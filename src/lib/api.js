import { supabase } from './supabase'

/**
 * Get or create a user by username
 * @param {string} username - The username
 * @returns {Promise<{id: string, username: string, created_at: string, total_races: number, total_score: number}>}
 */
export async function getOrCreateUser(username) {
  try {
    // Check if user exists
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (existingUser && !searchError) {
      return existingUser
    }

    // Create new user if doesn't exist
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          username: username.trim(),
          total_races: 0,
          total_score: 0,
        },
      ])
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    return newUser
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    throw error
  }
}

/**
 * Save race result to database
 * @param {string} userId - The user ID
 * @param {number} raceNumber - Race number (1-10)
 * @param {number} score - Total score for the race
 * @param {Array} answers - Array of answer objects
 * @returns {Promise<Object>}
 */
export async function saveRaceResult(userId, raceNumber, score, answers) {
  try {
    // Insert race result
    const { data: raceResult, error: raceError } = await supabase
      .from('race_results')
      .insert([
        {
          user_id: userId,
          race_number: raceNumber,
          score: score,
          answers: answers,
        },
      ])
      .select()
      .single()

    if (raceError) {
      console.error('Error saving race result:', raceError)
      throw raceError
    }

    // Update user stats
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_races, total_score')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      throw userError
    }

    const newTotalRaces = (user.total_races || 0) + 1
    const newTotalScore = (user.total_score || 0) + score

    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_races: newTotalRaces,
        total_score: newTotalScore,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user stats:', updateError)
      throw updateError
    }

    return {
      ...raceResult,
      user_total_races: newTotalRaces,
      user_total_score: newTotalScore,
    }
  } catch (error) {
    console.error('Error in saveRaceResult:', error)
    throw error
  }
}

/**
 * Get global leaderboard (all users ranked by total score)
 * @param {number} limit - Number of results to return (default: 100)
 * @returns {Promise<Array>}
 */
export async function getGlobalLeaderboard(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, total_races, total_score, created_at')
      .order('total_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching global leaderboard:', error)
      throw error
    }

    return data.map((user) => ({
      username: user.username,
      totalRaces: user.total_races || 0,
      totalScore: user.total_score || 0,
      avgScore: user.total_races > 0 ? Math.round(user.total_score / user.total_races) : 0,
      createdAt: user.created_at,
    }))
  } catch (error) {
    console.error('Error in getGlobalLeaderboard:', error)
    throw error
  }
}

/**
 * Get race leaderboard (all users ranked by score for a specific race)
 * @param {number} raceNumber - Race number (1-10)
 * @param {number} limit - Number of results to return (default: 100)
 * @returns {Promise<Array>}
 */
export async function getRaceLeaderboard(raceNumber, limit = 100) {
  try {
    // First get race results
    const { data: raceResults, error: raceError } = await supabase
      .from('race_results')
      .select('id, score, timestamp, user_id')
      .eq('race_number', raceNumber)
      .order('score', { ascending: false })
      .limit(limit)

    if (raceError) {
      console.error('Error fetching race leaderboard:', raceError)
      throw raceError
    }

    if (!raceResults || raceResults.length === 0) {
      return []
    }

    // Get user details for all user_ids
    const userIds = raceResults.map(r => r.user_id)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username')
      .in('id', userIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    // Map results with usernames
    const userMap = new Map(users.map(u => [u.id, u.username]))
    return raceResults.map((result) => ({
      username: userMap.get(result.user_id) || 'Unknown',
      score: result.score,
      date: result.timestamp,
    }))
  } catch (error) {
    console.error('Error in getRaceLeaderboard:', error)
    throw error
  }
}

/**
 * Get user statistics
 * @param {string} userId - The user ID
 * @returns {Promise<Object>}
 */
export async function getUserStats(userId) {
  try {
    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      throw userError
    }

    // Get all race results for this user
    const { data: raceResults, error: raceError } = await supabase
      .from('race_results')
      .select('*')
      .eq('user_id', userId)
      .order('race_number', { ascending: true })

    if (raceError) {
      console.error('Error fetching race results:', raceError)
      throw raceError
    }

    // Transform race results to match expected format
    const races = {}
    raceResults.forEach((result) => {
      races[`race${result.race_number}`] = {
        score: result.score,
        answers: result.answers,
        date: result.timestamp,
      }
    })

    return {
      username: user.username,
      races: races,
      totalRaces: user.total_races || 0,
      totalScore: user.total_score || 0,
      userId: user.id,
    }
  } catch (error) {
    console.error('Error in getUserStats:', error)
    throw error
  }
}

/**
 * Get user by username
 * @param {string} username - The username
 * @returns {Promise<Object|null>}
 */
export async function getUserByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // User not found
        return null
      }
      console.error('Error fetching user:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getUserByUsername:', error)
    throw error
  }
}

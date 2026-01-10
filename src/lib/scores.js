import { supabase, canUseSupabase } from './supabase'

/**
 * Get user's best score
 * @param {string} userId - User ID
 * @returns {Promise<number>}
 */
export async function getBestScore(userId) {
  if (!canUseSupabase() || !userId) {
    return 0
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('best_score')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No score found, return 0
        return 0
      }
      console.error('Error fetching best score:', error)
      return 0
    }

    return data?.best_score || 0
  } catch (error) {
    console.error('Error in getBestScore:', error)
    return 0
  }
}

/**
 * Upsert best score (only increase if new score is higher)
 * @param {string} userId - User ID
 * @param {number} newScore - New score to save
 * @returns {Promise<number>} - Final best score
 */
export async function upsertBestScore(userId, newScore) {
  if (!canUseSupabase() || !userId) {
    return 0
  }

  try {
    // Use the database function for atomic upsert
    const { data, error } = await supabase.rpc('upsert_best_score', {
      p_user_id: userId,
      p_new_score: newScore
    })

    if (error) {
      // Fallback to manual upsert if function doesn't exist
      console.warn('RPC function not available, using manual upsert:', error)
      return await manualUpsertBestScore(userId, newScore)
    }

    return data || newScore
  } catch (error) {
    console.error('Error in upsertBestScore:', error)
    // Fallback to manual upsert
    return await manualUpsertBestScore(userId, newScore)
  }
}

/**
 * Manual upsert best score (fallback)
 * @param {string} userId - User ID
 * @param {number} newScore - New score to save
 * @returns {Promise<number>} - Final best score
 */
async function manualUpsertBestScore(userId, newScore) {
  try {
    // Get current best score
    const { data: currentData } = await supabase
      .from('scores')
      .select('best_score')
      .eq('user_id', userId)
      .single()

    const currentBest = currentData?.best_score || 0

    // Only update if new score is higher
    if (newScore > currentBest) {
      const { error } = await supabase
        .from('scores')
        .upsert({
          user_id: userId,
          best_score: newScore,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error upserting score:', error)
        return currentBest
      }

      return newScore
    }

    return currentBest
  } catch (error) {
    console.error('Error in manualUpsertBestScore:', error)
    return 0
  }
}

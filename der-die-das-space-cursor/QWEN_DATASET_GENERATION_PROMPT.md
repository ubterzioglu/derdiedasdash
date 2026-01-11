# ðŸŽ® DER DIE DAS SPACE - DATASET GENERATION PROMPT FOR QWEN

## ðŸŽ¯ MISSION

Generate comprehensive German language learning datasets for **5 different game types**. Each game needs questions in specific formats with varying difficulty levels.

---

## ðŸ“Š OVERALL REQUIREMENTS

### Quantity Needed (Per Game):
- **1 Demo Set**: 10 questions (easy level)
- **Level 1 (Easy)**: 2 sets Ã— 10 questions = 20 questions
- **Level 2 (Medium-Easy)**: 2 sets Ã— 10 questions = 20 questions
- **Level 3 (Medium)**: 2 sets Ã— 10 questions = 20 questions
- **Level 4 (Hard)**: 2 sets Ã— 10 questions = 20 questions
- **Level 5 (Very Hard)**: 2 sets Ã— 10 questions = 20 questions

**Total per game**: 110 questions (1 demo + 10 sets)
**Total for all 5 games**: 550 questions

---

## ðŸŽ® GAME 1: DER DIE DASH

### Concept
German word â†’ Choose correct article (der/die/das)

### Output Format (JSON)
```json
{
  "game_type": "der_die_dash",
  "level": 1,
  "set_number": 1,
  "questions": [
    {
      "order": 1,
      "word": "Tisch",
      "correct_article": "der"
    },
    {
      "order": 2,
      "word": "TÃ¼r",
      "correct_article": "die"
    }
  ]
}
```

### Difficulty Guidelines

**Level 1 (Easy):**
- Common everyday nouns
- Clear gender patterns
- Examples: Tisch (der), Auto (das), TÃ¼r (die), Buch (das), Stuhl (der)

**Level 2 (Medium-Easy):**
- Common but less obvious
- Mix of everyday objects and concepts
- Examples: LÃ¶ffel (der), Gabel (die), Messer (das)

**Level 3 (Medium):**
- Less common words
- Some exceptions to patterns
- Examples: Computer (der), Maus (die), Problem (das)

**Level 4 (Hard):**
- Technical or less frequent words
- Many pattern exceptions
- Examples: Attribut (das), Horizont (der), Basis (die)

**Level 5 (Very Hard):**
- Rare or specialized vocabulary
- Counter-intuitive genders
- Examples: MÃ¤dchen (das!), KÃ¤tzchen (das!), Virus (das/der)

### Important Rules:
- Use only standard German nouns
- Avoid compound nouns that are too long (max 2 parts)
- No proper nouns (names, cities, brands)
- Mix genders evenly (roughly 33% each)

---

## ðŸŽ® GAME 2: CASE CONTROL

### Concept
Preposition + word â†’ Choose correct article form (dem/der/den/das)

### Output Format (JSON)
```json
{
  "game_type": "case_control",
  "level": 1,
  "set_number": 1,
  "questions": [
    {
      "order": 1,
      "preposition": "mit",
      "word": "Tisch",
      "correct_form": "dem",
      "options": ["dem", "der", "den"]
    },
    {
      "order": 2,
      "preposition": "fÃ¼r",
      "word": "Kind",
      "correct_form": "das",
      "options": ["das", "dem", "den"]
    }
  ]
}
```

### Preposition Guidelines by Level

**Level 1 (Easy):**
- Simple fixed prepositions
- Clear case requirements
- Prepositions: mit (Dativ), fÃ¼r (Akkusativ), ohne (Akkusativ), von (Genitiv)
- Use masculine/neuter/feminine nouns

**Level 2 (Medium-Easy):**
- More prepositions
- Still fixed cases
- Add: zu (Dativ), bei (Dativ), durch (Akkusativ), gegen (Akkusativ)

**Level 3 (Medium):**
- Introduce WechselprÃ¤positionen (wo? â†’ Dativ)
- in, an, auf, Ã¼ber, unter, vor, hinter (location = Dativ)
- Example: "in dem Haus" (location)

**Level 4 (Hard):**
- WechselprÃ¤positionen (wohin? â†’ Akkusativ)
- in, an, auf, Ã¼ber, unter, vor, hinter (direction = Akkusativ)
- Example: "in das Haus" (movement)

**Level 5 (Very Hard):**
- Mix of WechselprÃ¤positionen (context matters!)
- Genitive prepositions: wegen, trotz, wÃ¤hrend, statt
- Complex examples

### Important Rules:
- Options must be realistic alternatives (same word, different cases)
- Always provide exactly 3 options
- One correct, two plausible wrong answers
- Mark the correct form clearly

---

## ðŸŽ® GAME 3: WORD SALAD

### Concept
Scrambled words â†’ Build correct German sentence

### Output Format (JSON)
```json
{
  "game_type": "word_salad",
  "level": 1,
  "set_number": 1,
  "questions": [
    {
      "order": 1,
      "correct_sentence": "Ich gehe in die Schule",
      "scrambled_words": ["Schule", "gehe", "die", "in", "Ich"],
      "word_count": 5
    },
    {
      "order": 2,
      "correct_sentence": "Der Mann kauft ein neues Auto heute",
      "scrambled_words": ["heute", "Auto", "neues", "Mann", "ein", "kauft", "Der"],
      "word_count": 7
    }
  ]
}
```

### Sentence Guidelines

**IMPORTANT:** All sentences must have **exactly 10 words**!

**Level 1 (Easy):**
- Simple present tense
- Subject + Verb + Object structure
- Common vocabulary
- Example: "Ich gehe jeden Tag in die groÃŸe Schule hier"

**Level 2 (Medium-Easy):**
- Simple past tense (PrÃ¤teritum)
- Add time expressions
- Example: "Gestern ging ich mit meinem Freund in die Schule"

**Level 3 (Medium):**
- Perfekt tense (haben/sein + Partizip)
- Example: "Ich habe gestern mit meinem besten Freund FuÃŸball gespielt"

**Level 4 (Hard):**
- Perfekt with separable verbs
- Modal verbs
- Example: "Er hat mir gestern das neue interessante Buch mitgebracht heute"

**Level 5 (Very Hard):**
- Complex subordinate clauses
- Passive voice
- Relative pronouns
- Example: "Das Buch, das ich gestern gekauft habe, ist wirklich gut"

### Important Rules:
- **EXACTLY 10 words per sentence** (count carefully!)
- Grammatically correct German
- Natural word order in correct sentence
- Scrambled order should not accidentally create valid alternatives
- Use proper capitalization (German nouns start with capital letters)

---

## ðŸŽ® GAME 4: TRANSLATION QUEST

### Concept
German word â†’ Choose correct Turkish or English translation (4 options)

### Output Format (JSON)
```json
{
  "game_type": "translation_quest",
  "level": 1,
  "set_number": 1,
  "questions": [
    {
      "order": 1,
      "word": "Tisch",
      "article": "der",
      "translation_tr": "Masa",
      "translation_en": "Table",
      "wrong_options_tr": ["KapÄ±", "Araba", "Kitap"],
      "wrong_options_en": ["Door", "Car", "Book"]
    },
    {
      "order": 2,
      "word": "TÃ¼r",
      "article": "die",
      "translation_tr": "KapÄ±",
      "translation_en": "Door",
      "wrong_options_tr": ["Pencere", "Duvar", "Zemin"],
      "wrong_options_en": ["Window", "Wall", "Floor"]
    }
  ]
}
```

### Wrong Option Strategy (Critical!)

**Level 1 (Easy):**
- Wrong options from completely different categories
- Example: Tisch (Table) â†’ Wrong: Door, Sky, Book (very different)

**Level 2 (Medium-Easy):**
- Wrong options from related but distinct categories
- Example: Tisch (Table) â†’ Wrong: Chair, Lamp, Window (all furniture/home items)

**Level 3 (Medium):**
- Wrong options from same category
- Example: Stuhl (Chair) â†’ Wrong: Table, Desk, Bench (all seating/furniture)

**Level 4 (Hard):**
- Wrong options very similar in meaning
- Example: Stuhl (Chair) â†’ Wrong: Armchair, Stool, Seat (very close!)

**Level 5 (Very Hard):**
- Wrong options are near-synonyms or easily confused
- Example: schnell (fast/quick) â†’ Wrong: rapid, swift, speedy (all very similar!)

### Important Rules:
- Always provide article (der/die/das) with German word
- Exactly 3 wrong options per language (TR and EN)
- Wrong options must be plausible but clearly incorrect
- Turkish translations should use standard Turkish (avoid slang)
- English translations should use standard English (US/UK neutral)

---

## ðŸŽ® GAME 5: 5-LETTER BLITZ

### Concept
Scrambled 5 letters â†’ Build the correct 5-letter German word

### Output Format (JSON)
```json
{
  "game_type": "five_letter_blitz",
  "level": 1,
  "set_number": 1,
  "questions": [
    {
      "order": 1,
      "word": "TISCH",
      "scrambled": ["C", "I", "S", "H", "T"],
      "article": "der"
    },
    {
      "order": 2,
      "word": "STUHL",
      "scrambled": ["L", "H", "U", "T", "S"],
      "article": "der"
    }
  ]
}
```

### CRITICAL CONSTRAINT:
**ONLY 5-LETTER WORDS!** No more, no less!

### Word Selection Guidelines

**Level 1 (Easy):**
- Common 5-letter words
- Clear letter patterns
- Examples: Tisch, Stuhl, Buch (with article), Apfel

**Level 2 (Medium-Easy):**
- Common but less obvious
- Examples: Gabel, LÃ¶ffel (if 5 letters), HÃ¤nde

**Level 3 (Medium):**
- Less frequent words
- Examples: Mauer, Daten, Brief

**Level 4 (Hard):**
- Uncommon 5-letter words
- Examples: Zange, Kreis, Pferd

**Level 5 (Very Hard):**
- Rare or specialized vocabulary
- Difficult letter combinations
- Examples: Yacht, Fazit, Axiom

### Important Rules:
- **MUST be exactly 5 letters** (double-check!)
- Must be valid German nouns
- Provide article (der/die/das)
- Scrambled letters should not accidentally spell another valid word
- Use uppercase for word and scrambled letters

---

## ðŸ“‹ OUTPUT FORMAT STRUCTURE

### Complete Dataset JSON Structure

```json
{
  "dataset_version": "1.0",
  "generated_date": "2026-01-11",
  "total_games": 5,
  "games": [
    {
      "game_type": "der_die_dash",
      "total_sets": 11,
      "sets": [
        {
          "set_type": "demo",
          "level": 1,
          "set_number": 0,
          "questions": [ /* 10 questions */ ]
        },
        {
          "set_type": "normal",
          "level": 1,
          "set_number": 1,
          "questions": [ /* 10 questions */ ]
        }
        // ... more sets
      ]
    },
    {
      "game_type": "case_control",
      "total_sets": 11,
      "sets": [ /* ... */ ]
    },
    {
      "game_type": "word_salad",
      "total_sets": 11,
      "sets": [ /* ... */ ]
    },
    {
      "game_type": "translation_quest",
      "total_sets": 11,
      "sets": [ /* ... */ ]
    },
    {
      "game_type": "five_letter_blitz",
      "total_sets": 11,
      "sets": [ /* ... */ ]
    }
  ]
}
```

---

## âœ… QUALITY CHECKLIST

Before submitting the dataset, verify:

### General:
- [ ] Total 550 questions (110 per game)
- [ ] All JSON is valid (no syntax errors)
- [ ] All required fields present
- [ ] Consistent formatting

### Der Die Dash:
- [ ] All words are German nouns
- [ ] Articles are correct (der/die/das)
- [ ] No duplicate words within same set
- [ ] Difficulty progression makes sense

### Case Control:
- [ ] Preposition + case combination is correct
- [ ] Options are realistic alternatives
- [ ] Exactly 3 options per question
- [ ] Correct form is marked

### Word Salad:
- [ ] **ALL sentences have exactly 10 words**
- [ ] Sentences are grammatically correct
- [ ] Natural German word order
- [ ] Capitalization is correct

### Translation Quest:
- [ ] Both TR and EN translations provided
- [ ] 3 wrong options per language
- [ ] Wrong options follow difficulty strategy
- [ ] Translations are accurate

### 5-Letter Blitz:
- [ ] **ALL words are exactly 5 letters**
- [ ] Words are valid German nouns
- [ ] Scrambled letters don't form other words
- [ ] Articles provided

---

## ðŸŽ¯ GENERATION STRATEGY

### Recommended Approach:

1. **Start with Der Die Dash** (simplest format)
   - Generate demo set (10 questions)
   - Generate Level 1-5 sets (100 questions)

2. **Then Case Control**
   - Reuse some words from Der Die Dash
   - Add prepositions
   - Generate case forms

3. **Then 5-Letter Blitz**
   - Filter 5-letter words from previous games
   - Add more 5-letter words
   - Generate scrambles

4. **Then Translation Quest**
   - Take words from previous games
   - Add Turkish translations
   - Add English translations
   - Create wrong options strategically

5. **Finally Word Salad** (most complex)
   - Create 10-word sentences
   - Use vocabulary from previous games
   - Scramble word order
   - Verify grammar

---

## ðŸš¨ COMMON PITFALLS TO AVOID

1. **Word Salad:** Forgetting to count to exactly 10 words
2. **5-Letter Blitz:** Including 4 or 6 letter words by mistake
3. **Translation Quest:** Using same wrong options for multiple questions
4. **Case Control:** Wrong case for the preposition (e.g., "mit" ALWAYS Dativ!)
5. **Der Die Dash:** Using compound nouns that are too complex
6. **All Games:** Duplicating questions within a set

---

## ðŸ’¡ TIPS FOR EFFICIENCY

### Use German Language Resources:
- Common noun lists (1000 most frequent German nouns)
- German grammar guides for preposition cases
- Turkish-German dictionaries
- English-German dictionaries

### Generate Strategically:
- Create a master word bank first (500-1000 words)
- Tag each word with: article, length, difficulty, category
- Filter and sample from this bank for each game
- This ensures consistency and avoids duplication

### Validate as You Go:
- After each set, check for errors
- Verify difficulty progression
- Ensure variety in vocabulary

---

## ðŸ“¤ FINAL OUTPUT

Please provide:

1. **One large JSON file** containing all 550 questions
2. **Filename:** `derdiedas_dataset_v1.0.json`
3. **Structure:** As defined in "Output Format Structure" above
4. **Encoding:** UTF-8 (for German characters: Ã¤, Ã¶, Ã¼, ÃŸ)

---

## ðŸŽ¯ SUCCESS CRITERIA

Dataset is complete and ready when:

âœ… All 5 games have 110 questions each (550 total)
âœ… JSON is valid and parseable
âœ… All questions follow specified format
âœ… Difficulty progression is clear
âœ… No duplicate questions within sets
âœ… Quality checklist passes 100%
âœ… Turkish and English translations are accurate
âœ… Word Salad sentences are exactly 10 words
âœ… 5-Letter Blitz words are exactly 5 letters
âœ… German grammar is correct throughout

---

**Thank you for generating this comprehensive dataset! This will power an amazing German learning platform! ðŸ‡©ðŸ‡ªðŸš€**

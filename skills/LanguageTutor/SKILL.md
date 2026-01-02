---
name: LanguageTutor
description: Interactive French reading comprehension tutoring - ask comprehension questions about French texts and evaluate answers to expose weaknesses and build systematic reading skills
version: 2.0.0
author: asa
type: skill
keywords: [french, reading, comprehension, language-learning, questions, vocabulary, grammar, practice, tutoring, interactive]
---

# LanguageTutor - Interactive Reading Comprehension Tutor

**USE WHEN:** User wants to practice French reading comprehension, requests questions about a French text they've read, asks for interactive tutoring, or wants to test their understanding of French passages.

## Primary Workflow: Interactive Tutoring Session

**User says:** "Hey Claude, I have an article that I read at `<filepath>`. Please ask me some comprehension questions about this."

**Kai (you) will:**
1. Read the French text from the provided filepath
2. Load the question generation template (Templates/FrenchReadingComprehension.hbs)
3. Generate comprehension questions internally (no API cost - uses Claude Code tokens)
4. Ask user Question 1
5. Wait for user's answer
6. Evaluate their response against the correct answer
7. Tell them if they're right or wrong with explanation
8. Proceed to Question 2, and so on

**No external API calls needed - all processing happens in-session using Claude Code tokens.**

## What This Skill Does

This skill generates comprehensive reading comprehension questions from French texts to help you:

1. **Identify Weaknesses**: Questions designed to expose gaps in vocabulary, grammar understanding, and reading strategies
2. **Practice Systematically**: Follows Karl Sandberg "French for Reading" methodology - building skills progressively
3. **Track Progress**: Output schema designed for future integration with weakness tracking and Anki export
4. **Learn Actively**: Questions cover vocabulary, main ideas, details, and inference - not just simple recall

## Core Capabilities

### Question Types

All questions are in **English** to test comprehension without translation barriers:

- **Vocabulary**: Word meanings in context, idiomatic expressions
- **Main Idea**: Theme identification, author's purpose
- **Details**: Factual recall, specific information
- **Inference**: Reading between lines, drawing conclusions

### Difficulty Levels

- **Beginner**: Simple texts, basic grammar, common vocabulary
- **Intermediate**: Complex sentences, varied tenses, broader vocabulary
- **Advanced**: Idiomatic expressions, subjunctive mood, nuanced meaning

## Output Schema

Questions are generated in YAML format with future-proofing for weakness tracking:

```yaml
text_metadata:
  source: "Le Monde article: Climate Change"
  word_count: 450
  difficulty: intermediate
  date_generated: "2026-01-01"

questions:
  - id: 1
    type: "vocabulary"
    grammatical_category: "passé_composé"
    question_text: "What does 'j'ai mangé' mean in this context?"
    french_phrase: "j'ai mangé"
    correct_answer: "I ate"
    explanation: "Passé composé formed with avoir + past participle of manger"
    user_answer: null
    is_correct: null

  - id: 2
    type: "main_idea"
    grammatical_category: null
    question_text: "What is the main argument of this passage?"
    correct_answer: "Climate change requires immediate action"
    explanation: "The author repeatedly emphasizes urgency and consequences"
    user_answer: null
    is_correct: null
```

## Workflows

### Interactive Tutoring (Primary - $0 API Cost)

**Example user invocation:**
```
User: "Hey Claude, I have an article that I read at my-french-article.txt.
       Please ask me some comprehension questions about this."

User: "I read a French article at ~/Documents/le-monde-climate.txt.
       Quiz me on it at intermediate difficulty."

User: "Test my comprehension of the text at ./article.txt,
       focusing on passé_composé."
```

**Kai's workflow:**
1. Read French text from filepath
2. Generate 8 questions internally (or user-specified count)
3. Ask Question 1
4. Receive user's answer
5. Evaluate: compare to correct_answer, check for partial credit
6. Provide feedback: "Correct!" or "Not quite - [explanation]"
7. Continue with remaining questions
8. Summarize performance (score, strengths, areas to watch)
9. Ask user: "What parts of the text didn't you understand?" or "Were there any words/phrases that confused you?"
10. Address user's actual comprehension gaps with explanations
11. **Generate Anki flashcard suggestions** based on:
    - Questions user got wrong or partially wrong
    - User-identified confusion points
    - Key grammatical patterns worth reinforcing

**Parameters (optional):**
- Difficulty level: beginner, intermediate (default), advanced
- Question count: 1-20 (default: 8)
- Grammar focus: passé_composé, subjunctive, etc.

### Daily Reading Practice (Recommended Routine)

1. Find an interesting French text (news, blog, literature)
2. Read the French text first - comprehend without translating every word
3. Start Claude Code session: ask for comprehension questions
4. Answer questions interactively
5. Review explanations for questions you missed
6. Note grammatical categories where you struggled

## Advanced: Standalone CLI Tool (Optional)

### GenerateQuestions.ts - Batch Question Generation

For automation/batch processing outside of interactive sessions. **Requires ANTHROPIC_API_KEY** and incurs API costs (~$1.50/year for typical usage).

**When to use standalone CLI:**
- Batch processing multiple files
- Automated pipelines
- Scheduled question generation
- Non-interactive workflows

**Usage:**
```bash
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input french-article.txt \
  --output questions.yaml \
  --difficulty intermediate \
  --question-count 10
```

**Flags:**
- `--input <path>`: Path to French text file (required)
- `--output <path>`: Output YAML file (default: questions.yaml)
- `--difficulty <level>`: beginner | intermediate | advanced (default: intermediate)
- `--question-count <n>`: Number of questions to generate (default: 8)
- `--focus <category>`: Focus on specific grammar (optional: passé_composé, subjunctive, etc.)

**Setup (only if you need standalone CLI):**
```bash
bun add @anthropic-ai/sdk
export ANTHROPIC_API_KEY='your-key-here'
```

**For most users: Use interactive tutoring mode instead (no API cost).**

## Integration Points

### Future Features (Designed In)

The output schema is designed to integrate with:

1. **kai-history-system**: Track practice sessions and progress
2. **Progress Tracking**: Store user_answer and is_correct fields
3. **Weakness Analysis**: Aggregate by grammatical_category
4. **Anki Export**: YAML structure maps directly to Anki card format
5. **Content Sourcing**: Metadata enables automatic difficulty matching

### Current Capabilities (v2.0)

- ✅ Interactive tutoring with real-time answer evaluation
- ✅ Zero API cost (uses Claude Code session tokens)
- ✅ Customizable difficulty and question count
- ✅ Grammar focus options (e.g., passé_composé, subjunctive)

### Future Enhancements (Roadmap)

- Automatic weakness tracking across sessions (Phase 2)
- Anki export for spaced repetition (Phase 2)
- Automatic content sourcing from French news/blogs (Phase 3)
- Voice integration for listening comprehension (Phase 4)

## Methodology

Inspired by Karl Sandberg's "French for Reading":

1. **Reading for comprehension, not translation**: Questions test understanding, not word-for-word conversion
2. **Grammar in context**: Grammatical patterns identified within authentic texts
3. **Progressive difficulty**: Build from simple to complex systematically
4. **Active engagement**: Questions require thinking, not just recognition

## Examples

See `Examples/` directory for:
- `sample-text.txt`: Example French passage (Le Monde article excerpt)
- `sample-output.yaml`: Generated questions with answers

## Related Skills

- **Prompting**: Uses template system from kai-prompting-skill
- **Agents** (future): Can compose specialized tutor personas
- **Voice** (future): Read texts aloud, pronunciation practice
- **History** (future): Track vocabulary learned over time

## Tips

1. **Find engaging content**: You'll learn more from topics you care about
2. **Read before answering**: Don't jump to questions - comprehend first
3. **Check grammatical categories**: Note patterns you struggle with
4. **Practice regularly**: Daily 15-minute sessions > weekly marathons
5. **Vary difficulty**: Mix easier and harder texts to build confidence

---

**Version:** 2.0.0 (Interactive Tutoring Mode)
**Status:** Active - Zero API Cost
**Usage:** Interactive in-session tutoring (primary), standalone CLI (optional/advanced)
**Next Phase:** Add weakness tracking across sessions and Anki export

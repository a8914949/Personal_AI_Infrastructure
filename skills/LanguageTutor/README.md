# LanguageTutor - French Reading Comprehension Practice

Generate high-quality reading comprehension questions from French texts to systematically build your reading skills and expose areas of weakness.

## Overview

The LanguageTutor skill helps you practice French reading comprehension using the **Karl Sandberg "French for Reading" methodology** - focusing on understanding authentic texts through targeted questions rather than word-for-word translation.

**Key Features:**
- Generate questions in English from French texts
- Four question types: vocabulary, main idea, details, inference
- Tracks grammatical categories for future weakness analysis
- Output designed for Anki integration and progress tracking
- Difficulty levels: beginner, intermediate, advanced

## Quick Start

```bash
# Generate questions from a French article
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input my-french-article.txt \
  --output questions.yaml

# Specify difficulty and question count
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input article.txt \
  --difficulty advanced \
  --question-count 10

# Focus on specific grammar
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input article.txt \
  --focus passé_composé
```

## Prerequisites

### Required

- **Bun runtime**: `curl -fsSL https://bun.sh/install | bash`
- **Anthropic API key**: Get from [console.anthropic.com](https://console.anthropic.com/)

### Environment Setup

Set your API key:

```bash
# Option 1: Export in shell
export ANTHROPIC_API_KEY='your-key-here'

# Option 2: Add to ~/.zshrc or ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.zshrc

# Option 3: Add to PAI .env file (if using Kai Bundle)
echo 'ANTHROPIC_API_KEY="your-key-here"' >> $PAI_DIR/.env
```

### Install Dependencies

```bash
cd /Users/asa/src/Personal_AI_Infrastructure
bun add @anthropic-ai/sdk
```

## Usage

### Basic Workflow

1. **Find French content**: News articles, blog posts, short stories, academic papers
2. **Generate questions**: Run the CLI tool on your text
3. **Read the French**: Read without translating every word
4. **Answer questions**: Test your comprehension
5. **Check answers**: Review explanations to learn

### Command Reference

```bash
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts [OPTIONS]
```

**Required Flags:**
- `--input <file>`: Path to French text file

**Optional Flags:**
- `--output <file>`: Output YAML file (default: questions.yaml)
- `--difficulty <level>`: beginner | intermediate | advanced (default: intermediate)
- `--question-count <n>`: Number of questions 1-20 (default: 8)
- `--focus <category>`: Focus on grammar category (e.g., passé_composé, subjunctive)
- `--help`, `-h`: Show help message

### Examples

**Basic question generation:**
```bash
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input skills/LanguageTutor/Examples/sample-text.txt
```

**Advanced text with many questions:**
```bash
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input literature-excerpt.txt \
  --difficulty advanced \
  --question-count 15 \
  --output /tmp/advanced-questions.yaml
```

**Focus on specific grammar:**
```bash
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input subjunctive-examples.txt \
  --focus subjunctive \
  --question-count 10
```

## Output Format

Questions are generated in YAML with the following schema:

```yaml
text_metadata:
  source: "Brief description of text"
  word_count: 298
  difficulty: intermediate
  date_generated: "2026-01-01"
  dominant_tenses: ["présent", "passé_composé", "futur_simple"]
  key_grammar_patterns: ["subjunctive triggers", "conditional mood"]

questions:
  - id: 1
    type: "vocabulary"
    grammatical_category: "passé_composé"
    question_text: "What does 'avons-nous pensé' mean in context?"
    french_phrase: "avons-nous pensé"
    correct_answer: "did we think / have we thought"
    explanation: "Passé composé with auxiliary avoir + past participle..."
    difficulty_rating: "medium"
    user_answer: null        # Fill in when answering
    is_correct: null         # Track correctness
```

**Future-Proofing:**
- `user_answer` and `is_correct` fields enable progress tracking (Phase 2)
- `grammatical_category` enables weakness analysis by grammar pattern
- YAML structure maps directly to Anki card format (Phase 3)

## Question Types

### 1. Vocabulary Questions

Test understanding of French words/phrases in context:
- Word meanings (not just dictionary definitions)
- False cognates (e.g., "actuellement" ≠ "actually")
- Idiomatic expressions
- Grammatical category identification

**Example:**
```yaml
question_text: "What does 'il faut que' mean in this sentence?"
grammatical_category: "subjunctive_trigger"
```

### 2. Main Idea Questions

Test overall comprehension:
- Central theme identification
- Author's main argument
- Purpose of the text
- Synthesizing multiple paragraphs

**Example:**
```yaml
question_text: "What is the author's primary argument?"
grammatical_category: null
```

### 3. Detail Questions

Test factual recall:
- Specific information stated in text
- Numbers, dates, names
- Unambiguous facts
- Sequence of events

**Example:**
```yaml
question_text: "By how many degrees has temperature increased?"
grammatical_category: "number_expression"
```

### 4. Inference Questions

Test deeper understanding:
- Reading between the lines
- Implications and conclusions
- Author's tone or attitude
- Cause-and-effect relationships

**Example:**
```yaml
question_text: "What does the author imply about individual action?"
grammatical_category: null
```

## Methodology

### Karl Sandberg Approach

This tool follows the **"French for Reading"** methodology:

1. **Reading for Comprehension**: Not word-for-word translation
2. **Grammar in Context**: Identify patterns in authentic texts
3. **Progressive Difficulty**: Build from simple to complex
4. **Active Engagement**: Questions require thinking, not just recognition

### Exposing Weaknesses

Questions are designed to reveal gaps in:
- **Tense recognition**: Can you distinguish passé composé from imparfait?
- **Pronoun reference**: What does "y" or "en" refer to?
- **Subjunctive triggers**: Do you recognize "il faut que" patterns?
- **False cognates**: Do you confuse "actuellement" with "actually"?
- **Negation patterns**: ne...pas, ne...plus, ne...jamais
- **Causal relationships**: donc, parce que, car, puisque

## Difficulty Levels

### Beginner
- Simple present tense texts
- Basic vocabulary
- Short, clear sentences
- Common grammatical structures

### Intermediate (Default)
- Multiple tenses (présent, passé composé, futur)
- Broader vocabulary
- Compound sentences
- Some subjunctive and conditional

### Advanced
- Complex tenses (plus-que-parfait, subjonctif, conditionnel passé)
- Idiomatic expressions
- Nuanced meanings
- Literary or academic style

## Tips for Effective Practice

1. **Find Engaging Content**: Choose topics you care about - you'll learn more
2. **Read First, Then Questions**: Comprehend the whole text before answering
3. **Note Grammatical Patterns**: Track categories you struggle with
4. **Practice Regularly**: 15 minutes daily > 2 hours weekly
5. **Vary Difficulty**: Mix easier and harder texts for balanced practice
6. **Review Explanations**: The "why" is more important than just the answer

## Troubleshooting

### "Missing ANTHROPIC_API_KEY"

**Solution**: Set your API key in environment
```bash
export ANTHROPIC_API_KEY='your-key-here'
```

### "No such file or directory"

**Solution**: Use absolute paths or verify file exists
```bash
# Use absolute path
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts --input /full/path/to/text.txt

# Or verify file exists
ls -la my-text.txt
```

### "Invalid difficulty"

**Solution**: Use only: beginner, intermediate, or advanced
```bash
--difficulty intermediate  # ✓ Correct
--difficulty inter         # ✗ Wrong
```

### Questions seem too easy/hard

**Solution**: Adjust difficulty level
```bash
# If too easy, increase difficulty
--difficulty advanced

# If too hard, decrease difficulty
--difficulty beginner
```

## File Structure

```
skills/LanguageTutor/
├── SKILL.md                                    # Skill routing and metadata
├── README.md                                   # This file
├── Tools/
│   └── GenerateQuestions.ts                    # CLI tool
├── Templates/
│   └── FrenchReadingComprehension.hbs          # Question generation prompt template
└── Examples/
    ├── sample-text.txt                         # Example French article
    └── sample-output.yaml                      # Example generated questions
```

## Future Enhancements

### Phase 2: Weakness Tracking (Planned)
- Track `user_answer` and `is_correct` fields
- Aggregate by `grammatical_category`
- Generate weakness reports
- Adaptive difficulty based on performance

### Phase 3: Content Sourcing (Planned)
- Automatic article fetching from Le Monde, France 24
- RSS feed parsing
- Difficulty scoring
- Interest-based recommendations

### Phase 4: Anki Integration (Planned)
- Export to Anki .apkg format
- Map question types to card types
- Include grammatical category tags
- Spaced repetition scheduling

### Phase 5: Voice Integration (Planned)
- TTS for pronunciation practice
- Listening comprehension questions
- Audio-based exercises
- Integration with kai-voice-system

## Customization

### Adding Question Types

Edit `Templates/FrenchReadingComprehension.hbs` to add new question types or modify prompt instructions.

### Adjusting Output Format

Modify the template's `Output Format` section to customize the YAML schema.

### Focusing on Specific Grammar

Use the `--focus` flag to emphasize particular grammatical categories:

```bash
# Focus on subjunctive mood
--focus subjunctive

# Focus on past tenses
--focus passé_composé

# Focus on pronouns
--focus pronouns
```

## Related PAI Skills

- **kai-prompting-skill**: Template system (used by this skill)
- **kai-agents-skill**: Could create specialized tutor personas (future)
- **kai-voice-system**: Pronunciation/listening practice (future)
- **kai-history-system**: Track practice sessions (future)

## Credits

- **Methodology**: Based on Karl Sandberg's "French for Reading" approach
- **Author**: Asa (Personal AI Infrastructure)
- **Version**: 1.0.0 (MVP - Question Generation Only)

## License

Part of the Personal AI Infrastructure project. See project LICENSE for details.

## Feedback & Contributions

Found a bug? Have a suggestion? Open an issue or submit a PR to the Personal AI Infrastructure repository.

---

**Current Status**: MVP Complete - Question Generation Functional
**Next Phase**: Add weakness tracking and progress analytics

# LanguageTutor - Installation Guide

Quick guide to get the French Reading Comprehension skill up and running.

## Installation

### 1. Install Dependencies

```bash
cd /Users/asa/src/Personal_AI_Infrastructure
bun add @anthropic-ai/sdk
```

### 2. Set Up API Key

Get your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)

**Option A: Shell Environment (Quick)**
```bash
export ANTHROPIC_API_KEY='your-key-here'
```

**Option B: Shell Profile (Permanent)**
```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**Option C: PAI .env File (If using Kai Bundle)**
```bash
echo 'ANTHROPIC_API_KEY="your-key-here"' >> $PAI_DIR/.env
```

### 3. Verify Installation

```bash
# Test with sample text
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input skills/LanguageTutor/Examples/sample-text.txt \
  --output /tmp/test-questions.yaml \
  --question-count 5

# Check output
cat /tmp/test-questions.yaml
```

Expected output: YAML file with 5 French reading comprehension questions.

## Quick Test

### Test Command

```bash
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input skills/LanguageTutor/Examples/sample-text.txt
```

### Expected Behavior

1. Loads the template from `Templates/FrenchReadingComprehension.hbs`
2. Reads the sample French text (298 words about climate change)
3. Calls Claude API to generate questions
4. Outputs YAML file with 8 questions (default)

### Success Indicators

✓ Output file created: `questions.yaml`
✓ Contains valid YAML with `text_metadata` and `questions` sections
✓ Each question has: type, grammatical_category, question_text, answer, explanation
✓ Questions are in English, testing French comprehension

### Troubleshooting

**Error: "Missing ANTHROPIC_API_KEY"**
- Solution: Complete Step 2 above

**Error: "No such file or directory"**
- Solution: Run command from project root: `/Users/asa/src/Personal_AI_Infrastructure`

**Error: "Invalid YAML"**
- Solution: Check Claude API response - may need to regenerate

## Usage Examples

### Basic Usage

```bash
# Generate questions from your own French text
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input my-french-article.txt
```

### Advanced Usage

```bash
# Advanced difficulty, 10 questions, focus on subjunctive
bun run skills/LanguageTutor/Tools/GenerateQuestions.ts \
  --input advanced-text.txt \
  --difficulty advanced \
  --question-count 10 \
  --focus subjunctive \
  --output /tmp/advanced-questions.yaml
```

## Directory Structure

```
skills/LanguageTutor/
├── SKILL.md          # Skill metadata and routing
├── README.md         # Full documentation
├── INSTALL.md        # This file
├── Tools/
│   └── GenerateQuestions.ts
├── Templates/
│   └── FrenchReadingComprehension.hbs
└── Examples/
    ├── sample-text.txt
    └── sample-output.yaml
```

## Next Steps

1. Find French texts to practice with (news, blogs, books)
2. Generate questions for each text
3. Read the French and answer the questions
4. Check your answers against the explanations
5. Track which grammatical categories you struggle with

See `README.md` for complete usage guide and tips for effective practice.

## Integration with Claude Code

To make this skill easily invocable from Claude Code sessions, the `SKILL.md` file contains routing metadata:

**Trigger Phrases:**
- "practice French reading"
- "generate comprehension questions"
- "analyze French passage"
- "create French language exercises"

When you use these phrases in Claude Code, the skill will be automatically suggested or invoked.

## Support

- **Documentation**: `skills/LanguageTutor/README.md`
- **Methodology**: Based on Karl Sandberg "French for Reading"
- **Issues**: Report to Personal AI Infrastructure repository

---

**Version**: 1.0.0 (MVP)
**Status**: Ready for use
**Requirements**: Bun, Anthropic API key

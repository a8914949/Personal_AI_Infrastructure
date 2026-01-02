#!/usr/bin/env bun

/**
 * GenerateQuestions - French Reading Comprehension Question Generator
 *
 * Generates reading comprehension questions from French texts following
 * Karl Sandberg "French for Reading" methodology.
 *
 * Usage:
 *   bun run GenerateQuestions.ts --input french-text.txt --output questions.yaml
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";

// ============================================================================
// Types
// ============================================================================

type Difficulty = "beginner" | "intermediate" | "advanced";
type QuestionType = "vocabulary" | "main_idea" | "detail" | "inference";

interface CLIArgs {
  input: string;
  output: string;
  difficulty: Difficulty;
  questionCount: number;
  focus?: string;
  help?: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULTS = {
  output: "questions.yaml",
  difficulty: "intermediate" as Difficulty,
  questionCount: 8,
};

const QUESTION_TYPES: QuestionType[] = ["vocabulary", "main_idea", "detail", "inference"];

// ============================================================================
// Error Handling
// ============================================================================

class CLIError extends Error {
  constructor(message: string, public exitCode: number = 1) {
    super(message);
    this.name = "CLIError";
  }
}

function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.error(`Error: ${error.message}`);
    process.exit(error.exitCode);
  }
  if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
  console.error(`Unknown error:`, error);
  process.exit(1);
}

// ============================================================================
// Help
// ============================================================================

function showHelp(): void {
  console.log(`
GenerateQuestions - French Reading Comprehension Question Generator

Generate reading comprehension questions from French texts to expose areas
of weakness and build systematic reading skills.

USAGE:
  bun run GenerateQuestions.ts --input <file> [OPTIONS]

REQUIRED:
  --input <file>       Path to French text file

OPTIONS:
  --output <file>      Output YAML file (default: questions.yaml)
  --difficulty <level> Difficulty: beginner, intermediate, advanced (default: intermediate)
  --question-count <n> Number of questions (default: 8)
  --focus <category>   Focus on grammar: passé_composé, subjunctive, etc. (optional)
  --help, -h           Show this help

EXAMPLES:
  # Basic usage
  bun run GenerateQuestions.ts --input article.txt

  # Intermediate with 10 questions
  bun run GenerateQuestions.ts --input article.txt --question-count 10 --difficulty intermediate

  # Focus on specific grammar
  bun run GenerateQuestions.ts --input article.txt --focus passé_composé

  # Custom output location
  bun run GenerateQuestions.ts --input article.txt --output /tmp/questions.yaml

ENVIRONMENT VARIABLES:
  ANTHROPIC_API_KEY   Required - your Claude API key

METHODOLOGY:
  Follows Karl Sandberg's "French for Reading" approach:
  - Reading for comprehension, not translation
  - Grammar patterns in authentic contexts
  - Progressive difficulty building
  - Active engagement through targeted questions

MORE INFO:
  Documentation: skills/LanguageTutor/README.md
  Template: skills/LanguageTutor/Templates/FrenchReadingComprehension.hbs
`);
  process.exit(0);
}

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs(argv: string[]): CLIArgs {
  const args = argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    showHelp();
  }

  const parsed: Partial<CLIArgs> = {
    output: DEFAULTS.output,
    difficulty: DEFAULTS.difficulty,
    questionCount: DEFAULTS.questionCount,
  };

  for (let i = 0; i < args.length; i++) {
    const flag = args[i];

    if (!flag.startsWith("--")) {
      throw new CLIError(`Invalid flag: ${flag}`);
    }

    const key = flag.slice(2);
    const value = args[i + 1];

    if (!value || value.startsWith("--")) {
      throw new CLIError(`Missing value for: ${flag}`);
    }

    switch (key) {
      case "input":
        parsed.input = value;
        i++;
        break;
      case "output":
        parsed.output = value;
        i++;
        break;
      case "difficulty":
        if (!["beginner", "intermediate", "advanced"].includes(value)) {
          throw new CLIError(`Invalid difficulty: ${value}. Must be: beginner, intermediate, or advanced`);
        }
        parsed.difficulty = value as Difficulty;
        i++;
        break;
      case "question-count":
        const count = parseInt(value, 10);
        if (isNaN(count) || count < 1 || count > 20) {
          throw new CLIError(`Invalid question-count: ${value}. Must be 1-20`);
        }
        parsed.questionCount = count;
        i++;
        break;
      case "focus":
        parsed.focus = value;
        i++;
        break;
      default:
        throw new CLIError(`Unknown flag: ${flag}`);
    }
  }

  if (!parsed.input) throw new CLIError("Missing required: --input");

  return parsed as CLIArgs;
}

// ============================================================================
// Template Helpers
// ============================================================================

function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

// ============================================================================
// Template Rendering
// ============================================================================

async function loadTemplate(): Promise<string> {
  const templatePath = resolve(import.meta.dir, "../Templates/FrenchReadingComprehension.hbs");
  return await readFile(templatePath, "utf-8");
}

function renderTemplate(template: string, data: Record<string, any>): string {
  let rendered = template;

  // Simple Handlebars-like variable replacement
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  }

  // Handle {{#each}} blocks for question types
  const eachMatch = rendered.match(/{{#each questionTypes}}([\s\S]*?){{\/each}}/);
  if (eachMatch) {
    const blockContent = eachMatch[1];
    const questionTypes = data.questionTypes as string[];
    let expandedContent = '';

    for (const type of questionTypes) {
      let blockInstance = blockContent.replace(/{{this}}/g, type);

      // Handle conditionals
      blockInstance = blockInstance.replace(/{{#if \(eq this "vocabulary"\)}}([\s\S]*?){{\/if}}/g,
        type === "vocabulary" ? "$1" : "");
      blockInstance = blockInstance.replace(/{{#if \(eq this "main_idea"\)}}([\s\S]*?){{\/if}}/g,
        type === "main_idea" ? "$1" : "");
      blockInstance = blockInstance.replace(/{{#if \(eq this "detail"\)}}([\s\S]*?){{\/if}}/g,
        type === "detail" ? "$1" : "");
      blockInstance = blockInstance.replace(/{{#if \(eq this "inference"\)}}([\s\S]*?){{\/if}}/g,
        type === "inference" ? "$1" : "");

      expandedContent += blockInstance;
    }

    rendered = rendered.replace(eachMatch[0], expandedContent);
  }

  // Handle {{#if focusCategory}} blocks
  if (data.focusCategory) {
    rendered = rendered.replace(/{{#if focusCategory}}([\s\S]*?){{\/if}}/g, "$1");
  } else {
    rendered = rendered.replace(/{{#if focusCategory}}[\s\S]*?{{\/if}}/g, "");
  }

  return rendered;
}

// ============================================================================
// Question Generation
// ============================================================================

async function generateQuestions(
  text: string,
  difficulty: Difficulty,
  questionCount: number,
  focus?: string
): Promise<string> {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new CLIError(
      "Missing ANTHROPIC_API_KEY environment variable.\n" +
      "Get your API key from: https://console.anthropic.com/\n" +
      "Set it with: export ANTHROPIC_API_KEY='your-key-here'"
    );
  }

  const anthropic = new Anthropic({ apiKey });

  console.log("Loading template...");
  const template = await loadTemplate();

  console.log("Preparing prompt...");
  const wordCount = countWords(text);
  const prompt = renderTemplate(template, {
    text,
    difficulty,
    questionCount,
    wordCount,
    questionTypes: QUESTION_TYPES,
    currentDate: getCurrentDate(),
    focusCategory: focus || "",
    focusQuestionCount: focus ? Math.ceil(questionCount / 3) : 0,
  });

  console.log(`Generating ${questionCount} ${difficulty} questions...`);
  console.log(`Text: ${wordCount} words${focus ? `, focusing on ${focus}` : ""}`);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const response = message.content[0];
  if (response.type !== "text") {
    throw new CLIError("Unexpected response type from Claude");
  }

  return response.text;
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  try {
    const args = parseArgs(process.argv);

    // Read input French text
    console.log(`Reading French text from: ${args.input}`);
    const frenchText = await readFile(resolve(args.input), "utf-8");

    if (frenchText.trim().length === 0) {
      throw new CLIError("Input file is empty");
    }

    // Generate questions
    const questions = await generateQuestions(
      frenchText,
      args.difficulty,
      args.questionCount,
      args.focus
    );

    // Write output
    const outputPath = resolve(args.output);
    await writeFile(outputPath, questions, "utf-8");

    console.log(`\n✓ Questions generated successfully!`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Questions: ${args.questionCount}`);
    console.log(`  Difficulty: ${args.difficulty}`);
    if (args.focus) {
      console.log(`  Focus: ${args.focus}`);
    }
    console.log(`\nNext steps:`);
    console.log(`  1. Read the French text: ${args.input}`);
    console.log(`  2. Answer the questions from: ${outputPath}`);
    console.log(`  3. Check your answers against the provided explanations`);
  } catch (error) {
    handleError(error);
  }
}

main();

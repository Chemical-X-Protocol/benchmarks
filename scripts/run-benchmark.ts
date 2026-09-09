import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export type BenchmarkModel = 'claude-3-7-sonnet' | 'gemini-2-5-pro' | 'gpt-4o' | 'grok-2';
export type ArchitectureTarget = 'monolith' | 'chemical-x';
export type TaskIdentifier = 'task-a' | 'task-b' | 'task-c' | 'task-d' | 'task-e';

export interface BenchmarkMetrics {
  timestamp: string;
  runId: string;
  model: BenchmarkModel;
  architecture: ArchitectureTarget;
  task: TaskIdentifier;
  firstPassSuccess: boolean;
  diffIntegrity: boolean;
  typecheckPassed: boolean;
  testPassed: boolean;
  tokenConsumption: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  latencySeconds: number;
  error?: string;
}

const TASK_DESCRIPTIONS: Record<TaskIdentifier, string> = {
  'task-a': 'Add query parameter filtering for category that synchronizes bidirectionally with URL search parameters on page reload without infinite render loops.',
  'task-b': 'Add an export confirmation modal requiring the user to type "CONFIRM" before downloading filtered records as JSON. Ensure clean modal guard clauses.',
  'task-c': 'Handle 401 Unauthorized API responses using Result Tuples (toResult) to display an inline retry banner rather than throwing unhandled rejections.',
  'task-d': 'Refactor data fetching to handle HTTP 429 errors with exponential backoff (up to 3 retries) and expose reactive isRetrying state.',
  'task-e': 'Add a tri-state "Amount" column sort toggle (ASC/DESC/NONE) in the table header, extracting sort logic from the render cycle.'
};

const parseCliArgs = () => {
  const args = process.argv.slice(2);
  const getArgValue = (key: string, defaultValue: string) => {
    const match = args.find((a) => a.startsWith(`--${key}=`));
    return match ? match.split('=')[1] : defaultValue;
  };

  return {
    model: getArgValue('model', 'gemini-2-5-pro') as BenchmarkModel,
    target: getArgValue('target', 'chemical-x') as ArchitectureTarget,
    task: getArgValue('task', 'task-a') as TaskIdentifier | 'all',
    dryRun: args.includes('--dry-run')
  };
};

const callModelApi = async (
  model: BenchmarkModel,
  prompt: string,
  dryRun: boolean
): Promise<{ output: string; inputTokens: number; outputTokens: number }> => {
  if (dryRun) {
    return {
      output: '// Dry run response: No modifications made.\n',
      inputTokens: 100,
      outputTokens: 20
    };
  }

  if (model === 'claude-3-7-sonnet') {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });
    const textBlock = response.content.find((b) => b.type === 'text');
    return {
      output: textBlock ? textBlock.text : '',
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens
    };
  }

  if (model === 'gemini-2-5-pro') {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt
    });
    const output = response.text || '';
    const inputTokens = response.usageMetadata?.promptTokenCount || 0;
    const outputTokens = response.usageMetadata?.candidatesTokenCount || 0;
    return { output, inputTokens, outputTokens };
  }

  if (model === 'gpt-4o') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    });
    return {
      output: response.choices[0]?.message?.content || '',
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0
    };
  }

  if (model === 'grok-2') {
    const grok = new OpenAI({
      apiKey: process.env.XAI_API_KEY || process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1'
    });
    const response = await grok.chat.completions.create({
      model: 'grok-2-latest',
      messages: [{ role: 'user', content: prompt }]
    });
    return {
      output: response.choices[0]?.message?.content || '',
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0
    };
  }

  throw new Error(`Unsupported model identifier: ${model}`);
};

const applyDiffPatch = (targetFile: string, completionText: string): boolean => {
  // Extract file content from markdown fences if model returned code block
  const codeBlockRegex = /```(?:tsx?|typescript|javascript)?\n([\s\S]*?)```/;
  const match = completionText.match(codeBlockRegex);
  const updatedCode = match ? match[1] : completionText;

  // Verify diff integrity: ensure no unresolved conflict or placeholder markers
  if (updatedCode.includes('<<<<<<<') || updatedCode.includes('// ... existing code ...')) {
    return false;
  }

  try {
    fs.writeFileSync(targetFile, updatedCode, 'utf-8');
    return true;
  } catch {
    return false;
  }
};

export const runSingleTaskBenchmark = async (
  model: BenchmarkModel,
  architecture: ArchitectureTarget,
  taskId: TaskIdentifier,
  dryRun: boolean = false
): Promise<BenchmarkMetrics> => {
  const runId = Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const branchName = `eval/${architecture}/${taskId}-${model}-${runId}`;

  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const baseBranch = architecture === 'monolith' ? 'base/monolith' : 'base/chemical-x';

  const startTime = Date.now();
  let diffIntegrity = false;
  let typecheckPassed = false;
  let testPassed = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let runError: string | undefined;

  try {
    // 1. Checkout base branch and create evaluation branch
    execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'ignore' });

    // 2. Identify target files to provide as context
    const targetFile = architecture === 'monolith'
      ? 'src/UserDashboardMonolithApp.tsx'
      : 'src/views/UserDashboardView.tsx';
    
    const existingCode = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, 'utf-8') : '';
    const taskSpec = TASK_DESCRIPTIONS[taskId];

    const prompt = `You are an expert TypeScript and React engineer.
Complete the following coding task for the provided code.

TASK SPECIFICATION:
${taskSpec}

EXISTING FILE (${targetFile}):
\`\`\`tsx
${existingCode}
\`\`\`

REQUIREMENTS:
- Return the COMPLETE updated code for ${targetFile}.
- Do NOT use placeholders such as // ... existing code ...
- Adhere strictly to clean architecture, atomic booleans, and self-cleaning timers.
`;

    // 3. Dispatch API request
    const modelResponse = await callModelApi(model, prompt, dryRun);
    inputTokens = modelResponse.inputTokens;
    outputTokens = modelResponse.outputTokens;

    // 4. Apply patch and verify diff integrity
    diffIntegrity = applyDiffPatch(targetFile, modelResponse.output);

    // 5. Verification: typecheck and test
    if (diffIntegrity && !dryRun) {
      try {
        execSync('npx tsc --noEmit', { stdio: 'ignore' });
        typecheckPassed = true;
      } catch {
        typecheckPassed = false;
      }

      try {
        execSync(`npx vitest run tasks/${taskId}.test.ts`, { stdio: 'ignore' });
        testPassed = true;
      } catch {
        testPassed = false;
      }
    } else if (dryRun) {
      typecheckPassed = true;
      testPassed = true;
    }
  } catch (err: unknown) {
    runError = err instanceof Error ? err.message : String(err);
  } finally {
    // Restore initial branch
    try {
      execSync(`git checkout ${currentBranch}`, { stdio: 'ignore' });
    } catch {
      // Ignore checkout restoration error if already on current branch
    }
  }

  const latencySeconds = (Date.now() - startTime) / 1000;
  const firstPassSuccess = Boolean(diffIntegrity && typecheckPassed && testPassed);

  const result: BenchmarkMetrics = {
    timestamp,
    runId,
    model,
    architecture,
    task: taskId,
    firstPassSuccess,
    diffIntegrity,
    typecheckPassed,
    testPassed,
    tokenConsumption: {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens
    },
    latencySeconds,
    error: runError
  };

  const resultsDir = path.resolve(process.cwd(), 'benchmarks/results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const resultPath = path.join(resultsDir, `${timestamp}-${model}-${architecture}-${taskId}.json`);
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf-8');

  return result;
};

const main = async () => {
  const { model, target, task, dryRun } = parseCliArgs();
  const tasksToRun: TaskIdentifier[] = task === 'all'
    ? ['task-a', 'task-b', 'task-c', 'task-d', 'task-e']
    : [task];

  process.stdout.write(`\n=== RUNNING BENCHMARK MATRIX: ${model} | Target: ${target} ===\n`);

  for (const tId of tasksToRun) {
    process.stdout.write(`\nStarting evaluation: ${tId} ...\n`);
    const metrics = await runSingleTaskBenchmark(model, target, tId, dryRun);
    process.stdout.write(`Result for ${tId}:\n`);
    process.stdout.write(`  First-Pass Success: ${metrics.firstPassSuccess}\n`);
    process.stdout.write(`  Diff Integrity:     ${metrics.diffIntegrity}\n`);
    process.stdout.write(`  Typecheck Passed:   ${metrics.typecheckPassed}\n`);
    process.stdout.write(`  Tests Passed:       ${metrics.testPassed}\n`);
    process.stdout.write(`  Total Tokens:       ${metrics.tokenConsumption.totalTokens}\n`);
    process.stdout.write(`  Latency (s):        ${metrics.latencySeconds.toFixed(2)}s\n`);
  }
};

if (process.argv[1] && process.argv[1].endsWith('run-benchmark.ts')) {
  main().catch((err) => {
    process.stderr.write(`Benchmark run failed: ${err.message}\n`);
    process.exit(1);
  });
}

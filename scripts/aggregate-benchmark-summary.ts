import fs from 'node:fs';
import path from 'node:path';

const resultsDir = process.argv[2] || path.resolve(process.cwd(), 'benchmarks/results');

interface ResultPayload {
  model: string;
  architecture: string;
  task: string;
  firstPassSuccess: boolean;
  diffIntegrity: boolean;
  tokenConsumption: {
    totalTokens: number;
  };
  latencySeconds: number;
}

interface AggregateGroup {
  totalRuns: number;
  passedCount: number;
  cleanDiffCount: number;
  totalTokens: number;
  totalLatency: number;
}

const findJsonFiles = (dir: string): string[] => {
  let files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findJsonFiles(full));
    } else if (entry.name.endsWith('.json') && !entry.name.includes('audit-report')) {
      files.push(full);
    }
  }
  return files;
};

const jsonFiles = findJsonFiles(resultsDir);

if (jsonFiles.length === 0) {
  process.stdout.write('No benchmark result files found to aggregate.\n');
  process.exit(0);
}

const groups: Record<string, AggregateGroup> = {};

for (const file of jsonFiles) {
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const data: ResultPayload = JSON.parse(raw);
    if (!data.model || !data.architecture) continue;

    const key = `${data.model}__${data.architecture}`;
    if (!groups[key]) {
      groups[key] = {
        totalRuns: 0,
        passedCount: 0,
        cleanDiffCount: 0,
        totalTokens: 0,
        totalLatency: 0
      };
    }

    groups[key].totalRuns += 1;
    if (data.firstPassSuccess) groups[key].passedCount += 1;
    if (data.diffIntegrity) groups[key].cleanDiffCount += 1;
    groups[key].totalTokens += data.tokenConsumption?.totalTokens || 0;
    groups[key].totalLatency += data.latencySeconds || 0;
  } catch {
    // Ignore unparseable files
  }
}

let markdown = '# Empirical Benchmark Comparison: Monolith vs. Chemical X\n\n';
markdown += '| Model | Architecture | Pass Rate | Diff Cleanliness | Avg Token Burn | Avg Latency |\n';
markdown += '| :--- | :--- | :--- | :--- | :--- | :--- |\n';

const sortedKeys = Object.keys(groups).sort();

for (const key of sortedKeys) {
  const [model, arch] = key.split('__');
  const g = groups[key];
  const passRate = `${Math.round((g.passedCount / g.totalRuns) * 100)}% (${g.passedCount}/${g.totalRuns})`;
  const diffClean = `${Math.round((g.cleanDiffCount / g.totalRuns) * 100)}% (${g.cleanDiffCount}/${g.totalRuns})`;
  const avgTokens = Math.round(g.totalTokens / g.totalRuns).toLocaleString();
  const avgLatency = `${(g.totalLatency / g.totalRuns).toFixed(2)}s`;

  markdown += `| ${model} | ${arch} | ${passRate} | ${diffClean} | ${avgTokens} tokens | ${avgLatency} |\n`;
}

markdown += '\n### Benchmark Insights\n';
markdown += '- **Diff Cleanliness**: Measures whether agent edits applied without marker corruption.\n';
markdown += '- **Token Burn**: Measures average total token consumption per task.\n';
markdown += '- **Pass Rate**: First-pass success requiring zero manual repair cycles.\n';

process.stdout.write(markdown);

const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
if (stepSummaryPath && fs.existsSync(path.dirname(stepSummaryPath))) {
  fs.appendFileSync(stepSummaryPath, '\n' + markdown + '\n', 'utf-8');
}

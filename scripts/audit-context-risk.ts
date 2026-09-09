import starterKitAudit, {
  auditFile as starterAuditFile,
  scanDirectory as starterScanDirectory,
  runAudit as starterRunAudit,
  type HazardViolation,
  type AuditReport
} from '../../starter-kit/cli/audit.js';

export type { HazardViolation, AuditReport };
export const auditFile = starterAuditFile || starterKitAudit.auditFile;
export const scanDirectory = starterScanDirectory || starterKitAudit.scanDirectory;
export const runAudit = starterRunAudit || starterKitAudit.runAudit;

if (process.argv[1] && process.argv[1].endsWith('audit-context-risk.ts')) {
  const isJson = process.argv.includes('--json');
  const dirArg = process.argv.find((arg) => arg.startsWith('--dir='));
  const targetDir = dirArg ? dirArg.split('=')[1] : 'src';

  const report = runAudit(targetDir);

  if (isJson) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    process.stdout.write('\n=== CHEMICAL X ARCHITECTURAL CONTEXT HAZARD AUDIT ===\n\n');
    if (report.violations.length === 0) {
      process.stdout.write('PASSED: Zero context hazard violations detected.\n\n');
    } else {
      process.stdout.write(`FAILED: ${report.totalViolations} hazard violations detected.\n\n`);
      for (const v of report.violations) {
        process.stdout.write(`[${v.rule}] ${v.filePath}:${v.line}\n`);
        process.stdout.write(`  Hazard:    ${v.hazard}\n`);
        process.stdout.write(`  Directive: ${v.directive}\n\n`);
      }
    }
  }

  process.exit(report.violations.length > 0 ? 1 : 0);
}

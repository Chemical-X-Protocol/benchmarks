import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface HazardViolation {
  filePath: string;
  line: number;
  hazard: string;
  rule: string;
  directive: string;
}

export interface AuditReport {
  scannedFiles: number;
  totalViolations: number;
  violations: HazardViolation[];
}

const countLogicalOperators = (node: t.Node): number => {
  let count = 0;
  if (t.isLogicalExpression(node)) {
    count += 1;
    count += countLogicalOperators(node.left);
    count += countLogicalOperators(node.right);
  } else if (t.isUnaryExpression(node) && node.operator === '!') {
    count += 1;
    count += countLogicalOperators(node.argument);
  }
  return count;
};

export const auditFile = (filePath: string, relativePath: string): HazardViolation[] => {
  const violations: HazardViolation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const lineCount = lines.length;

  // 1. Line Budget Checks
  const isMolecule = relativePath.includes('molecules') || relativePath.includes('/m-');
  if (lineCount > 500) {
    violations.push({
      filePath: relativePath,
      line: 1,
      hazard: `File line budget exceeded (${lineCount} > 500 lines)`,
      rule: 'LINE_BUDGET_FILE',
      directive: 'Decompose monolith into domain capsules and molecules'
    });
  } else if (isMolecule && lineCount > 100) {
    violations.push({
      filePath: relativePath,
      line: 1,
      hazard: `Molecule capsule budget exceeded (${lineCount} > 100 lines)`,
      rule: 'LINE_BUDGET_MOLECULE',
      directive: 'Split molecule into focused sub-molecules or extract state to hook'
    });
  }

  let ast: t.File;
  try {
    ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    violations.push({
      filePath: relativePath,
      line: 1,
      hazard: `Parse error: ${errorMsg}`,
      rule: 'SYNTAX_PARSE_ERROR',
      directive: 'Fix syntax errors before static analysis'
    });
    return violations;
  }

  const traverseFn = (traverse as unknown as { default?: typeof traverse }).default || traverse;

  traverseFn(ast, {
    // 2. Hook Saturation Check
    Function(astPath) {
      let hookCount = 0;
      astPath.traverse({
        CallExpression(callPath) {
          if (t.isIdentifier(callPath.node.callee) && /^use[A-Z0-9]/.test(callPath.node.callee.name)) {
            // Only count direct or inner hooks of this component scope
            if (callPath.getFunctionParent() === astPath) {
              hookCount += 1;
            }
          }
        }
      });

      if (hookCount > 5) {
        const line = astPath.node.loc?.start.line || 1;
        violations.push({
          filePath: relativePath,
          line,
          hazard: `Hook saturation detected (${hookCount} hooks > 5 limit)`,
          rule: 'HOOK_SATURATION',
          directive: 'Extract related state and effects into dedicated domain hooks'
        });
      }
    },

    // 3. Control Flow Complexity (Inline JSX booleans & Nested Ternaries)
    JSXExpressionContainer(astPath) {
      const expr = astPath.node.expression;
      if (t.isLogicalExpression(expr) || t.isUnaryExpression(expr)) {
        const opCount = countLogicalOperators(expr);
        if (opCount > 2) {
          const line = expr.loc?.start.line || astPath.node.loc?.start.line || 1;
          violations.push({
            filePath: relativePath,
            line,
            hazard: `Inline boolean complexity (${opCount} logical operators > 2 limit)`,
            rule: 'CONTROL_FLOW_INLINE_BOOLEAN',
            directive: 'Compose booleans into Stage 1 concepts and Stage 2 decision variables'
          });
        }
      }
    },

    ConditionalExpression(astPath) {
      if (t.isConditionalExpression(astPath.node.consequent) || t.isConditionalExpression(astPath.node.alternate)) {
        const line = astPath.node.loc?.start.line || 1;
        violations.push({
          filePath: relativePath,
          line,
          hazard: 'Nested ternary operator detected',
          rule: 'CONTROL_FLOW_NESTED_TERNARY',
          directive: 'Extract display states into computed descriptor objects or early returns'
        });
      }
    },

    // 4. Timer Discipline (Raw setInterval / setTimeout without cleanup)
    CallExpression(astPath) {
      const callee = astPath.node.callee;
      if (t.isIdentifier(callee) && (callee.name === 'setInterval' || callee.name === 'setTimeout')) {
        // Check if inside useEffect or custom hook with cleanup
        const fnParent = astPath.getFunctionParent();
        let hasCleanup = false;
        if (fnParent) {
          fnParent.traverse({
            ReturnStatement(retPath) {
              if (retPath.node.argument) {
                hasCleanup = true;
              }
            }
          });
        }

        if (!hasCleanup) {
          const line = astPath.node.loc?.start.line || 1;
          violations.push({
            filePath: relativePath,
            line,
            hazard: `Raw ${callee.name} lacking lifecycle scope disposal`,
            rule: 'TIMER_DISCIPLINE',
            directive: 'Wrap timers in self-cleaning hooks returning cleanup disposers'
          });
        }
      }
    },

    // 5. Type Co-location (Inline complex anonymous types)
    TSTypeLiteral(astPath) {
      // Flag anonymous inline object types with > 3 members in function parameters or state
      if (astPath.node.members.length > 3) {
        // If not part of a type alias or interface declaration
        if (!astPath.findParent((p) => p.isTSTypeAliasDeclaration() || p.isTSInterfaceDeclaration())) {
          const line = astPath.node.loc?.start.line || 1;
          violations.push({
            filePath: relativePath,
            line,
            hazard: `Inlined anonymous complex type (${astPath.node.members.length} members)`,
            rule: 'TYPE_COLOCATION',
            directive: 'Define co-located domain interfaces in types/*.d.ts'
          });
        }
      }
    }
  });

  return violations;
};

const scanDirectory = (targetDir: string, baseDir: string): HazardViolation[] => {
  let results: HazardViolation[] = [];
  if (!fs.existsSync(targetDir)) return results;

  const entries = fs.readdirSync(targetDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);
    const relPath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        results = results.concat(scanDirectory(fullPath, baseDir));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !entry.name.endsWith('.d.ts') && !entry.name.includes('.test.')) {
      results = results.concat(auditFile(fullPath, relPath));
    }
  }
  return results;
};

export const runAudit = (targetDir: string = 'src'): AuditReport => {
  const cwd = process.cwd();
  const absoluteTarget = path.resolve(cwd, targetDir);
  const violations = scanDirectory(absoluteTarget, cwd);

  return {
    scannedFiles: fs.readdirSync(absoluteTarget).length,
    totalViolations: violations.length,
    violations
  };
};

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

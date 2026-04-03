import {once} from 'node:events';
import {rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {spec} from 'node:test/reporters';
import {run} from 'node:test';
import ts from 'typescript';

const rootDir = process.cwd();
const outputDir = path.join(rootDir, '.codex-test-build');
const configPath = path.join(rootDir, 'tsconfig.tests.json');

function printDiagnostics(diagnostics) {
  if (diagnostics.length === 0) {
    return;
  }

  const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => rootDir,
    getNewLine: () => '\n',
  });

  process.stderr.write(formatted);
}

async function compileTests() {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    printDiagnostics([configFile.error]);
    process.exitCode = 1;
    return false;
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    rootDir,
    undefined,
    configPath,
  );

  if (parsedConfig.errors.length > 0) {
    printDiagnostics(parsedConfig.errors);
    process.exitCode = 1;
    return false;
  }

  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  });

  const diagnostics = ts.getPreEmitDiagnostics(program);
  const emitResult = program.emit();
  const allDiagnostics = diagnostics.concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    printDiagnostics(allDiagnostics);
    process.exitCode = 1;
    return false;
  }

  return true;
}

async function runTests() {
  await writeFile(
    path.join(outputDir, 'package.json'),
    `${JSON.stringify({type: 'commonjs'}, null, 2)}\n`,
    'utf8',
  );

  const testStream = run({
    cwd: outputDir,
    forceExit: true,
    isolation: 'none',
  });

  const reporter = testStream.compose(spec);
  reporter.pipe(process.stdout);

  let hasFailures = false;
  testStream.on('test:fail', () => {
    hasFailures = true;
  });

  await once(reporter, 'end');
  process.exitCode = hasFailures ? 1 : 0;
}

await rm(outputDir, {recursive: true, force: true});

if (await compileTests()) {
  try {
    await runTests();
  } finally {
    await rm(outputDir, {recursive: true, force: true});
  }
}

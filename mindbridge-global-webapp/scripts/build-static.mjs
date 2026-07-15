import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const appRoot = path.resolve(__dirname, '..');

const sourceFiles = {
  index: path.join(appRoot, 'Index.html'),
  departmentSeal: path.join(appRoot, 'DepartmentSeal.html'),
  stylesheet: path.join(appRoot, 'Stylesheet.html'),
  javascript: path.join(appRoot, 'JavaScript.html')
};

const outputFiles = {
  docsIndex: path.join(workspaceRoot, 'docs', 'index.html'),
  docs404: path.join(workspaceRoot, 'docs', '404.html'),
  docsNoJekyll: path.join(workspaceRoot, 'docs', '.nojekyll'),
  offlineHtml: path.join(workspaceRoot, 'offline', 'mindbridge-global-offline.html')
};

async function main() {
  const [indexHtml, departmentSealHtml, stylesheetHtml, javascriptHtml] = await Promise.all([
    fs.readFile(sourceFiles.index, 'utf8'),
    fs.readFile(sourceFiles.departmentSeal, 'utf8'),
    fs.readFile(sourceFiles.stylesheet, 'utf8'),
    fs.readFile(sourceFiles.javascript, 'utf8')
  ]);

  const builtHtml = buildStaticHtml(indexHtml, departmentSealHtml, stylesheetHtml, javascriptHtml);

  await Promise.all([
    fs.mkdir(path.dirname(outputFiles.docsIndex), { recursive: true }),
    fs.mkdir(path.dirname(outputFiles.offlineHtml), { recursive: true })
  ]);

  await Promise.all([
    fs.writeFile(outputFiles.docsIndex, builtHtml),
    fs.writeFile(outputFiles.docs404, builtHtml),
    fs.writeFile(outputFiles.docsNoJekyll, ''),
    fs.writeFile(outputFiles.offlineHtml, builtHtml)
  ]);

  process.stdout.write([
    'Built static site assets:',
    `- ${path.relative(workspaceRoot, outputFiles.docsIndex)}`,
    `- ${path.relative(workspaceRoot, outputFiles.docs404)}`,
    `- ${path.relative(workspaceRoot, outputFiles.offlineHtml)}`
  ].join('\n'));
}

function buildStaticHtml(indexHtml, departmentSealHtml, stylesheetHtml, javascriptHtml) {
  return indexHtml
    .replaceAll(/<\?!= include\('DepartmentSeal'\); \?>/g, departmentSealHtml)
    .replace(/<\?!= include\('Stylesheet'\); \?>/, stylesheetHtml)
    .replace(/<\?!= include\('JavaScript'\); \?>/, javascriptHtml)
    .replace(
      '<body>',
      '<body>\n    <!-- Built from mindbridge-global-webapp Apps Script sources for GitHub Pages and offline presentation backup. -->'
    );
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});

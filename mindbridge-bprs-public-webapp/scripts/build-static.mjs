import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const appRoot = path.resolve(__dirname, '..');

const sourceFiles = {
  index: path.join(appRoot, 'Index.html'),
  dashboard: path.join(appRoot, 'Dashboard.html'),
  stylesheet: path.join(appRoot, 'Stylesheet.html'),
  javascript: path.join(appRoot, 'JavaScript.html'),
  dashboardJavascript: path.join(appRoot, 'DashboardJavaScript.html')
};

const outputFiles = {
  docsIndex: path.join(workspaceRoot, 'docs', 'bprs', 'index.html'),
  docsDashboard: path.join(workspaceRoot, 'docs', 'bprs', 'dashboard.html'),
  offlineHtml: path.join(workspaceRoot, 'offline', 'mindbridge-bprs-public-offline.html'),
  offlineDashboardHtml: path.join(workspaceRoot, 'offline', 'mindbridge-bprs-dashboard-offline.html')
};

async function main() {
  const [indexHtml, dashboardHtml, stylesheetHtml, javascriptHtml, dashboardJavascriptHtml] = await Promise.all([
    fs.readFile(sourceFiles.index, 'utf8'),
    fs.readFile(sourceFiles.dashboard, 'utf8'),
    fs.readFile(sourceFiles.stylesheet, 'utf8'),
    fs.readFile(sourceFiles.javascript, 'utf8'),
    fs.readFile(sourceFiles.dashboardJavascript, 'utf8')
  ]);

  const builtIndexHtml = indexHtml
    .replace(/<\?!= include\('Stylesheet'\); \?>/, stylesheetHtml)
    .replace(/<\?!= include\('JavaScript'\); \?>/, javascriptHtml)
    .replace(
      '<body>',
      '<body>\n    <!-- Built from mindbridge-bprs-public-webapp Apps Script sources for static and offline presentation use. -->'
    );

  const builtDashboardHtml = dashboardHtml
    .replace(/<\?!= include\('Stylesheet'\); \?>/, stylesheetHtml)
    .replace(/<\?!= include\('DashboardJavaScript'\); \?>/, dashboardJavascriptHtml)
    .replace(
      '<body class="dashboard-body">',
      '<body class="dashboard-body">\n    <!-- Built from mindbridge-bprs-public-webapp Apps Script dashboard sources for static and offline presentation use. -->'
    );

  await Promise.all([
    fs.mkdir(path.dirname(outputFiles.docsIndex), { recursive: true }),
    fs.mkdir(path.dirname(outputFiles.offlineHtml), { recursive: true })
  ]);

  await Promise.all([
    fs.writeFile(outputFiles.docsIndex, builtIndexHtml),
    fs.writeFile(outputFiles.docsDashboard, builtDashboardHtml),
    fs.writeFile(outputFiles.offlineHtml, builtIndexHtml),
    fs.writeFile(outputFiles.offlineDashboardHtml, builtDashboardHtml)
  ]);

  process.stdout.write([
    'Built BPRS presentation assets:',
    `- ${path.relative(workspaceRoot, outputFiles.docsIndex)}`,
    `- ${path.relative(workspaceRoot, outputFiles.docsDashboard)}`,
    `- ${path.relative(workspaceRoot, outputFiles.offlineHtml)}`,
    `- ${path.relative(workspaceRoot, outputFiles.offlineDashboardHtml)}`
  ].join('\n'));
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});

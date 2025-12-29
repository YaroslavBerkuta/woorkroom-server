const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const configPath = path.join(__dirname, 'nest-cli.json');

if (!fs.existsSync(configPath)) {
  console.error('❌ nest-cli.json not found');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const projects = config.projects || {};

const apps = Object.entries(projects)
  .filter(([, p]) => p.type === 'application')
  .map(([name]) => name);

if (!apps.length) {
  console.log('⚠️ No apps found');
  process.exit(0);
}

console.log(`🚀 Applications: ${apps.join(', ')}`);
console.log('-------------------------');

function run(cmd) {
  console.log(`▶️ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

/**
 * 1. Білдимо всі апки
 *  (libs підтягнуться автоматично)
 */
apps.forEach((app) => {
  run(`npx nest build ${app}`);
});

console.log('\n✅ ALL PROJECTS BUILT SUCCESSFULLY');

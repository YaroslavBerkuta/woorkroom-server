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

const libs = Object.entries(projects)
  .filter(([, p]) => p.type === 'library')
  .map(([name]) => name);

if (!apps.length && !libs.length) {
  console.log('⚠️ No apps or libs found');
  process.exit(0);
}

console.log(`🚀 Applications: ${apps.join(', ')}`);
console.log(`📦 Libraries: ${libs.join(', ')}`);
console.log('-------------------------');

function run(cmd) {
  console.log(`▶️ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

/**
 * 1. Білдимо всі апки
 *  (libs підтягнуться автоматично)
 */
apps.forEach(app => {
  run(`npx nest build ${app}`);
});

/**
 * 2. Додатково явно збираємо libs (опціонально, але безпечно)
 */
libs.forEach(lib => {
  run(`npx nest build ${lib}`);
});

console.log('\n✅ ALL PROJECTS BUILT SUCCESSFULLY');

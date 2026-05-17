import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname, resolve } from 'path';

const ROOT = resolve('.');

// Each app's src root
const APP_ROOTS = [
  'apps/authorization/src',
  'apps/companys/src',
  'apps/gateway/src',
  'apps/mails/src',
  'apps/media/src',
  'apps/projects/src',
  'apps/users/src',
];

function* walkTs(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkTs(full);
    else if (entry.endsWith('.ts')) yield full;
  }
}

function toRelative(fromFile, aliasPath, srcRoot) {
  const fromDir = dirname(fromFile);
  const target = join(ROOT, srcRoot, aliasPath);
  let rel = relative(fromDir, target).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

let totalFiles = 0;
let totalReplacements = 0;

for (const srcRoot of APP_ROOTS) {
  for (const file of walkTs(join(ROOT, srcRoot))) {
    let content = readFileSync(file, 'utf-8');
    const original = content;

    // Match: from '@/something' or from "@/something"
    content = content.replace(/from\s+(['"])@\/([^'"]+)\1/g, (match, quote, aliasPath) => {
      const rel = toRelative(file, aliasPath, srcRoot);
      return `from ${quote}${rel}${quote}`;
    });

    if (content !== original) {
      writeFileSync(file, content, 'utf-8');
      totalFiles++;
      const count = (original.match(/from\s+['"]@\//g) || []).length;
      totalReplacements += count;
    }
  }
}

console.log(`✓ Updated ${totalFiles} files, ~${totalReplacements} imports converted`);

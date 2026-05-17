import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';
import pg from 'pg';
import { MongoClient } from 'mongodb';

const { Client } = pg;

const PEPPER = 'helloWorld';
const SALT_ROUNDS = 10;

const PG_BASE = { host: 'localhost', port: 5432, user: 'root', password: 'root' };
const MONGO_URI = 'mongodb://localhost:27017';

async function hashPw(plain) {
  return hash(plain.normalize('NFKC') + PEPPER, SALT_ROUNDS);
}

async function pgClient(database) {
  const c = new Client({ ...PG_BASE, database });
  await c.connect();
  return c;
}

// ──────────────────────────────────────────────
// IDs (hardcoded so relations are deterministic)
// ──────────────────────────────────────────────

const ID = {
  // users
  u1: randomUUID(), u2: randomUUID(), u3: randomUUID(),
  u4: randomUUID(), u5: randomUUID(),
  // companies
  c1: randomUUID(), c2: randomUUID(),
  // employees  (emp<user><company>)
  e11: randomUUID(), e21: randomUUID(), e31: randomUUID(), e41: randomUUID(),
  e52: randomUUID(), e42: randomUUID(),
  // projects company-1
  p1: randomUUID(), p2: randomUUID(), p3: randomUUID(), p4: randomUUID(),
  // projects company-2
  p5: randomUUID(), p6: randomUUID(), p7: randomUUID(),
  // project members
  pm1: randomUUID(), pm2: randomUUID(), pm3: randomUUID(),
  pm4: randomUUID(), pm5: randomUUID(), pm6: randomUUID(),
  pm7: randomUUID(), pm8: randomUUID(), pm9: randomUUID(),
  pm10: randomUUID(), pm11: randomUUID(), pm12: randomUUID(),
  pm13: randomUUID(), pm14: randomUUID(), pm15: randomUUID(),
};

const users = [
  { id: ID.u1, email: 'yaroslav@woorkroom.dev', phone: '+380671234567', password: 'Yaroslav#2026' },
  { id: ID.u2, email: 'alex@woorkroom.dev',     phone: '+380672345678', password: 'Alex#2026' },
  { id: ID.u3, email: 'maria@woorkroom.dev',    phone: '+380673456789', password: 'Maria#2026' },
  { id: ID.u4, email: 'ivan@woorkroom.dev',     phone: '+380674567890', password: 'Ivan#2026' },
  { id: ID.u5, email: 'olga@woorkroom.dev',     phone: '+380675678901', password: 'Olga#2026' },
];

const companies = [
  {
    id: ID.c1, name: 'Woorkroom Tech',
    service: 'Software Development', describes: 'Product-driven software company',
    direction: 'IT / SaaS', peopleCountStart: 10, peopleCountEnd: 50,
  },
  {
    id: ID.c2, name: 'PixelStudio',
    service: 'UI/UX Design', describes: 'Creative design studio',
    direction: 'Design / Branding', peopleCountStart: 5, peopleCountEnd: 20,
  },
];

const employees = [
  // Woorkroom Tech
  { id: ID.e11, companyId: ID.c1, userId: ID.u1, role: 'OWNER', status: 'ACTIVE', name: 'Yaroslav', lastName: 'Berkuta',  position: 'CEO',                 location: 'Kyiv' },
  { id: ID.e21, companyId: ID.c1, userId: ID.u2, role: 'ADMIN', status: 'ACTIVE', name: 'Alex',     lastName: 'Morozov',  position: 'Tech Lead',           location: 'Lviv' },
  { id: ID.e31, companyId: ID.c1, userId: ID.u3, role: 'USER',  status: 'ACTIVE', name: 'Maria',    lastName: 'Kovalenko', position: 'Frontend Developer', location: 'Kyiv' },
  { id: ID.e41, companyId: ID.c1, userId: ID.u5, role: 'USER',  status: 'ACTIVE', name: 'Olga',     lastName: 'Sydorenko', position: 'QA Engineer',        location: 'Kharkiv' },
  // PixelStudio
  { id: ID.e52, companyId: ID.c2, userId: ID.u4, role: 'OWNER', status: 'ACTIVE', name: 'Ivan',     lastName: 'Petrenko', position: 'Creative Director',   location: 'Odesa' },
  { id: ID.e42, companyId: ID.c2, userId: ID.u5, role: 'USER',  status: 'ACTIVE', name: 'Olga',     lastName: 'Sydorenko', position: 'UI Designer',        location: 'Kharkiv' },
];

const projects = [
  // Woorkroom Tech
  { id: ID.p1, companyId: ID.c1, name: 'Mobile App',                slug: 'mobile-app',                status: 'ACTIVE', priority: 'high',   starts: '2026-01-15', deadline: '2026-08-31', description: 'Cross-platform mobile application for iOS and Android' },
  { id: ID.p2, companyId: ID.c1, name: 'Backend Refactoring',       slug: 'backend-refactoring',       status: 'ACTIVE', priority: 'medium', starts: '2026-03-01', deadline: '2026-09-30', description: 'Migrate monolith to microservices architecture' },
  { id: ID.p3, companyId: ID.c1, name: 'Marketing Website',         slug: 'marketing-website',         status: 'CLOSED', priority: 'low',    starts: '2025-09-01', deadline: '2026-01-31', description: 'New marketing landing page and blog' },
  { id: ID.p4, companyId: ID.c1, name: 'Analytics Dashboard',       slug: 'analytics-dashboard',       status: 'ACTIVE', priority: 'high',   starts: '2026-04-01', deadline: '2026-10-31', description: 'Real-time analytics dashboard for internal use' },
  // PixelStudio
  { id: ID.p5, companyId: ID.c2, name: 'Brand Identity Redesign',   slug: 'brand-identity-redesign',   status: 'ACTIVE', priority: 'high',   starts: '2026-02-01', deadline: '2026-07-31', description: 'Full brand refresh including logo, typography and guidelines' },
  { id: ID.p6, companyId: ID.c2, name: 'UI Design System',          slug: 'ui-design-system',          status: 'ACTIVE', priority: 'medium', starts: '2026-03-15', deadline: '2026-08-15', description: 'Component library and design tokens for product teams' },
  { id: ID.p7, companyId: ID.c2, name: 'Product Catalog',           slug: 'product-catalog',           status: 'CLOSED', priority: 'low',    starts: '2025-10-01', deadline: '2026-02-28', description: 'E-commerce product catalog design' },
];

const projectMembers = [
  // Mobile App (p1): yaroslav=REPORTER, alex=ASSIGNEE, maria=ASSIGNEE
  { id: ID.pm1,  projectId: ID.p1, employeeId: ID.e11, role: 'REPORTER' },
  { id: ID.pm2,  projectId: ID.p1, employeeId: ID.e21, role: 'ASSIGNEE' },
  { id: ID.pm3,  projectId: ID.p1, employeeId: ID.e31, role: 'ASSIGNEE' },
  // Backend Refactoring (p2): alex=REPORTER, yaroslav=ASSIGNEE, olga=ASSIGNEE
  { id: ID.pm4,  projectId: ID.p2, employeeId: ID.e21, role: 'REPORTER' },
  { id: ID.pm5,  projectId: ID.p2, employeeId: ID.e11, role: 'ASSIGNEE' },
  { id: ID.pm6,  projectId: ID.p2, employeeId: ID.e41, role: 'ASSIGNEE' },
  // Marketing Website (p3): maria=REPORTER, olga=ASSIGNEE
  { id: ID.pm7,  projectId: ID.p3, employeeId: ID.e31, role: 'REPORTER' },
  { id: ID.pm8,  projectId: ID.p3, employeeId: ID.e41, role: 'ASSIGNEE' },
  // Analytics Dashboard (p4): yaroslav=REPORTER, alex=ASSIGNEE, olga=ASSIGNEE
  { id: ID.pm9,  projectId: ID.p4, employeeId: ID.e11, role: 'REPORTER' },
  { id: ID.pm10, projectId: ID.p4, employeeId: ID.e21, role: 'ASSIGNEE' },
  { id: ID.pm11, projectId: ID.p4, employeeId: ID.e41, role: 'ASSIGNEE' },
  // Brand Identity (p5): ivan=REPORTER, olga=ASSIGNEE
  { id: ID.pm12, projectId: ID.p5, employeeId: ID.e52, role: 'REPORTER' },
  { id: ID.pm13, projectId: ID.p5, employeeId: ID.e42, role: 'ASSIGNEE' },
  // UI Design System (p6): ivan=REPORTER, olga=ASSIGNEE
  { id: ID.pm14, projectId: ID.p6, employeeId: ID.e52, role: 'REPORTER' },
  { id: ID.pm15, projectId: ID.p6, employeeId: ID.e42, role: 'ASSIGNEE' },
  // Product Catalog (p7): ivan=REPORTER only
  { id: randomUUID(), projectId: ID.p7, employeeId: ID.e52, role: 'REPORTER' },
];

const projectFiles = [
  { projectId: ID.p1, url: 'https://storage.woorkroom.dev/mobile-app/wireframes-v1.fig', name: 'wireframes-v1.fig', mimeType: 'application/figma', size: 2048000 },
  { projectId: ID.p1, url: 'https://storage.woorkroom.dev/mobile-app/tech-spec.pdf',     name: 'tech-spec.pdf',    mimeType: 'application/pdf',   size: 512000 },
  { projectId: ID.p2, url: 'https://storage.woorkroom.dev/backend/architecture.pdf',      name: 'architecture.pdf', mimeType: 'application/pdf',   size: 384000 },
  { projectId: ID.p4, url: 'https://storage.woorkroom.dev/analytics/mockups.fig',         name: 'mockups.fig',      mimeType: 'application/figma', size: 1536000 },
  { projectId: ID.p5, url: 'https://storage.woorkroom.dev/brand/logo-pack.zip',           name: 'logo-pack.zip',    mimeType: 'application/zip',   size: 4096000 },
  { projectId: ID.p5, url: 'https://storage.woorkroom.dev/brand/brand-guidelines.pdf',    name: 'brand-guidelines.pdf', mimeType: 'application/pdf', size: 768000 },
  { projectId: ID.p6, url: 'https://storage.woorkroom.dev/design-system/components.fig',  name: 'components.fig',   mimeType: 'application/figma', size: 3072000 },
];

const projectLinks = [
  { projectId: ID.p1, url: 'https://www.figma.com/file/mobile-app-design',      title: 'Figma Design' },
  { projectId: ID.p1, url: 'https://jira.woorkroom.dev/projects/MOBILE',         title: 'Jira Board' },
  { projectId: ID.p2, url: 'https://confluence.woorkroom.dev/backend-migration', title: 'Migration Docs' },
  { projectId: ID.p3, url: 'https://woorkroom.dev',                              title: 'Live Website' },
  { projectId: ID.p4, url: 'https://www.figma.com/file/analytics-dashboard',     title: 'Figma Prototype' },
  { projectId: ID.p5, url: 'https://www.figma.com/file/brand-identity',          title: 'Brand Board' },
  { projectId: ID.p6, url: 'https://storybook.pixelstudio.dev',                  title: 'Storybook' },
  { projectId: ID.p6, url: 'https://www.figma.com/file/design-system',           title: 'Figma Design System' },
];

// ──────────────────────────────────────────────
// Seeding
// ──────────────────────────────────────────────

async function seedUsers() {
  console.log('→ Seeding users...');
  const db = await pgClient('woorkroom-users');
  for (const u of users) {
    const pw = await hashPw(u.password);
    await db.query(
      `INSERT INTO users (id, email, password, "phoneNumber", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,NOW(),NOW())
       ON CONFLICT (email) DO UPDATE SET password=$3, "phoneNumber"=$4, "updatedAt"=NOW()`,
      [u.id, u.email, pw, u.phone],
    );
  }
  await db.end();
  console.log(`  ✓ ${users.length} users`);
}

async function seedCompanies() {
  console.log('→ Seeding companies & employees...');
  const db = await pgClient('woorkroom-company');

  for (const c of companies) {
    await db.query(
      `INSERT INTO companys (id, name, service, describes, direction, "peopleCountStart", "peopleCountEnd", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.service, c.describes, c.direction, c.peopleCountStart, c.peopleCountEnd],
    );
  }

  for (const e of employees) {
    await db.query(
      `INSERT INTO employee (id, "companyId", "userId", role, status, name, "lastName", position, location, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())
       ON CONFLICT ("userId","companyId") DO NOTHING`,
      [e.id, e.companyId, e.userId, e.role, e.status, e.name, e.lastName, e.position, e.location],
    );
  }

  await db.end();
  console.log(`  ✓ ${companies.length} companies, ${employees.length} employees`);
}

async function seedProjects() {
  console.log('→ Seeding projects & members...');
  const db = await pgClient('woorkroom-projects');

  for (const p of projects) {
    await db.query(
      `INSERT INTO project (id, "companyId", name, slug, status, priority, starts, deadline, description, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())
       ON CONFLICT ("companyId", slug) DO NOTHING`,
      [p.id, p.companyId, p.name, p.slug, p.status, p.priority, p.starts || null, p.deadline || null, p.description],
    );
  }

  for (const m of projectMembers) {
    await db.query(
      `INSERT INTO project_member (id, "projectId", "employeeId", role, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,NOW(),NOW())
       ON CONFLICT ("projectId","employeeId",role) DO NOTHING`,
      [m.id, m.projectId, m.employeeId, m.role],
    );
  }

  await db.end();
  console.log(`  ✓ ${projects.length} projects, ${projectMembers.length} members`);
}

async function seedMongo() {
  console.log('→ Seeding MongoDB files & links...');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db('woorkroom_projects');

  const filesCol = db.collection('project_files');
  const linksCol = db.collection('project_links');

  const now = new Date();

  for (const f of projectFiles) {
    const id = randomUUID();
    await filesCol.updateOne(
      { projectId: f.projectId, name: f.name },
      { $setOnInsert: { _id: id, ...f, createdAt: now, updatedAt: now } },
      { upsert: true },
    );
  }

  for (const l of projectLinks) {
    await linksCol.updateOne(
      { projectId: l.projectId, url: l.url },
      { $setOnInsert: { _id: randomUUID(), ...l, createdAt: now, updatedAt: now } },
      { upsert: true },
    );
  }

  await client.close();
  console.log(`  ✓ ${projectFiles.length} files, ${projectLinks.length} links`);
}

async function writeCredentials() {
  const lines = [
    '# Test Credentials',
    '',
    '> Pepper: `helloWorld` | bcryptjs saltRounds: 10',
    '> Login via GraphQL mutation `login(email, password)` on http://localhost:3000/graphql',
    '',
    '## Users',
    '',
    '| Name | Email | Password | Role in company | Companies |',
    '|------|-------|----------|-----------------|-----------|',
    `| Yaroslav Berkuta  | yaroslav@woorkroom.dev | Yaroslav#2026 | OWNER | Woorkroom Tech |`,
    `| Alex Morozov      | alex@woorkroom.dev     | Alex#2026     | ADMIN | Woorkroom Tech |`,
    `| Maria Kovalenko   | maria@woorkroom.dev    | Maria#2026    | USER  | Woorkroom Tech |`,
    `| Olga Sydorenko    | olga@woorkroom.dev     | Olga#2026     | USER  | Woorkroom Tech, PixelStudio |`,
    `| Ivan Petrenko     | ivan@woorkroom.dev     | Ivan#2026     | OWNER | PixelStudio |`,
    '',
    '## Companies',
    '',
    '| Name | Direction | Size |',
    '|------|-----------|------|',
    '| Woorkroom Tech | IT / SaaS         | 10–50 people |',
    '| PixelStudio    | Design / Branding | 5–20 people  |',
    '',
    '## Projects',
    '',
    '### Woorkroom Tech',
    '',
    '| Project | Priority | Status | Reporter | Assignees |',
    '|---------|----------|--------|----------|-----------|',
    '| Mobile App            | HIGH   | ACTIVE | Yaroslav | Alex, Maria |',
    '| Backend Refactoring   | MEDIUM | ACTIVE | Alex     | Yaroslav, Olga |',
    '| Marketing Website     | LOW    | CLOSED | Maria    | Olga |',
    '| Analytics Dashboard   | HIGH   | ACTIVE | Yaroslav | Alex, Olga |',
    '',
    '### PixelStudio',
    '',
    '| Project | Priority | Status | Reporter | Assignees |',
    '|---------|----------|--------|----------|-----------|',
    '| Brand Identity Redesign | HIGH   | ACTIVE | Ivan | Olga |',
    '| UI Design System        | MEDIUM | ACTIVE | Ivan | Olga |',
    '| Product Catalog         | LOW    | CLOSED | Ivan | — |',
    '',
    '## IDs (for direct DB queries)',
    '',
    '### User IDs',
    ...users.map(u => `- ${u.email}: \`${ID[Object.keys(ID).find(k => ID[k] === u.id)]}\``),
    '',
    '### Company IDs',
    `- Woorkroom Tech: \`${ID.c1}\``,
    `- PixelStudio: \`${ID.c2}\``,
    '',
    '### Employee IDs',
    `- Yaroslav @ Woorkroom Tech: \`${ID.e11}\``,
    `- Alex @ Woorkroom Tech: \`${ID.e21}\``,
    `- Maria @ Woorkroom Tech: \`${ID.e31}\``,
    `- Olga @ Woorkroom Tech: \`${ID.e41}\``,
    `- Ivan @ PixelStudio: \`${ID.e52}\``,
    `- Olga @ PixelStudio: \`${ID.e42}\``,
    '',
    '### Project IDs',
    `- Mobile App: \`${ID.p1}\``,
    `- Backend Refactoring: \`${ID.p2}\``,
    `- Marketing Website: \`${ID.p3}\``,
    `- Analytics Dashboard: \`${ID.p4}\``,
    `- Brand Identity Redesign: \`${ID.p5}\``,
    `- UI Design System: \`${ID.p6}\``,
    `- Product Catalog: \`${ID.p7}\``,
  ];

  const { writeFileSync } = await import('fs');
  writeFileSync('TEST_CREDENTIALS.md', lines.join('\n') + '\n', 'utf-8');
  console.log('  ✓ TEST_CREDENTIALS.md written');
}

async function main() {
  console.log('\n🌱 Seeding woorkroom databases...\n');
  try {
    await seedUsers();
    await seedCompanies();
    await seedProjects();
    await seedMongo();
    await writeCredentials();
    console.log('\n✅ Done.\n');
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();

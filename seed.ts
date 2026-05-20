import { Client } from 'pg';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';

const PG_HOST = 'woorkroom.cjqkggggys7s.eu-north-1.rds.amazonaws.com';
const PG_SSL = { rejectUnauthorized: false };
const PG_USER = 'woorkroom';
const PG_PASS = 'woorkroom';
const MONGO_BASE =
  'mongodb+srv://yaroslavberkuta_db_user:8tuRAYaj2tdikJ47@woorkroom.zzxg8vi.mongodb.net';
const PEPPER = 'some-secret-pepper';
const SALT_ROUNDS = 10;

function pg(database: string) {
  return new Client({
    host: PG_HOST,
    port: 5432,
    database,
    user: PG_USER,
    password: PG_PASS,
    ssl: PG_SSL,
  });
}
async function mongoConnect(db: string) {
  return mongoose
    .createConnection(`${MONGO_BASE}/${db}?appName=woorkroom`)
    .asPromise();
}
async function hashPwd(p: string) {
  return hash(p.normalize('NFKC') + PEPPER, SALT_ROUNDS);
}
function rand<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}
function randN<T>(a: T[], n: number): T[] {
  return [...a].sort(() => 0.5 - Math.random()).slice(0, n);
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ── DATA ─────────────────────────────────────────────────────────────────────

const RAW_USERS = [
  {
    email: 'admin@woorkroom.com',
    password: 'Admin123!',
    phone: '+380991110001',
  },
  {
    email: 'yaroslav@woorkroom.com',
    password: 'Yaroslav1!',
    phone: '+380991110002',
  },
  {
    email: 'olena@woorkroom.com',
    password: 'Olena123!',
    phone: '+380991110003',
  },
  {
    email: 'dmytro@woorkroom.com',
    password: 'Dmytro123!',
    phone: '+380991110004',
  },
  {
    email: 'sofia@woorkroom.com',
    password: 'Sofia123!',
    phone: '+380991110005',
  },
  {
    email: 'ivan@woorkroom.com',
    password: 'Ivan1234!',
    phone: '+380991110006',
  },
  {
    email: 'anna@woorkroom.com',
    password: 'Anna1234!',
    phone: '+380991110007',
  },
  {
    email: 'mykola@woorkroom.com',
    password: 'Mykola12!',
    phone: '+380991110008',
  },
  {
    email: 'kateryna@woorkroom.com',
    password: 'Kateryna1!',
    phone: '+380991110009',
  },
  {
    email: 'andrii@woorkroom.com',
    password: 'Andrii12!',
    phone: '+380991110010',
  },
  {
    email: 'tetiana@woorkroom.com',
    password: 'Tetiana1!',
    phone: '+380991110011',
  },
  {
    email: 'bohdan@woorkroom.com',
    password: 'Bohdan12!',
    phone: '+380991110012',
  },
];

const PROFILES = [
  {
    name: 'Admin',
    lastName: 'Owner',
    position: 'Administrator',
    location: 'Kyiv',
  },
  { name: 'Yaroslav', lastName: 'Berkuta', position: 'CEO', location: 'Kyiv' },
  {
    name: 'Olena',
    lastName: 'Kovalenko',
    position: 'Product Manager',
    location: 'Lviv',
  },
  {
    name: 'Dmytro',
    lastName: 'Shevchenko',
    position: 'Lead Developer',
    location: 'Kyiv',
  },
  {
    name: 'Sofia',
    lastName: 'Melnyk',
    position: 'UI/UX Designer',
    location: 'Odesa',
  },
  {
    name: 'Ivan',
    lastName: 'Petrenko',
    position: 'Backend Developer',
    location: 'Kharkiv',
  },
  {
    name: 'Anna',
    lastName: 'Bondarenko',
    position: 'Frontend Developer',
    location: 'Kyiv',
  },
  {
    name: 'Mykola',
    lastName: 'Kravchenko',
    position: 'QA Engineer',
    location: 'Dnipro',
  },
  {
    name: 'Kateryna',
    lastName: 'Lysenko',
    position: 'DevOps Engineer',
    location: 'Kyiv',
  },
  {
    name: 'Andrii',
    lastName: 'Savchenko',
    position: 'Full-Stack Dev',
    location: 'Lviv',
  },
  {
    name: 'Tetiana',
    lastName: 'Moroz',
    position: 'Business Analyst',
    location: 'Kyiv',
  },
  {
    name: 'Bohdan',
    lastName: 'Tkachenko',
    position: 'Mobile Developer',
    location: 'Zaporizhzhia',
  },
];

const COMPANIES_DATA = [
  {
    name: 'Woorkroom Inc',
    service: 'IT',
    describes: 'Product development studio',
    direction: 'Software',
    start: 5,
    end: 50,
    members: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    name: 'Digital Agency UA',
    service: 'Design',
    describes: 'UI/UX and branding agency',
    direction: 'Design',
    start: 10,
    end: 30,
    members: [0, 7, 8, 9, 10, 11],
  },
  {
    name: 'CloudScale Ltd',
    service: 'DevOps',
    describes: 'Cloud infrastructure consulting',
    direction: 'Infrastructure',
    start: 1,
    end: 20,
    members: [0, 2, 3, 8, 9],
  },
];

const PROJECTS_DATA = [
  // Woorkroom Inc (5)
  {
    c: 0,
    name: 'CRM Platform',
    slug: 'crm-platform',
    priority: 'high',
    desc: 'Internal CRM for sales team',
    starts: daysAgo(60),
    deadline: daysAgo(-30),
  },
  {
    c: 0,
    name: 'Mobile App v2',
    slug: 'mobile-app-v2',
    priority: 'high',
    desc: 'React Native rewrite of mobile client',
    starts: daysAgo(45),
    deadline: daysAgo(-15),
  },
  {
    c: 0,
    name: 'API Gateway',
    slug: 'api-gateway',
    priority: 'medium',
    desc: 'Unified API gateway for all services',
    starts: daysAgo(30),
    deadline: daysAgo(-60),
  },
  {
    c: 0,
    name: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    priority: 'medium',
    desc: 'Real-time analytics and reporting',
    starts: daysAgo(20),
    deadline: daysAgo(-40),
  },
  {
    c: 0,
    name: 'Auth Service',
    slug: 'auth-service',
    priority: 'high',
    desc: 'OAuth2 + session-based auth service',
    starts: daysAgo(90),
    deadline: daysAgo(-5),
  },
  // Digital Agency UA (4)
  {
    c: 1,
    name: 'Brand Identity',
    slug: 'brand-identity',
    priority: 'high',
    desc: 'Full brand redesign for TechCorp',
    starts: daysAgo(50),
    deadline: daysAgo(-10),
  },
  {
    c: 1,
    name: 'E-Commerce Redesign',
    slug: 'ecommerce-redesign',
    priority: 'high',
    desc: 'UX/UI overhaul of e-commerce platform',
    starts: daysAgo(35),
    deadline: daysAgo(-20),
  },
  {
    c: 1,
    name: 'Design System',
    slug: 'design-system',
    priority: 'medium',
    desc: 'Component library and design tokens',
    starts: daysAgo(25),
    deadline: daysAgo(-45),
  },
  {
    c: 1,
    name: 'Landing Pages',
    slug: 'landing-pages',
    priority: 'low',
    desc: 'Marketing landing pages for Q3',
    starts: daysAgo(10),
    deadline: daysAgo(-15),
  },
  // CloudScale Ltd (3)
  {
    c: 2,
    name: 'K8s Migration',
    slug: 'k8s-migration',
    priority: 'high',
    desc: 'Migrate all services to Kubernetes',
    starts: daysAgo(70),
    deadline: daysAgo(-7),
  },
  {
    c: 2,
    name: 'CI/CD Pipeline',
    slug: 'cicd-pipeline',
    priority: 'medium',
    desc: 'GitHub Actions + ArgoCD pipeline',
    starts: daysAgo(40),
    deadline: daysAgo(-20),
  },
  {
    c: 2,
    name: 'Monitoring Stack',
    slug: 'monitoring-stack',
    priority: 'medium',
    desc: 'Grafana + Prometheus + Loki stack',
    starts: daysAgo(15),
    deadline: daysAgo(-30),
  },
];

const COMMENTS = [
  'Looks good, moving forward!',
  'Need to review the requirements once more.',
  'Blocked by auth service — waiting on Dmytro.',
  'PR is up, please review when you can.',
  'Design approved by the client 🎉',
  'We should discuss the timeline at standup.',
  'Tests are failing on CI — investigating.',
  'Deployed to staging, please test.',
  'Found a critical bug, hotfix in progress.',
  'Ready for production deployment.',
  'Documentation updated in Confluence.',
  'Kick-off meeting scheduled for Monday.',
  'Budget approved for the next sprint.',
  'Performance improved by 40% after optimization.',
  'Security audit passed successfully.',
  'Waiting for design approval from the client.',
  'All unit tests passing, moving to integration tests.',
  'Database migration complete.',
  'API endpoints documented in Swagger.',
  'Load testing shows 99th percentile at 120ms.',
];

const HISTORY = [
  'Project was created',
  'Status changed to ACTIVE',
  'Priority updated to high',
  'Deadline was extended by 2 weeks',
  'New member added to project',
  'Description updated',
  'Project milestone reached',
  'Sprint planning completed',
  'Backlog groomed',
  'Release candidate created',
];

const LINKS = [
  { url: 'https://figma.com/design/example', title: 'Figma Design' },
  { url: 'https://notion.so/project-spec', title: 'Project Spec' },
  { url: 'https://github.com/org/repo', title: 'GitHub Repo' },
  { url: 'https://jira.atlassian.com/board', title: 'Jira Board' },
  { url: 'https://docs.google.com/spreadsheets/d/1', title: 'Timeline Sheet' },
  { url: 'https://miro.com/board/abc123', title: 'Miro Board' },
  { url: 'https://confluence.atlassian.com/page/1', title: 'Confluence Docs' },
];

const AUDIT_ACTIONS = [
  'project.updated',
  'project.status_updated',
  'project.member.added',
  'project.file.added',
  'project.link.added',
  'project.member.removed',
];

// ── SEEDS ────────────────────────────────────────────────────────────────────

async function seedUsers() {
  const client = pg('woorkroom_users');
  await client.connect();
  const users: { id: string }[] = [];

  for (const [i, u] of RAW_USERS.entries()) {
    const id = uuid();
    await client.query(
      `INSERT INTO "users" (id, email, password, "phoneNumber", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,NOW()) ON CONFLICT (email) DO NOTHING`,
      [id, u.email, await hashPwd(u.password), u.phone, daysAgo(90 - i * 5)],
    );
    users.push({ id });
    process.stdout.write('.');
  }
  await client.end();
  console.log(` ${users.length} users`);
  return users;
}

async function seedCompanys(users: { id: string }[]) {
  const client = pg('woorkroom_companys');
  await client.connect();

  const companies: { id: string; employeeIds: string[] }[] = [];

  for (const [ci, c] of COMPANIES_DATA.entries()) {
    const companyId = uuid();
    await client.query(
      `INSERT INTO "companys" (id,name,service,describes,direction,"peopleCountStart","peopleCountEnd","createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) ON CONFLICT DO NOTHING`,
      [
        companyId,
        c.name,
        c.service,
        c.describes,
        c.direction,
        c.start,
        c.end,
        daysAgo(180 - ci * 30),
      ],
    );

    const employeeIds: string[] = [];
    for (const [ei, userIdx] of c.members.entries()) {
      const empId = uuid();
      const role = ei === 0 ? 'OWNER' : ei === 1 ? 'ADMIN' : 'USER';
      const p = PROFILES[userIdx];
      await client.query(
        `INSERT INTO "employee" (id,"companyId","userId",role,status,name,"lastName",position,location,"createdAt","updatedAt")
         VALUES ($1,$2,$3,$4,'ACTIVE',$5,$6,$7,$8,$9,NOW()) ON CONFLICT ("userId","companyId") DO NOTHING`,
        [
          empId,
          companyId,
          users[userIdx].id,
          role,
          p.name,
          p.lastName,
          p.position,
          p.location,
          daysAgo(160 - ci * 15 - ei * 3),
        ],
      );
      employeeIds.push(empId);
      process.stdout.write('.');
    }
    companies.push({ id: companyId, employeeIds });
  }

  await client.end();
  const total = companies.reduce((s, c) => s + c.employeeIds.length, 0);
  console.log(` ${companies.length} companies, ${total} employees`);
  return companies;
}

async function seedProjects(
  companies: { id: string; employeeIds: string[] }[],
) {
  const client = pg('woorkroom_projects');
  await client.connect();

  const result: {
    id: string;
    name: string;
    companyId: string;
    employeeIds: string[];
  }[] = [];

  for (const p of PROJECTS_DATA) {
    const company = companies[p.c];
    const projectId = uuid();

    await client.query(
      `INSERT INTO "project" (id,"companyId",name,slug,status,priority,description,starts,deadline,"createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,'ACTIVE',$5,$6,$7,$8,$9,NOW()) ON CONFLICT ("companyId",slug) DO NOTHING`,
      [
        projectId,
        company.id,
        p.name,
        p.slug,
        p.priority,
        p.desc,
        p.starts,
        p.deadline,
        daysAgo(65),
      ],
    );

    const memberCount = Math.min(
      3 + Math.floor(Math.random() * 3),
      company.employeeIds.length,
    );
    const members = randN(company.employeeIds, memberCount);

    for (const [mi, empId] of members.entries()) {
      await client.query(
        `INSERT INTO "project_member" (id,"projectId","employeeId",role,"createdAt","updatedAt")
         VALUES ($1,$2,$3,$4,NOW(),NOW()) ON CONFLICT ("projectId","employeeId",role) DO NOTHING`,
        [uuid(), projectId, empId, mi === 0 ? 'ASSIGNEE' : 'REPORTER'],
      );
    }

    result.push({
      id: projectId,
      name: p.name,
      companyId: company.id,
      employeeIds: members,
    });
    process.stdout.write('.');
  }

  await client.end();
  console.log(` ${result.length} projects`);
  return result;
}

async function seedActivity(
  projects: {
    id: string;
    name: string;
    companyId: string;
    employeeIds: string[];
  }[],
) {
  const conn = await mongoConnect('woorkroom_activity');
  const Model = conn.model(
    'ActivityEvent',
    new mongoose.Schema(
      {
        _id: { type: String, default: uuid },
        resourceId: String,
        resourceType: String,
        type: String,
        actorEmployeeId: String,
        content: String,
        meta: { type: mongoose.Schema.Types.Mixed, default: {} },
        isEdited: { type: Boolean, default: false },
      },
      { timestamps: true, collection: 'activity_events' },
    ),
  );

  let count = 0;
  for (const p of projects) {
    if (!p.employeeIds.length) continue;
    const n = 5 + Math.floor(Math.random() * 8); // 5–12 events per project
    for (let i = 0; i < n; i++) {
      const type = i % 3 === 0 ? 'history' : 'comment';
      await Model.create({
        _id: uuid(),
        resourceId: p.id,
        resourceType: 'project',
        type,
        actorEmployeeId: rand(p.employeeIds),
        content: type === 'comment' ? rand(COMMENTS) : rand(HISTORY),
        meta: { companyId: p.companyId },
      });
      count++;
    }
    process.stdout.write('.');
  }
  await conn.close();
  console.log(` ${count} activity events`);
}

async function seedAudit(
  projects: {
    id: string;
    name: string;
    companyId: string;
    employeeIds: string[];
  }[],
) {
  const conn = await mongoConnect('woorkroom_audit');
  const Model = conn.model(
    'AuditEvent',
    new mongoose.Schema(
      {
        _id: { type: String, default: uuid },
        service: String,
        action: String,
        actorEmployeeId: String,
        resourceId: String,
        meta: { type: mongoose.Schema.Types.Mixed, default: {} },
      },
      { timestamps: true, collection: 'audit_events' },
    ),
  );

  let count = 0;
  for (const p of projects) {
    if (!p.employeeIds.length) continue;
    const n = 3 + Math.floor(Math.random() * 5); // 3–7 per project
    for (let i = 0; i < n; i++) {
      await Model.create({
        _id: uuid(),
        service: 'projects',
        action: rand(AUDIT_ACTIONS),
        actorEmployeeId: rand(p.employeeIds),
        resourceId: p.id,
        meta: { projectName: p.name, companyId: p.companyId },
      });
      count++;
    }
    process.stdout.write('.');
  }
  await conn.close();
  console.log(` ${count} audit events`);
}

async function seedProjectLinks(projects: { id: string }[]) {
  const conn = await mongoConnect('woorkroom_projects');
  const Model = conn.model(
    'ProjectLink',
    new mongoose.Schema(
      {
        _id: { type: String, default: uuid },
        projectId: String,
        url: String,
        title: String,
      },
      { timestamps: true, collection: 'project_links' },
    ),
  );

  let count = 0;
  for (const p of projects) {
    const n = 2 + Math.floor(Math.random() * 3); // 2–4 links per project
    for (const link of randN(LINKS, n)) {
      await Model.create({
        _id: uuid(),
        projectId: p.id,
        url: link.url,
        title: link.title,
      });
      count++;
    }
    process.stdout.write('.');
  }
  await conn.close();
  console.log(` ${count} project links`);
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  process.stdout.write('Users      ');
  const users = await seedUsers();

  process.stdout.write('Companies  ');
  const companies = await seedCompanys(users);

  process.stdout.write('Projects   ');
  const projects = await seedProjects(companies);

  process.stdout.write('Activity   ');
  await seedActivity(projects);

  process.stdout.write('Audit      ');
  await seedAudit(projects);

  process.stdout.write('Links      ');
  await seedProjectLinks(projects);

  console.log('\n✓ Seeding complete!\n');
  console.log('Test accounts:');
  RAW_USERS.slice(0, 6).forEach((u) =>
    console.log(`  ${u.email.padEnd(30)} ${u.password}`),
  );
}

main().catch(console.error);

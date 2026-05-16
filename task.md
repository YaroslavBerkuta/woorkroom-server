## Нові API для інтеграції

### 1. `companyMembers` query

Повертає всіх співробітників поточної компанії.

```graphql
query {
  companyMembers {
    id
    userId
    companyId
    role        # OWNER | ADMIN | EMPLOYEE
    position
    firstName
    lastName
    avatar
    createdAt
  }
}
```

> Потребує: активна сесія + `x-company-id` header.

---

### 2. `createProject` mutation

```graphql
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    slug
    name
    status      # ACTIVE | CLOSED
    priority    # low | medium | high | null
    starts
    deadline
    description
    image
    createdAt
  }
}
```

**Input:**
```graphql
input CreateProjectInput {
  name: String!
  starts: String        # ISO date "2026-06-01"
  deadline: String      # ISO date
  priority: ProjectPriority   # low | medium | high
  description: String
  image: String         # media URL
  reporterId: String    # employeeId (якщо не передати — creator стає reporter)
  assigneeIds: [String] # employeeIds
}
```

> Потребує: активна сесія + `x-company-id` header.

---

### 3. `myProjects` query

Проекти де поточний юзер є учасником (reporter або assignee).

```graphql
query {
  myProjects {
    id
    slug
    name
    status
    priority
    starts
    deadline
    description
    image
    createdAt
  }
}
```

> Потребує: активна сесія + `x-company-id` header.

---

### 4. `projectMembers` query

```graphql
query ProjectMembers($projectId: String!) {
  projectMembers(projectId: $projectId) {
    id
    projectId
    employeeId
    role    # REPORTER | ASSIGNEE
    createdAt
  }
}
```

> Потребує: активна сесія + `x-company-id` header.

---

## Нові enum-и

```graphql
enum ProjectStatus {
  ACTIVE
  CLOSED
}

enum ProjectMemberRole {
  REPORTER
  ASSIGNEE
}

enum ProjectPriority {
  low
  medium
  high
}
```

## Примітки

- `slug` генерується автоматично на сервері з `name`. Унікальний в межах компанії. Використовувати як URL-ключ (`/projects/my-project-slug`).
- `status` за замовчуванням `ACTIVE` при створенні.
- `projectMembers` повертає лише `employeeId` — якщо потрібні деталі юзера, треба зробити окремий запит `companyMembers` і join на клієнті.

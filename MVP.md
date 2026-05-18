# Woorkroom — MVP Roadmap

## Порядок реалізації

### 1. Security fix — selectMyCompany (~1 год)
- [ ] `apps/authorization` — перевіряти що `companyId` належить юзеру перед встановленням сесії
- Зараз: будь-хто може передати чужий `companyId` і отримати доступ до компанії

### 2. Missing Gateway mutations (~3 год)
- [ ] `updateCompany(input: UpdateCompanyInput!)` — input вже є в `apps/gateway/src/companys/inputs/update-company.input.ts`
- [ ] `deleteCompany(companyId: String!)`
- [ ] `createEmployee(input: CreateEmployeeInput!)`
- [ ] `deleteEmployee(employeeId: String!)`
- [ ] `updateUser(input: UpdateUserInput!)`

### 3. Tasks service — новий мікросервіс (~2 дні)
Новий `apps/tasks`, порт `5006` (gRPC), DB `woorkroom-tasks`

**Entities:**
- `task` — id, projectId, companyId, title, description, status (`TODO` | `IN_PROGRESS` | `REVIEW` | `DONE`), priority (`LOW` | `MEDIUM` | `HIGH`), assigneeId (employeeId), reporterId, dueDate, createdAt, updatedAt
- `task_comment` — id, taskId, authorId (employeeId), text, createdAt, updatedAt

**gRPC методи (proto/tasks.proto):**
- `CreateTask`
- `UpdateTask`
- `UpdateTaskStatus`
- `DeleteTask`
- `GetTask`
- `GetProjectTasks`
- `AddTaskComment`
- `GetTaskComments`
- `DeleteTaskComment`

**Також:**
- Додати `GrpcTasksService` в `libs/grpc`
- Додати сервіс в `docker-compose.yml`

### 4. Tasks Gateway resolver (~1 день)
- [ ] `apps/gateway/src/tasks/` — TaskModel, TaskCommentModel, inputs, resolver
- [ ] Queries: `getTask`, `projectTasks`
- [ ] Mutations: `createTask`, `updateTask`, `updateTaskStatus`, `deleteTask`, `addTaskComment`, `deleteTaskComment`
- [ ] `@ResolveField assignee` на TaskModel → gRPC до companys (DataLoader)

### 5. Telegram нотифікації (~4 год)
Інфраструктура вже є (бот + Redis chatId). Тригери:
- [ ] При `createTask` → assignee отримує повідомлення в Telegram
- [ ] При `updateTaskStatus` → assignee + reporter отримують повідомлення
- [ ] При `addTaskComment` → assignee + reporter отримують повідомлення

Реалізація: після gRPC виклику в resolver — fire-and-forget через RabbitMQ до `mails` сервісу (або напряму через `TelegramService` в gateway якщо простіше).

### 6. N+1 fix (~2 год)
- [ ] Переконатись що DataLoader (`apps/gateway/src/projects/dataloader/project-dataloader.service.ts`) використовується для `@ResolveField files` і `links` на ProjectModel
- [ ] Аналогічно зробити DataLoader для `@ResolveField assignee` на TaskModel

---

## Що НЕ потрібно для MVP
- Білінг / підписки (запустити безкоштовно)
- WebSocket / GraphQL subscriptions (polling достатньо)
- Розширені ролі всередині задач
- Audit logs (вже є, не чіпати)

---

## Стек нового сервісу tasks (копіювати з projects)
```
apps/tasks/
  src/
    entitys/
      task.entity.ts
      task-comment.entity.ts
    services/
      tasks.service.ts
      task-comments.service.ts
    controllers/
      tasks.controller.ts
    tasks.module.ts
    main.ts
  tsconfig.app.json
```

# Woorkroom Server — Claude Instructions

## API Tasks from Client Agent

GitHub Issues is the communication channel between the client agent and the server agent.

### How to pick up tasks

When the user asks to check for new API tasks, or before starting a new feature:

```
gh issue list --label api-request --state open
```

Each issue contains:
- **What** endpoint/mutation/query is needed
- **Expected input/output** types
- **Context** why it's needed

### Workflow

1. Pick an open issue with label `api-request`
2. Comment on it: "Starting implementation"
3. Implement the change
4. Close the issue with: `gh issue close <number> --comment "Done in commit <sha>"`

### Creating the label (first time only)

```
gh label create api-request --color 0075ca --description "API task from client agent"
```

## Architecture

- NestJS monorepo: `apps/` (gateway, authorization, users, companys, mails) + `libs/` (grpc, redis, rabbitmq, telegram, shared)
- Transport: gRPC between services, RabbitMQ for mails (fire-and-forget)
- Auth: session-based via Redis + HttpOnly cookie `sid`
- GraphQL gateway (Apollo) on port 3000
- Proto files in `/proto`

## Key rules

- After file changes: `npx nest build <app>` then `docker restart woorkroom-<app>`
- Check logs: `docker logs woorkroom-<app> --tail 30`
- proto3 string fields default to `""` — always guard nullable uuid/date fields before DB queries

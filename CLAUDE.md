# Woorkroom Server — Claude Instructions

## GitHub Issues — Agent Communication

Two labels are used for cross-agent tasks:

| Label | Direction | Description |
|-------|-----------|-------------|
| `api-request` | frontend → server | Frontend agent needs a new API endpoint/mutation |
| `frontend` | server → frontend | Server agent has implemented something the frontend needs to integrate |

### Picking up tasks (api-request — for this agent)

```
gh issue list --label api-request --state open
```

1. Comment on it: "Starting implementation"
2. Implement the change
3. Close: `gh issue close <number> --comment "Done in commit <sha>"`

### Creating tasks for frontend agent

```
gh issue create --label frontend --title "..." --body-file task.md
```

### Creating labels (first time only)

```
gh label create api-request --color 0075ca --description "API task from client agent"
gh label create frontend --color e99695 --description "Task for frontend/UI agent"
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

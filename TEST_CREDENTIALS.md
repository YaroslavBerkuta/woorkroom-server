# Test Credentials

> Pepper: `helloWorld` | bcryptjs saltRounds: 10
> Login via GraphQL mutation `login(email, password)` on http://localhost:3000/graphql

## Users

| Name | Email | Password | Role in company | Companies |
|------|-------|----------|-----------------|-----------|
| Yaroslav Berkuta  | yaroslav@woorkroom.dev | Yaroslav#2026 | OWNER | Woorkroom Tech |
| Alex Morozov      | alex@woorkroom.dev     | Alex#2026     | ADMIN | Woorkroom Tech |
| Maria Kovalenko   | maria@woorkroom.dev    | Maria#2026    | USER  | Woorkroom Tech |
| Olga Sydorenko    | olga@woorkroom.dev     | Olga#2026     | USER  | Woorkroom Tech, PixelStudio |
| Ivan Petrenko     | ivan@woorkroom.dev     | Ivan#2026     | OWNER | PixelStudio |

## Companies

| Name | Direction | Size |
|------|-----------|------|
| Woorkroom Tech | IT / SaaS         | 10–50 people |
| PixelStudio    | Design / Branding | 5–20 people  |

## Projects

### Woorkroom Tech

| Project | Priority | Status | Reporter | Assignees |
|---------|----------|--------|----------|-----------|
| Mobile App            | HIGH   | ACTIVE | Yaroslav | Alex, Maria |
| Backend Refactoring   | MEDIUM | ACTIVE | Alex     | Yaroslav, Olga |
| Marketing Website     | LOW    | CLOSED | Maria    | Olga |
| Analytics Dashboard   | HIGH   | ACTIVE | Yaroslav | Alex, Olga |

### PixelStudio

| Project | Priority | Status | Reporter | Assignees |
|---------|----------|--------|----------|-----------|
| Brand Identity Redesign | HIGH   | ACTIVE | Ivan | Olga |
| UI Design System        | MEDIUM | ACTIVE | Ivan | Olga |
| Product Catalog         | LOW    | CLOSED | Ivan | — |

## IDs (for direct DB queries)

### User IDs
- yaroslav@woorkroom.dev: `573154c3-6720-483a-8f89-4b83a7619322`
- alex@woorkroom.dev: `a2368c68-5e0a-46b8-acc1-10bb1bf0856d`
- maria@woorkroom.dev: `b4379fa6-28fe-47a7-ac21-e336780babd9`
- ivan@woorkroom.dev: `93ed93d9-efca-4428-81a3-475ff9a5280c`
- olga@woorkroom.dev: `cc221589-e1bb-4225-a12e-46f7cdc2a076`

### Company IDs
- Woorkroom Tech: `098864f6-f332-4962-99fc-3de101c66a24`
- PixelStudio: `0fa1d034-48c4-405e-bd07-901995a503a2`

### Employee IDs
- Yaroslav @ Woorkroom Tech: `7d5b2f9a-07dd-417a-93a5-bce852b86130`
- Alex @ Woorkroom Tech: `b1c066cd-b6fe-4098-bfa0-25f195804dd3`
- Maria @ Woorkroom Tech: `2a1cf4c8-e281-4993-b736-499c53f80536`
- Olga @ Woorkroom Tech: `5e59ab56-527f-4ffa-b5ce-6928eaa91806`
- Ivan @ PixelStudio: `34e83b19-703b-4b54-a98c-a5b3e7c72847`
- Olga @ PixelStudio: `4a56f932-22ea-4cee-bda5-2410829b1f4c`

### Project IDs
- Mobile App: `b1de4ec7-bc8a-476e-b975-5bed9a0e0b67`
- Backend Refactoring: `f4547428-ee6b-412d-92db-f1f0bb44cde6`
- Marketing Website: `94a4bd46-7dc2-4196-9cf2-704db54b7891`
- Analytics Dashboard: `e5957f9b-8751-4756-bc30-8931446a96f4`
- Brand Identity Redesign: `8e602da3-e0a6-464a-8731-8a681da6a5f2`
- UI Design System: `6a8d1ed6-2331-411e-ad27-3ffc2dfbd87c`
- Product Catalog: `db30463b-0f4a-42a1-9724-aa37f817a9b3`

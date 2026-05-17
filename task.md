## Company Logo Upload — UI

### Що потрібно реалізувати

Додати можливість завантажити логотип компанії в налаштуваннях компанії.

---

### API

#### 1. Завантаження файлу (REST)

```
POST http://<host>:3001/media/upload
Content-Type: multipart/form-data

fields:
  file    — зображення (jpg, png, webp тощо)
  folder  — "logos"
```

Відповідь:
```json
{
  "fileId": "logos/uuid.webp",
  "url": "http://...",
  "webpUrl": "http://...",
  "thumbnailUrl": "http://...",
  "mimetype": "image/png",
  "size": 51200
}
```

Дозволені типи: тільки `image/*`. Ліміт: 50 MB.

#### 2. Збереження логотипу (GraphQL)

```graphql
mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input) {
    id
    logo
  }
}
```

`UpdateCompanyInput` — всі поля nullable:
```
name, service, describes, logo, direction, peopleCountStart, peopleCountEnd
```

Передавати тільки `logo`:
```json
{ "input": { "logo": "<url з media upload>" } }
```

Для відображення логотипу використовувати `webpUrl ?? url`.

---

### UX-сценарій

1. У налаштуваннях компанії є область для логотипу (placeholder або поточне зображення).
2. Клік → відкривається file picker (тільки `image/*`).
3. Після вибору файлу — одразу `POST /media/upload` з `folder=logos`.
4. Після успішного upload — `mutation updateCompany({ logo: url })`.
5. Логотип відображається.
6. Показувати loading/spinner під час завантаження.
7. При помилці — toast з повідомленням.

---

### Де відображати логотип

- У хедері / сайдбарі поряд з назвою компанії
- На сторінці налаштувань компанії (edit-форма)

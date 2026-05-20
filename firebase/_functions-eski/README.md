# Firebase Functions API

## Gelistirme

```bash
npm install
npm run build
```

## Ortam Degiskenleri

`.env`:

- `FIREBASE_API_KEY`: Firebase Web API key (Email/Password login endpoint icin)

## Endpointler

- `POST /login`
- `POST /tickets`
- `GET /tickets`
- `POST /tickets/:ticketId/assign`
- `POST /tickets/:ticketId/status`

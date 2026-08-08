# Odontoclinic — Sistema de Citas con IA

Sistema web de gestión de citas para la clínica odontológica **Odontoclinic**.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Prisma 7** + SQLite (MVP sin dependencias externas; migrable a PostgreSQL/Supabase)
- **OdontoBot** — asistente IA con reglas + integración preparada para OpenAI

## Inicio rápido

```bash
cd odontoclinic
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Usuarios demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@odontoclinic.com | admin123 |
| Recepción | recepcion@odontoclinic.com | recepcion123 |
| Odontólogo | dr.zurita@odontoclinic.com | doctor123 |

## Pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública |
| `/reservar` | Flujo de reserva online (4 pasos) |
| `/mis-citas` | Portal paciente (buscar por teléfono) |
| `/recepcion` | Panel recepción (reemplaza Excel) |
| `/recepcion/nueva` | Crear cita desde recepción |
| `/admin` | Reportes y automatización |
| `/login` | Acceso staff |

## API principal

- `GET/POST /api/appointments` — listar/crear citas
- `PATCH /api/appointments/[id]` — confirmar, cancelar, reprogramar
- `GET /api/availability` — horarios disponibles
- `POST /api/chat` — OdontoBot
- `POST /api/import` — importar Excel
- `GET /api/export` — exportar Excel
- `POST /api/notifications/process` — recordatorios automáticos

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [Manual recepcionista](docs/MANUAL-RECEPCIONISTA.md)
- [Plantillas WhatsApp](docs/PLANTILLAS-WHATSAPP.md)
- [Prompt OdontoBot](docs/ODONTOBOT-PROMPT.md)
- [Checklist puesta en marcha](docs/CHECKLIST-PUSTA-EN-MARCHA.md)

## WhatsApp

Las notificaciones se registran en modo **MOCK** (tabla `MessageLog`). Para producción, conectar Twilio o WhatsApp Business API en `src/lib/messages.ts`.

## Importación Excel

Columnas: `Fecha | Hora | Paciente | Teléfono | Servicio | Odontólogo | Notas | Estado`

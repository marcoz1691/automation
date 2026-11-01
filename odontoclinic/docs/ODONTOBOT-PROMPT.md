# System Prompt — OdontoBot

Ver implementación completa en `src/lib/ai/odontobot.ts` (`ODONTOBOT_SYSTEM_PROMPT`).

## Resumen

OdontoBot es el asistente virtual de Odontoclinic con estas reglas:

- **NO** diagnosticar ni recetar
- **NO** dar precios exactos sin tabla configurada
- Escalar a humano en emergencias, dolor agudo, quejas
- Verificar identidad (nombre + teléfono) para cancelar/reprogramar

## Tools / Functions disponibles

| Función | Descripción |
|---------|-------------|
| `getAvailability` | Consulta slots libres por fecha y servicio |
| `bookAppointment` | Crea cita verificando disponibilidad |
| `getPatientAppointments` | Lista citas por teléfono |
| `getClinicInfo` | Horarios, dirección, contacto |
| `getServices` | Lista servicios y duraciones |
| `escalateToHuman` | Marca conversación para recepción |

## Integración OpenAI (opcional)

Para activar GPT con function calling, agregar `OPENAI_API_KEY` y extender `processOdontoBotMessage` para usar el system prompt con tools que llamen a las funciones del API.

# Checklist — Puesta en marcha Odontoclinic

## Configuración inicial

- [ ] Completar datos en `ClinicSettings` (dirección, teléfono, WhatsApp, email)
- [ ] Verificar horarios Lun–Vie 8–18, Sáb 8–13
- [ ] Configurar servicios y duraciones
- [ ] Registrar odontólogos activos
- [ ] Crear usuarios staff (recepción, admin, odontólogos)

## Migración desde Excel

- [ ] Exportar Excel actual con columnas correctas
- [ ] Importar vía panel Recepción
- [ ] Verificar citas del día vs Excel
- [ ] Resolver conflictos de horario manualmente

## Capacitación recepción

- [ ] Demo panel "Hoy" en tablet
- [ ] Practicar confirmar / cancelar / no-show
- [ ] Probar búsqueda por teléfono
- [ ] Probar nueva cita y exportación

## Automatización

- [ ] Configurar cron para `/api/notifications/process` (cada hora)
- [ ] Conectar WhatsApp Business API o Twilio
- [ ] Probar flujo: reserva → confirmación → recordatorio 24h

## IA

- [ ] Probar OdontoBot en landing (FAQ, horarios, servicios)
- [ ] Verificar escalamiento en urgencias
- [ ] Revisar conversaciones en admin

## Go-live

- [ ] Anunciar reserva online a pacientes
- [ ] Mantener teléfono como respaldo 2 semanas
- [ ] Exportar Excel semanal como respaldo
- [ ] Revisar reportes admin semanalmente

## Producción

- [ ] Migrar SQLite → PostgreSQL (Supabase)
- [ ] Configurar dominio y HTTPS
- [ ] Variables de entorno: `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`
- [ ] Backup automático de base de datos

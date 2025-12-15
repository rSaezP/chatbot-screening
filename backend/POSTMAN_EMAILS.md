# 📧 Sistema de Emails Automáticos - Documentación

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

```env
# Configuración de Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_o_app_password
EMAIL_FROM_NAME=Sistema de Screening

# URL del Frontend (para links en emails)
FRONTEND_URL=http://localhost:3000
```

### 2. Configuración de Gmail (Recomendado)

Si usas Gmail, necesitas crear una **App Password**:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en dos pasos (actívala si no está activa)
3. Vuelve a Seguridad → Contraseñas de aplicaciones
4. Genera una nueva contraseña para "Mail"
5. Copia la contraseña de 16 caracteres
6. Úsala en `EMAIL_PASS`

**Ejemplo de configuración Gmail:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=miempresa@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM_NAME=Mi Empresa RH
```

### 3. Otros Proveedores de Email

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=tu_api_key_de_sendgrid
```

---

## 📬 Emails Automáticos

El sistema envía emails automáticamente en los siguientes casos:

### 1. 📩 Invitación (Al crear sesión)
**Cuándo se envía:** Automáticamente cuando se crea una sesión con email del candidato

**Request:**
```bash
POST /api/sesiones
Content-Type: application/json

{
  "config_id": 1,
  "candidato": {
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "telefono": "+569 1234 5678"
  }
}
```

**Email enviado:**
- ✉️ **Destinatario:** juan.perez@example.com
- 📝 **Asunto:** ¡Has sido invitado a una entrevista!
- 🎨 **Plantilla:** invitacion.html
- 🔗 **Incluye:** Link único para acceder al chatbot

**Variables de la plantilla:**
- `{{nombre_candidato}}` - Nombre del candidato
- `{{nombre_chatbot}}` - Nombre de la evaluación
- `{{nombre_empresa}}` - Nombre de la empresa
- `{{chatbot_url}}` - URL única para acceder
- `{{fecha_expiracion}}` - Fecha límite
- `{{duracion_dias}}` - Días disponibles

---

### 2. ✅ Aprobado (Al finalizar evaluación)
**Cuándo se envía:** Automáticamente cuando se finaliza una sesión y el resultado es "aprobado"

**Request:**
```bash
POST /api/sesiones/:token/finalizar
Content-Type: application/json

{
  "umbral_aprobacion": 70
}
```

**Email enviado si aprobó:**
- ✉️ **Destinatario:** Email del candidato
- 📝 **Asunto:** ¡Felicitaciones! Has aprobado la evaluación
- 🎨 **Plantilla:** aprobado.html
- 🎉 **Contenido:** Mensaje de felicitaciones con puntaje

**Variables de la plantilla:**
- `{{nombre_candidato}}`
- `{{nombre_chatbot}}`
- `{{nombre_empresa}}`
- `{{puntaje}}` - Porcentaje obtenido
- `{{umbral}}` - Umbral requerido
- `{{fecha_completado}}`
- `{{mensaje_personalizado}}` - Del chatbot

---

### 3. ❌ Rechazado (Al finalizar evaluación)
**Cuándo se envía:** Automáticamente cuando se finaliza una sesión y el resultado es "rechazado"

**Email enviado si no aprobó:**
- ✉️ **Destinatario:** Email del candidato
- 📝 **Asunto:** Resultado de tu evaluación
- 🎨 **Plantilla:** rechazado.html
- 📊 **Contenido:** Retroalimentación constructiva

**Variables de la plantilla:**
- `{{nombre_candidato}}`
- `{{nombre_chatbot}}`
- `{{nombre_empresa}}`
- `{{puntaje}}` - Porcentaje obtenido
- `{{umbral}}` - Umbral requerido
- `{{fecha_completado}}`
- `{{mensaje_personalizado}}` - Del chatbot

---

### 4. 🔔 Notificación al Reclutador (Al finalizar evaluación)
**Cuándo se envía:** Automáticamente cuando se finaliza una sesión (siempre)

**Email enviado:**
- ✉️ **Destinatario:** email_reclutador (del chatbot cb_config)
- 📝 **Asunto:** Nuevo candidato evaluado
- 🎨 **Plantilla:** notificacion-reclutador.html
- 📊 **Contenido:** Resumen completo de la evaluación

**Variables de la plantilla:**
- `{{nombre_candidato}}`
- `{{email_candidato}}`
- `{{telefono_candidato}}`
- `{{nombre_chatbot}}`
- `{{resultado}}` - APROBADO ✅ / RECHAZADO ❌
- `{{puntaje}}` - Porcentaje
- `{{umbral}}` - Umbral
- `{{fecha_completado}}`
- `{{admin_url}}` - Link al panel admin

---

### 5. ⏰ Recordatorio (Manual - futuro)
**Cuándo se envía:** Manualmente o mediante cron job (futuro)

**Request (futuro):**
```bash
POST /api/emails/recordatorio
Content-Type: application/json

{
  "sesion_id": 1,
  "horas_restantes": 24
}
```

**Email enviado:**
- ✉️ **Destinatario:** Email del candidato
- 📝 **Asunto:** Recordatorio: Completa tu entrevista
- 🎨 **Plantilla:** recordatorio.html
- ⏱️ **Contenido:** Recordatorio de tiempo restante

---

## 🧪 Pruebas y Testing

### Flujo Completo de Prueba

#### 1. Configurar Email
```bash
# Edita .env con tu configuración real de Gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

#### 2. Crear Sesión (Enviará invitación)
```bash
POST http://localhost:4000/api/sesiones
Content-Type: application/json

{
  "config_id": 1,
  "candidato": {
    "nombre": "Test User",
    "email": "tu_email_prueba@gmail.com",
    "telefono": "+569 1234 5678"
  }
}
```

**✅ Verificar:**
- Se creó la sesión correctamente
- Se envió email de invitación a tu_email_prueba@gmail.com
- El link del email funciona

#### 3. Responder Preguntas
```bash
# Iniciar sesión
POST http://localhost:4000/api/sesiones/TOKEN/iniciar

# Responder preguntas
POST http://localhost:4000/api/sesiones/TOKEN/mensajes/responder
{
  "pregunta_id": 1,
  "respuesta": "Mi respuesta"
}
```

#### 4. Finalizar Evaluación (Enviará resultado)
```bash
POST http://localhost:4000/api/sesiones/TOKEN/finalizar
Content-Type: application/json

{
  "umbral_aprobacion": 70
}
```

**✅ Verificar:**
- Se finalizó la sesión
- Se calculó el puntaje correctamente
- Se envió email de aprobado/rechazado al candidato
- Se envió notificación al reclutador (si está configurado)

---

## 📝 Gestión de Plantillas

### Opción 1: Usar Plantillas HTML (Archivos)

Las plantillas están en: `src/shared/templates/emails/`

- `invitacion.html`
- `aprobado.html`
- `rechazado.html`
- `notificacion-reclutador.html`
- `recordatorio.html`

**Editar plantilla:**
1. Abre el archivo HTML
2. Modifica el diseño o texto
3. Usa variables con `{{nombre_variable}}`
4. Guarda y reinicia el servidor

### Opción 2: Usar Base de Datos (cb_email_templates)

Las plantillas también se pueden gestionar desde la base de datos.

**Insertar plantilla en BD:**
```sql
INSERT INTO cb_email_templates (codigo, nombre, asunto, cuerpo, variables, activo) VALUES
('invitacion',
 'Invitación a Entrevista',
 '¡Has sido invitado a {{nombre_chatbot}}!',
 '<h1>Hola {{nombre_candidato}}</h1><p>Te invitamos a...</p>',
 JSON_ARRAY('nombre_candidato', 'nombre_chatbot', 'chatbot_url'),
 1);
```

**Prioridad:**
1. Si existe en BD → Usa plantilla de BD
2. Si no existe en BD → Usa archivo HTML

---

## 🔍 Verificar Configuración

### Endpoint de Verificación (Futuro)

```bash
GET http://localhost:4000/api/emails/config
```

**Response:**
```json
{
  "success": true,
  "configurado": true,
  "host": "smtp.gmail.com",
  "port": "587",
  "user": "miempresa@gmail.com",
  "fromName": "Sistema de Screening"
}
```

---

## 🚨 Troubleshooting

### Problema 1: No se envían emails

**Síntomas:**
- Logs muestran: "⚠️  Configuración de email no encontrada"
- No se envían emails

**Solución:**
1. Verifica que `.env` tenga `EMAIL_USER` y `EMAIL_PASS`
2. Reinicia el servidor después de editar `.env`
3. Verifica que las credenciales sean correctas

```bash
# Verifica variables de entorno
node -e "require('dotenv').config(); console.log(process.env.EMAIL_USER)"
```

---

### Problema 2: Error de autenticación con Gmail

**Error:**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solución:**
1. No uses tu contraseña de Gmail normal
2. Crea una **App Password** (ver sección Configuración)
3. Usa la App Password de 16 caracteres en `EMAIL_PASS`

---

### Problema 3: Emails van a spam

**Solución:**
1. Agrega un SPF record en tu dominio
2. Configura DKIM
3. Usa un servicio profesional como SendGrid
4. Pide a los usuarios marcar como "No spam"

---

### Problema 4: Plantilla no se renderiza bien

**Solución:**
1. Verifica que las variables tengan el formato `{{variable}}`
2. Verifica que las variables existan en el código
3. Revisa los logs para ver qué variables se están pasando

```javascript
console.log('Variables para plantilla:', variables);
```

---

## 📊 Logs y Debugging

El sistema genera logs informativos:

```
✅ Email de invitación enviado a juan@example.com
✅ Email de aprobación enviado a maria@example.com
✅ Notificación enviada al reclutador: rh@empresa.com
⚠️  Error al enviar email de invitación: Invalid credentials
⚠️  Configuración de email no encontrada. Email no enviado (modo desarrollo)
```

---

## 🎨 Personalización de Emails

### Cambiar colores y estilos

Edita los archivos HTML y modifica los estilos CSS inline:

```html
<!-- Cambiar color del header -->
<div class="header" style="background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);">
```

### Agregar logo de la empresa

```html
<div class="header">
    <img src="https://tu-dominio.com/logo.png" alt="Logo" style="max-width: 200px;">
    <h1>¡Has sido invitado!</h1>
</div>
```

### Personalizar mensajes por chatbot

Los chatbots tienen campos personalizables:
- `mensaje_aprobado` - Se incluye en email de aprobación
- `mensaje_rechazado` - Se incluye en email de rechazo

```sql
UPDATE cb_config SET
  mensaje_aprobado = '¡Bienvenido al equipo! Los siguientes pasos son...',
  mensaje_rechazado = 'Gracias por tu interés. Te invitamos a postular nuevamente en 6 meses.'
WHERE id = 1;
```

---

## ✅ Checklist de Implementación

- [ ] Configurar variables de entorno (`EMAIL_*`)
- [ ] Crear App Password en Gmail (si usas Gmail)
- [ ] Probar envío de invitación al crear sesión
- [ ] Probar envío de aprobado al finalizar sesión
- [ ] Probar envío de rechazado al finalizar sesión
- [ ] Verificar que emails no vayan a spam
- [ ] Personalizar plantillas HTML con logo y colores
- [ ] Configurar `email_reclutador` en chatbots
- [ ] Probar notificación al reclutador
- [ ] Agregar plantillas personalizadas en BD (opcional)

---

## 🚀 Próximas Mejoras (Futuro)

1. **Recordatorios automáticos con Cron Jobs**
   - Enviar recordatorio 24h antes de expiración
   - Enviar recordatorio 6h antes de expiración

2. **Plantillas visuales en panel admin**
   - Editor WYSIWYG para plantillas
   - Preview en tiempo real

3. **Métricas de emails**
   - Tasa de apertura
   - Tasa de clicks
   - Emails rebotados

4. **Personalización avanzada**
   - Variables condicionales
   - Plantillas por idioma
   - A/B testing de plantillas

---

**Última actualización**: 2025-11-09
**Versión del Sistema**: 1.0.0

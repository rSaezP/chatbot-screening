# 🔄 Flujo Completo: Invitaciones con Datos

## 📊 Flujo de Datos

### 1. Frontend (Formulario)
```
Usuario pega desde Excel:
Juan Pérez	juan@example.com	+56912345678
María González	maria@example.com	+56987654321
```

↓

**InvitacionDialogComponent.vue** detecta formato y crea:
```javascript
[
  { nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '+56912345678' },
  { nombre: 'María González', email: 'maria@example.com', telefono: '+56987654321' }
]
```

↓

### 2. API Request
```javascript
POST /api/config/{id}/invitar
Body: { candidatos: [...] }
```

↓

### 3. Backend (Controlador)
**invitacionController.js** procesa cada candidato:
- Genera token único
- Crea sesión en BD con: `candidato_nombre`, `candidato_email`, `candidato_telefono`
- Genera link: `http://frontend.com/chat/{token}`

↓

### 4. Email Service
**emailService.js** personaliza email:
- Si hay nombre: "Hola Juan Pérez,"
- Si no hay nombre: "Hola,"

↓

### 5. Candidato Recibe Email
```
Hola Juan Pérez,

Has sido invitado a completar la evaluación...

[Botón: Comenzar Evaluación]
```

↓

### 6. Candidato Entra al Chatbot
**perfilService.js** verifica datos:
- ✅ Nombre existe → NO pregunta
- ✅ Email existe → NO pregunta
- ✅ Teléfono existe → NO pregunta
- ❌ Dato falta → SÍ pregunta

↓

### 7. Candidato Completa Evaluación

↓

### 8. PDF al Reclutador
**pdfService.js** genera PDF con:
```
Nombre: Juan Pérez
Email: juan@example.com
Teléfono: +56912345678
```

---

## ✅ Ventajas del Flujo

1. **Email personalizado** desde el inicio
2. **Menos preguntas** al candidato (mejor UX)
3. **PDF completo** para el reclutador
4. **Datos consistentes** en todo el sistema

---

## 🧪 Probar

```bash
cd backend
node test-invitacion-con-datos.js
```

Este script prueba 4 escenarios:
1. Candidato con todos los datos
2. Candidato sin teléfono
3. Candidato solo con email
4. Verificación de emails personalizados

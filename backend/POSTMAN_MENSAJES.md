# 📮 DOCUMENTACIÓN DE MENSAJES - POSTMAN

## Base URL
```
http://localhost:4000
```

---

## 💬 MÓDULO DE MENSAJES/CONVERSACIÓN

### 1. Crear Mensaje (Genérico)
```
POST http://localhost:4000/api/mensajes
Content-Type: application/json

{
  "sesion_id": 1,
  "tipo": "sistema",
  "contenido": "¡Bienvenido a la evaluación!"
}
```

**Tipos de mensaje:**
- `sistema` - Mensajes del sistema
- `pregunta` - Preguntas del chatbot
- `respuesta` - Respuestas del candidato

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Mensaje registrado exitosamente",
  "data": {
    "id": 1,
    "sesion_id": 1,
    "tipo": "sistema",
    "contenido": "¡Bienvenido a la evaluación!",
    "created_at": "2025-11-08T15:00:00.000Z"
  }
}
```

---

### 2. Crear Mensaje de Pregunta
```
POST http://localhost:4000/api/mensajes
Content-Type: application/json

{
  "sesion_id": 1,
  "pregunta_id": 1,
  "tipo": "pregunta",
  "contenido": "¿Cuántos años de experiencia tienes con Node.js?"
}
```

---

### 3. Crear Mensaje de Respuesta
```
POST http://localhost:4000/api/mensajes
Content-Type: application/json

{
  "sesion_id": 1,
  "pregunta_id": 1,
  "tipo": "respuesta",
  "contenido": "3 años"
}
```

---

### 4. Obtener Conversación Completa de una Sesión
```
GET http://localhost:4000/api/sesiones/{token}/mensajes
```

**Ejemplo:**
```
GET http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/mensajes
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "sesion_id": 1,
    "total_mensajes": 5,
    "conteo_por_tipo": {
      "sistema": 1,
      "pregunta": 2,
      "respuesta": 2
    },
    "mensajes": [
      {
        "id": 1,
        "tipo": "sistema",
        "contenido": "¡Bienvenido a la evaluación!",
        "created_at": "2025-11-08T15:00:00.000Z"
      },
      {
        "id": 2,
        "tipo": "pregunta",
        "contenido": "¿Cuántos años de experiencia tienes con Node.js?",
        "pregunta_id": 1,
        "tipo_campo": "numero",
        "created_at": "2025-11-08T15:01:00.000Z"
      },
      {
        "id": 3,
        "tipo": "respuesta",
        "contenido": "3 años",
        "pregunta_id": 1,
        "created_at": "2025-11-08T15:02:00.000Z"
      }
    ]
  }
}
```

---

### 5. Obtener Solo Preguntas
```
GET http://localhost:4000/api/sesiones/{token}/mensajes?tipo=pregunta
```

---

### 6. Obtener Solo Respuestas
```
GET http://localhost:4000/api/sesiones/{token}/mensajes?tipo=respuesta
```

---

### 7. Obtener Progreso de la Conversación
```
GET http://localhost:4000/api/sesiones/{token}/mensajes/progreso
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "total_preguntas": 5,
    "respondidas": 2,
    "pendientes": 3,
    "porcentaje_progreso": 40.00,
    "completado": false
  }
}
```

---

### 8. Obtener Siguiente Pregunta Pendiente
```
GET http://localhost:4000/api/sesiones/{token}/mensajes/siguiente-pregunta
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "config_id": 1,
    "pregunta": "¿Tienes experiencia con bases de datos SQL?",
    "descripcion": null,
    "tipo_campo": "si_no",
    "opciones": null,
    "requerida": true,
    "orden": 2
  }
}
```

**Si no hay más preguntas:**
```json
{
  "success": true,
  "message": "No hay más preguntas pendientes",
  "data": null
}
```

---

### 9. Responder una Pregunta (Shortcut)
```
POST http://localhost:4000/api/sesiones/{token}/mensajes/responder
Content-Type: application/json

{
  "pregunta_id": 1,
  "respuesta": "3"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Respuesta registrada exitosamente",
  "data": {
    "mensaje": {
      "id": 5,
      "sesion_id": 1,
      "pregunta_id": 1,
      "tipo": "respuesta",
      "contenido": "3",
      "created_at": "2025-11-08T15:10:00.000Z"
    },
    "progreso": {
      "total_preguntas": 5,
      "respondidas": 3,
      "pendientes": 2,
      "porcentaje_progreso": 60.00,
      "completado": false
    }
  }
}
```

**Error si la respuesta no es válida:**
```json
{
  "success": false,
  "message": "Respuesta no válida",
  "errores": [
    "La respuesta es requerida"
  ]
}
```

---

### 10. Obtener un Mensaje Específico
```
GET http://localhost:4000/api/mensajes/1
```

---

### 11. Actualizar un Mensaje
```
PUT http://localhost:4000/api/mensajes/1
Content-Type: application/json

{
  "contenido": "Contenido actualizado"
}
```

---

### 12. Eliminar un Mensaje
```
DELETE http://localhost:4000/api/mensajes/1
```

---

## 🧪 FLUJO COMPLETO DE CONVERSACIÓN

### **ESCENARIO: Candidato responde evaluación completa**

#### **Paso 1: Crear Sesión**
```
POST http://localhost:4000/api/sesiones
Body:
{
  "config_id": 1,
  "candidato": {
    "nombre": "María García",
    "email": "maria@example.com"
  }
}
```
✅ Guarda el `token`

---

#### **Paso 2: Iniciar Sesión**
```
POST http://localhost:4000/api/sesiones/{token}/iniciar
```

---

#### **Paso 3: Registrar Mensaje de Bienvenida**
```
POST http://localhost:4000/api/mensajes
Body:
{
  "sesion_id": 1,
  "tipo": "sistema",
  "contenido": "¡Hola María! Bienvenida a la evaluación. Te haré algunas preguntas."
}
```

---

#### **Paso 4: Obtener Primera Pregunta**
```
GET http://localhost:4000/api/sesiones/{token}/mensajes/siguiente-pregunta
```
✅ Retorna la primera pregunta pendiente

---

#### **Paso 5: Registrar Pregunta en la Conversación**
```
POST http://localhost:4000/api/mensajes
Body:
{
  "sesion_id": 1,
  "pregunta_id": 1,
  "tipo": "pregunta",
  "contenido": "¿Cuántos años de experiencia tienes con Node.js?"
}
```

---

#### **Paso 6: Candidato Responde**
```
POST http://localhost:4000/api/sesiones/{token}/mensajes/responder
Body:
{
  "pregunta_id": 1,
  "respuesta": "3"
}
```
✅ Registra la respuesta y muestra progreso actualizado

---

#### **Paso 7: Repetir Pasos 4-6 para Todas las Preguntas**

---

#### **Paso 8: Verificar Progreso**
```
GET http://localhost:4000/api/sesiones/{token}/mensajes/progreso
```
✅ Verifica que `"completado": true`

---

#### **Paso 9: Ver Conversación Completa**
```
GET http://localhost:4000/api/sesiones/{token}/mensajes
```
✅ Ver todo el historial de mensajes

---

#### **Paso 10: Completar Sesión**
```
POST http://localhost:4000/api/sesiones/{token}/completar
Body:
{
  "puntaje_total": 85,
  "puntaje_maximo": 100
}
```

---

## 📊 TIPOS DE MENSAJE

| Tipo | Descripción | Requiere pregunta_id |
|------|-------------|---------------------|
| `sistema` | Mensajes informativos del sistema | No |
| `pregunta` | Preguntas del chatbot al candidato | Sí |
| `respuesta` | Respuestas del candidato | Sí |

---

## 🎯 TIPOS DE CAMPO (de preguntas)

- `texto` - Texto corto
- `texto_largo` - Texto largo (párrafos)
- `numero` - Números
- `email` - Email
- `telefono` - Teléfono
- `url` - URL
- `fecha` - Fecha
- `si_no` - Sí/No
- `opcion_multiple` - Selección múltiple
- `opcion_unica` - Selección única

---

## ✅ VALIDACIONES AUTOMÁTICAS

Al usar `POST /api/sesiones/:token/mensajes/responder`, se valida automáticamente:

1. ✅ **Campo requerido:** Si la pregunta es requerida
2. ✅ **Longitud mínima:** `min_longitud` de la pregunta
3. ✅ **Longitud máxima:** `max_longitud` de la pregunta
4. ✅ **Patrón (regex):** `patron_validacion` de la pregunta
5. ✅ **Sesión activa:** La sesión debe estar en estado `en_progreso`
6. ✅ **No duplicar:** No se puede responder la misma pregunta dos veces

---

## 🔄 ESTADOS DE VALIDACIÓN

### **Respuesta Válida:**
```json
{
  "success": true,
  "message": "Respuesta registrada exitosamente",
  "data": {
    "mensaje": {...},
    "progreso": {...}
  }
}
```

### **Respuesta Inválida:**
```json
{
  "success": false,
  "message": "Respuesta no válida",
  "errores": [
    "La respuesta es requerida",
    "La respuesta debe tener al menos 10 caracteres"
  ]
}
```

### **Sesión No Activa:**
```json
{
  "success": false,
  "error": {
    "message": "La sesión no está activa para recibir respuestas"
  }
}
```

### **Pregunta Ya Respondida:**
```json
{
  "success": false,
  "error": {
    "message": "Ya existe una respuesta para esta pregunta"
  }
}
```

---

## ✅ CHECKLIST DE PRUEBAS - PASO 3

- [ ] Crear mensaje de sistema
- [ ] Crear mensaje de pregunta
- [ ] Crear mensaje de respuesta
- [ ] Obtener conversación completa
- [ ] Filtrar por tipo de mensaje
- [ ] Obtener progreso
- [ ] Obtener siguiente pregunta pendiente
- [ ] Responder pregunta (shortcut)
- [ ] Validar respuesta requerida
- [ ] Validar longitud mínima
- [ ] Validar longitud máxima
- [ ] Intentar responder pregunta ya respondida (error)
- [ ] Intentar responder en sesión no activa (error)
- [ ] Actualizar mensaje
- [ ] Eliminar mensaje
- [ ] Flujo completo de conversación

---

## 💡 CONSEJOS

### **Para el Frontend:**

1. **Usar el endpoint de responder:**
   ```
   POST /api/sesiones/:token/mensajes/responder
   ```
   Es más simple que crear manualmente los mensajes.

2. **Obtener siguiente pregunta:**
   ```
   GET /api/sesiones/:token/mensajes/siguiente-pregunta
   ```
   Para saber qué preguntar al candidato.

3. **Mostrar progreso:**
   ```
   GET /api/sesiones/:token/mensajes/progreso
   ```
   Para mostrar barra de progreso (ej: "2 de 5 preguntas").

4. **Ver conversación:**
   ```
   GET /api/sesiones/:token/mensajes
   ```
   Para mostrar el historial completo.

---

**🎉 ¡Listo para probar el módulo de conversación!**

# 📮 DOCUMENTACIÓN DE SESIONES - POSTMAN

## Base URL
```
http://localhost:4000
```

---

## 🎫 MÓDULO DE SESIONES

### 1. Crear una Sesión
```
POST http://localhost:4000/api/sesiones
Content-Type: application/json

{
  "config_id": 1,
  "candidato": {
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "telefono": "+56912345678"
  }
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Sesión creada exitosamente",
  "data": {
    "id": 1,
    "config_id": 1,
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "estado": "pendiente",
    "resultado": "sin_evaluar",
    "puntaje_total": "0.00",
    "porcentaje": "0.00",
    "candidato_nombre": "Juan Pérez",
    "candidato_email": "juan.perez@example.com",
    "candidato_telefono": "+56912345678",
    "fecha_expiracion": "2025-11-15T13:00:00.000Z",
    "url_sesion": "/chatbot/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
  }
}
```

---

### 2. Obtener Sesión por Token
```
GET http://localhost:4000/api/sesiones/{token}
```

**Ejemplo:**
```
GET http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "config_id": 1,
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "estado": "pendiente",
    "candidato_nombre": "Juan Pérez",
    "chatbot_nombre": "Chatbot Desarrollador Backend",
    "nombre_asistente": "Ana",
    ...
  }
}
```

---

### 3. Validar Sesión
```
GET http://localhost:4000/api/sesiones/{token}/validar
```

**Ejemplo:**
```
GET http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6/validar
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Sesión válida",
  "data": {
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "estado": "pendiente",
    "fecha_expiracion": "2025-11-15T13:00:00.000Z",
    "valida": true
  }
}
```

**Respuesta si está expirada:**
```json
{
  "success": false,
  "message": "La sesión ha expirado",
  "data": {
    "valida": false
  }
}
```

---

### 4. Iniciar Sesión
```
POST http://localhost:4000/api/sesiones/{token}/iniciar
```

**Ejemplo:**
```
POST http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6/iniciar
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Sesión iniciada correctamente",
  "data": {
    "id": 1,
    "estado": "en_progreso",
    "fecha_inicio": "2025-11-08T14:00:00.000Z",
    ...
  }
}
```

---

### 5. Completar Sesión
```
POST http://localhost:4000/api/sesiones/{token}/completar
Content-Type: application/json

{
  "puntaje_total": 85,
  "puntaje_maximo": 100
}
```

**Ejemplo:**
```
POST http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6/completar
Content-Type: application/json

{
  "puntaje_total": 85,
  "puntaje_maximo": 100
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Sesión completada correctamente",
  "data": {
    "id": 1,
    "estado": "completado",
    "resultado": "aprobado",
    "puntaje_total": "85.00",
    "porcentaje": "85.00",
    "fecha_completado": "2025-11-08T15:30:00.000Z",
    ...
  }
}
```

---

### 6. Obtener Resumen de Sesión
```
GET http://localhost:4000/api/sesiones/{token}/resumen
```

**Ejemplo:**
```
GET http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6/resumen
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "estado": "completado",
    "resultado": "aprobado",
    "porcentaje": 85.00,
    "puntaje_total": 85.00,
    "umbral_aprobacion": 75.00,
    "chatbot": {
      "nombre": "Chatbot Desarrollador Backend",
      "nombre_asistente": "Ana",
      "mensaje_aprobado": "¡Felicitaciones! Has superado la evaluación."
    },
    "candidato": {
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com"
    }
  }
}
```

---

### 7. Cancelar Sesión
```
POST http://localhost:4000/api/sesiones/{token}/cancelar
```

**Ejemplo:**
```
POST http://localhost:4000/api/sesiones/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6/cancelar
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Sesión cancelada correctamente",
  "data": {
    "estado": "cancelado",
    ...
  }
}
```

---

### 8. Actualizar Sesión
```
PUT http://localhost:4000/api/sesiones/{token}
Content-Type: application/json

{
  "candidato_nombre": "Juan Carlos Pérez",
  "candidato_telefono": "+56987654321"
}
```

---

### 9. Eliminar Sesión
```
DELETE http://localhost:4000/api/sesiones/{token}
```

---

### 10. Obtener Sesiones de un Chatbot
```
GET http://localhost:4000/api/config/1/sesiones
```

**Con filtros:**
```
GET http://localhost:4000/api/config/1/sesiones?estado=completado&resultado=aprobado
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "token": "...",
      "estado": "completado",
      "resultado": "aprobado",
      ...
    }
  ],
  "total": 1
}
```

---

### 11. Obtener Estadísticas de Sesiones
```
GET http://localhost:4000/api/config/1/sesiones/estadisticas
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "general": {
      "total": 10,
      "aprobados": 7,
      "rechazados": 2,
      "completadas": 9,
      "promedio_porcentaje": "78.50",
      "max_porcentaje": "95.00",
      "min_porcentaje": "45.00"
    },
    "por_estado": {
      "pendiente": 1,
      "en_progreso": 0,
      "completado": 9,
      "expirado": 0,
      "cancelado": 0
    }
  }
}
```

---

### 12. Procesar Sesiones Expiradas (Endpoint Administrativo)
```
POST http://localhost:4000/api/sesiones/procesar-expiradas
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "3 sesiones marcadas como expiradas",
  "data": {
    "cantidad": 3
  }
}
```

---

## 🧪 FLUJO DE PRUEBA COMPLETO

### **ESCENARIO: Evaluación de un Candidato**

#### **Paso 1: Crear Sesión**
```
POST http://localhost:4000/api/sesiones
Body:
{
  "config_id": 1,
  "candidato": {
    "nombre": "María García",
    "email": "maria.garcia@example.com"
  }
}
```
✅ Guarda el `token` generado

---

#### **Paso 2: Validar que la Sesión es Accesible**
```
GET http://localhost:4000/api/sesiones/{token}/validar
```
✅ Verifica que retorna `"valida": true`

---

#### **Paso 3: Iniciar la Sesión**
```
POST http://localhost:4000/api/sesiones/{token}/iniciar
```
✅ El estado cambia a `"en_progreso"`

---

#### **Paso 4: [Aquí el candidato responde las preguntas]**
(Esto se implementará en el Paso 3: Módulo de Chatbot)

---

#### **Paso 5: Completar la Sesión**
```
POST http://localhost:4000/api/sesiones/{token}/completar
Body:
{
  "puntaje_total": 82,
  "puntaje_maximo": 100
}
```
✅ El sistema calcula el porcentaje (82%) y determina el resultado según el umbral

---

#### **Paso 6: Obtener Resumen Final**
```
GET http://localhost:4000/api/sesiones/{token}/resumen
```
✅ Muestra el resultado final, mensaje personalizado y estadísticas

---

## 📊 ESTADOS DE SESIÓN

| Estado | Descripción |
|--------|-------------|
| `pendiente` | Sesión creada, aún no iniciada |
| `en_progreso` | Candidato está respondiendo |
| `completado` | Sesión finalizada |
| `expirado` | Pasó la fecha de expiración |
| `cancelado` | Sesión cancelada manualmente |

## 🎯 RESULTADOS DE EVALUACIÓN

| Resultado | Descripción |
|-----------|-------------|
| `sin_evaluar` | Aún no se ha evaluado |
| `aprobado` | Porcentaje >= umbral |
| `rechazado` | Porcentaje < umbral |
| `pendiente_revision` | Requiere revisión manual |

---

## ✅ CHECKLIST DE PRUEBAS - PASO 2

- [ ] Crear sesión con datos del candidato
- [ ] Obtener sesión por token
- [ ] Validar sesión (debe ser válida)
- [ ] Iniciar sesión
- [ ] Completar sesión con puntaje
- [ ] Obtener resumen de sesión
- [ ] Cancelar sesión
- [ ] Actualizar datos de sesión
- [ ] Obtener todas las sesiones de un chatbot
- [ ] Obtener sesiones con filtros (estado, resultado)
- [ ] Obtener estadísticas de un chatbot
- [ ] Procesar sesiones expiradas
- [ ] Probar validación con sesión inexistente (404)
- [ ] Probar validación con sesión expirada (400)
- [ ] Eliminar sesión

---

**🎉 ¡Listo para probar el módulo de sesiones!**

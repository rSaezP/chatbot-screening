# 📮 DOCUMENTACIÓN DE ENDPOINTS PARA POSTMAN

## Base URL
```
http://localhost:4000
```

---

## 🏠 ENDPOINTS GENERALES

### 1. Home
```
GET http://localhost:4000/
```

### 2. Health Check
```
GET http://localhost:4000/health
```

---

## ⚙️ MÓDULO DE CONFIGURACIÓN DE CHATBOTS

### 1. Crear un Chatbot
```
POST http://localhost:4000/api/config
Content-Type: application/json

{
  "nombre": "Chatbot Desarrollador Backend",
  "descripcion": "Evaluación para desarrolladores backend con Node.js",
  "categoria": "Tecnología",
  "duracion_dias": 7,
  "umbral_aprobacion": 75.00,
  "nombre_asistente": "Ana",
  "avatar_url": "https://example.com/avatar.png",
  "idioma": "es",
  "color_botones": "#28a745",
  "color_conversacion": "#f0f8ff",
  "color_fondo": "#ffffff",
  "mensaje_bienvenida": "¡Hola! Soy Ana, tu asistente virtual. Te haré algunas preguntas para conocerte mejor.",
  "mensaje_aprobado": "¡Felicitaciones! Has superado la evaluación. Nos pondremos en contacto contigo pronto.",
  "mensaje_rechazado": "Gracias por tu tiempo. En esta ocasión no cumples con los requisitos, pero te animamos a seguir preparándote.",
  "activo": true
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Chatbot creado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Chatbot Desarrollador Backend",
    "descripcion": "Evaluación para desarrolladores backend con Node.js",
    ...
  }
}
```

---

### 2. Obtener Todos los Chatbots
```
GET http://localhost:4000/api/config
```

**Con filtro (solo activos):**
```
GET http://localhost:4000/api/config?activos=true
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Chatbot Desarrollador Backend",
      ...
    }
  ],
  "total": 1
}
```

---

### 3. Obtener un Chatbot por ID
```
GET http://localhost:4000/api/config/1
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Chatbot Desarrollador Backend",
    ...
  }
}
```

---

### 4. Actualizar un Chatbot
```
PUT http://localhost:4000/api/config/1
Content-Type: application/json

{
  "nombre": "Chatbot Desarrollador Backend Senior",
  "umbral_aprobacion": 80.00,
  "color_botones": "#007bff"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Chatbot actualizado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Chatbot Desarrollador Backend Senior",
    ...
  }
}
```

---

### 5. Desactivar un Chatbot (Soft Delete)
```
DELETE http://localhost:4000/api/config/1
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Chatbot desactivado exitosamente"
}
```

---

### 6. Eliminar Permanentemente un Chatbot
```
DELETE http://localhost:4000/api/config/1?permanente=true
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Chatbot eliminado permanentemente"
}
```

---

## 📝 MÓDULO DE PREGUNTAS

### 1. Crear una Pregunta
```
POST http://localhost:4000/api/config/1/preguntas
Content-Type: application/json

{
  "pregunta": "¿Cuántos años de experiencia tienes con Node.js?",
  "descripcion": "Queremos conocer tu nivel de experiencia",
  "tipo_campo": "numero",
  "requerida": true,
  "min_longitud": 1,
  "max_longitud": 2,
  "metodo_evaluacion": "regla_fija",
  "regla": {
    "tipo": "numero",
    "operador": ">=",
    "valor": 2
  },
  "es_eliminatoria": true,
  "peso": 10.00,
  "orden": 0,
  "activa": true
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Pregunta creada exitosamente",
  "data": {
    "id": 1,
    "config_id": 1,
    "pregunta": "¿Cuántos años de experiencia tienes con Node.js?",
    ...
  }
}
```

---

### 2. Crear Pregunta con Opciones Múltiples
```
POST http://localhost:4000/api/config/1/preguntas
Content-Type: application/json

{
  "pregunta": "¿Qué bases de datos has usado? (Puedes seleccionar varias)",
  "tipo_campo": "opcion_multiple",
  "opciones": [
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Oracle"
  ],
  "requerida": true,
  "metodo_evaluacion": "regla_fija",
  "regla": {
    "tipo": "contiene",
    "valores_requeridos": ["MySQL", "PostgreSQL"]
  },
  "peso": 5.00,
  "orden": 1
}
```

---

### 3. Crear Pregunta con Evaluación por IA
```
POST http://localhost:4000/api/config/1/preguntas
Content-Type: application/json

{
  "pregunta": "Describe un proyecto complejo que hayas desarrollado con Node.js",
  "descripcion": "Cuéntanos sobre los desafíos, tecnologías usadas y resultados",
  "tipo_campo": "texto_largo",
  "requerida": true,
  "min_longitud": 100,
  "max_longitud": 1000,
  "metodo_evaluacion": "ia_opcional",
  "usar_ia": true,
  "prompt_ia": "Evalúa si el candidato demuestra experiencia real con Node.js, arquitectura de aplicaciones, manejo de desafíos técnicos y resultados medibles",
  "criterios_ia": {
    "experiencia_tecnica": "Debe mencionar tecnologías específicas",
    "solucion_problemas": "Debe describir desafíos superados",
    "impacto": "Debe mencionar resultados o impacto del proyecto"
  },
  "peso": 15.00,
  "orden": 2
}
```

---

### 4. Crear Pregunta Si/No
```
POST http://localhost:4000/api/config/1/preguntas
Content-Type: application/json

{
  "pregunta": "¿Estás disponible para empezar de inmediato?",
  "tipo_campo": "si_no",
  "requerida": true,
  "metodo_evaluacion": "regla_fija",
  "regla": {
    "tipo": "igual_a",
    "valor": "si"
  },
  "es_eliminatoria": false,
  "peso": 2.00,
  "orden": 3
}
```

---

### 5. Obtener Todas las Preguntas de un Chatbot
```
GET http://localhost:4000/api/config/1/preguntas
```

**Con filtro (solo activas):**
```
GET http://localhost:4000/api/config/1/preguntas?activas=true
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "config_id": 1,
      "pregunta": "¿Cuántos años de experiencia tienes con Node.js?",
      ...
    }
  ],
  "total": 4
}
```

---

### 6. Obtener una Pregunta Específica
```
GET http://localhost:4000/api/config/1/preguntas/1
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "config_id": 1,
    "pregunta": "¿Cuántos años de experiencia tienes con Node.js?",
    ...
  }
}
```

---

### 7. Actualizar una Pregunta
```
PUT http://localhost:4000/api/config/1/preguntas/1
Content-Type: application/json

{
  "pregunta": "¿Cuántos años de experiencia profesional tienes con Node.js?",
  "peso": 12.00
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Pregunta actualizada exitosamente",
  "data": {
    "id": 1,
    "pregunta": "¿Cuántos años de experiencia profesional tienes con Node.js?",
    ...
  }
}
```

---

### 8. Reordenar Preguntas
```
PUT http://localhost:4000/api/config/1/preguntas/reordenar
Content-Type: application/json

{
  "orden": [3, 1, 2, 4]
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Preguntas reordenadas exitosamente"
}
```

---

### 9. Eliminar una Pregunta
```
DELETE http://localhost:4000/api/config/1/preguntas/1
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Pregunta eliminada exitosamente"
}
```

---

## 🧪 FLUJO DE PRUEBA COMPLETO

### Paso 1: Crear un Chatbot
```
POST /api/config
Body: { nombre, descripcion, categoria, etc. }
```

### Paso 2: Agregar Preguntas al Chatbot
```
POST /api/config/1/preguntas
Body: { pregunta, tipo_campo, regla, etc. }
```
Repetir para varias preguntas.

### Paso 3: Obtener el Chatbot con todas sus Preguntas
```
GET /api/config/1
GET /api/config/1/preguntas
```

### Paso 4: Actualizar Configuración
```
PUT /api/config/1
Body: { umbral_aprobacion: 80 }
```

### Paso 5: Reordenar Preguntas
```
PUT /api/config/1/preguntas/reordenar
Body: { orden: [3, 1, 2, 4] }
```

### Paso 6: Verificar Cambios
```
GET /api/config/1/preguntas
```

---

## ❌ PRUEBAS DE MANEJO DE ERRORES

### 1. Crear Chatbot sin Nombre (Error 400)
```
POST http://localhost:4000/api/config
Content-Type: application/json

{
  "descripcion": "Sin nombre"
}
```

**Respuesta esperada:**
```json
{
  "success": false,
  "message": "El campo \"nombre\" es requerido"
}
```

---

### 2. Obtener Chatbot que no Existe (Error 404)
```
GET http://localhost:4000/api/config/999
```

**Respuesta esperada:**
```json
{
  "success": false,
  "message": "Chatbot no encontrado"
}
```

---

### 3. Acceder a Ruta Inexistente (Error 404)
```
GET http://localhost:4000/api/ruta-que-no-existe
```

**Respuesta esperada:**
```json
{
  "success": false,
  "error": {
    "type": "Error del Servidor",
    "message": "Ruta no encontrada: /api/ruta-que-no-existe",
    "statusCode": 404
  }
}
```

---

## 📊 TIPOS DE CAMPO DISPONIBLES

- `texto` - Texto corto
- `texto_largo` - Texto largo (párrafos)
- `numero` - Números enteros o decimales
- `email` - Dirección de email
- `telefono` - Número de teléfono
- `url` - URL válida
- `fecha` - Fecha
- `si_no` - Respuesta booleana (sí/no)
- `opcion_multiple` - Selección múltiple
- `opcion_unica` - Selección única

---

## 🔧 MÉTODOS DE EVALUACIÓN

- `regla_fija` - Evaluación automática con reglas predefinidas
- `ia_opcional` - Puede usar IA opcionalmente para evaluar
- `manual` - Requiere evaluación manual

---

## 🎯 EJEMPLOS DE REGLAS

### Regla de Número (mayor o igual)
```json
{
  "tipo": "numero",
  "operador": ">=",
  "valor": 2
}
```

### Regla de Igualdad
```json
{
  "tipo": "igual_a",
  "valor": "si"
}
```

### Regla de Contiene (para múltiples opciones)
```json
{
  "tipo": "contiene",
  "valores_requeridos": ["MySQL", "PostgreSQL"]
}
```

### Regla de Longitud Mínima
```json
{
  "tipo": "longitud_minima",
  "valor": 100
}
```

---

## ✅ CHECKLIST DE PRUEBAS

- [ ] Crear chatbot
- [ ] Obtener todos los chatbots
- [ ] Obtener chatbot por ID
- [ ] Actualizar chatbot
- [ ] Desactivar chatbot
- [ ] Eliminar chatbot permanentemente
- [ ] Crear pregunta tipo número
- [ ] Crear pregunta tipo texto
- [ ] Crear pregunta tipo si/no
- [ ] Crear pregunta tipo opción múltiple
- [ ] Crear pregunta con evaluación IA
- [ ] Obtener todas las preguntas
- [ ] Obtener pregunta por ID
- [ ] Actualizar pregunta
- [ ] Reordenar preguntas
- [ ] Eliminar pregunta
- [ ] Probar error 404 (chatbot no existe)
- [ ] Probar error 400 (campo requerido faltante)
- [ ] Probar error 404 (ruta no existe)

---

**🎉 ¡Listo para probar!**

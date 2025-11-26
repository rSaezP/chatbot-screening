# 📋 Pruebas Postman - Módulo de Evaluaciones

## 🔧 Configuración Inicial
- **URL Base**: `http://localhost:4000`
- **Headers**: `Content-Type: application/json`

---

## 🎯 ENDPOINTS DE EVALUACIONES

### 1. Obtener Evaluaciones de una Sesión
**GET** `/api/sesiones/:sesionId/evaluaciones`

Obtener todas las evaluaciones realizadas en una sesión.

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sesion_id": 1,
      "pregunta_id": 5,
      "mensaje_id": 12,
      "cumple": 1,
      "puntaje": 85.00,
      "razon": "Respuesta correcta: El valor 5 está dentro del rango permitido (1-10)",
      "metodo_evaluacion": "regla_fija",
      "detalles": "{\"tipo_regla\":\"rango\",\"regla_aplicada\":{\"tipo\":\"rango\",\"min\":1,\"max\":10}}",
      "evaluador": "sistema",
      "pregunta": "¿Cuántos años de experiencia tienes en JavaScript?",
      "peso": 1.5,
      "es_eliminatoria": 0,
      "created_at": "2025-11-09T10:30:00.000Z"
    }
  ],
  "total": 5
}
```

---

### 2. Obtener Evaluación de una Pregunta Específica
**GET** `/api/sesiones/:sesionId/evaluaciones/pregunta/:preguntaId`

Obtener la evaluación de una pregunta específica dentro de una sesión.

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones/pregunta/5
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sesion_id": 1,
    "pregunta_id": 5,
    "cumple": 1,
    "puntaje": 85.00,
    "razon": "Respuesta dentro del rango esperado",
    "metodo_evaluacion": "regla_fija",
    "pregunta": "¿Cuántos años de experiencia tienes?",
    "peso": 1.5,
    "es_eliminatoria": 0
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "Evaluación no encontrada"
}
```

---

### 3. Calcular Puntaje de una Sesión
**GET** `/api/sesiones/:sesionId/evaluaciones/puntaje`

Calcular el puntaje total, máximo y porcentaje de una sesión.

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones/puntaje
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "puntaje_total": 382.50,
    "puntaje_maximo": 450.00,
    "porcentaje": 85.00,
    "total_preguntas": 5,
    "preguntas_aprobadas": 4,
    "preguntas_reprobadas": 1,
    "preguntas_pendientes": 0
  }
}
```

---

### 4. Determinar Resultado Final
**GET** `/api/sesiones/:sesionId/evaluaciones/resultado`

Determinar si el candidato aprobó o reprobó según el umbral.

**Query Params:**
- `umbral` (opcional): Umbral de aprobación personalizado (default: 70)

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones/resultado
GET http://localhost:4000/api/sesiones/1/evaluaciones/resultado?umbral=80
```

**Response 200 - Aprobado:**
```json
{
  "success": true,
  "data": {
    "puntaje_total": 382.50,
    "puntaje_maximo": 450.00,
    "porcentaje": 85.00,
    "resultado": "aprobado",
    "razon": "Aprobado con 85% (umbral: 70%)",
    "estadisticas": {
      "total_preguntas": 5,
      "preguntas_aprobadas": 4,
      "preguntas_reprobadas": 1,
      "porcentaje_preguntas_aprobadas": 80
    },
    "eliminatorias_reprobadas": 0
  }
}
```

**Response 200 - Rechazado por Eliminatoria:**
```json
{
  "success": true,
  "data": {
    "puntaje_total": 0,
    "puntaje_maximo": 0,
    "porcentaje": 0,
    "resultado": "rechazado",
    "razon": "Reprobó una o más preguntas eliminatorias",
    "eliminatorias_reprobadas": 1
  }
}
```

**Response 200 - Pendiente:**
```json
{
  "success": true,
  "data": {
    "resultado": "pendiente",
    "razon": "Hay 2 pregunta(s) pendiente(s) de evaluación manual",
    "puntaje_total": 0,
    "puntaje_maximo": 0,
    "porcentaje": 0,
    "evaluaciones_pendientes": 2
  }
}
```

---

### 5. Obtener Estadísticas Completas
**GET** `/api/sesiones/:sesionId/evaluaciones/estadisticas`

Obtener estadísticas detalladas de evaluación por sesión.

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones/estadisticas
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_evaluaciones": 5,
    "preguntas_aprobadas": 4,
    "preguntas_reprobadas": 1,
    "preguntas_pendientes": 0,
    "puntaje_total": 382.50,
    "puntaje_promedio": 76.50,
    "evaluadas_regla": 4,
    "evaluadas_ia": 0,
    "evaluadas_manual": 1,
    "puntaje": {
      "puntaje_total": 382.50,
      "puntaje_maximo": 450.00,
      "porcentaje": 85.00,
      "total_preguntas": 5,
      "preguntas_aprobadas": 4,
      "preguntas_reprobadas": 1,
      "preguntas_pendientes": 0
    },
    "distribucion_por_metodo": {
      "regla_fija": {
        "count": 4,
        "puntaje_promedio": 82.50
      },
      "ia": {
        "count": 0,
        "puntaje_promedio": 0
      },
      "manual": {
        "count": 1,
        "puntaje_promedio": 50.00
      }
    },
    "eliminatorias_reprobadas": false
  }
}
```

---

### 6. Validar si se Puede Finalizar Sesión
**GET** `/api/sesiones/:sesionId/evaluaciones/validar-finalizacion`

Verificar si todas las preguntas han sido evaluadas y la sesión puede ser finalizada.

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones/validar-finalizacion
```

**Response 200 - Puede Finalizar:**
```json
{
  "success": true,
  "data": {
    "puede_finalizar": true,
    "razon": "Todas las preguntas han sido evaluadas",
    "estadisticas": {
      "total_evaluaciones": 5,
      "preguntas_aprobadas": 4,
      "preguntas_reprobadas": 1,
      "preguntas_pendientes": 0
    }
  }
}
```

**Response 200 - No Puede Finalizar:**
```json
{
  "success": true,
  "data": {
    "puede_finalizar": false,
    "razon": "Faltan 2 pregunta(s) por evaluar",
    "estadisticas": {
      "total_evaluaciones": 3,
      "preguntas_aprobadas": 2,
      "preguntas_reprobadas": 1,
      "preguntas_pendientes": 2
    }
  }
}
```

---

### 7. Obtener Evaluación por Mensaje
**GET** `/api/sesiones/:sesionId/evaluaciones/mensaje/:mensajeId`

Obtener la evaluación asociada a un mensaje específico.

**Request:**
```
GET http://localhost:4000/api/sesiones/1/evaluaciones/mensaje/15
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sesion_id": 1,
    "pregunta_id": 5,
    "mensaje_id": 15,
    "cumple": 1,
    "puntaje": 85.00,
    "razon": "Respuesta correcta",
    "metodo_evaluacion": "regla_fija",
    "pregunta": "¿Cuántos años de experiencia tienes?",
    "peso": 1.5
  }
}
```

---

### 8. Actualizar Evaluación Manual
**PUT** `/api/evaluaciones/:evaluacionId/manual`

Actualizar una evaluación que requiere revisión manual.

**Request:**
```
PUT http://localhost:4000/api/evaluaciones/3/manual
Content-Type: application/json

{
  "cumple": true,
  "puntaje": 85,
  "razon": "El candidato demostró conocimientos sólidos de arquitectura de software",
  "evaluador": "Juan Pérez"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Evaluación manual actualizada correctamente",
  "data": {
    "id": 3,
    "cumple": 1,
    "puntaje": 85,
    "razon": "El candidato demostró conocimientos sólidos de arquitectura de software",
    "detalles": "{\"evaluador\":\"Juan Pérez\",\"fecha_evaluacion\":\"2025-11-09T12:00:00.000Z\",\"estado\":\"evaluado\"}"
  }
}
```

**Response 400 - Validación:**
```json
{
  "success": false,
  "message": "El campo \"cumple\" es requerido (true/false)"
}
```

```json
{
  "success": false,
  "message": "El puntaje debe estar entre 0 y 100"
}
```

---

### 9. Obtener Evaluaciones Pendientes
**GET** `/api/evaluaciones/pendientes`

Obtener todas las evaluaciones pendientes de revisión manual del sistema.

**Query Params:**
- `configId` (opcional): Filtrar por chatbot específico

**Request:**
```
GET http://localhost:4000/api/evaluaciones/pendientes
GET http://localhost:4000/api/evaluaciones/pendientes?configId=1
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "sesion_id": 1,
      "pregunta_id": 8,
      "cumple": null,
      "puntaje": 0,
      "razon": "Pendiente de evaluación manual",
      "metodo_evaluacion": "manual",
      "pregunta": "Describe tu experiencia con arquitectura de microservicios",
      "peso": 2.0,
      "es_eliminatoria": 0,
      "sesion_token": "abc123def456",
      "candidato_nombre": "María García",
      "candidato_email": "maria@example.com",
      "chatbot_nombre": "Entrevista Backend Developer",
      "created_at": "2025-11-09T10:30:00.000Z"
    }
  ],
  "total": 3
}
```

---

## 🔄 ENDPOINT DE FINALIZACIÓN (Sesiones)

### 10. Finalizar Evaluación Automáticamente
**POST** `/api/sesiones/:token/finalizar`

Finaliza la evaluación calculando automáticamente el puntaje y determinando el resultado.

**Request:**
```
POST http://localhost:4000/api/sesiones/abc123def456/finalizar
Content-Type: application/json

{
  "umbral_aprobacion": 75
}
```

**Body (opcional):**
- `umbral_aprobacion`: Umbral personalizado (si no se envía, usa el del chatbot)

**Response 200 - Aprobado:**
```json
{
  "success": true,
  "message": "Evaluación finalizada correctamente",
  "data": {
    "id": 1,
    "token": "abc123def456",
    "estado": "completado",
    "resultado": "aprobado",
    "puntaje_total": 382.50,
    "porcentaje": 85.00,
    "fecha_completado": "2025-11-09T12:00:00.000Z",
    "detalle_evaluacion": {
      "puntaje_total": 382.50,
      "puntaje_maximo": 450.00,
      "porcentaje": 85.00,
      "resultado": "aprobado",
      "razon": "Aprobado con 85% (umbral: 75%)",
      "estadisticas": {
        "total_preguntas": 5,
        "preguntas_aprobadas": 4,
        "preguntas_reprobadas": 1,
        "porcentaje_preguntas_aprobadas": 80
      }
    }
  }
}
```

**Response 400 - No Puede Finalizar:**
```json
{
  "success": false,
  "message": "Error al finalizar evaluación: Faltan 2 pregunta(s) por evaluar"
}
```

---

## 📝 FLUJO COMPLETO DE EVALUACIÓN

### Paso 1: Crear Sesión y Responder Preguntas
```bash
# 1. Crear sesión
POST /api/sesiones
{ "config_id": 1, "candidato": { "nombre": "Juan", "email": "juan@example.com" } }

# 2. Iniciar sesión
POST /api/sesiones/abc123def456/iniciar

# 3. Obtener siguiente pregunta
GET /api/sesiones/abc123def456/mensajes/siguiente-pregunta

# 4. Responder pregunta (se evalúa automáticamente)
POST /api/sesiones/abc123def456/mensajes/responder
{ "pregunta_id": 5, "respuesta": "5 años" }

# Repetir pasos 3-4 hasta completar todas las preguntas
```

### Paso 2: Verificar Evaluaciones
```bash
# Ver todas las evaluaciones
GET /api/sesiones/1/evaluaciones

# Ver puntaje actual
GET /api/sesiones/1/evaluaciones/puntaje

# Ver estadísticas
GET /api/sesiones/1/evaluaciones/estadisticas
```

### Paso 3: Evaluar Manualmente (si hay pendientes)
```bash
# Ver pendientes
GET /api/evaluaciones/pendientes

# Actualizar evaluación manual
PUT /api/evaluaciones/3/manual
{ "cumple": true, "puntaje": 80, "razon": "Buena respuesta", "evaluador": "Recruiter" }
```

### Paso 4: Finalizar Sesión
```bash
# Validar que se puede finalizar
GET /api/sesiones/1/evaluaciones/validar-finalizacion

# Finalizar (calcula automáticamente)
POST /api/sesiones/abc123def456/finalizar
{ "umbral_aprobacion": 70 }

# Ver resultado
GET /api/sesiones/abc123def456/resumen
```

---

## 🎨 EJEMPLOS DE REGLAS DE EVALUACIÓN

### Regla de Rango
```json
{
  "tipo": "rango",
  "min": 1,
  "max": 10
}
```

### Regla de Palabras Clave
```json
{
  "tipo": "keywords",
  "keywords": ["react", "angular", "vue"],
  "modo": "alguna"
}
```

### Regla de Opciones
```json
{
  "tipo": "opcion",
  "opciones_validas": ["Sí", "No"],
  "tipo_seleccion": "unica"
}
```

### Regla de Formato
```json
{
  "tipo": "formato",
  "formato": "email"
}
```

### Regla de Longitud
```json
{
  "tipo": "longitud",
  "min": 50,
  "max": 500
}
```

---

## 🔍 NOTAS IMPORTANTES

### Auto-Evaluación
- ✅ Cada vez que se responde una pregunta, se evalúa **automáticamente**
- ✅ La evaluación se guarda en `cb_evaluaciones`
- ✅ El resultado se incluye en la respuesta del endpoint `/mensajes/responder`

### Métodos de Evaluación
1. **regla_fija** (80%): Evaluación automática por reglas predefinidas
2. **ia** (futuro): Evaluación con IA (OpenAI/Claude) - actualmente en modo mock
3. **manual**: Requiere revisión humana - queda con `cumple = NULL`

### Preguntas Eliminatorias
- Si `es_eliminatoria = 1` y `cumple = 0`, el candidato es **rechazado automáticamente**
- No importa el puntaje obtenido en las demás preguntas

### Pesos (Ponderación)
- Cada pregunta tiene un `peso` (default: 1.0)
- Puntaje final = `SUM(puntaje_pregunta * peso) / SUM(100 * peso) * 100`

---

## ✅ CHECKLIST DE PRUEBAS

- [ ] Crear sesión y responder preguntas
- [ ] Verificar que se evalúan automáticamente
- [ ] Obtener evaluaciones de una sesión
- [ ] Calcular puntaje de una sesión
- [ ] Determinar resultado (aprobado/rechazado)
- [ ] Obtener estadísticas completas
- [ ] Validar finalización de sesión
- [ ] Actualizar evaluación manual
- [ ] Obtener evaluaciones pendientes
- [ ] Finalizar sesión automáticamente
- [ ] Probar pregunta eliminatoria (debe rechazar)
- [ ] Probar con diferentes umbrales de aprobación
- [ ] Verificar distribución por método de evaluación

---

## 🚀 Estado del Sistema

**Implementado:**
- ✅ Evaluación automática con reglas fijas (7 tipos de validadores)
- ✅ Sistema de ponderación con pesos
- ✅ Preguntas eliminatorias
- ✅ Evaluación manual con revisión humana
- ✅ Cálculo automático de puntajes y resultados
- ✅ Estadísticas completas por sesión y método

**En Desarrollo:**
- 🔄 Evaluación con IA (OpenAI/Claude) - modo mock activo

---

**Última actualización**: 2025-11-09
**Versión del Sistema**: 1.0.0

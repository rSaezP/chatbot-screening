# ESTRUCTURA DE DATOS - Chatbot Screening System

**Proyecto:** Sistema de evaluación de candidatos mediante chatbot conversacional
**Frontend:** Vue 3 + Vite + Pinia + UI Kit 3IT
**Backend:** Node.js + MySQL
**Fecha de extracción:** 2025-11-12

---

## 📋 TABLA DE CONTENIDOS

1. [Interfaces TypeScript](#1-interfaces-typescript)
2. [Store Pinia](#2-store-pinia)
3. [Endpoints API](#3-endpoints-api)
4. [Ejemplos de Datos](#4-ejemplos-de-datos)
5. [Validaciones y Reglas](#5-validaciones-y-reglas)
6. [Configuración](#6-configuración)

---

## 1. INTERFACES TYPESCRIPT

### 1.1 Chatbot (Configuración)

```typescript
interface Chatbot {
  // Identificación
  id?: number;

  // Paso 1: Configuración del Asistente
  nombre_asistente: string;         // Nombre del asistente virtual (ej: "Eva")
  avatar_url?: string;               // URL del avatar (opcional)
  color_botones: string;             // Color hexadecimal para botones (ej: "#667eea")
  color_conversacion: string;        // Color de fondo de la conversación (ej: "#f7fafc")
  color_fondo: string;               // Color de fondo general (ej: "#ffffff")

  // Paso 2: Configuración de Evaluación
  nombre: string;                    // Nombre del chatbot *REQUERIDO*
  descripcion?: string;              // Descripción del chatbot
  categoria?: string;                // Categoría (ej: "Tecnología", "Ventas")
  duracion_dias: number;             // Días de vigencia de la sesión (ej: 7)
  umbral_aprobacion: number;         // % mínimo para aprobar (0-100) (ej: 70)

  // Paso 3: Mensajes Personalizados
  mensaje_bienvenida: string;        // Mensaje inicial del chatbot
  mensaje_finalizacion: string;      // Mensaje final después de completar

  // Paso 4: Configuración de Email
  email_reclutador: string;          // Email donde llegan resultados *REQUERIDO*
  smtp_config?: SMTPConfig;          // Configuración SMTP (opcional)

  // Paso 5: Preguntas
  preguntas: Pregunta[];             // Array de preguntas

  // Metadatos
  activo?: boolean;                  // Si el chatbot está activo
  fecha_creacion?: string;           // Fecha de creación (ISO 8601)
  fecha_actualizacion?: string;      // Fecha de última actualización (ISO 8601)
}
```

### 1.2 SMTPConfig

```typescript
interface SMTPConfig {
  host: string;                      // Servidor SMTP (ej: "smtp.gmail.com")
  port: number;                      // Puerto SMTP (ej: 587)
  user: string;                      // Usuario SMTP
  pass: string;                      // Contraseña/App Password
  from_name: string;                 // Nombre del remitente (ej: "ChatBot 3IT")
}
```

### 1.3 Pregunta

```typescript
interface Pregunta {
  // Identificación
  id?: number;
  config_id?: number;                // ID del chatbot padre

  // Datos básicos
  pregunta: string;                  // Texto de la pregunta *REQUERIDO*
  tipo_campo: TipoCampo;             // Tipo de respuesta esperada *REQUERIDO*
  metodo_evaluacion: 'regla_fija' | 'ia' | 'manual';  // Método de evaluación

  // Reglas de evaluación
  regla: ReglaPregunta;              // Reglas según tipo_campo

  // Configuración
  peso: number;                      // Importancia de la pregunta (1-100)
  es_eliminatoria: boolean;          // Si rechaza automáticamente al fallar
  requerida: boolean;                // Si es obligatoria responder
  orden: number;                     // Orden de aparición (1, 2, 3...)

  // Metadatos
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
```

### 1.4 TipoCampo

```typescript
type TipoCampo =
  | 'texto_corto'      // Input de texto corto (max ~50 caracteres)
  | 'texto_largo'      // Textarea (max ~500 caracteres)
  | 'numero'           // Input numérico
  | 'email'            // Input de email con validación
  | 'telefono'         // Input de teléfono
  | 'si_no'            // Pregunta de Sí/No
  | 'opcion_unica';    // Selección múltiple con opciones correctas
```

### 1.5 ReglaPregunta

```typescript
interface ReglaPregunta {
  tipo: TipoRegla;

  // Para tipo_campo = 'numero'
  min?: number | null;               // Valor mínimo aceptable
  max?: number | null;               // Valor máximo aceptable

  // Para tipo_campo = 'texto_corto' | 'texto_largo'
  keywords?: string[];               // Palabras clave a buscar
  minimo?: number;                   // Cantidad mínima de keywords a encontrar
  longitud_minima?: number | null;   // Mínimo de caracteres
  longitud_maxima?: number | null;   // Máximo de caracteres

  // Para tipo_campo = 'si_no'
  respuesta_correcta?: 'si' | 'no';  // Respuesta esperada

  // Para tipo_campo = 'opcion_unica'
  opciones?: string[];               // Array de opciones disponibles
  opciones_correctas?: string[];     // Array de opciones que se consideran correctas
}
```

### 1.6 TipoRegla

```typescript
type TipoRegla =
  | 'rango'       // Para preguntas numéricas (usa min/max)
  | 'keywords'    // Para preguntas de texto (busca keywords)
  | 'igual'       // Para preguntas sí/no (compara respuesta_correcta)
  | 'opcion'      // Para opciones múltiples (compara con opciones_correctas)
  | '';           // Sin regla definida
```

### 1.7 Sesion

```typescript
interface Sesion {
  // Identificación
  id?: number;
  token: string;                     // Token único de la sesión (UUID)
  config_id: number;                 // ID del chatbot asociado

  // Datos del candidato
  candidato_nombre: string;          // Nombre del candidato *REQUERIDO*
  candidato_email: string;           // Email del candidato *REQUERIDO*
  candidato_telefono?: string;       // Teléfono (opcional)
  candidato_notas?: string;          // Notas adicionales (opcional)

  // Estado de la sesión
  estado: EstadoSesion;              // Estado actual
  resultado?: ResultadoSesion;       // Resultado de la evaluación

  // Evaluación
  porcentaje?: number;               // Porcentaje final (0-100)
  puntaje_obtenido?: number;         // Puntaje obtenido
  puntaje_total?: number;            // Puntaje total posible

  // Fechas
  fecha_creacion: string;            // Fecha de creación (ISO 8601)
  fecha_inicio?: string;             // Fecha de inicio (ISO 8601)
  fecha_completado?: string;         // Fecha de finalización (ISO 8601)
  fecha_expiracion: string;          // Fecha de expiración (ISO 8601)

  // Datos relacionados (cuando se cargan)
  chatbot_nombre?: string;           // Nombre del chatbot
  chatbot_descripcion?: string;      // Descripción del chatbot
}
```

### 1.8 EstadoSesion

```typescript
type EstadoSesion =
  | 'pendiente'     // Sesión creada, esperando que el candidato inicie
  | 'en_progreso'   // Candidato respondiendo preguntas
  | 'completado'    // Todas las preguntas respondidas y evaluadas
  | 'expirado';     // Sesión expirada sin completar
```

### 1.9 ResultadoSesion

```typescript
type ResultadoSesion =
  | 'sin_evaluar'   // No se ha evaluado aún
  | 'aprobado'      // Cumple con el umbral de aprobación
  | 'rechazado';    // No cumple con el umbral de aprobación
```

### 1.10 Mensaje

```typescript
interface Mensaje {
  // Identificación
  id?: number;
  sesion_id: number;                 // ID de la sesión
  pregunta_id?: number;              // ID de la pregunta (si es respuesta)

  // Contenido
  tipo: TipoMensaje;                 // Tipo de mensaje
  contenido: string;                 // Texto del mensaje

  // Si es respuesta del candidato
  respuesta?: string;                // Respuesta del candidato
  es_correcta?: boolean;             // Si la respuesta es correcta (evaluada)
  puntaje_obtenido?: number;         // Puntaje obtenido en esta pregunta
  metadata?: any;                    // Metadata adicional

  // Fecha
  fecha_creacion: string;            // Timestamp (ISO 8601)
}
```

### 1.11 TipoMensaje

```typescript
type TipoMensaje =
  | 'sistema'       // Mensajes automáticos del sistema
  | 'pregunta'      // Pregunta del chatbot
  | 'respuesta';    // Respuesta del candidato
```

### 1.12 Progreso

```typescript
interface Progreso {
  total_preguntas: number;           // Total de preguntas en el chatbot
  preguntas_respondidas: number;     // Cantidad respondidas
  preguntas_pendientes: number;      // Cantidad pendientes
  porcentaje_completado: number;     // % completado (0-100)
}
```

### 1.13 Candidato (para invitación)

```typescript
interface Candidato {
  nombre: string;                    // Nombre completo *REQUERIDO*
  email: string;                     // Email *REQUERIDO*
  telefono?: string;                 // Teléfono (opcional)
  notas?: string;                    // Notas adicionales (opcional)
}
```

---

## 2. STORE PINIA

### 2.1 Estado (State)

```typescript
interface ChatbotStoreState {
  // Estado - Chat del candidato
  sesion: Sesion | null;             // Sesión actual del candidato
  mensajes: Mensaje[];               // Mensajes del chat
  preguntaActual: Pregunta | null;   // Pregunta que se está mostrando
  loading: boolean;                  // Indicador de carga
  error: string | null;              // Mensaje de error
  progreso: Progreso | null;         // Progreso de la sesión

  // Estado - Gestión de chatbots (admin)
  chatbotEnEdicion: Chatbot | null;  // Chatbot siendo editado
  preguntasEnEdicion: Pregunta[];    // Preguntas del chatbot en edición
  chatbots: Chatbot[];               // Lista de todos los chatbots
  sesiones: Sesion[];                // Lista de sesiones (con filtros)
}
```

### 2.2 Acciones (Actions)

#### 2.2.1 Chat del Candidato

```typescript
// Iniciar chat con token
async iniciarChat(token: string): Promise<void>

// Cargar mensajes de la sesión
async cargarMensajes(token: string): Promise<void>

// Obtener siguiente pregunta pendiente
async obtenerSiguientePregunta(token?: string): Promise<void>

// Responder pregunta actual
async responderPregunta(respuesta: string): Promise<void>

// Obtener progreso de la sesión
async obtenerProgreso(token?: string): Promise<void>

// Finalizar chat y calcular resultado
async finalizarChat(): Promise<void>

// Reiniciar estado del store
resetStore(): void
```

#### 2.2.2 Gestión de Chatbots (Admin)

```typescript
// Cargar todos los chatbots
async cargarChatbots(): Promise<Chatbot[]>

// Cargar un chatbot por ID
async cargarChatbot(id: number): Promise<Chatbot>

// Guardar chatbot (crear o actualizar)
async guardarChatbot(chatbotData: Chatbot): Promise<Chatbot>

// Eliminar chatbot
async eliminarChatbot(id: number): Promise<void>

// Agregar pregunta al chatbot en edición
agregarPregunta(pregunta: Pregunta): void

// Editar pregunta del chatbot en edición
editarPregunta(index: number, pregunta: Pregunta): void

// Eliminar pregunta del chatbot en edición
eliminarPregunta(index: number): void

// Reordenar preguntas del chatbot en edición
reordenarPreguntas(nuevasPreguntas: Pregunta[]): void

// Cargar sesiones con filtros
async cargarSesiones(filtros?: FiltrosSesiones): Promise<Sesion[]>

// Reiniciar estado de edición
resetEdicion(): void
```

### 2.3 Getters

No hay getters explícitos, pero el estado es reactivo y accesible directamente.

---

## 3. ENDPOINTS API

**Base URL:** `http://localhost:4000/api`

### 3.1 Sesiones (Chat del Candidato)

#### `GET /sesiones/:token/validar`
**Descripción:** Validar si un token de sesión es válido
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Response:**
```json
{
  "success": true,
  "message": "Sesión válida"
}
```

---

#### `GET /sesiones/:token`
**Descripción:** Obtener información completa de una sesión
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "token": "abc-123-def",
    "config_id": 1,
    "candidato_nombre": "Juan Pérez",
    "candidato_email": "juan@example.com",
    "estado": "en_progreso",
    "resultado": "sin_evaluar",
    "fecha_creacion": "2025-01-12T10:30:00Z",
    "fecha_expiracion": "2025-01-19T10:30:00Z",
    "chatbot_nombre": "Evaluación Desarrollador Full Stack"
  }
}
```

---

#### `POST /sesiones/:token/iniciar`
**Descripción:** Iniciar sesión (cambiar estado de 'pendiente' a 'en_progreso')
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "estado": "en_progreso"
  }
}
```

---

#### `GET /sesiones/:token/mensajes`
**Descripción:** Obtener todos los mensajes de una sesión
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tipo": "sistema",
      "contenido": "¡Bienvenido! Comencemos la evaluación.",
      "fecha_creacion": "2025-01-12T10:30:00Z"
    },
    {
      "id": 2,
      "tipo": "pregunta",
      "contenido": "¿Cuántos años de experiencia tienes en JavaScript?",
      "pregunta_id": 10,
      "fecha_creacion": "2025-01-12T10:30:05Z"
    },
    {
      "id": 3,
      "tipo": "respuesta",
      "contenido": "Tengo 5 años de experiencia",
      "respuesta": "5",
      "es_correcta": true,
      "puntaje_obtenido": 25,
      "fecha_creacion": "2025-01-12T10:31:00Z"
    }
  ]
}
```

---

#### `GET /sesiones/:token/mensajes/siguiente-pregunta`
**Descripción:** Obtener la siguiente pregunta pendiente de responder
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "pregunta": "¿Qué frameworks de JavaScript conoces?",
    "tipo_campo": "texto_largo",
    "requerida": true,
    "orden": 2
  }
}
```

**Response (sin más preguntas):**
```json
{
  "success": true,
  "data": null,
  "message": "No hay más preguntas pendientes"
}
```

---

#### `POST /sesiones/:token/mensajes/responder`
**Descripción:** Responder una pregunta
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Body:**
```json
{
  "pregunta_id": 11,
  "respuesta": "React, Vue, Angular",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "tipo": "respuesta",
    "contenido": "React, Vue, Angular",
    "pregunta_id": 11,
    "es_correcta": true,
    "puntaje_obtenido": 30,
    "fecha_creacion": "2025-01-12T10:32:00Z"
  }
}
```

---

#### `GET /sesiones/:token/mensajes/progreso`
**Descripción:** Obtener progreso de la sesión
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Response:**
```json
{
  "success": true,
  "data": {
    "total_preguntas": 10,
    "preguntas_respondidas": 3,
    "preguntas_pendientes": 7,
    "porcentaje_completado": 30
  }
}
```

---

#### `POST /sesiones/:token/finalizar`
**Descripción:** Finalizar evaluación (calcula puntaje y envía emails)
**Parámetros URL:**
- `token` (string) - Token único de la sesión

**Body (opcional):**
```json
{
  "umbral_aprobacion": 70
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estado": "completado",
    "resultado": "aprobado",
    "porcentaje": 85,
    "puntaje_obtenido": 255,
    "puntaje_total": 300
  }
}
```

---

#### `POST /sesiones`
**Descripción:** Crear nueva sesión (para admin/invitaciones)
**Body:**
```json
{
  "config_id": 1,
  "candidato": {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+56912345678",
    "notas": "Candidato referido por LinkedIn"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 124,
    "token": "xyz-789-abc",
    "config_id": 1,
    "candidato_nombre": "Juan Pérez",
    "candidato_email": "juan@example.com",
    "estado": "pendiente",
    "fecha_creacion": "2025-01-12T15:00:00Z",
    "fecha_expiracion": "2025-01-19T15:00:00Z"
  }
}
```

---

### 3.2 Configuración de Chatbots (Admin)

#### `GET /config`
**Descripción:** Obtener todos los chatbots
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Evaluación Desarrollador Full Stack",
      "descripcion": "Evaluación técnica para desarrolladores",
      "categoria": "Tecnología",
      "activo": true,
      "fecha_creacion": "2025-01-10T08:00:00Z"
    }
  ]
}
```

---

#### `GET /config/:id`
**Descripción:** Obtener un chatbot por ID
**Parámetros URL:**
- `id` (number) - ID del chatbot

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre_asistente": "Eva",
    "avatar_url": "https://example.com/avatar.png",
    "color_botones": "#667eea",
    "color_conversacion": "#f7fafc",
    "color_fondo": "#ffffff",
    "nombre": "Evaluación Desarrollador Full Stack",
    "descripcion": "Evaluación completa para desarrolladores Full Stack",
    "categoria": "Tecnología",
    "duracion_dias": 7,
    "umbral_aprobacion": 70,
    "mensaje_bienvenida": "¡Hola! Bienvenido...",
    "mensaje_finalizacion": "Gracias por completar...",
    "email_reclutador": "reclutador@3it.cl",
    "smtp_config": {
      "host": "smtp.gmail.com",
      "port": 587,
      "user": "bot@3it.cl",
      "from_name": "ChatBot 3IT"
    },
    "activo": true,
    "fecha_creacion": "2025-01-10T08:00:00Z"
  }
}
```

---

#### `POST /config`
**Descripción:** Crear nuevo chatbot
**Body:**
```json
{
  "nombre_asistente": "Eva",
  "color_botones": "#667eea",
  "color_conversacion": "#f7fafc",
  "color_fondo": "#ffffff",
  "nombre": "Evaluación Ventas",
  "descripcion": "Evaluación para ejecutivos de ventas",
  "categoria": "Ventas",
  "duracion_dias": 7,
  "umbral_aprobacion": 75,
  "mensaje_bienvenida": "¡Hola!...",
  "mensaje_finalizacion": "Gracias...",
  "email_reclutador": "ventas@3it.cl",
  "preguntas": [
    {
      "pregunta": "¿Cuántos años de experiencia en ventas tienes?",
      "tipo_campo": "numero",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": "rango",
        "min": 2,
        "max": null
      },
      "peso": 30,
      "es_eliminatoria": false,
      "requerida": true,
      "orden": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "nombre": "Evaluación Ventas",
    "fecha_creacion": "2025-01-12T16:00:00Z"
  }
}
```

---

#### `PUT /config/:id`
**Descripción:** Actualizar chatbot existente
**Parámetros URL:**
- `id` (number) - ID del chatbot

**Body:** (mismo formato que POST /config)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "nombre": "Evaluación Ventas Actualizada",
    "fecha_actualizacion": "2025-01-12T17:00:00Z"
  }
}
```

---

#### `DELETE /config/:id`
**Descripción:** Eliminar chatbot
**Parámetros URL:**
- `id` (number) - ID del chatbot

**Response:**
```json
{
  "success": true,
  "message": "Chatbot eliminado exitosamente"
}
```

---

### 3.3 Preguntas

#### `GET /config/:configId/preguntas`
**Descripción:** Obtener todas las preguntas de un chatbot
**Parámetros URL:**
- `configId` (number) - ID del chatbot

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "config_id": 1,
      "pregunta": "¿Cuántos años de experiencia tienes en JavaScript?",
      "tipo_campo": "numero",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": "rango",
        "min": 2,
        "max": null
      },
      "peso": 25,
      "es_eliminatoria": false,
      "requerida": true,
      "orden": 1,
      "activo": true
    }
  ]
}
```

---

#### `POST /config/:configId/preguntas`
**Descripción:** Crear nueva pregunta para un chatbot
**Parámetros URL:**
- `configId` (number) - ID del chatbot

**Body:**
```json
{
  "pregunta": "¿Qué es un closure en JavaScript?",
  "tipo_campo": "texto_largo",
  "metodo_evaluacion": "regla_fija",
  "regla": {
    "tipo": "keywords",
    "keywords": ["función", "scope", "contexto", "variable"],
    "minimo": 2
  },
  "peso": 30,
  "es_eliminatoria": false,
  "requerida": true,
  "orden": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "pregunta": "¿Qué es un closure en JavaScript?",
    "orden": 3
  }
}
```

---

#### `PUT /preguntas/:preguntaId`
**Descripción:** Actualizar pregunta existente
**Parámetros URL:**
- `preguntaId` (number) - ID de la pregunta

**Body:** (mismo formato que POST)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "pregunta": "¿Qué es un closure en JavaScript? (actualizada)"
  }
}
```

---

#### `DELETE /preguntas/:preguntaId`
**Descripción:** Eliminar pregunta
**Parámetros URL:**
- `preguntaId` (number) - ID de la pregunta

**Response:**
```json
{
  "success": true,
  "message": "Pregunta eliminada exitosamente"
}
```

---

#### `PUT /config/:configId/preguntas/reordenar`
**Descripción:** Reordenar preguntas de un chatbot
**Parámetros URL:**
- `configId` (number) - ID del chatbot

**Body:**
```json
{
  "orden": [15, 10, 12, 11]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preguntas reordenadas exitosamente"
}
```

---

### 3.4 Sesiones (Admin)

#### `GET /sesiones`
**Descripción:** Obtener todas las sesiones con filtros
**Query Parameters (opcionales):**
- `chatbotId` (number) - Filtrar por ID de chatbot
- `estado` (string) - Filtrar por estado ('pendiente', 'en_progreso', 'completado', 'expirado')
- `resultado` (string) - Filtrar por resultado ('sin_evaluar', 'aprobado', 'rechazado')

**Ejemplo:** `GET /sesiones?chatbotId=1&estado=completado&resultado=aprobado`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "token": "abc-123-def",
      "config_id": 1,
      "candidato_nombre": "Juan Pérez",
      "candidato_email": "juan@example.com",
      "estado": "completado",
      "resultado": "aprobado",
      "porcentaje": 85,
      "fecha_creacion": "2025-01-12T10:30:00Z",
      "chatbot_nombre": "Evaluación Desarrollador Full Stack"
    }
  ]
}
```

---

#### `GET /sesiones/recientes/:chatbotId`
**Descripción:** Obtener sesiones recientes de un chatbot
**Parámetros URL:**
- `chatbotId` (number) - ID del chatbot

**Query Parameters:**
- `limite` (number) - Límite de resultados (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 125,
      "candidato_nombre": "María González",
      "candidato_email": "maria@example.com",
      "estado": "en_progreso",
      "fecha_creacion": "2025-01-12T14:00:00Z"
    }
  ]
}
```

---

## 4. EJEMPLOS DE DATOS

### 4.1 Chatbot Completo (Ejemplo Real)

```json
{
  "id": 1,
  "nombre_asistente": "Eva",
  "avatar_url": "https://cdn.3it.cl/avatars/eva.png",
  "color_botones": "#667eea",
  "color_conversacion": "#f7fafc",
  "color_fondo": "#ffffff",
  "nombre": "Evaluación Desarrollador Full Stack",
  "descripcion": "Evaluación técnica completa para desarrolladores Full Stack con experiencia en JavaScript, Node.js y bases de datos",
  "categoria": "Tecnología",
  "duracion_dias": 7,
  "umbral_aprobacion": 70,
  "mensaje_bienvenida": "¡Hola! Bienvenido a la evaluación de ChatBot 3IT. Soy Eva, tu asistente virtual. Este proceso tomará aproximadamente 15 minutos. Por favor, responde todas las preguntas con honestidad y lo más completo posible. ¡Comencemos!",
  "mensaje_finalizacion": "¡Excelente! Has completado la evaluación. Muchas gracias por tu tiempo. El equipo de reclutamiento revisará tus respuestas y te contactaremos pronto con los siguientes pasos. ¡Que tengas un gran día!",
  "email_reclutador": "reclutador@3it.cl",
  "smtp_config": {
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "estoesunaprueba1402@gmail.com",
    "pass": "xevgynyplmylxtut",
    "from_name": "ChatBot 3IT - Evaluaciones"
  },
  "preguntas": [
    {
      "id": 10,
      "pregunta": "¿Cuántos años de experiencia tienes programando en JavaScript?",
      "tipo_campo": "numero",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": "rango",
        "min": 2,
        "max": null
      },
      "peso": 25,
      "es_eliminatoria": false,
      "requerida": true,
      "orden": 1
    },
    {
      "id": 11,
      "pregunta": "¿Qué frameworks y librerías de JavaScript conoces? Menciona al menos 3.",
      "tipo_campo": "texto_largo",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": "keywords",
        "keywords": ["react", "vue", "angular", "node", "express", "next"],
        "minimo": 3,
        "longitud_minima": 20,
        "longitud_maxima": 500
      },
      "peso": 30,
      "es_eliminatoria": false,
      "requerida": true,
      "orden": 2
    },
    {
      "id": 12,
      "pregunta": "¿Tienes experiencia trabajando con bases de datos SQL?",
      "tipo_campo": "si_no",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": "igual",
        "respuesta_correcta": "si"
      },
      "peso": 20,
      "es_eliminatoria": true,
      "requerida": true,
      "orden": 3
    },
    {
      "id": 13,
      "pregunta": "¿Cuándo podrías comenzar a trabajar con nosotros?",
      "tipo_campo": "opcion_unica",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": "opcion",
        "opciones": [
          "Inmediata",
          "1 mes",
          "2 meses",
          "3 meses o más"
        ],
        "opciones_correctas": ["Inmediata", "1 mes"]
      },
      "peso": 15,
      "es_eliminatoria": false,
      "requerida": true,
      "orden": 4
    },
    {
      "id": 14,
      "pregunta": "¿Cuál es tu email de contacto?",
      "tipo_campo": "email",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": ""
      },
      "peso": 5,
      "es_eliminatoria": false,
      "requerida": true,
      "orden": 5
    },
    {
      "id": 15,
      "pregunta": "¿Tienes un portafolio o GitHub que puedas compartir?",
      "tipo_campo": "texto_corto",
      "metodo_evaluacion": "regla_fija",
      "regla": {
        "tipo": ""
      },
      "peso": 5,
      "es_eliminatoria": false,
      "requerida": false,
      "orden": 6
    }
  ],
  "activo": true,
  "fecha_creacion": "2025-01-10T08:00:00Z",
  "fecha_actualizacion": "2025-01-12T14:30:00Z"
}
```

### 4.2 Sesión Completa (Ejemplo)

```json
{
  "id": 123,
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "config_id": 1,
  "candidato_nombre": "Juan Carlos Pérez González",
  "candidato_email": "juan.perez@example.com",
  "candidato_telefono": "+56912345678",
  "candidato_notas": "Candidato referido por LinkedIn. Tiene experiencia en startup tech.",
  "estado": "completado",
  "resultado": "aprobado",
  "porcentaje": 85,
  "puntaje_obtenido": 85,
  "puntaje_total": 100,
  "fecha_creacion": "2025-01-12T10:00:00Z",
  "fecha_inicio": "2025-01-12T10:30:00Z",
  "fecha_completado": "2025-01-12T10:45:00Z",
  "fecha_expiracion": "2025-01-19T10:00:00Z",
  "chatbot_nombre": "Evaluación Desarrollador Full Stack",
  "chatbot_descripcion": "Evaluación técnica completa para desarrolladores Full Stack"
}
```

### 4.3 Mensajes de una Sesión (Ejemplo)

```json
[
  {
    "id": 1,
    "sesion_id": 123,
    "tipo": "sistema",
    "contenido": "¡Hola! Bienvenido a la evaluación de ChatBot 3IT. Soy Eva, tu asistente virtual...",
    "fecha_creacion": "2025-01-12T10:30:00Z"
  },
  {
    "id": 2,
    "sesion_id": 123,
    "pregunta_id": 10,
    "tipo": "pregunta",
    "contenido": "¿Cuántos años de experiencia tienes programando en JavaScript?",
    "fecha_creacion": "2025-01-12T10:30:05Z"
  },
  {
    "id": 3,
    "sesion_id": 123,
    "pregunta_id": 10,
    "tipo": "respuesta",
    "contenido": "Tengo 5 años de experiencia programando en JavaScript",
    "respuesta": "5",
    "es_correcta": true,
    "puntaje_obtenido": 25,
    "metadata": null,
    "fecha_creacion": "2025-01-12T10:31:00Z"
  },
  {
    "id": 4,
    "sesion_id": 123,
    "pregunta_id": 11,
    "tipo": "pregunta",
    "contenido": "¿Qué frameworks y librerías de JavaScript conoces? Menciona al menos 3.",
    "fecha_creacion": "2025-01-12T10:31:05Z"
  },
  {
    "id": 5,
    "sesion_id": 123,
    "pregunta_id": 11,
    "tipo": "respuesta",
    "contenido": "Conozco React para frontend, Node.js con Express para backend, y también he trabajado con Vue.js y Next.js",
    "respuesta": "Conozco React para frontend, Node.js con Express para backend, y también he trabajado con Vue.js y Next.js",
    "es_correcta": true,
    "puntaje_obtenido": 30,
    "metadata": {
      "keywords_encontradas": ["react", "node", "express", "vue", "next"]
    },
    "fecha_creacion": "2025-01-12T10:32:00Z"
  }
]
```

### 4.4 Valores por Defecto (formData inicial)

```javascript
// frontend/src/views/admin/ChatbotFormView.vue
const formData = ref({
  // Paso 1: Asistente
  nombre_asistente: 'Eva',
  avatar_url: '',
  color_botones: '#667eea',
  color_conversacion: '#f7fafc',
  color_fondo: '#ffffff',

  // Paso 2: Evaluación
  nombre: '',
  descripcion: '',
  categoria: '',
  duracion_dias: 7,
  umbral_aprobacion: 70,

  // Paso 3: Mensajes
  mensaje_bienvenida: '¡Hola! Bienvenido a la evaluación de ChatBot 3IT. Responde todas las preguntas con honestidad.',
  mensaje_finalizacion: 'Gracias por completar la evaluación. Te contactaremos pronto con los siguientes pasos.',

  // Paso 4: Email
  email_reclutador: '',
  smtp_config: {
    host: 'smtp.gmail.com',
    port: 587,
    user: 'estoesunaprueba1402@gmail.com',
    pass: 'xevgynyplmylxtut',
    from_name: 'ChatBot 3IT'
  },

  // Paso 5: Preguntas
  preguntas: []
});
```

```javascript
// frontend/src/components/admin/PreguntaForm.vue
const form = ref({
  pregunta: '',
  tipo_campo: '',
  metodo_evaluacion: 'regla_fija',
  regla: {
    tipo: '',
    // Para número
    min: null,
    max: null,
    // Para texto
    keywords_raw: '',
    keywords: [],
    minimo: 1,
    longitud_minima: null,
    longitud_maxima: null,
    // Para sí/no
    respuesta_correcta: 'si',
    // Para opción única
    opciones_raw: '',
    opciones: [],
    opciones_correctas: []
  },
  peso: 25,
  es_eliminatoria: false,
  requerida: true,
  orden: 1
});
```

---

## 5. VALIDACIONES Y REGLAS

### 5.1 Validaciones de Chatbot

#### Campos Requeridos:
- ✅ `nombre_asistente` - Requerido en Paso 1
- ✅ `nombre` - Requerido en Paso 2
- ✅ `email_reclutador` - Requerido en Paso 4

#### Validaciones de Rangos:
- `umbral_aprobacion`: Debe estar entre 0 y 100
- `duracion_dias`: Debe ser mayor a 0
- `color_*`: Deben ser códigos hexadecimales válidos (#RRGGBB)

#### Validaciones de Email:
- `email_reclutador`: Debe ser un email válido

### 5.2 Validaciones de Pregunta

#### Campos Requeridos:
- ✅ `pregunta` - Texto de la pregunta (obligatorio)
- ✅ `tipo_campo` - Tipo de respuesta (obligatorio)

#### Validaciones de Rangos:
- `peso`: Debe estar entre 1 y 100

#### Validaciones según tipo_campo:

**NÚMERO (`tipo_campo = 'numero'`):**
- Si `min` y `max` están definidos: `min` debe ser menor que `max`

**TEXTO (`tipo_campo = 'texto_corto' | 'texto_largo'`):**
- Si se definen `keywords`: No puede estar vacío
- `minimo`: Debe ser >= 1
- Si `longitud_minima` y `longitud_maxima` están definidos: `longitud_minima` < `longitud_maxima`

**OPCIÓN ÚNICA (`tipo_campo = 'opcion_unica'`):**
- `opciones`: Debe tener al menos 1 opción
- `opciones_correctas`: Debe tener al menos 1 opción seleccionada
- Todas las `opciones_correctas` deben estar en `opciones`

### 5.3 Reglas de Negocio

#### Chatbot:
1. Un chatbot debe tener al menos 1 pregunta para estar activo
2. No se puede eliminar un chatbot con sesiones activas
3. El `umbral_aprobacion` determina si el candidato es aprobado o rechazado

#### Pregunta:
1. Si `es_eliminatoria = true`: Si el candidato falla esta pregunta, es rechazado automáticamente sin importar el puntaje final
2. El `orden` determina la secuencia de aparición en el chat
3. Las preguntas con `requerida = false` pueden ser omitidas por el candidato
4. El `peso` define la importancia de la pregunta en el cálculo final

#### Sesión:
1. Una sesión cambia de `pendiente` a `en_progreso` cuando el candidato inicia
2. Una sesión cambia de `en_progreso` a `completado` cuando se responden todas las preguntas
3. Una sesión expira después de `duracion_dias` si no se completa
4. El `resultado` se calcula como: `(puntaje_obtenido / puntaje_total) * 100`
5. Si `resultado >= umbral_aprobacion`: Estado = 'aprobado', sino = 'rechazado'

#### Evaluación:
1. **Pregunta NÚMERO**: Se evalúa si el número está dentro del rango `min`-`max`
2. **Pregunta TEXTO**: Se buscan las `keywords` en la respuesta. Si se encuentran >= `minimo`, es correcta
3. **Pregunta SÍ/NO**: Se compara la respuesta con `respuesta_correcta`
4. **Pregunta OPCIÓN ÚNICA**: Se verifica si la opción seleccionada está en `opciones_correctas`
5. **Pregunta EMAIL/TELEFONO**: Se valida el formato, pero no se evalúa como correcta/incorrecta

### 5.4 Estructura de Reglas según Tipo de Campo

| tipo_campo | regla.tipo | Campos usados en regla | Ejemplo |
|------------|-----------|------------------------|---------|
| `numero` | `rango` | `min`, `max` | `{ tipo: 'rango', min: 2, max: 10 }` |
| `texto_corto` | `keywords` | `keywords`, `minimo`, `longitud_minima`, `longitud_maxima` | `{ tipo: 'keywords', keywords: ['react', 'vue'], minimo: 1 }` |
| `texto_largo` | `keywords` | `keywords`, `minimo`, `longitud_minima`, `longitud_maxima` | `{ tipo: 'keywords', keywords: ['experiencia', 'proyecto'], minimo: 2 }` |
| `si_no` | `igual` | `respuesta_correcta` | `{ tipo: 'igual', respuesta_correcta: 'si' }` |
| `opcion_unica` | `opcion` | `opciones`, `opciones_correctas` | `{ tipo: 'opcion', opciones: ['A', 'B'], opciones_correctas: ['A'] }` |
| `email` | `''` | ninguno | `{ tipo: '' }` |
| `telefono` | `''` | ninguno | `{ tipo: '' }` |

---

## 6. CONFIGURACIÓN

### 6.1 Axios Configuration

**Archivo:** `frontend/src/api/axios.js`

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
});
```

### 6.2 Tipos de Respuesta Disponibles

```javascript
const tiposRespuesta = [
  { id: 'texto_corto', label: 'Texto Corto' },
  { id: 'texto_largo', label: 'Texto Largo' },
  { id: 'numero', label: 'Número' },
  { id: 'email', label: 'Email' },
  { id: 'telefono', label: 'Teléfono' },
  { id: 'si_no', label: 'Sí/No' },
  { id: 'opcion_unica', label: 'Opción Única' }
];
```

### 6.3 Opciones de Filtro (Sesiones)

```javascript
// Estados
const estadosOptions = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'en_progreso', label: 'En Progreso' },
  { id: 'completado', label: 'Completado' },
  { id: 'expirado', label: 'Expirado' }
];

// Resultados
const resultadosOptions = [
  { id: 'sin_evaluar', label: 'Sin Evaluar' },
  { id: 'aprobado', label: 'Aprobado' },
  { id: 'rechazado', label: 'Rechazado' }
];
```

---

## 📌 NOTAS IMPORTANTES

### Conversión de Datos en el Frontend

Cuando se guarda una pregunta, los datos "raw" se convierten:

```javascript
// keywords_raw (string) → keywords (array)
"react, vue, angular" → ["react", "vue", "angular"]

// opciones_raw (string con saltos de línea) → opciones (array)
"Opción 1\nOpción 2\nOpción 3" → ["Opción 1", "Opción 2", "Opción 3"]
```

### Tokens de Sesión

Los tokens son UUIDs generados por el backend. Ejemplo:
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Se usan en la URL para acceder al chat:
```
http://localhost:3000/chat/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Cálculo de Puntaje

```javascript
// Puntaje total = suma de todos los pesos
puntaje_total = pregunta1.peso + pregunta2.peso + ... + preguntaN.peso

// Puntaje obtenido = suma de pesos de preguntas correctas
puntaje_obtenido = suma de (pregunta.peso si es_correcta === true)

// Porcentaje
porcentaje = (puntaje_obtenido / puntaje_total) * 100

// Resultado
resultado = porcentaje >= umbral_aprobacion ? 'aprobado' : 'rechazado'
```

### Preguntas Eliminatorias

Si una pregunta tiene `es_eliminatoria = true` y el candidato falla:
- `resultado = 'rechazado'` inmediatamente
- No importa el puntaje obtenido en otras preguntas

---

**Documento generado el:** 2025-11-12
**Versión del Frontend:** Vue 3 + Vite + Pinia
**UI Kit:** uikit-3it-vue@1.0.0 (github:3itsoluciones/uikit-3it-vue#2.0.0)

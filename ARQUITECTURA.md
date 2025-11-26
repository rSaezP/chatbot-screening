# 🏗️ ARQUITECTURA TÉCNICA

## 📋 Índice
1. [Tipo de Arquitectura](#tipo-de-arquitectura)
2. [Decisiones y Justificaciones](#decisiones-y-justificaciones)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Flujo de Datos](#flujo-de-datos)
6. [Resumen de Implementación](#resumen-de-implementación)

---

## 🏛️ Tipo de Arquitectura

### **Monolito Modular + Clean Architecture + MVC**

```
┌────────────────────────────────────────┐
│     FRONTEND (Vue.js 3)               │
│     - SPA con Vue Router              │
│     - State: Pinia                    │
│     - UI: UI Kit 3IT                  │
└──────────────┬─────────────────────────┘
               │ HTTP/REST
               ↓
┌────────────────────────────────────────┐
│     BACKEND (Node.js + Express)       │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │   API Layer (Routes)             │ │
│  └────────┬─────────────────────────┘ │
│           │                            │
│  ┌────────▼─────────────────────────┐ │
│  │   Controllers (HTTP Handlers)    │ │
│  │   - Solo manejo req/res          │ │
│  │   - 10-20 líneas                 │ │
│  └────────┬─────────────────────────┘ │
│           │                            │
│  ┌────────▼─────────────────────────┐ │
│  │   Services (Business Logic)      │ │
│  │   - Lógica de negocio            │ │
│  │   - Orquestación                 │ │
│  │   - 50-200 líneas                │ │
│  └────────┬─────────────────────────┘ │
│           │                            │
│  ┌────────▼─────────────────────────┐ │
│  │   Repositories (Data Access)     │ │
│  │   - Solo queries SQL             │ │
│  │   - 20-50 líneas                 │ │
│  └────────┬─────────────────────────┘ │
│           │                            │
└───────────┼────────────────────────────┘
            │
            ↓
  ┌─────────────────┐    ┌──────────┐
  │  MySQL 8.4.6    │    │ OpenAI   │
  │  chatbot_       │    │ API      │
  │  screening      │    │ (opcional)│
  └─────────────────┘    └──────────┘
```

---

## 🤔 Decisiones y Justificaciones

### **1. Monolito vs Microservicios**

#### ❌ Microservicios (Descartado)

**Complejidad:**
- Múltiples servicios independientes
- API Gateway
- Service discovery
- Message queues
- Transacciones distribuidas

**Tiempo:** 4-6 semanas
**Costos:** Mayor infraestructura
**Debugging:** Complejo

#### ✅ Monolito Modular (Elegido)

**Simplicidad:**
- Un solo servidor
- Un deployment
- Transacciones ACID simples

**Tiempo:** 2 semanas
**Costos:** Un servidor
**Debugging:** Stack traces completos

**Modularidad:**
```
backend/src/modules/
├── chatbot/           # Módulo autocontenido
├── videoentrevistas/  # Futuro
└── ofertas/          # Futuro
```

**Migración futura:** Si escala, se puede extraer cada módulo a un microservicio.

---

### **2. Clean Architecture vs MVC Tradicional**

#### ❌ MVC Tradicional (Descartado)

```
backend/
├── controllers/
│   └── chatbot.controller.js    # 500+ líneas
│       ├─ Validaciones
│       ├─ Queries SQL
│       ├─ Lógica de negocio
│       └─ Respuestas HTTP
```

**Problemas:**
- Controllers gigantes
- Código duplicado
- Difícil de testear
- Alto acoplamiento

#### ✅ Clean Architecture (Elegido)

```
backend/src/modules/chatbot/
├── controllers/     # 10-20 líneas/archivo
├── services/        # 50-200 líneas/archivo
├── repositories/    # 20-50 líneas/archivo
└── validators/      # Específicas
```

**Ventajas:**
- Single Responsibility Principle
- Bajo acoplamiento
- Alto cohesión
- Testeable

---

### **3. Separación de Responsabilidades**

```
REQUEST
  ↓
ROUTE (1 línea)
  Define URL → Controller
  
  ↓
MIDDLEWARE (10-20 líneas)
  - Autenticación
  - Validación básica
  
  ↓
CONTROLLER (10-20 líneas)
  - Recibe req
  - Llama service
  - Maneja errores
  - Devuelve res
  
  ↓
SERVICE (50-200 líneas)
  - Lógica de negocio
  - Validaciones complejas
  - Orquestación
  
  ↓
REPOSITORY (20-50 líneas)
  - Solo SQL queries
  - CRUD básico
  
  ↓
DATABASE
```

**Ejemplo:**
```javascript
// Route
router.post('/sesiones', controller.crear);

// Controller
async crear(req, res) {
  const sesion = await service.crear(req.body);
  res.json({ data: sesion });
}

// Service
async crear(data) {
  const config = await configRepo.findById(data.configId);
  const token = this.generarToken();
  const id = await sesionRepo.insert({...});
  await emailService.enviar(...);
  return { id, token };
}

// Repository
async insert(data) {
  return await db.query('INSERT INTO ...', [data]);
}
```

---

## 🎨 Patrones de Diseño

### **1. Repository Pattern**
**Propósito:** Abstraer acceso a datos

```javascript
class SesionRepository {
  async findById(id) {
    return await queryHelper.findOne(
      'SELECT * FROM cb_sesiones WHERE id = ?', 
      [id]
    );
  }
}
```

**Ventaja:** Cambiar DB sin tocar lógica

---

### **2. Service Layer Pattern**
**Propósito:** Centralizar lógica de negocio

```javascript
class EvaluacionService {
  async evaluar(pregunta, respuesta) {
    const evaluator = EvaluatorFactory.get(pregunta.tipo);
    return await evaluator.evaluar(pregunta, respuesta);
  }
}
```

**Ventaja:** Reutilizable y testeable

---

### **3. Factory Pattern**
**Propósito:** Crear objetos dinámicamente

```javascript
class EvaluatorFactory {
  static get(tipo) {
    switch(tipo) {
      case 'regla_fija': return new ReglaFijaEvaluator();
      case 'ia': return new IAEvaluator();
      case 'manual': return new ManualEvaluator();
    }
  }
}
```

**Ventaja:** Extensible sin modificar código

---

### **4. Strategy Pattern**
**Propósito:** Algoritmos intercambiables

```javascript
// Diferentes estrategias de evaluación
class ReglaFijaEvaluator {
  evaluar(pregunta, respuesta) { /* Reglas */ }
}

class IAEvaluator {
  evaluar(pregunta, respuesta) { /* OpenAI */ }
}
```

**Ventaja:** Agregar evaluadores sin cambiar código

---

## 📁 Estructura de Carpetas

```
chatbot-screening/
│
├── backend/
│   ├── node_modules/           # Dependencias npm
│   │
│   ├── src/
│   │   │
│   │   ├── config/             # ⚙️ Configuración
│   │   │   ├── database.js     # Pool MySQL (Singleton)
│   │   │   └── testConnection.js
│   │   │
│   │   ├── modules/            # 📦 Módulos de dominio
│   │   │   └── chatbot/
│   │   │       │
│   │   │       ├── controllers/     # HTTP handlers
│   │   │       │   ├── config.controller.js
│   │   │       │   ├── sesion.controller.js
│   │   │       │   ├── mensaje.controller.js
│   │   │       │   └── evaluacion.controller.js
│   │   │       │
│   │   │       ├── services/        # Lógica de negocio
│   │   │       │   ├── config.service.js
│   │   │       │   ├── sesion.service.js
│   │   │       │   ├── mensaje.service.js
│   │   │       │   │
│   │   │       │   └── evaluacion/  # 🔥 Core
│   │   │       │       ├── evaluacion.service.js
│   │   │       │       ├── evaluators/
│   │   │       │       │   ├── ReglaFijaEvaluator.js
│   │   │       │       │   ├── IAEvaluator.js
│   │   │       │       │   └── ManualEvaluator.js
│   │   │       │       ├── validators/
│   │   │       │       │   ├── RangoValidator.js
│   │   │       │       │   ├── KeywordValidator.js
│   │   │       │       │   └── OpcionValidator.js
│   │   │       │       └── scoring.service.js
│   │   │       │
│   │   │       ├── repositories/    # Acceso a datos
│   │   │       │   ├── config.repository.js
│   │   │       │   ├── sesion.repository.js
│   │   │       │   ├── pregunta.repository.js
│   │   │       │   └── mensaje.repository.js
│   │   │       │
│   │   │       ├── models/          # Definiciones
│   │   │       │   ├── ChatbotConfig.js
│   │   │       │   ├── Pregunta.js
│   │   │       │   └── Sesion.js
│   │   │       │
│   │   │       ├── routes/          # Endpoints
│   │   │       │   ├── index.js
│   │   │       │   ├── config.routes.js
│   │   │       │   ├── sesion.routes.js
│   │   │       │   └── public.routes.js
│   │   │       │
│   │   │       ├── validators/      # Validaciones
│   │   │       │   ├── config.validator.js
│   │   │       │   └── sesion.validator.js
│   │   │       │
│   │   │       └── constants/       # Constantes
│   │   │           ├── tiposEvaluacion.js
│   │   │           └── estadosSesion.js
│   │   │
│   │   ├── shared/             # Código compartido
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.js
│   │   │   │   ├── errorHandler.middleware.js
│   │   │   │   └── validator.middleware.js
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── queryHelper.js   # Ejecutar queries
│   │   │       ├── logger.js
│   │   │       └── response.js
│   │   │
│   │   └── server.js           # Punto de entrada
│   │
│   ├── database/
│   │   ├── schema.sql          # Definición de tablas
│   │   └── runSchema.js        # Script para ejecutar
│   │
│   ├── .env                    # Variables de entorno
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                   # Vue.js (pendiente)
│   ├── src/
│   │   ├── modules/
│   │   │   └── chatbot/
│   │   ├── shared/
│   │   │   └── components/     # UI Kit 3IT
│   │   └── router/
│   └── package.json
│
└── docs/                       # Documentación
    ├── README.md
    └── ARQUITECTURA.md         # Este archivo
```

### **Explicación de Carpetas Clave:**

| Carpeta | Propósito | Líneas típicas |
|---------|-----------|----------------|
| **controllers** | Manejo HTTP (req → service → res) | 10-20 |
| **services** | Lógica de negocio, orquestación | 50-200 |
| **repositories** | Solo queries SQL | 20-50 |
| **validators** | Validaciones de datos | 20-100 |
| **models** | Definiciones de entidades | 50-100 |
| **routes** | Definición de endpoints | 1-2 por ruta |
| **middleware** | Auth, validación, logging | 20-50 |
| **utils** | Funciones auxiliares | 10-50 |
| **constants** | Enums, valores fijos | 10-30 |

---

## 🔄 Flujo de Datos

### **Caso de Uso: Crear Sesión de Chatbot**

```
1. HTTP POST /api/chatbot/sesiones
   Body: { candidatoId: 1, configId: 1 }
   
2. Route → sesionController.crear()

3. Controller (12 líneas):
   try {
     const sesion = await sesionService.crear(req.body);
     res.json({ success: true, data: sesion });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }

4. Service (60 líneas):
   a) Obtener config
      const config = await configRepo.findById(configId);
   
   b) Validar
      if (!config) throw new Error('Config no encontrada');
   
   c) Generar token
      const token = crypto.randomBytes(32).toString('hex');
   
   d) Calcular expiración
      const fechaExp = new Date();
      fechaExp.setDate(fechaExp.getDate() + config.duracion_dias);
   
   e) Crear sesión
      const id = await sesionRepo.insert({
        candidato_id: candidatoId,
        config_id: configId,
        token,
        fecha_expiracion: fechaExp,
        estado: 'pendiente'
      });
   
   f) Generar URL
      const url = `${process.env.FRONTEND_URL}/chatbot/${token}`;
   
   g) Enviar email
      await emailService.enviar(candidatoId, url);
   
   h) Retornar
      return { id, token, url };

5. Repository (15 líneas):
   async insert(data) {
     const sql = `
       INSERT INTO cb_sesiones 
       (candidato_id, config_id, token, fecha_expiracion, estado)
       VALUES (?, ?, ?, ?, ?)
     `;
     return await queryHelper.insert(sql, [
       data.candidato_id,
       data.config_id,
       data.token,
       data.fecha_expiracion,
       data.estado
     ]);
   }

6. QueryHelper (10 líneas):
   async insert(sql, params) {
     const pool = database.getPool();
     const [result] = await pool.execute(sql, params);
     return result.insertId;
   }

7. Database → MySQL

8. Response HTTP 200
   {
     "success": true,
     "data": {
       "id": 123,
       "token": "abc123...",
       "url": "https://.../chatbot/abc123"
     }
   }
```

---

## 📊 Resumen de Implementación

### **Fase Completada:**

1. ✅ **Setup del proyecto**
   - Carpeta `chatbot-screening` creada
   - Estructura backend/frontend/database

2. ✅ **Inicialización de Node.js**
   ```bash
   npm init
   npm install express mysql2 dotenv cors nodemon
   ```

3. ✅ **Configuración de MySQL**
   - Archivo `database.js` con pool de conexiones
   - Archivo `queryHelper.js` con funciones auxiliares
   - Script `testConnection.js` para pruebas

4. ✅ **Base de datos**
   - DB `chatbot_screening` creada
   - Conexión probada y funcionando (MySQL 8.4.6)

5. ✅ **Estructura modular**
   - Carpetas controllers/services/repositories creadas
   - Separación de responsabilidades definida

### **Próximo Paso:**

- Crear schema completo de base de datos (tablas)

---

## 🔑 Principios SOLID Aplicados

| Principio | Aplicación |
|-----------|------------|
| **S**ingle Responsibility | Cada clase/módulo una responsabilidad |
| **O**pen/Closed | Extensible sin modificar (Factory, Strategy) |
| **L**iskov Substitution | Evaluators intercambiables |
| **I**nterface Segregation | Interfaces pequeñas y específicas |
| **D**ependency Inversion | Dependencias en abstracciones (repos) |

---

**Documentación actualizada:** 8 de noviembre, 2025

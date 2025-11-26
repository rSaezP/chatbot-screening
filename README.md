# 🤖 Sistema de Chatbot de Screening - Documentación del Proyecto

## 📋 Índice
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Investigación: Análisis de Bizneo](#investigación-análisis-de-bizneo)
3. [Problema Identificado](#problema-identificado)
4. [Nuestra Solución Innovadora](#nuestra-solución-innovadora)
5. [Alcance del Proyecto](#alcance-del-proyecto)
6. [Features Innovadoras](#features-innovadoras)
7. [Ventajas Competitivas](#ventajas-competitivas)
8. [Stack Tecnológico](#stack-tecnológico)
9. [Requisitos del Sistema](#requisitos-del-sistema)
10. [Metodología de Trabajo](#metodología-de-trabajo)

---

## 📖 Descripción del Proyecto

Sistema de **chatbot conversacional para screening de candidatos** en procesos de reclutamiento. El sistema evalúa automáticamente a los candidatos mediante preguntas configurables, asigna puntajes, y determina si pasan a la siguiente etapa del proceso.

**Objetivo Principal:** Automatizar el 90% del trabajo de screening inicial, ahorrando horas de trabajo manual a los reclutadores.

---

## 🔍 Investigación: Análisis de Bizneo

### ¿Qué es Bizneo?
Bizneo HR es una plataforma de recursos humanos que incluye un módulo de chatbot para screening de candidatos.

### Funcionalidades de Bizneo (Documentadas)

**✅ Lo que SÍ tiene Bizneo:**
1. **Chatbot conversacional** - Interfaz de chat para hacer preguntas
2. **Configuración del asistente virtual:**
   - Personalización de avatar
   - Nombre del asistente
   - Idioma (español)
   - Colores personalizables (botones, conversación, fondo)
3. **Creación de preguntas:**
   - Campo de texto para la pregunta
   - Opción de añadir GIF o video explicativo
   - Tipos de campo (texto, párrafo, número, etc.)
   - Condiciones de cuándo mostrar la pregunta
4. **Gestión de respuestas:**
   - Checkbox para añadir información a la ficha del candidato
   - Almacenamiento de respuestas
5. **Plantillas de email:**
   - Asunto personalizable
   - Cuerpo con variables dinámicas ({{candidate_name}}, {{chatbot_url}}, etc.)
   - Envío automático de invitación
6. **Duración del enlace:** 2 días de validez configurables

### ❌ Lo que NO tiene Bizneo (Limitaciones identificadas):

1. **NO hay evaluación automática**
   - Los reclutadores deben revisar TODAS las respuestas manualmente
   - No asigna puntajes automáticos
   - No hay sistema de scoring

2. **NO hay filtrado automático**
   - No rechaza candidatos automáticamente
   - No hay preguntas eliminatorias
   - Todo requiere revisión humana

3. **NO hay notificaciones inteligentes**
   - No envía emails con resultados al reclutador
   - No hay alertas de candidatos aprobados/rechazados

4. **NO hay dashboard con métricas**
   - No muestra ranking de mejores candidatos
   - No hay estadísticas en tiempo real
   - No hay filtros inteligentes

5. **Proceso manual extremadamente tedioso:**
   - Para 50 candidatos, el reclutador debe:
     * Abrir 50 conversaciones una por una
     * Leer manualmente todas las respuestas
     * Copiar y pegar a ChatGPT web para evaluar
     * Cambiar el prompt cada vez según el perfil
     * Decidir manualmente quién pasa
   - **Resultado:** 5-8 horas de trabajo manual

---

## 🚨 Problema Identificado

### El Dolor del Reclutador con Bizneo:

```
Reclutador recibe 50 candidatos en Bizneo
    ↓
❌ Tiene que ABRIR UNO POR UNO (50 clics)
    ↓
❌ Leer todas las respuestas manualmente (10 min/candidato)
    ↓
❌ Copiar respuestas a ChatGPT web (tedioso)
    ↓
❌ Ajustar prompt cada vez según perfil (manual)
    ↓
❌ Decidir si pasa o no (sin criterios claros)
    ↓
😰 ¡8 HORAS de trabajo repetitivo!
```

### Citas textuales del cliente:
> "Los reclutadores deben ver todo uno por uno y si son varios candidatos... deben copiar las respuestas a ChatGPT para evaluar, pero el prompt se debe ir cambiando según el perfil. Es muy tedioso."

---

## ✨ Nuestra Solución Innovadora

### Sistema Híbrido: Evaluación Automática + Notificaciones Inteligentes

```
Candidato responde chatbot
    ↓
🤖 Sistema evalúa AUTOMÁTICAMENTE (reglas + IA opcional)
    ↓
📊 Calcula puntaje y decide: APROBADO/RECHAZADO
    ↓
📧 Email INMEDIATO al reclutador con resumen
    ↓
📈 Dashboard muestra ranking de mejores candidatos
    ↓
⏱️ ¡Ahorra 90% del tiempo! (30 min vs 8 horas)
```

---

## 🎯 Alcance del Proyecto

### Fase 1: Sistema Standalone (2 semanas)
**Objetivo:** Crear un sistema completo y funcional independiente del sistema en producción.

**Entregables:**
- ✅ Backend Node.js + Express con evaluación automática
- ✅ Frontend Vue.js con UI responsive
- ✅ Base de datos MySQL con todas las tablas
- ✅ Sistema de evaluación híbrido (reglas + IA opcional)
- ✅ Dashboard para reclutadores
- ✅ Sistema de notificaciones por email
- ✅ Documentación completa

**Restricción:** NO tocar el sistema en producción durante esta fase.

### Fase 2: Integración (1 semana)
**Objetivo:** Integrar el chatbot con el sistema de videoentrevistas existente.

**Tareas:**
- Agregar tablas a la base de datos existente
- Conectar módulos del chatbot al backend actual
- Integrar UI Kit 3IT en el frontend
- Configurar flujo completo: Postulación → Chatbot → Video → Evaluación

---

## 🚀 Features Innovadoras

### 1. 📧 **Notificaciones Automáticas Inteligentes**

#### Email al aprobar candidato:
```
✅ Nuevo candidato APROBADO

👤 Juan Pérez
📧 juan@email.com
⭐ Puntaje: 87/100

📋 RESUMEN RÁPIDO:
✅ Experiencia B2B: 5 años (cumple)
✅ Tecnologías: React, Node (cumple)
⚠️ Disponibilidad: 1 mes (aceptable)

💡 RECOMENDACIÓN: Avanzar a video entrevista

[Ver detalle completo] [Aprobar] [Rechazar]
```

#### Email al rechazar:
```
❌ Candidato NO cumple requisitos

👤 María González
⭐ Puntaje: 45/100

❌ RAZONES DE RECHAZO:
• Experiencia B2B: 0 años (requiere 2+)
• Título universitario: No (eliminatoria)

[Ver detalle] [Revisar manualmente]
```

### 2. 📊 **Dashboard Innovador con Métricas**

```
┌─────────────────────────────────────────────────────┐
│ 📊 RESUMEN HOY                                      │
│                                                     │
│  10 Candidatos nuevos                              │
│  ├─ ✅ 7 Aprobados automáticamente                 │
│  ├─ ❌ 2 Rechazados automáticamente                │
│  └─ ⚠️ 1 Requiere revisión manual                  │
│                                                     │
│  Puntaje promedio: 78/100                          │
│  Mejor candidato: Juan Pérez (92/100) ⭐           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🔥 CANDIDATOS TOP (Aprobados automáticamente)      │
│                                                     │
│  1. 👤 Juan Pérez        92/100 ⭐⭐⭐              │
│     [Invitar a video] [Ver perfil]                 │
│                                                     │
│  2. 👤 Ana López         87/100 ⭐⭐                │
│     [Invitar a video] [Ver perfil]                 │
└─────────────────────────────────────────────────────┘
```

### 3. 🤖 **Sistema de Evaluación Híbrido**

**80% Reglas Fijas (Sin IA):**
- Preguntas objetivas (años de experiencia, título, disponibilidad)
- Validación instantánea con reglas configurables
- Sin costos de API
- 100% predecible

**20% IA Opcional (Con GPT):**
- Solo para preguntas subjetivas complejas
- Prompt configurable UNA sola vez por perfil
- Se reutiliza para TODOS los candidatos
- Evaluación semántica inteligente

### 4. ⚙️ **Configuración Simple para Reclutadores**

```
Pregunta 1: "¿Años de experiencia en B2B?"
├─ Tipo: Número
├─ Evaluación: Regla fija
├─ Rango: 2-10 años
├─ Es eliminatoria: ✅ Sí
├─ Peso: 20 puntos
└─ Si no cumple → Rechazo automático + Email

Pregunta 2: "¿Qué tecnologías dominas?"
├─ Tipo: Texto
├─ Evaluación: Keywords
├─ Debe mencionar: react, node, python
├─ Mínimo: 2 de 3
├─ Peso: 15 puntos

Pregunta 3: "Cuéntanos sobre un proyecto complejo"
├─ Tipo: Texto largo
├─ Evaluación: IA (opcional)
├─ Criterios: "liderazgo, resultados medibles"
└─ Peso: 10 puntos
```

### 5. 📈 **Reportes Automáticos**

**Email semanal:**
```
📧 Resumen de la semana:
- 45 candidatos evaluados
- 30 aprobados (67%)
- 15 rechazados (33%)
- Mejor candidato: Juan Pérez (95/100)
- Tiempo ahorrado: 6 horas 🎉
```

### 6. 🔄 **Flujo Integrado con VideoEntrevistas**

```
1. Candidato postula → Estado: "nuevo"
2. Sistema genera chatbot automáticamente
3. Candidato responde → Evaluación automática
4. Si aprobado → Estado: "chatbot_aprobado"
5. Sistema envía invitación a video automáticamente
6. Candidato graba video
7. IA evalúa video (sistema existente)
8. Resultado final
```

---

## 🏆 Ventajas Competitivas

### Comparación: Bizneo vs Nuestro Sistema

| Feature | Bizneo | Nuestro Sistema |
|---------|--------|-----------------|
| Recopila respuestas | ✅ | ✅ |
| Chatbot conversacional | ✅ | ✅ |
| Personalización visual | ✅ | ✅ |
| **Evaluación automática** | ❌ | ✅ |
| **Puntaje automático** | ❌ | ✅ |
| **Email con resultado** | ❌ | ✅ |
| **Dashboard con ranking** | ❌ | ✅ |
| **Filtros inteligentes** | ❌ | ✅ |
| **Reportes automáticos** | ❌ | ✅ |
| **Preguntas eliminatorias** | ❌ | ✅ |
| **Scoring transparente** | ❌ | ✅ |
| **Ahorro de tiempo** | ❌ 0% | ✅ 90% |
| **Tiempo manual** | 8 horas | 30 min |

### ROI (Retorno de Inversión)

**Sin nuestro sistema (Bizneo):**
- 50 candidatos × 10 min/candidato = **8 horas de trabajo**
- Costo: $50/hora × 8 = **$400 por proceso**

**Con nuestro sistema:**
- Evaluación automática: 5 minutos
- Revisión de aprobados: 25 minutos
- Total: **30 minutos de trabajo**
- Costo: $50/hora × 0.5 = **$25 por proceso**

**Ahorro:** $375 por proceso (94% de reducción de costos)
**Tiempo ahorrado:** 7.5 horas por proceso

---

## 💻 Stack Tecnológico

### Backend
- **Node.js** v22.17.1 - Runtime JavaScript
- **Express.js** v5.1.0 - Framework web
- **MySQL** 8.4.6 - Base de datos relacional
- **mysql2** v3.15.3 - Driver MySQL con promises
- **dotenv** v17.2.3 - Variables de entorno
- **cors** v2.8.5 - Cross-Origin Resource Sharing
- **nodemon** v3.1.10 - Auto-reload en desarrollo
- **crypto** (nativo) - Generación de tokens seguros

### Frontend (Pendiente)
- **Vue.js** 3 - Framework progresivo
- **Vite** - Build tool moderno
- **Vue Router** - Navegación
- **Pinia** - State management
- **UI Kit 3IT** - Componentes de la empresa

### Base de Datos
- **MySQL** 8.4.6
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci
- **Engine:** InnoDB

### Servicios Externos (Opcional)
- **OpenAI API** - GPT-4 o GPT-3.5-turbo para evaluación IA
- **SendGrid/SMTP** - Envío de emails

---

## 🔧 Requisitos del Sistema

### Desarrollo
- **Sistema Operativo:** Windows 10/11 (con WSL2 Ubuntu 24.04)
- **Node.js:** v20+ (actualmente v22.17.1)
- **MySQL:** v8.0+
- **Git:** Para control de versiones
- **Editor:** Visual Studio Code (recomendado)

### Herramientas
- **MySQL Workbench** - Gestión de base de datos
- **PowerShell** - Terminal de Windows
- **Claude Code** - Asistente de desarrollo IA
- **Postman** (opcional) - Testing de APIs

### Credenciales
- Usuario MySQL: root
- Base de datos: chatbot_screening
- Puerto backend: 4000
- Puerto frontend: 5173 (pendiente)

---

## 🎯 Metodología de Trabajo

### Estrategia General: **Incremental y Cautela**

#### Principio 1: Desarrollo Standalone Primero
```
Fase 1: Sistema Independiente
├─ Desarrollar completamente
├─ Probar exhaustivamente
└─ Perfeccionar

Fase 2: Integración
├─ Sin tocar código en producción
├─ Agregar solo módulos nuevos
└─ Integración no invasiva
```

**Razón:** El sistema de videoentrevistas está en producción. NO podemos arriesgarnos a romper nada.

#### Principio 2: Trabajo en Equipo (Humano + IA)

**Roles:**
1. **Desarrollador (Romina):** 
   - Toma decisiones finales
   - Ejecuta comandos
   - Valida resultados
   
2. **Claude (Asistente):**
   - Proporciona arquitectura y mejores prácticas
   - Da instrucciones detalladas paso a paso
   - Documenta todo el proceso
   
3. **Claude Code (Terminal):**
   - Genera código
   - Crea archivos y estructura
   - Explica qué hace cada paso

**Flujo de Trabajo:**
```
Claude (yo) da instrucciones detalladas
    ↓
Romina las valida y decide continuar
    ↓
Romina ejecuta en Claude Code o manualmente
    ↓
Claude Code genera/ejecuta
    ↓
Romina verifica resultados
    ↓
Claude actualiza documentación
    ↓
Siguiente paso
```

#### Principio 3: Paso a Paso Sin Prisa 🐢

**Nunca:**
- ❌ Saltar pasos
- ❌ Asumir que algo funciona sin probarlo
- ❌ Continuar si algo falló
- ❌ Hacer cambios sin entender

**Siempre:**
- ✅ Confirmar cada paso
- ✅ Probar inmediatamente
- ✅ Documentar lo que funciona
- ✅ Hacer preguntas si algo no está claro

#### Principio 4: Documentación Continua

Este documento se actualiza **CONSTANTEMENTE** con:
- Cada decisión tomada y por qué
- Cada paso ejecutado y su resultado
- Problemas encontrados y cómo se resolvieron
- Código importante generado

---

## 📚 Documentación Técnica Complementaria

- [**ARQUITECTURA.md**](./ARQUITECTURA.md) - Tipo de arquitectura, patrones y estructura detallada
- [**API.md**](./API.md) - Documentación de endpoints (cuando esté lista)

---

## 🎉 Progreso Actual

**Última actualización:** 8 de noviembre, 2025

### ✅ Completado
1. Investigación de mercado (Bizneo)
2. Definición de alcance y objetivos
3. Setup del proyecto (carpeta chatbot-screening)
4. Inicialización de Node.js + dependencias instaladas
5. Configuración de conexión a MySQL (pool + queryHelper)
6. Base de datos `chatbot_screening` creada
7. Prueba de conexión exitosa (MySQL 8.4.6)

### 🔄 En Progreso
- Creación del schema de base de datos

### ⏳ Pendiente
- Implementación de módulos backend
- Desarrollo frontend Vue.js
- Sistema de evaluación
- Testing e integración

-- ============================================================================
-- SCHEMA DE BASE DE DATOS: CHATBOT DE SCREENING
-- Descripción: Sistema de chatbot para evaluar candidatos automáticamente
-- Base de datos: chatbot_screening
-- Engine: InnoDB
-- Charset: utf8mb4
-- ============================================================================

-- Usar la base de datos
USE chatbot_screening;

-- Eliminar tablas si existen (en orden inverso por dependencias)
DROP TABLE IF EXISTS cb_evaluaciones;
DROP TABLE IF EXISTS cb_mensajes;
DROP TABLE IF EXISTS cb_sesiones;
DROP TABLE IF EXISTS cb_preguntas;
DROP TABLE IF EXISTS cb_email_templates;
DROP TABLE IF EXISTS cb_config;
DROP TABLE IF EXISTS candidatos_temp;

-- ============================================================================
-- TABLA: cb_config
-- Descripción: Configuración de chatbots de screening
-- ============================================================================
CREATE TABLE cb_config (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del chatbot',

    -- Información básica
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre del chatbot',
    descripcion TEXT COMMENT 'Descripción del chatbot',
    categoria VARCHAR(100) COMMENT 'Categoría (ej: Técnico, Ventas, Marketing)',

    -- Configuración de evaluación
    duracion_dias INT DEFAULT 7 COMMENT 'Días para completar la evaluación',
    umbral_aprobacion DECIMAL(5,2) DEFAULT 70.00 COMMENT 'Porcentaje mínimo para aprobar (0-100)',

    -- Personalización del asistente
    nombre_asistente VARCHAR(100) DEFAULT 'Asistente Virtual' COMMENT 'Nombre del asistente',
    avatar_url VARCHAR(500) COMMENT 'URL del avatar del asistente',
    idioma VARCHAR(10) DEFAULT 'es' COMMENT 'Idioma del chatbot (es, en, etc)',

    -- Personalización visual
    color_botones VARCHAR(20) DEFAULT '#007bff' COMMENT 'Color hexadecimal de botones',
    color_conversacion VARCHAR(20) DEFAULT '#f8f9fa' COMMENT 'Color de fondo de conversación',
    color_fondo VARCHAR(20) DEFAULT '#ffffff' COMMENT 'Color de fondo principal',

    -- Mensajes personalizados
    mensaje_bienvenida TEXT COMMENT 'Mensaje de bienvenida al iniciar',
    mensaje_aprobado TEXT COMMENT 'Mensaje cuando el candidato aprueba',
    mensaje_rechazado TEXT COMMENT 'Mensaje cuando el candidato no aprueba',

    -- Estado
    activo BOOLEAN DEFAULT TRUE COMMENT 'Si el chatbot está activo',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',

    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Configuración de chatbots de screening';

-- ============================================================================
-- TABLA: cb_preguntas
-- Descripción: Preguntas del chatbot con configuración de evaluación
-- ============================================================================
CREATE TABLE cb_preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la pregunta',
    config_id INT NOT NULL COMMENT 'ID del chatbot al que pertenece',

    -- Contenido de la pregunta
    pregunta TEXT NOT NULL COMMENT 'Texto de la pregunta',
    descripcion TEXT COMMENT 'Descripción o instrucciones adicionales',
    media_url VARCHAR(500) COMMENT 'URL de imagen/video asociado a la pregunta',

    -- Configuración del campo de respuesta
    tipo_campo ENUM(
        'texto',
        'texto_largo',
        'numero',
        'email',
        'telefono',
        'url',
        'fecha',
        'si_no',
        'opcion_multiple',
        'opcion_unica'
    ) DEFAULT 'texto' COMMENT 'Tipo de campo para la respuesta',

    opciones JSON COMMENT 'Opciones para campos de selección (opcion_multiple, opcion_unica)',

    -- Validación básica
    requerida BOOLEAN DEFAULT TRUE COMMENT 'Si la pregunta es obligatoria',
    min_longitud INT COMMENT 'Longitud mínima de la respuesta (caracteres)',
    max_longitud INT COMMENT 'Longitud máxima de la respuesta (caracteres)',
    patron_validacion VARCHAR(500) COMMENT 'Regex para validar la respuesta',

    -- Configuración de evaluación
    metodo_evaluacion ENUM(
        'regla_fija',
        'ia_opcional',
        'manual'
    ) DEFAULT 'regla_fija' COMMENT 'Método para evaluar la respuesta',

    -- Reglas fijas de evaluación
    regla JSON COMMENT 'Configuración de reglas fijas (tipo, operador, valor, etc)',

    -- Evaluación con IA (opcional)
    usar_ia BOOLEAN DEFAULT FALSE COMMENT 'Si se debe usar IA para evaluar',
    prompt_ia TEXT COMMENT 'Prompt para la evaluación con IA',
    criterios_ia JSON COMMENT 'Criterios específicos para la evaluación con IA',

    -- Ponderación
    es_eliminatoria BOOLEAN DEFAULT FALSE COMMENT 'Si es una pregunta eliminatoria',
    peso DECIMAL(5,2) DEFAULT 1.00 COMMENT 'Peso de la pregunta en la evaluación (1-10)',

    -- Orden y estado
    orden INT DEFAULT 0 COMMENT 'Orden de presentación de la pregunta',
    activa BOOLEAN DEFAULT TRUE COMMENT 'Si la pregunta está activa',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',

    -- Claves foráneas
    FOREIGN KEY (config_id) REFERENCES cb_config(id) ON DELETE CASCADE,

    -- Índices
    INDEX idx_config_orden (config_id, orden),
    INDEX idx_metodo_evaluacion (metodo_evaluacion),
    INDEX idx_activa (activa)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Preguntas del chatbot';

-- ============================================================================
-- TABLA: candidatos_temp
-- Descripción: Tabla temporal para datos de candidatos en modo standalone
-- ============================================================================
CREATE TABLE candidatos_temp (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del candidato temporal',

    -- Datos personales
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre completo del candidato',
    email VARCHAR(255) NOT NULL COMMENT 'Email del candidato',
    telefono VARCHAR(50) COMMENT 'Teléfono de contacto',

    -- Datos profesionales
    cv_url VARCHAR(500) COMMENT 'URL del CV',
    linkedin_url VARCHAR(500) COMMENT 'URL de LinkedIn',

    -- Metadata
    metadata JSON COMMENT 'Datos adicionales del candidato',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',

    -- Índices
    UNIQUE INDEX idx_email (email),
    INDEX idx_nombre (nombre)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Candidatos temporales para modo standalone';

-- ============================================================================
-- TABLA: cb_sesiones
-- Descripción: Sesiones de evaluación de candidatos
-- ============================================================================
CREATE TABLE cb_sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la sesión',
    config_id INT NOT NULL COMMENT 'ID del chatbot utilizado',
    candidato_id INT COMMENT 'ID del candidato (puede ser NULL en modo standalone)',

    -- Token de sesión
    token VARCHAR(100) NOT NULL UNIQUE COMMENT 'Token único para acceder a la sesión',

    -- Estado de la sesión
    estado ENUM(
        'pendiente',
        'en_progreso',
        'completado',
        'expirado',
        'cancelado'
    ) DEFAULT 'pendiente' COMMENT 'Estado actual de la sesión',

    -- Resultado de la evaluación
    resultado ENUM(
        'aprobado',
        'rechazado',
        'pendiente_revision',
        'sin_evaluar'
    ) DEFAULT 'sin_evaluar' COMMENT 'Resultado final de la evaluación',

    puntaje_total DECIMAL(8,2) DEFAULT 0.00 COMMENT 'Puntaje total obtenido',
    porcentaje DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Porcentaje de aprobación (0-100)',

    -- Datos temporales del candidato (si no está registrado)
    candidato_nombre VARCHAR(255) COMMENT 'Nombre del candidato',
    candidato_email VARCHAR(255) COMMENT 'Email del candidato',
    candidato_telefono VARCHAR(50) COMMENT 'Teléfono del candidato',

    -- Control de tiempo
    fecha_expiracion DATETIME COMMENT 'Fecha de expiración de la sesión',
    fecha_inicio DATETIME COMMENT 'Fecha en que inició la sesión',
    fecha_completado DATETIME COMMENT 'Fecha en que completó la sesión',

    -- Metadata
    metadata JSON COMMENT 'Datos adicionales de la sesión',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',

    -- Claves foráneas
    FOREIGN KEY (config_id) REFERENCES cb_config(id) ON DELETE CASCADE,
    FOREIGN KEY (candidato_id) REFERENCES candidatos_temp(id) ON DELETE SET NULL,

    -- Índices
    UNIQUE INDEX idx_token (token),
    INDEX idx_config_estado (config_id, estado),
    INDEX idx_resultado (resultado),
    INDEX idx_candidato_email (candidato_email),
    INDEX idx_fecha_expiracion (fecha_expiracion)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sesiones de evaluación de candidatos';

-- ============================================================================
-- TABLA: cb_mensajes
-- Descripción: Registro de la conversación del chatbot
-- ============================================================================
CREATE TABLE cb_mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del mensaje',
    sesion_id INT NOT NULL COMMENT 'ID de la sesión',
    pregunta_id INT COMMENT 'ID de la pregunta (NULL si es mensaje del sistema)',

    -- Contenido del mensaje
    tipo ENUM(
        'sistema',
        'pregunta',
        'respuesta'
    ) NOT NULL COMMENT 'Tipo de mensaje',

    contenido TEXT NOT NULL COMMENT 'Contenido del mensaje',

    -- Metadata
    metadata JSON COMMENT 'Datos adicionales del mensaje',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',

    -- Claves foráneas
    FOREIGN KEY (sesion_id) REFERENCES cb_sesiones(id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES cb_preguntas(id) ON DELETE SET NULL,

    -- Índices
    INDEX idx_sesion_tipo (sesion_id, tipo),
    INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Mensajes de la conversación';

-- ============================================================================
-- TABLA: cb_evaluaciones
-- Descripción: Evaluaciones de respuestas de candidatos
-- ============================================================================
CREATE TABLE cb_evaluaciones (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la evaluación',
    sesion_id INT NOT NULL COMMENT 'ID de la sesión',
    pregunta_id INT NOT NULL COMMENT 'ID de la pregunta evaluada',
    mensaje_id INT COMMENT 'ID del mensaje de respuesta',

    -- Resultado de la evaluación
    cumple BOOLEAN NOT NULL COMMENT 'Si la respuesta cumple con los criterios',
    puntaje DECIMAL(8,2) DEFAULT 0.00 COMMENT 'Puntaje obtenido',
    razon TEXT COMMENT 'Razón de la evaluación',

    -- Detalles de la evaluación
    metodo_evaluacion ENUM(
        'regla_fija',
        'ia',
        'manual'
    ) NOT NULL COMMENT 'Método utilizado para evaluar',

    detalles JSON COMMENT 'Detalles adicionales de la evaluación (criterios, scores, etc)',

    -- Evaluador
    evaluador VARCHAR(100) COMMENT 'Quién evaluó (sistema, ia, usuario_id)',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de evaluación',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',

    -- Claves foráneas
    FOREIGN KEY (sesion_id) REFERENCES cb_sesiones(id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES cb_preguntas(id) ON DELETE CASCADE,
    FOREIGN KEY (mensaje_id) REFERENCES cb_mensajes(id) ON DELETE SET NULL,

    -- Índices
    INDEX idx_sesion (sesion_id),
    INDEX idx_pregunta (pregunta_id),
    INDEX idx_cumple (cumple),
    INDEX idx_metodo (metodo_evaluacion)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Evaluaciones de respuestas';

-- ============================================================================
-- TABLA: cb_email_templates
-- Descripción: Plantillas de email para notificaciones
-- ============================================================================
CREATE TABLE cb_email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la plantilla',
    config_id INT COMMENT 'ID del chatbot (NULL si es plantilla global)',

    -- Identificación de la plantilla
    codigo VARCHAR(100) NOT NULL COMMENT 'Código único de la plantilla (ej: invitacion, aprobado)',
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre descriptivo de la plantilla',
    descripcion TEXT COMMENT 'Descripción de cuándo se usa',

    -- Contenido del email
    asunto VARCHAR(500) NOT NULL COMMENT 'Asunto del email',
    cuerpo_html TEXT NOT NULL COMMENT 'Cuerpo del email en HTML',
    cuerpo_texto TEXT COMMENT 'Versión en texto plano',

    -- Variables disponibles
    variables_disponibles JSON COMMENT 'Lista de variables que se pueden usar (ej: {nombre}, {token})',

    -- Estado
    activa BOOLEAN DEFAULT TRUE COMMENT 'Si la plantilla está activa',

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',

    -- Claves foráneas
    FOREIGN KEY (config_id) REFERENCES cb_config(id) ON DELETE CASCADE,

    -- Índices
    UNIQUE INDEX idx_codigo_config (codigo, config_id),
    INDEX idx_activa (activa)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Plantillas de email';

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================

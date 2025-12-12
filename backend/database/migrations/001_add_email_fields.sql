-- Migración: Agregar campos de email y mensajes faltantes
-- Fecha: 2025-11-28
-- Descripción: Agrega campos email_reclutador, mensaje_finalizacion y smtp_config a cb_config

ALTER TABLE cb_config
ADD COLUMN email_reclutador VARCHAR(255) COMMENT 'Email del reclutador que recibirá los resultados' AFTER mensaje_rechazado,
ADD COLUMN mensaje_finalizacion TEXT COMMENT 'Mensaje de finalización después de completar' AFTER email_reclutador,
ADD COLUMN smtp_config JSON COMMENT 'Configuración SMTP personalizada (opcional)' AFTER mensaje_finalizacion;

-- Crear índice para email_reclutador
CREATE INDEX idx_email_reclutador ON cb_config(email_reclutador);

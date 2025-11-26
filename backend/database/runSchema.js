/**
 * Script para ejecutar el schema de la base de datos
 * Lee el archivo schema.sql y ejecuta todas las queries
 * Ejecutar con: npm run db:schema
 */

// Cargar variables de entorno
require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const { getPool, closePool } = require('../src/config/database');

/**
 * Lee el archivo schema.sql
 */
const leerSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    return schemaContent;
  } catch (error) {
    console.error('❌ Error al leer schema.sql:', error.message);
    throw error;
  }
};

/**
 * Divide el contenido SQL en queries individuales
 * Filtra comentarios y líneas vacías
 */
const dividirQueries = (sqlContent) => {
  // Eliminar comentarios de una línea (--) y múltiples líneas (/* */)
  let cleaned = sqlContent.replace(/--.*$/gm, ''); // Comentarios de línea
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, ''); // Comentarios de bloque

  // Dividir por punto y coma
  const queries = cleaned
    .split(';')
    .map(query => query.trim())
    .filter(query => query.length > 0 && !query.match(/^(USE|DROP|CREATE)\s+DATABASE/i));

  return queries;
};

/**
 * Ejecuta todas las queries del schema
 */
const ejecutarSchema = async () => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║          EJECUTANDO SCHEMA DE BASE DE DATOS              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📋 Configuración:');
  console.log(`   Base de datos: ${process.env.DB_NAME}`);
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Usuario: ${process.env.DB_USER}\n`);

  let pool = null;
  let connection = null;

  try {
    // Leer el archivo schema.sql
    console.log('📄 Leyendo archivo schema.sql...');
    const schemaContent = await leerSchema();
    console.log('✅ Archivo leído correctamente\n');

    // Dividir en queries individuales
    console.log('🔍 Procesando queries...');
    const queries = dividirQueries(schemaContent);
    console.log(`✅ ${queries.length} queries encontradas\n`);

    // Obtener pool de conexiones
    console.log('🔄 Conectando a la base de datos...');
    pool = await getPool();
    connection = await pool.getConnection();
    console.log('✅ Conexión establecida\n');

    // Ejecutar cada query
    console.log('⚙️  Ejecutando queries...\n');
    console.log('═'.repeat(60));

    let exitosas = 0;
    let fallidas = 0;

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];

      // Extraer el tipo de operación (DROP, CREATE, etc.)
      const operacion = query.match(/^(DROP|CREATE|ALTER|INSERT|UPDATE|DELETE|USE)\s+(\w+)/i);
      const tipoOperacion = operacion ? `${operacion[1]} ${operacion[2]}` : 'QUERY';

      try {
        // Mostrar progreso
        process.stdout.write(`[${i + 1}/${queries.length}] ${tipoOperacion}... `);

        // Ejecutar query
        await connection.query(query);

        console.log('✅');
        exitosas++;

      } catch (error) {
        console.log('❌');
        console.error(`   Error: ${error.message}\n`);
        fallidas++;

        // Si falla una tabla crítica, continuar con las demás
        if (error.code !== 'ER_TABLE_EXISTS_ALREADY') {
          console.log(`   Query problemática:\n   ${query.substring(0, 100)}...\n`);
        }
      }
    }

    console.log('═'.repeat(60));
    console.log();

    // Mostrar resumen
    console.log('📊 RESUMEN:');
    console.log(`   ✅ Queries exitosas: ${exitosas}`);
    console.log(`   ❌ Queries fallidas: ${fallidas}`);
    console.log(`   📈 Total: ${queries.length}\n`);

    // Verificar tablas creadas
    console.log('🔍 Verificando tablas creadas...\n');
    const [tables] = await connection.query(`
      SELECT TABLE_NAME, TABLE_ROWS, TABLE_COMMENT
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME]);

    if (tables.length > 0) {
      console.log('╔════════════════════════════════════════════════════════════════════════╗');
      console.log('║                        TABLAS CREADAS                                  ║');
      console.log('╠════════════════════════════════════════════════════════════════════════╣');

      tables.forEach((table, index) => {
        const numero = `${index + 1}.`.padEnd(4);
        const nombre = table.TABLE_NAME.padEnd(25);
        const comentario = (table.TABLE_COMMENT || 'Sin descripción').substring(0, 35);
        console.log(`║ ${numero}${nombre} - ${comentario.padEnd(35)} ║`);
      });

      console.log('╚════════════════════════════════════════════════════════════════════════╝\n');
    }

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║            ✅ SCHEMA EJECUTADO EXITOSAMENTE              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║            ❌ ERROR AL EJECUTAR SCHEMA                   ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.error('💥 Detalles del error:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Código: ${error.code || 'N/A'}\n`);

    console.log('📌 Posibles soluciones:');
    console.log('   1. Verifica que la base de datos exista');
    console.log('   2. Revisa los permisos del usuario MySQL');
    console.log('   3. Asegúrate de que el archivo schema.sql sea válido');
    console.log('   4. Verifica que no haya errores de sintaxis SQL\n');

    process.exit(1);

  } finally {
    // Liberar conexión y cerrar pool
    if (connection) {
      connection.release();
    }
    await closePool();
    console.log('👋 Proceso finalizado\n');
    process.exit(0);
  }
};

// Ejecutar el script
ejecutarSchema();

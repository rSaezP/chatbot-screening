/**
 * Script para probar la conexión a la base de datos MySQL
 * Ejecutar con: npm run test:db
 */

// Cargar variables de entorno
require('dotenv').config();

const { getPool, closePool, checkConnection } = require('./database');

/**
 * Función principal para probar la conexión
 */
const testDatabaseConnection = async () => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║          PRUEBA DE CONEXIÓN A BASE DE DATOS              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('📋 Configuración:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Usuario: ${process.env.DB_USER}`);
  console.log(`   Base de datos: ${process.env.DB_NAME}`);
  console.log(`   Puerto: ${process.env.DB_PORT || '3306 (default)'}\n`);

  try {
    // Intentar obtener el pool de conexiones
    console.log('🔄 Intentando conectar a MySQL...\n');
    const pool = await getPool();

    // Verificar la conexión
    const isConnected = await checkConnection();

    if (isConnected) {
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║            ✅ CONEXIÓN EXITOSA                           ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');

      // Obtener información del servidor MySQL
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT VERSION() as version');
      console.log(`📊 Versión de MySQL: ${rows[0].version}`);

      // Verificar que la base de datos existe
      const [databases] = await connection.query(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [process.env.DB_NAME]
      );

      if (databases.length > 0) {
        console.log(`✅ Base de datos "${process.env.DB_NAME}" encontrada`);

        // Obtener número de tablas
        const [tables] = await connection.query(
          'SELECT COUNT(*) as total FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?',
          [process.env.DB_NAME]
        );
        console.log(`📁 Número de tablas: ${tables[0].total}`);
      } else {
        console.log(`⚠️  Base de datos "${process.env.DB_NAME}" NO existe`);
        console.log('   Debes crearla antes de continuar');
      }

      connection.release();

    } else {
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║            ❌ CONEXIÓN FALLIDA                           ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
    }

  } catch (error) {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║            ❌ ERROR DE CONEXIÓN                          ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.error('💥 Detalles del error:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Código: ${error.code || 'N/A'}`);

    console.log('\n📌 Posibles soluciones:');
    console.log('   1. Verifica que MySQL esté ejecutándose');
    console.log('   2. Revisa las credenciales en el archivo .env');
    console.log('   3. Asegúrate de que la base de datos exista');
    console.log('   4. Verifica los permisos del usuario MySQL');
    console.log('   5. Confirma que el host y puerto sean correctos\n');

  } finally {
    // Cerrar el pool de conexiones
    await closePool();
    console.log('👋 Prueba finalizada\n');
    process.exit(0);
  }
};

// Ejecutar la prueba
testDatabaseConnection();

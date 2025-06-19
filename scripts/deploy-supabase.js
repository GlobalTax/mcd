const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando despliegue en Supabase...');

// Paso 1: Build de la aplicación
console.log('📦 Construyendo la aplicación...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completado');
} catch (error) {
  console.error('❌ Error en el build:', error.message);
  process.exit(1);
}

// Paso 2: Copiar archivos build a la función edge
console.log('📁 Copiando archivos a Supabase...');
const distPath = path.join(__dirname, '../dist');
const supabaseDistPath = path.join(__dirname, '../supabase/functions/serve/dist');

// Crear directorio si no existe
if (!fs.existsSync(supabaseDistPath)) {
  fs.mkdirSync(supabaseDistPath, { recursive: true });
}

// Copiar archivos
try {
  execSync(`cp -r "${distPath}"/* "${supabaseDistPath}/"`, { stdio: 'inherit' });
  console.log('✅ Archivos copiados');
} catch (error) {
  console.error('❌ Error copiando archivos:', error.message);
  process.exit(1);
}

// Paso 3: Desplegar en Supabase
console.log('🌐 Desplegando en Supabase...');
try {
  execSync('npx supabase functions deploy serve', { stdio: 'inherit' });
  console.log('✅ Función edge desplegada');
} catch (error) {
  console.error('❌ Error desplegando función:', error.message);
  process.exit(1);
}

// Paso 4: Aplicar migraciones
console.log('🗄️ Aplicando migraciones...');
try {
  execSync('npx supabase db push', { stdio: 'inherit' });
  console.log('✅ Migraciones aplicadas');
} catch (error) {
  console.error('❌ Error aplicando migraciones:', error.message);
  process.exit(1);
}

console.log('🎉 ¡Despliegue completado exitosamente!');
console.log('🌍 Tu aplicación está disponible en: https://ckvqfrppnfhoadcpqhld.supabase.co/functions/v1/serve'); 
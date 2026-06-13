/**
 * qrGenerator.js
 * Genera el código QR de tu web de aniversario.
 *
 * Uso:
 *   1. Edita la constante URL_DE_TU_PAGINA con la URL real después del despliegue.
 *   2. Ejecuta: node qrGenerator.js
 *   3. Se creará el archivo qr-aniversario.png en la raíz del proyecto.
 *
 * Instala la dependencia si no la tienes:
 *   npm install qrcode
 */

import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// ✏️  EDITA AQUÍ: Coloca la URL real después del despliegue
// ============================================================
const URL_DE_TU_PAGINA = 'https://TU-PROYECTO.vercel.app';
// Ejemplos:
//   Vercel:       'https://mi-aniversario.vercel.app'
//   Netlify:      'https://mi-aniversario.netlify.app'
//   GitHub Pages: 'https://tuusuario.github.io/mi-aniversario'
// ============================================================

async function generateQR() {
  if (URL_DE_TU_PAGINA.includes('TU-PROYECTO')) {
    console.error('❌  Por favor edita la variable URL_DE_TU_PAGINA en qrGenerator.js');
    console.error('   Coloca la URL real de tu página después del despliegue.');
    process.exit(1);
  }

  const outputPath = path.join(__dirname, 'qr-aniversario.png');

  await QRCode.toFile(outputPath, URL_DE_TU_PAGINA, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 1000,
    margin: 3,
    color: {
      dark: '#1a0d0d',
      light: '#f5ede0',
    },
  });

  console.log('✅  Código QR generado exitosamente:');
  console.log(`   📁 ${outputPath}`);
  console.log(`   🔗 URL codificada: ${URL_DE_TU_PAGINA}`);
  console.log('');
  console.log('   Ahora puedes imprimir o compartir el archivo qr-aniversario.png');
}

generateQR().catch((err) => {
  console.error('Error al generar el QR:', err);
  process.exit(1);
});

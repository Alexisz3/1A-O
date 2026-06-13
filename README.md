# 💌 Aniversario — Experiencia digital romántica

Una experiencia íntima y cinematográfica construida con React + Vite.
Pensada para abrirse desde un código QR en el celular.

---

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`

---

## ✏️ Cómo personalizar

### 1. Agregar el audio (poema)
Coloca tu archivo MP3 aquí:
```
public/
  audio/
    poema.mp3   ← tu archivo aquí
```

### 2. Agregar las fotos
Coloca tus imágenes aquí (JPG recomendado):
```
public/
  images/
    foto1.jpg
    foto2.jpg
    foto3.jpg
    foto4.jpg
    foto5.jpg
```
> Las fotos aparecerán en el orden del 1 al 5 mientras se desliza hacia abajo.

### 3. Editar la traducción del poema
Abre el archivo:
```
src/constants/content.js
```
Busca la constante `translatedPoem` y reemplaza el texto placeholder con la traducción completa del poema al español.

El texto admite párrafos separados por línea en blanco (doble salto de línea `\n\n`).

### 4. Editar el mensaje final
En el mismo archivo `src/constants/content.js`, edita:
- `finalMessage` — El mensaje principal al final de la experiencia
- `finalSignature` — La firma ("Con todo mi amor." u otro texto)
- `heroTitle` — El título principal ("Feliz Aniversario")
- `heroSubtitle` — El subtítulo breve de la primera pantalla
- `poemSectionTitle` — El título de la sección del poema

---

## 🌐 Despliegue

### Opción A: Vercel (recomendado — más simple)

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Instala la CLI: `npm install -g vercel`
3. Ejecuta en la raíz del proyecto: `vercel`
4. Sigue las instrucciones. Elige las opciones por defecto.
5. Tu URL pública será algo como: `https://tu-proyecto.vercel.app`

### Opción B: Netlify

1. Crea una cuenta en [netlify.com](https://netlify.com)
2. En el dashboard, arrastra la carpeta `dist/` (después de hacer `npm run build`)
3. O conecta tu repositorio de GitHub directamente.

### Opción C: GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Instala: `npm install -D gh-pages`
3. Agrega en `package.json`:
   ```json
   "homepage": "https://tuusuario.github.io/nombre-repo",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Ejecuta: `npm run deploy`

> **Nota importante para GitHub Pages:** si la app no carga en rutas secundarias,
> asegúrate de que el `base` en `vite.config.js` coincida con el nombre de tu repositorio:
> ```js
> base: '/nombre-de-tu-repo/'
> ```

---

## 🔲 Generar el código QR

Una vez que tengas la URL pública de tu página:

### Método 1: Script incluido (genera un PNG de alta calidad)

```bash
# Instalar la dependencia del generador
npm install qrcode

# Edita qrGenerator.js y coloca tu URL real en:
#   const URL_DE_TU_PAGINA = 'https://tu-proyecto.vercel.app'

# Generar el QR
node qrGenerator.js
```
Se creará el archivo `qr-aniversario.png` en colores dorado/oscuro.

### Método 2: Online (más rápido)
Pega tu URL en cualquiera de estos generadores:
- [qr-code-generator.com](https://www.qr-code-generator.com)
- [qrcode-monkey.com](https://www.qrcode-monkey.com)

---

## 📁 Estructura del proyecto

```
📦 PROYECTO 1 AÑO
├── public/
│   ├── audio/
│   │   └── poema.mp3          ← Coloca tu audio aquí
│   └── images/
│       ├── foto1.jpg          ← Coloca tus fotos aquí
│       ├── foto2.jpg
│       ├── foto3.jpg
│       ├── foto4.jpg
│       └── foto5.jpg
├── src/
│   ├── components/
│   │   ├── Hero.jsx           ← Primera pantalla
│   │   ├── Hero.css
│   │   ├── AudioPoem.jsx      ← Reproductor + poema traducido
│   │   ├── AudioPoem.css
│   │   ├── PhotoStory.jsx     ← Galería vertical de fotos
│   │   ├── PhotoStory.css
│   │   ├── FinalMessage.jsx   ← Mensaje de cierre
│   │   └── FinalMessage.css
│   ├── constants/
│   │   └── content.js         ← ✏️ TODOS los textos editables aquí
│   ├── hooks/
│   │   └── useScrollReveal.js ← Animaciones al hacer scroll
│   ├── App.jsx
│   ├── App.css
│   ├── index.css              ← Estilos globales y Google Fonts
│   └── main.jsx
├── index.html
├── qrGenerator.js             ← Script para generar el QR
├── vite.config.js
└── README.md
```

---

## 🎨 Paleta de colores

| Color | Valor | Uso |
|---|---|---|
| Negro cálido | `#0d0806` | Fondo principal |
| Vino profundo | `#3d1a1a` | Acentos de fondo |
| Dorado tenue | `#d4af37` | Ornamentos, líneas, detalles |
| Marfil | `#f5ede0` | Texto principal |
| Marfil suave | `rgba(245,237,224,0.65)` | Texto secundario |

---

## 📱 Optimización móvil

- Diseño mobile-first
- Primera pantalla a pantalla completa (`100svh`)
- Navegación exclusiva por scroll vertical
- Fuentes optimizadas para pantallas pequeñas
- El audio solo inicia con interacción del usuario (requerido por navegadores móviles)

---

*Hecho con amor. ✦*

// ============================================================
// ⚙️ CONFIGURACIÓN GLOBAL
// ============================================================
export const config = {
    partnerName: 'Jeimy', // ✏️ Reemplaza con su nombre
    anniversaryDate: '2025-06-14', // ✏️ Fecha real del aniversario (YYYY-MM-DD) para el contador
    startDate: '14 de junio de 2025', // Texto para mostrar
    endDate: '14 de junio de 2026', // Texto para mostrar
};

// ============================================================
// 📖 PORTADA (Hero)
// ============================================================
export const heroTitle = 'Un año de nosotros';
export const heroSubtitle = 'Guardé aquí un pedacito de todo lo que me haces sentir.';

// ============================================================
// 🎵 EL POEMA (Letras sincronizadas con audio/poema.mp3)
// ============================================================
export const poemSectionTitle = 'El poema';
export const poemAttribution = '— Fiódor Dostoyevski';

export const synchronizedLyrics = [
    { time: 0.05, text: 'In italiano diciamo: "Sono così fortunato ad averti nella mia vita."', translation: 'En italiano decimos: "Soy tan afortunado de tenerte en mi vida."' },
    { time: 5.15, text: "Ma Fëdor Dostoevskij scrisse:", translation: "Pero Fiódor Dostoyevski escribió:" },
    { time: 8.55, text: '"Non molto tempo fa non ci conoscevamo nemmeno,', translation: '"No hace mucho ni siquiera nos conocíamos,' },
    { time: 11.15, text: "eravamo solo due anime che camminavano senza vedersi.", translation: "éramos solo dos almas que caminaban sin verse." },
    { time: 14.40, text: "E poi un giorno, senza alcun preavviso,", translation: "Y luego un día, sin previo aviso," },
    { time: 16.80, text: "ci siamo ritrovati sullo stesso cammino.", translation: "nos encontramos en el mismo camino." },
    { time: 19.55, text: "E a volte dicono che certi encontri ti cambiano la vita.", translation: "Y a veces dicen que ciertos encuentros te cambian la vida." },
    { time: 23.10, text: "Questo è uno di quelli.", translation: "Este es uno de ellos." },
    { time: 24.55, text: "È strano, lo so.", translation: "Es extraño, lo sé." },
    { time: 25.75, text: "Più ti conosco,", translation: "Cuanto más te conozco," },
    { time: 26.90, text: "più dimentico com'era la mia vita senza di te.", translation: "más olvido cómo era mi vida sin ti." },
    { time: 29.30, text: "Mi rendi una persona migliore", translation: "Me haces una persona mejor" },
    { time: 30.90, text: "e per questo ti sono grato.", translation: "y por eso te estoy agradecido." },
    { time: 32.70, text: "Perché se amare è un errore,", translation: "Porque si amar es un error," },
    { time: 34.60, text: "allora che il mondo mi giudichi pure,", translation: "entonces que el mondo me juzgue," },
    { time: 36.70, text: 'e che io bruci per l\'eternità."', translation: 'y que yo arda por la eternidad."' }
];
// ============================================================
// ✨ 5 COSAS QUE AMO DE TI
// ============================================================
export const topThingsILove = [
    "Tu manera tan positiva de ver la vida.",
    "Tu risa tan agradable y serena que me calma el alma.",
    "Tus ojos color miel que me hipnotizan.",
    "Tus manos tan suaves como tus besos.",
    "Sobre todo amo tu alma tan llena de amor y bondad.",

    "Dios es tan grande que te puso en mi camino para hacerme feliz."
];

// ============================================================
// 📸 CAPÍTULOS DE NUESTRA HISTORIA (Memories)
// ============================================================
export const monthlyMemories = [
    {
        month: 'Mes 1',
        range: '14 de Junio 2025',
        title: 'Cuando todo empezó',
        cover: '/images/months-opt/junio2025/cover.jpg',
        description: 'No fue solo una fecha. Fue el inicio de una forma nueva de mirar la vida.',
        secret: 'Ese día no lo sabía, pero algo en mí ya te estaba eligiendo.',
        photos: [
            '/images/months-opt/junio2025/1.jpg',
            '/images/months-opt/junio2025/2.jpg',
            '/images/months-opt/junio2025/3.jpg'
        ]
    },
    {
        month: 'Mes 2',
        range: '14 de Julio 2025',
        title: 'Nuestras primeras risas',
        cover: '/images/months-opt/julio2025/cover.jpg',
        description: 'Te miraba y sabia que siempre habias sido tú.',
        secret: 'Me di cuenta de que tu risa era mi sonido favorito.',
        photos: [
            '/images/months-opt/julio2025/1.jpg',
            '/images/months-opt/julio2025/2.jpg',
            '/images/months-opt/julio2025/3.jpg',
            '/images/months-opt/julio2025/4.jpg'
        ]
    },
    {
        month: 'Mes 3',
        range: '14 de Agosto 2025',
        title: 'Caminar de la mano',
        cover: '/images/months-opt/agosto2025/cover.jpg',
        description: 'El mundo se siente bonito cuando entrelazamos nuestras manos.',
        secret: 'Nunca quiero soltarte.',
        photos: [
            '/images/months-opt/agosto2025/1.jpg',
            '/images/months-opt/agosto2025/2.jpg',
            '/images/months-opt/agosto2025/3.jpg',
            '/images/months-opt/agosto2025/4.jpg',
            '/images/months-opt/agosto2025/5.jpg',
            '/images/months-opt/agosto2025/6.jpg'
        ]
    },
    {
        month: 'Mes 4',
        range: '14 de Septiembre 2025',
        title: 'Tu forma de quedarte',
        cover: '/images/months-opt/septiembre2025/cover.jpg',
        description: 'No hay mejor remedio que estar con la persona que amas cuando estás enfermita.',
        secret: 'Tus chistes y tus locuras me dan vida.',
        photos: [
            '/images/months-opt/septiembre2025/1.jpg',
            '/images/months-opt/septiembre2025/2.jpg',
            '/images/months-opt/septiembre2025/3.jpg',
            '/images/months-opt/septiembre2025/4.jpg',
            '/images/months-opt/septiembre2025/5.jpg',
            '/images/months-opt/septiembre2025/6.jpg'
        ]
    },
    {
        month: 'Mes 5',
        range: '14 de Octubre 2025',
        title: 'Lo que cambió conmigo',
        cover: '/images/months-opt/octubre2025/cover.jpg',
        description: 'Contigo aprendí que el amor también vive en lo simple.',
        secret: 'Contigo el silencio nunca es incómodo.',
        photos: [
            '/images/months-opt/octubre2025/1.jpg',
            '/images/months-opt/octubre2025/2.jpg',
            '/images/months-opt/octubre2025/3.jpg',
            '/images/months-opt/octubre2025/4.jpg'
        ]
    },
    {
        month: 'Mes 6',
        range: '14 de Noviembre 2025',
        title: 'Días de frío y calientes',
        cover: '/images/months-opt/noviembre2025/cover.jpg',
        description: 'Aprendí que en los climas frios siempre encontraras calor en los brazos de tu persona favorita.',
        secret: 'Mi lugar favorito es a tu lado.',
        photos: [
            '/images/months-opt/noviembre2025/1.jpg',
            '/images/months-opt/noviembre2025/2.jpg',
            '/images/months-opt/noviembre2025/3.jpg',
            '/images/months-opt/noviembre2025/4.jpg',

        ]
    },
    {
        month: 'Mes 7',
        range: '14 de Diciembre 2025',
        title: 'Luces y promesas',
        cover: '/images/months-opt/diciembre2025/cover.jpg',
        description: 'Terminar el año de tu mano fue una experiencia muy bonita.',
        secret: 'Mi mayor deseo fuiste tú.',
        photos: [
            '/images/months-opt/diciembre2025/1.jpg',
            '/images/months-opt/diciembre2025/2.jpg',
            '/images/months-opt/diciembre2025/3.jpg',
            '/images/months-opt/diciembre2025/4.jpg',
            '/images/months-opt/diciembre2025/5.jpg',
            '/images/months-opt/diciembre2025/6.jpg'
        ]
    },
    {
        month: 'Mes 8',
        range: '14 de Enero 2026',
        title: 'Nuevos comienzos',
        cover: '/images/months-opt/enero2026/cover.jpg',
        description: 'Empezar el año de tu mano me dio la certeza de que sería un gran año.',
        secret: 'Cada día a tu lado es un regalo.',
        photos: [
            '/images/months-opt/enero2026/1.jpg',
            '/images/months-opt/enero2026/2.jpg',
            '/images/months-opt/enero2026/3.jpg',
            '/images/months-opt/enero2026/4.jpg',
            '/images/months-opt/enero2026/5.jpg'
        ]
    },
    {
        month: 'Mes 9',
        range: '14 de Febrero 2026',
        title: 'Nuestro mundo secreto',
        cover: '/images/months-opt/febrero2026/cover.jpg',
        description: 'Construimos chistes internos y miradas que solo nosotros entendemos.',
        secret: 'Mi Cuchurrumin.',
        photos: [
            '/images/months-opt/febrero2026/1.jpg',
            '/images/months-opt/febrero2026/2.jpg',
            '/images/months-opt/febrero2026/3.jpg',
            '/images/months-opt/febrero2026/4.jpg'
        ]
    },
    {
        month: 'Mes 10',
        range: '14 de Marzo 2026',
        title: 'Nuestros días pequeños',
        cover: '/images/months-opt/marzo2026/cover.jpg',
        description: 'Los días que no parecen importantes son los que más recuerdo.',
        secret: 'Compartimos la misma vibra.',
        photos: [
            '/images/months-opt/marzo2026/1.jpg',
            '/images/months-opt/marzo2026/2.jpg'
        ]
    },
    {
        month: 'Mes 11',
        range: '14 de Abril 2026',
        title: 'Miradas que hablan',
        cover: '/images/months-opt/abril2026/cover.jpg',
        description: 'A veces no necesitamos palabras, un cruce de miradas lo dice todo.',
        secret: 'En tus ojos encuentro paz mi chiquistriquis.',
        photos: [
            '/images/months-opt/abril2026/1.jpg',
            '/images/months-opt/abril2026/2.jpg',
            '/images/months-opt/abril2026/3.jpg',
            '/images/months-opt/abril2026/4.jpg'
        ]
    },
    {
        month: 'Mes 12',
        range: '14 de Mayo 2026',
        title: 'Hacia el futuro',
        cover: '/images/months-opt/mayo2026/cover.jpg',
        description: 'No sé a dónde vamos, pero sé que quiero ir contigo a todas partes.',
        secret: 'Mi amor. Este es solo el comienzo de nuestra historia.',
        photos: [
            '/images/months-opt/mayo2026/1.jpg',
            '/images/months-opt/mayo2026/2.jpg',
            '/images/months-opt/mayo2026/3.jpg',
            '/images/months-opt/mayo2026/4.jpg',
            '/images/months-opt/mayo2026/5.jpg'
        ]
    },
    {
        month: 'Mes 13',
        range: '14 de Junio 2026 - 1er Aniversario',
        title: 'Un año de nosotros',
        cover: '/images/months-opt/junio2026/cover.jpg',
        description: 'Doce meses de aprendizajes, de risas, de elegirnos todos los días.',
        secret: 'Gracias a ti y a Jehová por el mejor año de mi vida. ¡Feliz Aniversario!',
        photos: [
            '/images/months-opt/junio2026/1.jpg',
            '/images/months-opt/junio2026/2.jpg',
            '/images/months-opt/junio2026/3.jpg'
        ]
    }
];

// ============================================================
// 💌 MENSAJE FINAL
// ============================================================
export const replyMessage = `Eres todo para mí. Te agradezco tanto por estar en mi vida,
por acompañarme en los momentos difíciles y en los más bonitos,
estando siempre presente, justo en el instante correcto.

Me haces apreciar de verdad cada alegría, cada momento, cada instante y te agradezco porque,
gracias a ti, hoy tengo a Dios en mi corazón. Él se ha vuelto
el pilar fundamental que sostiene nuestra relación.

Sé que nos amamos con toda el alma y que nuestro respeto es inigualable.
Por eso y por todo lo que viene: Te amo, mi vida.`

export const finalPromise = 'Prometo cuidar lo nuestro incluso en los días simples.';
export const finalSignature = 'Con todo mi amor.';

// ============================================================
// 🤫 EASTER EGG (Secreto oculto)
// Mantener presionado el ícono final para revelarlo
// ============================================================
export const secretMessage = 'P.D. Y si te lo estabas preguntando... sí, sigo igual de enamorado que el primer día.';

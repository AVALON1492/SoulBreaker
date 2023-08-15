let showVersion = false;
class VERSION {
    constructor(release, features = false, issues = false, textFeatures = null, textIssues = null) {
        this.release = release;
        this.features = features;
        this.issues = issues;
        this.textFeatures = textFeatures;
        this.textIssues = textIssues;
        this.faxVersion = document.createElement("div");
        this.listNotes = document.createElement("ul");
    }

    show() {
        this.faxVersion.className = "boxFaxVersion";
        this.faxVersion.innerText = this.release;
        listVersions.appendChild(this.faxVersion);

        this.listNotes.className = "boxList";
        listVersions.appendChild(this.listNotes);

        if (this.features) {
            const idFeature = document.createElement("div");
            idFeature.className = "boxMisc"
            idFeature.innerText = "Mejoras / Cambios (" + this.textFeatures.length + ")"
            this.listNotes.appendChild(idFeature);
        }

        for(let i = 0; i < this.textFeatures.length; i++) {
            const list = document.createElement("li");
            list.innerHTML = this.textFeatures[i];
            this.listNotes.appendChild(list);
        }

        if (this.features && this.issues) {
            const line = document.createElement("hr");
            this.listNotes.appendChild(line);
        }

        if (this.issues) {
            const idIssue = document.createElement("div");
            idIssue.className = "boxMisc"
            idIssue.innerText = "Errores corregidos (" + this.textIssues.length + ")"
            this.listNotes.appendChild(idIssue);
        }

        for(let i = 0; i < this.textIssues.length; i++) {
            const list = document.createElement("li");
            list.innerHTML = this.textIssues[i];
            this.listNotes.appendChild(list);
        }
    }

    hide() {
        listVersions.removeChild(this.faxVersion);
        this.listNotes.innerText = "";
        listVersions.removeChild(this.listNotes);
    }
}

const versionActual = "Alpha 7"
vPrev.innerText = versionActual;
vPrev2.innerText = versionActual;

const listParches = [
    new VERSION("Alpha 7", true, true,
    ["Nuevo rediseño de la sección tutorial para los móviles sobre UX y nuevos tutoriales.",
    "Nueva accesibilidad para ajustes: Barras de desplazamientos, ideal para los móviles que tienen poco espacio. Por defecto, está deshabilitado.",
    "Nuevo logro incremental: Poder total.",
    "El poder total ya es funcional.",
    "Se ha agregado el funcionamiento para el atributo de producción de progreso.",
    "Balance: El entrenamiento de vitalidad, se ha reducido de 12 a 10 para conseguir puntos de entrenamiento mucho más fácil.",
    "Cambios de UI.",
    "Optimización del código."],
    ["Se ha corregido un error que el audio cargaba de forma anormal y lo cambié usando el autoplay para evitar peticiones excesivas.",
    "Se ha corregido un error grave que, al borrar los datos del juego, se ha experimentado un fallo en la barra de progreso donde decía NaN (Not a Number).",
    "Se ha corregido un error que, al cargar la cámara mientras salías de la pestaña del navegador, no se ha procesado correctamente la animación de bienvenida.",
    "Se ha corregido un error en los gestos táctiles para móviles en el entrenamiento de vitalidad y no responde correctamente su jugabilidad."]
    ),
    new VERSION("Alpha 6", true, true,
    ["Nuevo sistema de sonidos para una experiencia de mayor entretenimiento y diversión. Se han insertado 6 sonidos diferentes que probar.",
    "3 ajustes de sonidos agregados.",
    "Nuevo sección de entrenamiento.",
    "3 nuevos mecanismos del juego del entrenamiento (Potencia, Vitalidad y Dureza). La lealtad se implementará en la próxima versión.",
    "Funcionamiento de los atributos para la potencia de toque, la energía y el coste. El resto de ellos, se verán implementados en la próxima versión.",
    "Balance del juego: Ha subido la dificultad del progreso desde el exponencial sobre 1.4 a 1.5.",
    "Nuevas estadísticas generales y logros nuevos: Número de entrenamientos.",
    "Cambios de UI.",
    "El soporte del móvil lo tendrá que verificar el funcionamiento para lanzar una app como prueba. Se verificará en la próxima versión."],
    ["Otros errores corregidos."]
    ),
    new VERSION("Alpha 5", false, true,
    [],
    ["Tras la rotación de los móviles, ya no se reescalará el zoom de forma anormal, facilitándose a los usuarios tener menos interrupciones.",
    "Se ha deshabilitado el zoom automático para no provocar problemas de jugabilidad.",
    "Se han corregido la tasa de resolución mientras cambia de rotación para no causar problemas de rendimiento.",
    "Se ha corregido un efecto flash de carga y bienvenida para evitar aturdimientos de luz.",
    "Se ha corregido un error de que el bloqueo del menú lo tenía activado inicialmente. Ahora ya puedes tocar y desplazar la cámara del juego sin problemas tras iniciar el juego."]
    ),
    new VERSION("Alpha 4", true, false,
    ["Funcionamiento en la sección estadísticas agregado.",
    "Funcionamiento en la sección logros agregado y se han añadido 3 logros incrementales de 10 niveles.",
    "Funcionamiento en la sección tutorial agregado.",
    "Enlace Github agregado.",
    "Sistema de ventanas agregado.",
    "Sistema de notificaciones agregado.",
    "Se han añadido más información en la menú de perfil para ver cómo se trabajan los atributos.",
    "Nuevo recurso valioso: Alma gema.",
    "Mensaje de datos de protección agregado.",
    "En los ajustes, se ha ampliado la resolución mínima de 0.3 a 0.2 para el soporte de los móviles de gama baja.",
    "Mejoras de accesibilidad para el soporte de los móviles.",
    "Se ha añadido la detección del aspecto de pantalla horizontal para una mejor jugabilidad de los dispositivos.",
    "Mejoras de UI para móviles.",
    "Otros cambios de UI."],
    []
    ),
    new VERSION("Alpha 3", true, true,
    ["Nuevo botón atrás para volver al inicio. Eso ayuda a evitar la confusión a los usuarios de cómo volver al inicio.",
    "Nuevas mejoras de UI en la búsqueda de resultados.",
    "Cambios de la interfaz UI."],
    ["Por razones de seguridad, los iconos estaban encriptados que impiden cargar su petición. Para resolverlo, los iconos se vuelven integrados sin enviar la petición para poder cargar sin problemas.",
    "Se ha corregido los problemas de los trazados de luz por el exceso de brillo y la precisión del color.",
    "Otros pequeños errores corregidos."]
    ),
    new VERSION("Alpha 2", false, true,
    [],
    ["Se ha corregido de que los iconos de entrada no cargaban correctamente.",
    "Se ha corregido un grave error que no cargaban correctamente en la sección de versiones (A).",
    "Gracias a ese error corregido (A), se ha mejorado notablemente el rendimiento al accionar las entradas de secciones.",
    "Otros pequeños errores corregidos."]
    ),
    new VERSION("Alpha 1", false, false,
    ["Prelanzamiento del juego en público."],
    []
    )
];

goVersions.addEventListener("click", () => {
    showVersion = true;
    for (let i = 0; i < listParches.length; i++) {
        listParches[i].show();
    }
    listVersions.lastChild.style.marginBottom = "0px";
});

goMain.addEventListener("click", () => {
    if (showVersion) {
        showVersion = false;
        for (let i = 0; i < listParches.length; i++) {
            listParches[i].hide();
        }
    }
})
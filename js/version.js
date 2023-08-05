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

const versionActual = "Alpha 3"
vPrev.innerText = versionActual;
vPrev2.innerText = versionActual;

const listParches = [
    new VERSION("Alpha 3", true, true,
    ["Nuevo botón atrás para volver al inicio. Eso ayuda a evitar la confusión a los usuarios de cómo volver al inicio.",
    "Nuevas mejoras de UI en la búsqueda de resultados",
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
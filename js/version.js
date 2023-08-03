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

        if (this.issues) {
            const idIssue = document.createElement("div");
            idIssue.className = "boxMisc"
            idIssue.innerText = "Errores corregidos"
            this.listNotes.appendChild(idIssue);
        }

        if (this.features) {
            const idFeature = document.createElement("div");
            idFeature.className = "boxMisc"
            idFeature.innerText = "Mejoras"
            this.listNotes.appendChild(idFeature);
        }

        for(let i = 0; i < this.textFeatures.length; i++) {
            const list = document.createElement("li");
            list.innerHTML = this.textFeatures[i];
            this.listNotes.appendChild(list);
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

const alpha2 = new VERSION("Alpha 2", false, true,
[],
["Se ha corregido de que los iconos de entrada no cargaban correctamente.",
"Se ha corregido un grave error que no cargaban correctamente en la sección de versiones (A).",
"Gracias a ese error corregido (A), se ha mejorado notablemente el rendimiento al accionar las entradas de secciones.",
"Otros pequeños errores corregidos."]
);

const alpha1 = new VERSION("Alpha 1", false, false,
["Prelanzamiento del juego en público."],
[]
);

goVersions.addEventListener("click", () => {
    showVersion = true;
    alpha2.show();
    alpha1.show();
});

goMain.addEventListener("click", () => {
    if (showVersion) {
        showVersion = false;
        alpha2.hide();
        alpha1.hide();
    }
})
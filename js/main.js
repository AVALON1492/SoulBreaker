import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { color, float, vec2, texture, normalMap, uv, MeshPhysicalNodeMaterial } from 'three/nodes';
import { nodeFrame } from 'three/addons/renderers/webgl/nodes/WebGLNodes.js';
import { FlakesTexture } from 'three/addons/textures/FlakesTexture.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import CryptoJS from "crypto-js"

//

import {computePosition, offset, shift} from '@floating-ui/dom';

import Stats from 'three/addons/libs/stats.module'

const versionActual = "Alpha 8"
vPrev.innerText = versionActual;
vPrev2.innerText = versionActual;

const root = document.querySelector(":root");
const styleScrollBar = document.createElement("style");
let playAnimate = false;
let isVertical = window.innerWidth < window.innerHeight;
isVertical ? blockAspectRatioDetector.style.display = "flex" : blockAspectRatioDetector.style.display = "none";

let clock;
window.addEventListener("load", () => {
    clock = new THREE.Clock();
});

const packSettings = () => {
    return {
        soundAmbient: 100,
        soundInteract: 100,
        soundSystem: 100,
        resolution: 1,
        rotateDamp: 0.05,
        rotateSpeed: 1,
        rotateSpeedAuto: 1,
        zoomSpeed: 2,
        colorSelector: 1,
        search: true,
        scrollBar: false,
        clickSplash: true,
        clickText: true,
        antialias: false,
        statsFPS: false,
        bloom: false,
        image: false,
        render: false,
        terrain: false,
        terrainAnimation: true,
        shadow: false,
        control: false,
        rotation: true,
        notif: true,
        tool: true,
        toolWarn: true,
        toolTip: true,
        theme: false,
        glass: false
    }
}

export let gameSB;
const setNewGame = () => {
    gameSB = {
        codeGame: "Soul Breaker",
        version: versionActual,
        settings: packSettings(),
        data: {
            gemSoul: 0,
            valuePower: 0,
            valueHealth: 0,
            valueDef: 0,
            valueLea: 0,
            totalPower: 0,
            totalTime: 0,
            totalClicks: 0,
            totalEnergy: 0,
            totalTrain: 0,
            valueEnergy: 0,
            actualPeople: 0,
            lvlTotalClicks: 0,
            lvlTotalTime: 0,
            lvlTotalEnergy: 0,
            lvlTotalTrain: 0,
            lvlTotalPower: 0,
            lvlMain: 1,
            expMain: 0,
            combo: {
                power: 0,
                vita: 0,
                res: 0,
                lea: 0
            },
            comboStar: {
                power: 0,
                vita: 0,
                res: 0,
                lea: 0
            }
        }
    }
}

const setSettingDefault = () => {
    gameSB.settings = packSettings();
}

export let mainEXP;

setNewGame();

//TODO POP-UP WINDOW
const openWindow = (idWindow) => {
    tapeWindow.style.display = "block";
    idWindow.style.display = "flex";
    setTimeout(() => {
        audioNotif.autoplay = true;
        audioNotif.load();
        tapeWindow.style.opacity = "0.5";
        idWindow.style.scale = "1";
        idWindow.style.opacity = "1";
    }, 10)
}

const closeWindow = (idWindow) => {
    tapeWindow.style.opacity = "0";
    idWindow.style.scale = "0.8";
    idWindow.style.opacity = "0";
    setTimeout(() => {
        tapeWindow.style.display = "none";
        idWindow.style.display = "none";
    }, 310);
}

//TODO NOTIFICATION
let countNotif;
const pushNotification = (desc, type = "normal") => {
    countNotif = 0;
    const createNotif = document.createElement("div");
    if (type == "normal" && gameSB.settings["notif"]) {
        createNotif.className = "popUpNotification";
        audioNotif.autoplay = true;
        audioNotif.load();
    }

    if (type == "error") {
        createNotif.className = "popUpNotification errorNotif";
        audioNotifError.autoplay = true;
        audioNotifError.load();
    }

    if (type == "success" && gameSB.settings["notif"]) {
        createNotif.className = "popUpNotification successNotif";
        audioNotif.autoplay = true;
        audioNotif.load();
    }

    if (type == "process" && gameSB.settings["notif"]) {
        createNotif.className = "popUpNotification processNotif";
    }
    
    createNotif.innerText = desc;
    document.body.appendChild(createNotif);

    setTimeout(() => {
        for (let i = document.querySelectorAll(".popUpNotification").length - 1; i >= 0; i--) {
            document.querySelectorAll(".popUpNotification")[i].style.translate = "-50% calc(" + (countNotif * 72) + "px)";
            countNotif++;
        }
        countNotif = 0;
    }, 10);

    setTimeout(() => {
        createNotif.style.opacity = "0";
        createNotif.style.scale = "0.8";
    }, 5000);

    setTimeout(() => {
        countNotif--;
        createNotif.remove();
    }, 6000);
}

//TODO TIME
const showTimeStartMinute = (number, idText) => {
    const minute = number % 60;
    const hour = Math.floor(number / 60);
    const day = Math.floor(hour / 24);
    let isNoneTime = 3;
    idText.innerText = "";
    if (day != 0) {
        idText.innerText = day + "d "
        isNoneTime--;
    }
    if (hour != 0) {
        idText.innerText += hour + "h "
        isNoneTime--;
    }
    if (minute != 0) {
        idText.innerText += minute + "m"
        isNoneTime--;
    }

    (isNoneTime == 3) ? idText.innerText = "---" : null;
}

//TODO APARIENCIA
const createLight = document.createElement("div");
createLight.className = "pointLight";

document.addEventListener("mouseout", () => {
    createLight.style.display = "none";
})

document.querySelectorAll(".onPoint").forEach((object) => {
    object.addEventListener("mouseover", (e) => {
        e.target.appendChild(createLight);
        createLight.style.width = (e.target.offsetWidth * 1.5) + "px";
        createLight.style.height = (e.target.offsetWidth * 1.5) + "px";
        createLight.style.display = "inherit";
    })
});

document.addEventListener("mousemove", (e) => {
    const xPointer = e.offsetX - createLight.offsetWidth / 2;
    const yPointer = e.offsetY - createLight.offsetHeight / 2;

    createLight.style.transform = "translateX(" + xPointer + "px) translateY(" + yPointer + "px)"
});

//TODO SETTINGS
let settingSoundAmbient,
settingSoundInteract,
settingSoundSystem,
settingResolution,
settingRotateDamp,
settingRotateSpeed,
settingRotateSpeedAuto,
settingZoomSpeed,
settingColorSelector,
settingSearch,
settingScrollBar,
settingClickSplash,
settingClickText,
settingAntialias,
settingStatsFPS,
settingBloom,
settingImage,
settingRender,
settingTerrain,
settingTerrainAnimation,
settingShadow,
settingControl,
settingRotation,
settingNotif,
settingTool,
settingToolWarn,
settingToolTip,
settingTheme,
settingGlass;

class SETTINGS {
	constructor(valueObject) {
		this.valueObject = valueObject;
	}

    getValue() {
        return gameSB.settings[this.valueObject];
    }
}

class SETTINGSTOOGLE extends SETTINGS {
    constructor(button, valueObject, setFunctionOn, setFunctionOff) {
        super(valueObject);
        this.button = button;
        this.svgInput = button.children[0];
        this.textInput = button.children[2].children[0];
        this.setFunctionOn = setFunctionOn;
		this.setFunctionOff = setFunctionOff;
    }

    setToogle() {
        try {
            if (gameSB.settings[this.valueObject]) {
                this.setFunctionOn({svg: this.svgInput, text: this.textInput});
            } else {
                this.setFunctionOff({svg: this.svgInput, text: this.textInput});
            }
        } catch {}
	}

    changeSetting() {
        if (gameSB.settings[this.valueObject]) {
            gameSB.settings[this.valueObject] = false;
        } else {
            gameSB.settings[this.valueObject] = true;
        }

        this.setToogle();
    }

	setChange() {
		this.button.addEventListener("click", () => {
			this.changeSetting();
		})
	}

    setSettingToogle(boolean) {
        gameSB.settings[this.valueObject] = boolean;
        this.setToogle();
    }

    setOnUI(svgIcon = null) {
        if (svgIcon == null) {
            this.svgInput.style.opacity = 1;
        } else {
            this.svgInput.className = svgIcon + " subIcon"
        }
        this.textInput.innerText = "Encendido";
        this.textInput.style.color = "var(--onText)";
        this.textInput.style.background = "var(--on)";
        this.textInput.style.boxShadow = `0px 0px 0px 2px var(--onText),
                                          inset 0px 0px 0px 3px var(--on)`;
    }

    setOffUI(svgIcon = null) {
        if (svgIcon == null) {
            this.svgInput.style.opacity = 0.4;
        } else {
            this.svgInput.className = svgIcon + " subIcon"
        }
        this.textInput.innerText = "Apagado";
        this.textInput.style.color = "var(--offText)";
        this.textInput.style.background = "var(--off)";
        this.textInput.style.boxShadow = `0px 0px 0px 2px var(--offText),
                                          inset 0px 0px 0px 3px var(--off)`;
    }
}

class SETTINGSVALUE extends SETTINGS {
    constructor(button, textRanger = null, valueObject, functioner) {
        super(valueObject);
        this.button = button;
        this.textRanger = textRanger;
        this.functioner = functioner;
    }

    changeSetting(value) {
        if (value != undefined) {
            gameSB.settings[this.valueObject] = value;
        }
    }

    //RANGER
    setRanger() {
        const val = gameSB.settings[this.valueObject];
        this.textRanger.innerText = val;
        this.button.value = val;
        this.button.style.backgroundSize = (val - this.button.min) * 100 / (this.button.max - this.button.min) + "% 100%";
        return val;
    }

    ranger() {
        this.functioner(this.setRanger());
    }

    createRanger() {
        this.ranger();
    
        this.button.addEventListener("input", (e) => {
            this.changeSetting(e.target.value);
            this.ranger();
        })
    }

    resetRanger(idReset, setDefault) {
        idReset.addEventListener("click", () => {
            this.changeSetting(setDefault);
            this.ranger();
        });
    }

    //DROPDOWN
    droper() {
        const val = gameSB.settings[this.valueObject];
        this.functioner(val, this.button, this.textRanger);
    }

    createDropDown() {
        for(let i = 0; i < this.button.children.length; i++) {
            this.button.children[i].value = i;
        }

        this.droper();

        this.button.addEventListener("click", (e) => {
            this.changeSetting(e.target.value);
            this.droper();
        })
    }
}

class SETTINGSARRAY extends SETTINGS {
    constructor(valueObject) {
        super(valueObject);
    }

    changeSetting(value) {
        if (value != undefined) {
            gameSB.settings[this.valueObject] = value;
        }
    }
}

let firstStartup = true;
function init() {
const settingColor = new SETTINGSARRAY("color");

//AUTOSETTINGS
let colorLight = 90;
let valueShadersTerrain = 12;
const changeMaterial = () => {
    materialTerrain.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + (settingColor.getValue()[2] - (valueShadersTerrain)) + "%)");
}

const changeScene = () => {
    scene.background = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + colorLight + "%)");
    scene.fog.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + colorLight + "%)");
}

//TODO POSTPROCESSING
//EFECTO BLOOM
const bloomPass = new UnrealBloomPass(new THREE.Vector2(1024, 1024));

//
//TODO FUNCTIONS
//

settingNotif = new SETTINGSTOOGLE(buttonNotif, "notif",
    () => {
        settingNotif.setOnUI("fi-rr-bell");
    },
    () => {
        settingNotif.setOffUI("fi-rr-bell-slash");
    }
)
settingNotif.setChange();

//TODO AUDIO
document.addEventListener("click", () => {
    audioAmbient.play();
    audioClick.autoplay = true;
    audioClick.load();
});

audioAmbient.loop = true;

settingSoundAmbient = new SETTINGSVALUE(rangeSoundAmbient, textSoundAmbient, "soundAmbient",
    (value) => {
        audioAmbient.volume = value / 100;
    }
);
settingSoundAmbient.createRanger();

settingSoundInteract = new SETTINGSVALUE(rangeSoundInteract, textSoundInteract, "soundInteract",
    (value) => {
        audioClick.volume = value / 100;
    }
);
settingSoundInteract.createRanger();

settingSoundSystem = new SETTINGSVALUE(rangeSoundSystem, textSoundSystem, "soundSystem",
    (value) => {
        audioNotif.volume = value / 100;
        audioEye.volume = value / 100;
        audioScore.volume = value / 100;
        audioGameOver.volume = value / 100;
    }
);
settingSoundSystem.createRanger();

//TODO SELECT
//SELECT SUBMENU MAIN
const showSearch = () => {
    textSearch.style.opacity = 1;
    textSearch.style.pointerEvents = "inherit";
    buttonEraseSearch.style.opacity = 1;
    buttonEraseSearch.style.pointerEvents = "inherit";
    iconSearch.style.transform = "translateX(0px)";
    titleId.style.opacity = 0;
}

const hideSearch = () => {
    textSearch.style.opacity = 0;
    textSearch.style.pointerEvents = "none";
    buttonEraseSearch.style.opacity = 0;
    buttonEraseSearch.style.pointerEvents = "none";
    iconSearch.style.transform = "translateX(-54px)";
    titleId.style.opacity = 1;
    textSearch.value = "";
    searchIndex();
}

const showIndex = () => {
    textIndex.style.opacity = 1;
    textIndex.style.pointerEvents = "inherit";
    titleId.style.opacity = 0;
}

const hideIndex = () => {
    textIndex.style.opacity = 0;
    textIndex.style.pointerEvents = "none";
    titleId.style.opacity = 1;
}
hideIndex();

let auxMenu = null;
const goMenu = (idEvent, menu, name, className) => {
    idEvent.addEventListener("click", () => {
        goMain.style.pointerEvents = "inherit";
        goMain.style.opacity = 1;
        goNext.style.opacity = 1;
        svgNextIn.className = "svgIconIn " + className;
        svgNext.style.transform = "scale(1) rotateZ(0deg)";
        nextText.style.transform = "translateX(0px)";
        nextText.innerText = name;
        menu.style.display = "inherit";
        setTimeout(() => {
            menu.style.transform = "translateX(0px)";
            menu.style.opacity = 1;
        }, 100);
        mainMenu.style.transform = "translateX(-200px)";
        mainMenu.style.opacity = 0;
        setTimeout(() => {
            mainMenu.style.display = "none";
        }, 250)
        iconHome.style.opacity = 0.4;
        iconHome.style.scale = 0.8;
        auxMenu = menu;
    });
}

goMenu(goSettings, menuSettings, "Configuración", "mainHomeSvg");
goMenu(goStats, menuStats, "Estadísticas", "statsSvg");
goMenu(goAward, menuAward, "Logros", "awardSvg");
goMenu(goTutorial, menuTutorial, "Tutorial", "tipSvg");
goMenu(goAbout, menuAbout, "Acerca de", "aboutSvg");
goMenu(goVersions, menuVersions, "Versiones", "versionSvg");

goSettings.addEventListener("click", () => {
    if (settingSearch.getValue()) {
        showSearch();
    }
});

goTutorial.addEventListener("click", () => {
    showIndex();
})

goMain.addEventListener("click", () => {
    goMain.style.pointerEvents = "none";
    goMain.style.opacity = 0;
    goNext.style.opacity = 0;
    svgNext.style.transform = "scale(0) rotateZ(-45deg)";
    nextText.style.transform = "translateX(-200px)";
    auxMenu.style.transform = "translateX(200px)";
    auxMenu.style.opacity = 0;
    setTimeout(() => {
        auxMenu.style.display = "none";
    }, 250)
    mainMenu.style.display = "grid";
    setTimeout(() => {
        mainMenu.style.transform = "translateX(0px)";
        mainMenu.style.opacity = 1;
    }, 100);
    iconHome.style.opacity = 1;
    iconHome.style.scale = 1;
    hideSearch();
    hideIndex();
});

//SELECT SUBMENU PERFIL
const inTrainMenu = (toogle) => {
    if (toogle) {
        document.querySelectorAll(".iconCardStats").forEach((object) => {
            object.style.pointerEvents = "inherit";
        })
    } else {
        document.querySelectorAll(".iconCardStats").forEach((object) => {
            object.style.pointerEvents = "none";
        })
    }
}

let auxMenuPerfil = boxPerfilStats;
let auxFunc = null;
let auxOrder = 0;
let auxMenuTrain = menuNoneTrain;
let auxCardTrain = null;
const goPerfilMenu = (idEvent, menu, name, className, order, func = null) => {
    idEvent.addEventListener("click", () => {
        if (auxOrder != order) {
            svgNextInPerfil.className = className + " center";
            nextTextPerfil.innerText = name;
            if (auxOrder > order) {
                auxMenuPerfil.style.translate = "calc(100% + 80px)";
            } else {
                auxMenuPerfil.style.translate = "calc(-100% - 80px)";
            }

            const caller = func;
            if (caller != null) {
                caller(true);
            }

            if (auxFunc != null) {
                auxFunc(false);
            }

            if (auxCardTrain != null) {
                auxCardTrain.parentElement.className = "cardStats";
                auxCardTrain.parentElement.style.rotate = "0deg";
                auxCardTrain.parentElement.style.scale = "1";
            }
            menuStatsTrain.style.display = "none";
            menuNoneTrain.style.display = "flex";

            menu.style.translate = "0px";
            auxOrder = order;
            auxFunc = func;
            auxMenuPerfil = menu;
            auxCardTrain = null;
        }
    });
}

goPerfilMenu(openStats, boxPerfilStats, "Estadísticas", "fi-rr-chart-histogram", 0);
goPerfilMenu(openTrain, boxPerfilTrain, "Entrenamiento", "fi-rr-bullseye-arrow", 1, inTrainMenu);

const goMenuTrain = (idEvent, statsTitle, valueCombo, iconStats, textColor, boxColor, colorShadow, textDesc) => {
    idEvent.addEventListener("click", () => {
        if (auxCardTrain != idEvent && auxCardTrain != null) {
            auxCardTrain.parentElement.className = "cardStats";
            auxCardTrain.parentElement.style.rotate = "0deg";
            auxCardTrain.parentElement.style.scale = "1";
        }
        
        idEvent.parentElement.className = "cardStats " + colorShadow;
        idEvent.parentElement.style.rotate = "4deg";
        idEvent.parentElement.style.scale = "0.9";
        auxCardTrain = idEvent;

        menuStatsTrain.style.display = "flex";
        menuNoneTrain.style.display = "none";
        textStats.innerText = statsTitle;
        infoRecordCombo.innerText = "Récord: " + gameSB.data.combo[valueCombo];
        textComboMax.innerText = "Récord: " + gameSB.data.combo[valueCombo];
        infoRecordStars.innerText = "Récord: " + gameSB.data.comboStar[valueCombo];
        textComboStarsMax.innerText = "Récord stars: " + gameSB.data.comboStar[valueCombo];
        descStats.innerHTML = textDesc;
        goPlay.value = statsTitle;

        idIconStats.className = "iconStats " + iconStats;
        textStats.className = textColor;
        goPlay.className = "fi-rr-play boxStart center " + boxColor;
    })
}

goMenuTrain(openPower, "Potencia", "power", "statsSvgPower", "redLetter", "red", "redShadow",
"<b>Toca discos:</b> Pulsa los discos y las estrellas para ganar puntos. Los combos se resetean cuando el disco o estrella desaparece sin tocar."
);
goMenuTrain(openVita, "Vitalidad", "vita", "statsSvgVita", "greenLetter", "green", "greenShadow",
"<b>La habitación nocturna:</b> Usa la linterna pulsando el gran círculo para encender y apagar. Cuando está iluminado y sus ojos están dormidos, puedes recoger los discos y las estrellas. En caso de que los ojos preparan para despertar, apaga las luces para evitar ser pillado. Una vez pillado, pierdes la partida."
);
goMenuTrain(openRes, "Dureza", "res", "statsSvgRes", "blueLetter", "blue", "blueShadow",
"<b>Invasión circular:</b> Protege el alma bloqueando los objetos arrojados y recoge las estrellas sin distraer. De lo contrario, los combos se resetean."
);
goMenuTrain(openLea, "Lealtad", "lea", "statsSvgLea", "yellowLetter", "yellow", "yellowShadow",
"<b>Simón Dice (Juego creado por Ralph Baer y Howard J. Morrison en 1978):</b> Memoriza los cuadrantes que aparecen iluminados seguidos en orden. Si aciertas la ronda, consigues una estrella con 5 puntos de combo (7 si no tiene sonido) y se responderá con una secuencia más larga. Para salir del juego (El botón de salida no está mientras dure el juego), pulsa una cuadrante errónea."
);

//MENU SYSTEM
let auxIdEvent = null;
let auxGoMenu = null;
let isOpenMenu = false;
const closeMenuAnimation = () => {
    auxIdEvent.style.opacity = 1;
    auxIdEvent.style.pointerEvents = "inherit";
    auxGoMenu.style.display = "none";
}

const closeMenu = (idEvent, typeEvent = "mousedown") => {
    idEvent.addEventListener(typeEvent, () => {
        taskHome.style.borderRadius = "42px";
        home.style.transition = "0.3s"
        home.style.translate = "0px 62px";
        home.style.opacity = 0;
        home.style.pointerEvents = "none";
        isOpenMenu = false;

        if (auxIdEvent != null) {
            closeMenuAnimation();
        }
        
        blockContent.style.display = "none";
        auxIdEvent = null;
    });
}

closeMenu(blockContent);
closeMenu(blockTask);

const goOpen = (idEvent, menu, hasExit = false) => {
    idEvent.addEventListener("click", () => {
        taskHome.style.borderRadius = "16px 16px 42px 42px";
        home.style.transition = "0.5s cubic-bezier(0,1.5,.3,1)"
        home.style.translate = "0px 0px";
        home.style.opacity = 1;
        home.style.pointerEvents = "inherit";

        if (!hasExit) {
            idEvent.style.opacity = 0;
            idEvent.style.pointerEvents = "none";
        } else {
            taskHome.style.width = "640px";
            openHome.style.display = "flex";
            openProfile.style.display = "flex";
            openProfile.style.opacity = 0;
            openProfile.style.pointerEvents = "none";
            exiterTrain.style.display = "none";
            statsTrain.style.display = "none";
            statsInfoTask.style.display = "flex";
            timeInfoTask.style.display = "none";
            setTimeout(() => {
                updateStats();
            }, 500)
        }
        
        menu.style.display = "flex";
        blockContent.style.display = "block";
        isOpenMenu = true;

        if (auxIdEvent != null) {
            closeMenuAnimation();
        }

        if (!hasExit) {
            auxGoMenu = menu;
            auxIdEvent = idEvent;
        } else {
            auxGoMenu = profileMenu;
            auxIdEvent = openProfile;
        }
    });
}

goOpen(openHome, startMenu);
goOpen(openProfile, profileMenu);
goOpen(exiterTrain, profileMenu, true);

closeMenu(goPlay, "click");

const startTrain = (idEvent) => {
    idEvent.addEventListener("click", () => {
        taskHome.style.width = "400px";
        openHome.style.display = "none";
        openProfile.style.display = "none";
        exiterTrain.style.display = "flex";
        statsTrain.style.display = "flex";
        statsInfoTask.style.display = "none";
        timeInfoTask.style.display = "flex";
    });
}

startTrain(goPlay);

window.addEventListener("resize", () => {
    renderer.setPixelRatio( window.devicePixelRatio * settingResolution.getValue() );

    if (window.innerHeight < 885) {
        home.style.height = "calc(" + window.innerHeight + "px - 165px)";
    } else {
        home.style.height = "calc(720px)";
    }
})

//TODO PAGE
let page = 1;
const pageLimit = 5;

const setPage = (page) => {
    switch (page) {
        case 1:
            infoIndexTut.innerText = page + " > Bienvenida del tutorial";
            idDescTut.innerText = "Te damos la bienvenida a este tutorial para recomendarte a jugar con experiencias sin problemas. Este juego consiste en una plataforma idle basado de un mundo relajante 3D con colores. Pero hay una manera más divertida y activa para no quedarse aburrido, introduciremos unos nuevos mecanismos del juego, a dificultad incremental. A continuación, veremos las siguientes indicaciones que vamos a aprender.";
            titleTut.innerText = "Bienvenida del tutorial";
            imgTut.className = "boxImg tut1Png";
            break;
        case 2:
            infoIndexTut.innerText = page + " > Barra de tareas";
            idDescTut.innerText = "En la barra de tareas, tienen 3 aspectos: en la izquierda indica el menú del inicio; en el centro es la información simplificada del alma; y en la derecha, menú del perfil.";
            titleTut.innerText = "Barra de tareas";
            imgTut.className = "boxImg tut2Png";
            break;
        case 3:
            infoIndexTut.innerText = page + " > Inicio";
            idDescTut.innerText = "En el menú del inicio, se observan 6 sección: la configuración del juego; sus estadísticas, información detallado del juego; los logros, objetivos que recompensan almas gemas; el tutorial, donde has entrado esta sección; el Acerca de, información del juego y desarrollador; y la versión, registros de mejoras y parches de errores.";
            titleTut.innerText = "Inicio";
            imgTut.className = "boxImg tut3Png";
            break;
        case 4:
            infoIndexTut.innerText = page + " > Perfil > Estadísticas";
            idDescTut.innerText = "En el menú del perfil, se observan que, en la parte superior, presentan los 4 atributos del alma: Potencia, Vitalidad, Dureza y Lealtad. Y en la parte inferior, están en la información de estadísticas del alma, en la sección estadísticas. Debajo de ahí, están en la barra del perfil para navegar. Nota: pásate al cursor o al dedo encima de los elementos para ver más información.";
            titleTut.innerText = "Perfil > Estadísticas";
            imgTut.className = "boxImg tut4Png";
            break;
        case 5:
            infoIndexTut.innerText = page + " > Perfil > Entrenamiento";
            idDescTut.innerText = "En el entrenamiento, en la parte inferior, hay un mensaje que está diciendo que debes escoger los atributos centrados en el icono en la parte superior del perfil. A continuación, se muestra información del entrenamiento que explica cómo se entrena.";
            titleTut.innerText = "Perfil > Entrenamiento";
            imgTut.className = "boxImg tut5Png";
            break;
    }
}

setPage(page);

goBackPageTut.addEventListener("click", () => {
    const isPageOne = page == 1;
    isPageOne ? page = pageLimit : page--;
    setPage(page);
})

goNextPageTut.addEventListener("click", () => {
    const isPageLimit = page == pageLimit;
    isPageLimit ? page = 1 : page++;
    setPage(page);
})

//TODO SEARCH
const boxContainer = menuSettings.querySelectorAll(".boxContainer");
const listBoxContainer = [];
const listBoxContainerNumber = [];
for (let i = 0; i < boxContainer.length; i++) {
    listBoxContainer.push(boxContainer[i].querySelectorAll(".boxButton"));
    listBoxContainerNumber.push(boxContainer[i].querySelectorAll(".boxButton").length);
}
const separator = menuSettings.querySelectorAll(".separator");

const searchIndex = () => {
    const textInput = textSearch.value.toUpperCase();
    let searchFoundTotal = 0;
    const searchNotFoundBox = new Array(boxContainer.length);

    for (let i = 0; i < boxContainer.length; i++) {
        searchNotFoundBox[i] = 0;
        for (let j = 0; j < listBoxContainer[i].length; j++) {
            const textButton = listBoxContainer[i][j].innerText;
            if (textButton.toUpperCase().indexOf(textInput) > -1) {
                listBoxContainer[i][j].style.display = "flex";
            } else {
                listBoxContainer[i][j].style.display = "none";
                searchNotFoundBox[i] += 1;
            }

            const textDisplay = boxContainer[i].querySelector(".boxTitle").innerText;
            if (textDisplay.toUpperCase().indexOf(textInput) > -1) {
                listBoxContainer[i][j].style.display = "flex";
                searchNotFoundBox[i] -= 1;
            }

            if (listBoxContainer[i][j].style.display == "flex") {
                searchFoundTotal++;
            }
        }

        const isEmpty = searchNotFoundBox[i] == listBoxContainerNumber[i];
        isEmpty ? boxContainer[i].style.display = "none" : boxContainer[i].style.display = "flex";
    }

    const isNotWrite = textSearch.value == "";
    isNotWrite ? resultsSearch.style.display = "none" : resultsSearch.style.display = "flex";
    const isPlural = searchFoundTotal != 1;
    const isNotFound = searchFoundTotal != 0;
    let addS;
    isPlural ? addS = "s" : addS = "";
    isNotFound ? resultsSearch.innerText = "Hay " + searchFoundTotal + " ajuste" + addS + " disponible" + addS : resultsSearch.innerText = "No hay " + " ajuste" + addS + " disponible" + addS;

    for (let i = 0; i < separator.length; i++) {
        const isEmptyNext = searchNotFoundBox[i + 1] - listBoxContainerNumber[i + 1] == 0;
        isEmptyNext ? separator[i].style.display = "none" : separator[i].style.display = "";
    }

    let a = 0;
    const isZero = searchNotFoundBox[0] - listBoxContainerNumber[0] == 0;
    while (isZero && (0 == searchNotFoundBox[a + 1] - listBoxContainerNumber[a + 1]) && a < (boxContainer.length - 2)) {
        ++a;
    }

    if (isZero) {
        separator[a].style.display = "none";
    }
}

buttonEraseSearch.addEventListener("click", () => {
    textSearch.value = "";
    searchIndex();
})

textSearch.addEventListener("keyup", () => {
    searchIndex();
})

settingSearch = new SETTINGSTOOGLE(buttonSearch, "search",
    () => {
        settingSearch.setOnUI();
        if (!firstStartup) {
            showSearch();
        }
    },
    () => {
        settingSearch.setOffUI();
        hideSearch();
    }
);
settingSearch.setChange();

hideSearch();

//TODO SCROLLBARS
document.getElementsByTagName("head")[0].appendChild(styleScrollBar);
settingScrollBar = new SETTINGSTOOGLE(buttonScrollBar, "scrollBar",
    () => {
        settingScrollBar.setOnUI();
        styleScrollBar.appendChild(document.createTextNode(".mainScroller::-webkit-scrollbar {display: block; appearance: none; width: 10px}"));
        document.querySelectorAll(".mainScroller").forEach((object) => {
            object.style.paddingRight = "8px";
        });
    },
    () => {
        settingScrollBar.setOffUI();
        styleScrollBar.appendChild(document.createTextNode(".mainScroller::-webkit-scrollbar {display: none; appearance: none; width: 10px}"));
        document.querySelectorAll(".mainScroller").forEach((object) => {
            object.style.paddingRight = "0px";
        });
    }
);
settingScrollBar.setChange();

//
//TODO GAME
//

settingClickSplash = new SETTINGSTOOGLE(buttonClickSplash, "clickSplash",
    () => {
        settingClickSplash.setOnUI();
    },
    () => {
        settingClickSplash.setOffUI();
    }
);
settingClickSplash.setChange();

settingClickText = new SETTINGSTOOGLE(buttonClickText, "clickText",
    () => {
        settingClickText.setOnUI();
    },
    () => {
        settingClickText.setOffUI();
    }
);
settingClickText.setChange();

//TODO RESOURCES GENERAL
textGemSoul.innerText = gameSB.data["gemSoul"];
numberPower.innerText = gameSB.data["valuePower"];
numberVita.innerText = gameSB.data["valueHealth"];
numberRes.innerText = gameSB.data["valueDef"];
numberLea.innerText = gameSB.data["valueLea"];

let progressTotal;
let touchPower;
let gainEnergy;
let lowCost;
let production;
let maxPeople;
let peopleRate;

let progressMultiplierPeople = 1 + 0.05 * Number((gameSB.data["actualPeople"] ** 0.5).toFixed(2));
let energyMultiplierPeople = 1 + 0.01 * Number((gameSB.data["actualPeople"] ** 0.5).toFixed(2));
const updateStats = () => {
    touchPower = (1 + Math.floor(gameSB.data["valuePower"] / 5) * 0.1) * progressMultiplierPeople;
    gainEnergy = (1 + Math.floor(gameSB.data["valueDef"] / 15) * 0.05) * energyMultiplierPeople;
    lowCost = 1 + Math.floor(gameSB.data["valueHealth"] / 100) * 0.01;
    production = (0 + Math.floor(gameSB.data["valuePower"] / 5) * 0.05 + Math.floor(gameSB.data["valueHealth"] / 5) * 0.15) * progressMultiplierPeople;
    maxPeople = 0 + Math.floor(gameSB.data["valueLea"] / 5);
    peopleRate = 0 + Math.floor(maxPeople ** 0.5);

    textTouchPower.innerText = Number(touchPower.toFixed(2));
    textGainEnergy.innerText = Number(gainEnergy.toFixed(2));
    textLowCost.innerText = "×" + Number(lowCost.toFixed(2));
    textProduction.innerText = Number(production.toFixed(2)) + " / 5s";
    textMaximumPeople.innerText = maxPeople;
    textMaxPeople.innerText = maxPeople;
    textPeopleGrow.innerText = peopleRate;

    progressTotal = Number((10 / lowCost + 10 * ((gameSB.data["valueEnergy"] / lowCost ** (1 / 1.5)) ** 1.5)).toFixed(0));
    gameSB.data["totalPower"] = gameSB.data["valuePower"] + gameSB.data["valueHealth"] + gameSB.data["valueDef"] + gameSB.data["valueLea"];
    totalPower.innerText = gameSB.data["totalPower"];
}

//TODO STATS GENERAL
showTimeStartMinute(gameSB.data["totalTime"], textTimeTotal);
textTotalClicks.innerText = gameSB.data["totalClicks"];

const upClick = () => {
    gameSB.data["totalClicks"] = gameSB.data["totalClicks"] + 1;
    textTotalClicks.innerText = gameSB.data["totalClicks"];
}

textTotalEnergy.innerText = Math.floor(gameSB.data["totalEnergy"]);
const upEnergy = (amount) => {
    gameSB.data["totalEnergy"] = gameSB.data["totalEnergy"] + amount;
    textTotalEnergy.innerText = Math.floor(gameSB.data["totalEnergy"]);
}

//TODO AWARDS
class ACHIEVE {
    constructor(data, dataLVL, goals, rewards, idLevel, idBarProgress, idTextProgress, idTextReward, idDesc, desc1, desc2) {
        this.data = data;
        this.dataLVL = dataLVL;
        this.goals = goals;
        this.rewards = rewards;
        this.idLevel = idLevel;
        this.idBarProgress = idBarProgress;
        this.idTextProgress = idTextProgress;
        this.idTextReward = idTextReward;
        this.idDesc = idDesc;
        this.desc1 = desc1;
        this.desc2 = desc2;
    }

    update() {
        if (this.idLevel.innerText != "Nivel MÁX") {
            const level = gameSB.data[this.dataLVL];
            this.idLevel.innerText = "Nivel " + level;
            if (level < this.goals.length) {
                this.idLevel.innerText = "Nivel " + level;
                this.idDesc.innerText = this.desc1 + this.goals[level] + this.desc2;
                this.idTextProgress.innerText = Number(gameSB.data[this.data].toFixed(2)) + " / " + this.goals[level];
                this.idTextReward.innerText = "+" + this.rewards[level];
                this.idBarProgress.style.width = (gameSB.data[this.data] / this.goals[level]) * 100 + "%";

                if(Number(gameSB.data[this.data]) >= this.goals[level]) {
                    pushNotification("Has completado el logro. Has obtenido " + this.rewards[level] + " almas gemas.");
                    gameSB.data["gemSoul"] = gameSB.data["gemSoul"] + this.rewards[level];
                    textGemSoul.innerText = gameSB.data["gemSoul"];
                    gameSB.data[this.dataLVL]++;
                    this.update();
                }
            } else {
                this.idLevel.innerText = "Nivel MÁX";
                this.idDesc.innerText = "Ya has completado el logro";
                this.idTextReward.parentElement.remove();
                this.idBarProgress.parentElement.parentElement.remove();
            }
        }
    }
}

const clickAchieve = new ACHIEVE("totalClicks", "lvlTotalClicks", [100, 400, 1400, 3000, 6000, 12000, 24000, 50000, 100000, 250000], [5, 10, 15, 25, 40, 70, 100, 250, 525, 1600], idTotalClickLVL, barTotalClick, inPTotalClick, rewardClickTotal, descTotalClick, "Haz click ", " veces");
clickAchieve.update();

const timeAchieve = new ACHIEVE("totalTime", "lvlTotalTime", [10, 30, 60, 120, 240, 480, 960, 1440, 2880, 5760], [5, 10, 15, 20, 30, 50, 100, 175, 320, 640], idTotalTimeLVL, barTotalTime, inPTotalTime, rewardTimeTotal, descTotalTime, "Juega ", " minutos");
timeAchieve.update();

const energyAchieve = new ACHIEVE("totalEnergy", "lvlTotalEnergy", [50, 250, 800, 2500, 10000, 30000, 100000, 250000, 750000, 3000000], [10, 20, 40, 70, 115, 225, 450, 800, 1750, 4000], idTotalEnerLVL, barTotalEner, inPTotalEner, rewardEnerTotal, descTotalEner, "Acumula ", " energía total");
energyAchieve.update();

const trainAchieve = new ACHIEVE("totalTrain", "lvlTotalTrain", [4, 16, 48, 120, 240, 480, 1000, 2000, 4000, 8000], [5, 10, 20, 40, 80, 160, 350, 700, 1500, 3000], idTotalTrainLVL, barTotalTrain, inPTotalTrain, rewardTrainTotal, descTotalTrain, "Realiza ", " entrenamientos");
trainAchieve.update();

const powerAchieve = new ACHIEVE("totalPower", "lvlTotalPower", [100, 500, 1500, 4000, 12000, 40000, 120000, 360000, 1000000, 5000000], [10, 20, 40, 70, 110, 210, 400, 750, 1600, 3200], idTotalPowerLVL, barTotalPower, inPTotalPower, rewardPowerTotal, descTotalPower, "Alcalza ", " de poder total");
powerAchieve.update();

const totalAwards = 50;
textTotalAwards.innerText = (gameSB.data["lvlTotalClicks"] + gameSB.data["lvlTotalTime"] + gameSB.data["lvlTotalEnergy"] + gameSB.data["lvlTotalClicks"]) + " / " + totalAwards;
setInterval(() => {
    gameSB.data["totalTime"]++;
    showTimeStartMinute(gameSB.data["totalTime"], textTimeTotal);
    timeAchieve.update();
    trainAchieve.update();
    powerAchieve.update();

    textTotalAwards.innerText = (gameSB.data["lvlTotalClicks"] + gameSB.data["lvlTotalTime"] + gameSB.data["lvlTotalEnergy"] + gameSB.data["lvlTotalClicks"]) + " / " + totalAwards;
}, 60000);

//

class EXPERIENCIE {
    constructor(idTextLevel, barProgress, level, expActual, startAmount, sequenceAmount, incrementalAmount, exponencial) {
        this.idTextLevel = idTextLevel;
        this.barProgress = barProgress;
        this.level = level;
        this.expActual = expActual;
        this.startAmount = startAmount;
        this.sequenceAmount = sequenceAmount;
        this.incrementalAmount = incrementalAmount;    
        this.exponencial = exponencial;
        this.idTextLevel.innerText = gameSB.data[level];
        this.expRequired = startAmount + sequenceAmount * (gameSB.data[level] - 1) + incrementalAmount * ((gameSB.data[level] - 1) ** exponencial);
        this.barProgress.style.width = (gameSB.data[expActual] / this.expRequired) * 100 + "%";
    }

    gain(amount) {
        gameSB.data[this.expActual] += amount;
        if (gameSB.data[this.expActual] >= this.expRequired) {
            gameSB.data[this.expActual] -= this.expRequired;
            gameSB.data[this.level]++;
            this.expRequired = this.startAmount + this.sequenceAmount * (gameSB.data[this.level] - 1) + this.incrementalAmount * ((gameSB.data[this.level] - 1) ** this.exponencial);
            this.idTextLevel.innerText = gameSB.data[this.level];
        }
        this.barProgress.style.width = (gameSB.data[this.expActual] / this.expRequired) * 100 + "%";
    }

    showRequired() {
        return this.expRequired;
    }
}

mainEXP = new EXPERIENCIE(textLevelMain, barProgressEXP, "lvlMain", "expMain", 400, 150, 25, 2);

//PEOPLE BENEFITS
setInterval(() => {
    if (gameSB.data["actualPeople"] == maxPeople) {
        if (Math.random() * 10 < 5) {
            gameSB.data["actualPeople"] = Math.floor(gameSB.data["actualPeople"] / 2);
        }
    } else {
        gameSB.data["actualPeople"] = Math.min(gameSB.data["actualPeople"] + peopleRate, maxPeople);
    }

    textActualPeople.innerText = gameSB.data["actualPeople"];
    mainEXP.gain(gameSB.data["actualPeople"]);
    progressMultiplierPeople = Number((1 + 0.05 * (gameSB.data["actualPeople"] ** 0.5)).toFixed(2));
    energyMultiplierPeople = Number((1 + 0.01 * (gameSB.data["actualPeople"] ** 0.5)).toFixed(2));
    updateStats();
}, 10000);

let progress = 0;
infoEnergy.innerText = Math.floor(gameSB.data["valueEnergy"]);
progressEnergy.style.width = (progress / progressTotal) * 100 + "%";

const splashEffect = (e) => {
    if (settingClickSplash.getValue()) {
        const splash = document.createElement("div");
        splash.className = "splasher";
        splash.style.left = (e.clientX - 40) + "px";
        splash.style.top = (e.clientY - 40) + "px";
        document.body.appendChild(splash);
        setTimeout(() => {
            document.body.removeChild(splash);
        }, 300)
    }
}

const createTextNumberSvg = (e, amount, svgType, type = "paster") => {
    if (settingClickText.getValue()) {
        const boxNumber = document.createElement("div");
        boxNumber.className = "boxerNumber";
        const textNumber = document.createElement("div");
        textNumber.className = "texterNumber";
        const svg = document.createElement("div");
        if (type == "paster") {
            svg.className = "svgResource";
            svg.innerHTML = svgType;
        }
        if (type == "file") {
            svg.className = "svgResourceFile " + svgType;
        }
        boxNumber.style.left = (e.clientX) + "px";
        boxNumber.style.top = (e.clientY - 20) + "px";
        boxNumber.appendChild(textNumber);
        boxNumber.appendChild(svg);
        document.body.appendChild(boxNumber);

        textNumber.innerText = "+" + amount;

        setTimeout(() => {
            document.body.removeChild(boxNumber);
        }, 1200);
    }
}

const gainProgress = (gain, e, isManually = false) => {
    progress += gain;
    if (progress >= progressTotal) {
        progress -= progressTotal;
        const amount = gainEnergy;
        upEnergy(Number(amount.toFixed(2)));
        gameSB.data["valueEnergy"] += Number(amount.toFixed(2));
        infoEnergy.innerText = Math.floor(gameSB.data["valueEnergy"]);
        progressTotal = Number((10 / lowCost + 10 * ((gameSB.data["valueEnergy"] / lowCost ** (1 / 1.5)) ** 1.5)).toFixed(0));
        energyAchieve.update();

        if (isManually) {
            createTextNumberSvg(e, gainEnergy, `<svg width="20" height="25.6" viewBox="0 0 50 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_361_35" fill="white">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M31.6906 14.9053C27.8464 13.4713 26.4186 12.0707 30 0.5C15.7343 8.36069 6.8933 18.2556 2.786 27.5197C1.0057 30.9576 3.05176e-05 34.8613 3.05176e-05 39C3.05176e-05 52.8071 11.1929 64 25 64C38.8071 64 50 52.8071 50 39C50 27.5102 42.249 17.8308 31.6906 14.9053Z"/>
            </mask>
            <g filter="url(#filter0_i_361_35)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M31.6906 14.9053C27.8464 13.4713 26.4186 12.0707 30 0.5C15.7343 8.36069 6.8933 18.2556 2.786 27.5197C1.0057 30.9576 3.05176e-05 34.8613 3.05176e-05 39C3.05176e-05 52.8071 11.1929 64 25 64C38.8071 64 50 52.8071 50 39C50 27.5102 42.249 17.8308 31.6906 14.9053Z" fill="var(--colorMain)"/>
            </g>
            <path d="M30 0.5L33.8212 1.68274L36.7525 -7.78782L28.0696 -3.00335L30 0.5ZM31.6906 14.9053L30.2925 18.6531L30.4552 18.7137L30.6225 18.7601L31.6906 14.9053ZM2.786 27.5197L6.33798 29.3591L6.39365 29.2516L6.44272 29.141L2.786 27.5197ZM26.1789 -0.682736C25.2619 2.27964 24.6238 4.72153 24.2718 6.74518C23.9266 8.73024 23.8038 10.5927 24.1363 12.2781C24.5026 14.1348 25.3937 15.631 26.7451 16.7535C27.928 17.7361 29.3039 18.2842 30.2925 18.6531L33.0886 11.1576C32.6559 10.9962 32.3614 10.8731 32.143 10.7649C32.0392 10.7135 31.968 10.6729 31.9209 10.6434C31.8745 10.6144 31.8563 10.5992 31.8569 10.5997C31.9713 10.6948 32.0085 10.8488 31.985 10.7297C31.9278 10.4394 31.8793 9.69256 32.1535 8.11594C32.421 6.5779 32.9474 4.50571 33.8212 1.68274L26.1789 -0.682736ZM6.44272 29.141C10.1275 20.8299 18.2685 11.5313 31.9304 4.00335L28.0696 -3.00335C13.2001 5.19005 3.65911 15.6814 -0.870724 25.8985L6.44272 29.141ZM4.00003 39C4.00003 35.5164 4.84511 32.2419 6.33798 29.3591L-0.765989 25.6803C-2.83372 29.6732 -3.99997 34.2063 -3.99997 39H4.00003ZM25 60C13.4021 60 4.00003 50.598 4.00003 39H-3.99997C-3.99997 55.0163 8.98377 68 25 68V60ZM46 39C46 50.598 36.598 60 25 60V68C41.0163 68 54 55.0163 54 39H46ZM30.6225 18.7601C39.4934 21.218 46 29.3543 46 39H54C54 25.6661 45.0046 14.4436 32.7586 11.0505L30.6225 18.7601Z" fill="black" fill-opacity="0.25" mask="url(#path-1-inside-1_361_35)"/>
            <circle cx="25" cy="39" r="16" fill="white"/>
            <g filter="url(#filter1_i_361_35)">
            <circle cx="25" cy="39" r="10" fill="var(--colorMainFill)"/>
            </g>
            <defs>
            <filter id="filter0_i_361_35" x="3.05176e-05" y="-7.5" width="58" height="71.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="8" dy="-8"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_361_35"/>
            </filter>
            <filter id="filter1_i_361_35" x="15" y="25" width="24" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="4" dy="-4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_361_35"/>
            </filter>
            </defs>
            </svg> `);
        }
    }

    progressEnergy.style.width = (progress / progressTotal) * 100 + "%";
}

worldGame.addEventListener("mousedown", (e) => {
    upClick();
    clickAchieve.update();
    splashEffect(e);
    gainProgress(touchPower, e, true);
});

setInterval(() => {
    gainProgress(production, null);
}, 5000);

setInterval(() => {
    const number = Math.random() * 100;
    if (number < 50) {
        const createGemSoulRain = document.createElement("div");
        createGemSoulRain.className = "mediumSvg freePos gemSoulSvg";
        createGemSoulRain.style.transition = "15s linear"
        const pos = 30 + Math.random() * (window.innerWidth - 120);
        createGemSoulRain.style.translate = pos + "px -120px";
        setTimeout(() => {
            createGemSoulRain.style.translate = pos + "px " + (window.innerHeight + 120) + "px";
        }, 10);

        document.body.appendChild(createGemSoulRain);

        createGemSoulRain.addEventListener("click", (e) => {
            audioScore.autoplay = true;
            audioScore.load();
            const amount = Math.floor(Math.random() * 3 + 1);
            gameSB.data["gemSoul"] += amount;
            createTextNumberSvg(e, amount, "gemSoulSvg", "file");
            textGemSoul.innerText = gameSB.data["gemSoul"];
            createGemSoulRain.remove();
        })

        setTimeout(() => {
            createGemSoulRain.remove();
        }, 15000);
    }
    
}, 20000);

//
//TODO THREE JS
//
const scene = new THREE.Scene();
const colour = new THREE.Color("hsl(264, 100%, 90%)");
scene.background = colour;
scene.fog = new THREE.FogExp2(colour, 0.0016);

//TODO CAMERAS
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 4800);
camera.lookAt(0,0,0);
camera.position.set(0, 100, 400);

//TODO RENDER
settingAntialias = new SETTINGSTOOGLE(buttonAntialias, "antialias",
    () => {
        settingAntialias.setOnUI();
    },
    () => {
        settingAntialias.setOffUI();
    }
);
settingAntialias.setChange();

let renderer = new THREE.WebGLRenderer({canvas: worldGame, powerPreference: "high-performance", antialias: settingAntialias.getValue()});

renderer.setClearColor(colour);
renderer.setSize( window.innerWidth / 1, window.innerHeight / 1 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

settingResolution = new SETTINGSVALUE(rangeResolution, textResolution, "resolution",
    (value) => {
        renderer.setPixelRatio( window.devicePixelRatio * value );
        composer.renderer = renderer;
    }
);
const composer = new EffectComposer(renderer);
settingResolution.createRanger();
settingResolution.resetRanger(resetResolution, 1);

const stats = new Stats();
document.body.appendChild(stats.dom);
settingStatsFPS = new SETTINGSTOOGLE(buttonStatsFPS, "statsFPS",
    () => {
        settingStatsFPS.setOnUI();
        document.body.appendChild(stats.dom);
    },
    () => {
        settingStatsFPS.setOffUI();
        document.body.removeChild(stats.dom);
    }
);
settingStatsFPS.setChange();

//TODO COMPOSER
const renderScene = new RenderPass(scene, camera);

settingBloom = new SETTINGSTOOGLE(buttonBloom, "bloom",
    () => {
        settingBloom.setOnUI();
        composer.insertPass(bloomPass, 1);
        valueShadersTerrain = -2;
        changeMaterial();
    },
    () => {
        settingBloom.setOffUI();
        composer.removePass(bloomPass);
        valueShadersTerrain = -14;
        changeMaterial();
    }
);
settingBloom.setChange();

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.8;

settingImage = new SETTINGSTOOGLE(buttonImage, "image",
    () => {
        settingImage.setOnUI();
        composer.insertPass(afterImagePass, 2);
    },
    () => {
        settingImage.setOffUI();
        composer.removePass(afterImagePass);
    }
);
settingImage.setChange();

settingRender = new SETTINGSTOOGLE(buttonRender, "render",
    () => {
        settingRender.setOnUI();
        composer.insertPass(renderScene, 0);
        buttonBloom.style.opacity = 1;
        buttonImage.style.opacity = 1;
        buttonBloom.style.pointerEvents = "inherit";
        buttonImage.style.pointerEvents = "inherit";
    },
    () => {
        settingRender.setOffUI();
        composer.removePass(renderScene);
        buttonBloom.style.opacity = 0.2;
        buttonImage.style.opacity = 0.2;
        buttonBloom.style.pointerEvents = "none";
        buttonImage.style.pointerEvents = "none";
        settingBloom.setSettingToogle(false);
        settingImage.setSettingToogle(false);
    }
);
settingRender.setChange();

//TODO MESH
const orb = new THREE.Group();

const geometryIcoA = new THREE.IcosahedronGeometry(60, 6);
const materialIcoA = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.3, side: THREE.BackSide });
const meshIcoA = new THREE.Mesh( geometryIcoA, materialIcoA );
orb.add( meshIcoA );

const geometryIcoB = new THREE.IcosahedronGeometry(40, 6);
const materialIcoB = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, fog: false, side: THREE.BackSide, roughness: 1, clearcoat: 0.75, clearcoatRoughness: 0.25 });
const meshIcoB = new THREE.Mesh( geometryIcoB, materialIcoB );
orb.add( meshIcoB );

const geometryIcoC = new THREE.IcosahedronGeometry(28, 6);
const materialIcoC = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
const meshIcoC = new THREE.Mesh( geometryIcoC, materialIcoC );
orb.add( meshIcoC );

const geometryIcoD = new THREE.IcosahedronGeometry(54, 6);
const materialIcoD = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.7, side: THREE.BackSide });
const meshIcoD = new THREE.Mesh( geometryIcoD, materialIcoD );
orb.add( meshIcoD );

const geometryIcoWA = new THREE.IcosahedronGeometry(44, 6);
const materialIcoWA = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, wireframe: true, roughness: 1, clearcoat: 0.75, clearcoatRoughness: 0.25 });
const meshIcoWA = new THREE.Mesh( geometryIcoWA, materialIcoWA );
orb.add( meshIcoWA );

const torus = new THREE.Group();

const geometryTorusA = new THREE.TorusGeometry(80, 12, 30, 96);
const materialTorusA = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.9, side: THREE.BackSide });
const meshTorusA = new THREE.Mesh( geometryTorusA, materialTorusA );
torus.add( meshTorusA );

const normalMapFlakes = new THREE.CanvasTexture(new FlakesTexture());
normalMapFlakes.wrapS = THREE.RepeatWrapping;
normalMapFlakes.wrapT = THREE.RepeatWrapping;
normalMapFlakes.anisotropy = 20;

const paintUV = uv().mul( vec2( 15, 9 ) );
const paintNormalScale = vec2( 2 );

const geometryTorusB = new THREE.TorusGeometry(80, 9, 30, 96);
//const materialTorusB = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, roughness: 1, clearcoat: 1, clearcoatRoughness: 0.15 });
let materialTorusB = new MeshPhysicalNodeMaterial();
const meshTorusB = new THREE.Mesh( geometryTorusB, materialTorusB );
torus.add( meshTorusB );
orb.add(torus);

scene.add(orb);

const geometryTerrain = new THREE.PlaneGeometry(3500, 3500, 150, 150);
const geometryTerrainStatic = new THREE.PlaneGeometry(3500, 3500, 150, 150);
const materialTerrain = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, roughness: 0.45, metalness: 0.1, reflectivity: 0.4, clearcoat: 0.8, clearcoatRoughness: 1 });
const meshTerrain = new THREE.Mesh( geometryTerrain, materialTerrain );
scene.add( meshTerrain );

settingTerrain = new SETTINGSTOOGLE(buttonTerrain, "terrain",
    (input) => {
        input["svg"].className = "fi-rr-grid-alt subIcon";
        input["text"].innerText = "Alámbrica";
        materialTerrain.wireframe = true;
    },
    (input) => {
        input["svg"].className = "fi-rr-square subIcon";
        input["text"].innerText = "Plana";
        materialTerrain.wireframe = false;
    }
);
settingTerrain.setChange();

settingTerrainAnimation = new SETTINGSTOOGLE(buttonTerrainAnimation, "terrainAnimation",
    (input) => {
        input["svg"].className = "fi-rr-water subIcon";
        input["text"].innerText = "Animado";
        meshTerrain.geometry = geometryTerrain;
    },
    (input) => {
        input["svg"].className = "fi-rr-align-justify subIcon";
        input["text"].innerText = "Estático";
        meshTerrain.geometry = geometryTerrainStatic;
    }
);
settingTerrainAnimation.setChange();

meshTerrain.rotation.x = -Math.PI / 2;
meshTerrain.position.y = -175;
meshTerrain.scale.set(2, 2, 2);

//TODO LIGHT and SHADOWS
const light = new THREE.AmbientLight(0xffffff, 2.5);
scene.add( light );

const lightPointA = new THREE.PointLight( 0x6600ff, 3, 1200 );
lightPointA.position.set( 0, 125, 0 );
scene.add( lightPointA );

const lightPointB = new THREE.PointLight( 0x6600ff, 3, 600 );
lightPointB.position.set( 0, -100, 0 );
scene.add( lightPointB );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
scene.add( directionalLight );

let xLight = 0;
let yLight = 600;
let zLight = 200;

directionalLight.position.set(xLight, yLight, zLight);

directionalLight.castShadow = false;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
directionalLight.shadow.camera.near = 100;
directionalLight.shadow.camera.far = 1200;
directionalLight.shadow.mapSize.x = 512 * 4;
directionalLight.shadow.mapSize.y = 512 * 4;
directionalLight.castShadow = true;

meshIcoB.castShadow = true;
meshIcoWA.castShadow = true;
meshTorusB.castShadow = true;

meshTorusB.receiveShadow = true;
meshTerrain.receiveShadow = true;

const rectLight = new THREE.RectAreaLight( 0xffffff, 4, 200, 200 );
rectLight.position.set( 0, -120, 0 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight );

//const rectLightHelper = new RectAreaLightHelper( rectLight );
//rectLight.add( rectLightHelper );

settingShadow = new SETTINGSTOOGLE(buttonShadow, "shadow",
    (input) => {
        input["svg"].className = "fi-rr-opacity subIcon";
        settingShadow.setOnUI();
        renderer.shadowMap.enabled = true;
        directionalLight.castShadow = true;
    },
    (input) => {
        input["svg"].className = "fi-rr-circle-dashed subIcon";
        settingShadow.setOffUI();
        renderer.shadowMap.enabled = false;
        directionalLight.castShadow = false;
    }
);
settingShadow.setChange();

//TODO CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
settingControl = new SETTINGSTOOGLE(buttonControl, "control",
    () => {
        settingControl.setOnUI();
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null,
            RIGHT: null
        }
    },
    () => {
        settingControl.setOffUI();
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }
    }
);
settingControl.setChange();

controls.autoRotateSpeed = 1;
controls.rotateSpeed = 1;
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2;

const controls2 = new TrackballControls( camera, renderer.domElement );
controls2.noRotate = true;
controls2.noPan = true;
controls2.noZoom = false;
controls2.zoomSpeed = 2;
controls2.minDistance = 240;
controls2.maxDistance = 1000;

settingRotation = new SETTINGSTOOGLE(buttonRotation, "rotation",
    () => {
        settingRotation.setOnUI();
        controls.autoRotate = true;
    },
    () => {
        settingRotation.setOffUI();
        controls.autoRotate = false;
    }
);
settingRotation.setChange();

settingRotateDamp = new SETTINGSVALUE(rangeRotateDamp, textRotateDamp, "rotateDamp",
    (value) => {
        controls.dampingFactor = value;
    }
);
settingRotateDamp.createRanger();
settingRotateDamp.resetRanger(resetRotateDamp, 0.05);

settingRotateSpeed = new SETTINGSVALUE(rangeRotateSpeed, textRotateSpeed, "rotateSpeed",
    (value) => {
        controls.rotateSpeed = value;
    }
);
settingRotateSpeed.createRanger();
settingRotateSpeed.resetRanger(resetRotateSpeed, 1);

settingRotateSpeedAuto = new SETTINGSVALUE(rangeRotateSpeedAuto, textRotateSpeedAuto, "rotateSpeedAuto",
    (value) => {
        controls.autoRotateSpeed = value;
    }
);
settingRotateSpeedAuto.createRanger();
settingRotateSpeedAuto.resetRanger(resetRotateSpeedAuto, 1);

settingZoomSpeed = new SETTINGSVALUE(rangeZoomSpeed, textZoomSpeed, "zoomSpeed",
    (value) => {
        controls2.zoomSpeed = value;
    }
);
settingZoomSpeed.createRanger();
settingZoomSpeed.resetRanger(resetZoomSpeed, 2);

//TODO ANIMATION
scene.matrixWorldAutoUpdate = true;
const animate = () => {
    requestAnimationFrame(animate);

    if (playAnimate) {
        const target = controls.target;
        controls.update();
        controls2.target.set(target.x, target.y, target.z);
        controls2.update();

        nodeFrame.update();

        //Animation
        const time = clock.getElapsedTime();

        if (settingTerrainAnimation.getValue()) {
            const positionWaves = geometryTerrain.attributes.position;
            positionWaves.usage = THREE.DynamicDrawUsage;
            for (let i = 0; i < positionWaves.count; i++) {

                const z = 12 * Math.sin(i / 3 + Math.sin(time) / 5 + time) + 12 * Math.cos(-i / 12 + time);
                positionWaves.setZ(i, z);

            }
            positionWaves.needsUpdate = true;
        }

        if (time < 6 / 4) {
            const adFov = (6 - time * 4) ** 2.4;
            camera.fov = 75 + adFov;
        } else {
            if (camera.fov != 75) {
                camera.fov = 75;
            }
        }

        const scaleA = Math.cos(time * 1.25) * 0.025;
        const scaleC = Math.cos((time * 1.5) * 1.4 + 0.25) * 0.06;
        const scaleD = Math.cos((time * 1.25) * 1.333 + 0.5) * 0.025;

        meshIcoA.scale.set(1 + scaleA, 1 + scaleA, 1 + scaleA);
        meshIcoC.scale.set(1 + scaleC, 1 + scaleC, 1 + scaleC)
        meshIcoD.scale.set(1 + scaleD, 1 + scaleD, 1 + scaleD);

        torus.rotation.set((time / 5), (time / 5) * 2, (time / 5));

        const moveOrb = Math.cos(time * 2) * 8;
        orb.position.y = moveOrb;

        //Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        //Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        //Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render( scene, camera );

        const delta = clock.getDelta();
        if (settingRender.getValue()) {
            if (settingBloom.getValue() || settingImage.getValue()) {
                composer.render(delta);
            }
        }

        stats.update();

        isVertical = window.innerWidth < window.innerHeight;
        isVertical ? blockAspectRatioDetector.style.display = "flex" : blockAspectRatioDetector.style.display = "none";
    }
}

animate();

//SETTINGS APPAREANCE
const effectFluent = () => {
    let themeRgb;
    let themeOpacity;
    if (!settingTheme.getValue()) {
        themeRgb = "rgba(255, 255, 255, ";
        themeOpacity = 0.8;
    } else {
        themeRgb = "rgba(20, 20, 20, ";
        themeOpacity = 0.8;
    }

    if (!settingGlass.getValue()) {
        themeOpacity = 1;
    }

    root.style.setProperty("--bgFluent", themeRgb + (themeOpacity) + ")");
    root.style.setProperty("--bgFluentB", themeRgb + (themeOpacity / 2) + ")");
}

settingTheme = new SETTINGSTOOGLE(buttonTheme, "theme",
    (input) => {
        input["svg"].className = "fi-rr-moon-stars subIcon"
        input["text"].innerText = "Oscuro";

        root.style.setProperty("--bgMain", "rgb(0, 0, 0)");
        root.style.setProperty("--bgSecond", "rgb(20, 20, 20, 0.7)");
        root.style.setProperty("--bgThird", "rgb(20, 20, 20)");
        root.style.setProperty("--bgText", "rgba(255, 255, 255, 1)");
        root.style.setProperty("--bgTextSoft", "rgba(255, 255, 255, 0.5)");

        root.style.setProperty("--bgOpacStrong", "rgba(255, 255, 255, 0.9)");
        root.style.setProperty("--bgOpac", "rgba(255, 255, 255, 0.7)");
        root.style.setProperty("--bgOpacSoft", "rgba(255, 255, 255, 0.4)");
        root.style.setProperty("--bgOpacSoftest", "rgba(255, 255, 255, 0.1)");

        root.style.setProperty("--opacFill", "1");
        root.style.setProperty("--opacLight", "0.3");

        root.style.setProperty("--on", "rgba(0, 255, 100, 0.2)");
        root.style.setProperty("--off", "rgba(255, 0, 100, 0.2)");
        root.style.setProperty("--onText", "rgb(0, 255, 100)");
        root.style.setProperty("--offText", "rgb(255, 0, 100)");

        root.style.setProperty("--invert", "invert(100%)");

        effectFluent();
        colorLight = 10;
        bloomPass.strength = 0.44;
        bloomPass.radius = 1.8;
        bloomPass.threshold = 0.78;

        changeScene();
    },
    (input) => {
        input["svg"].className = "fi-rr-sun subIcon"
        input["text"].innerText = "Claro";

        root.style.setProperty("--bgMain", "rgb(235, 235, 235)");
        root.style.setProperty("--bgSecond", "rgba(255, 255, 255, 0.7)");
        root.style.setProperty("--bgThird", "rgb(255, 255, 255)");
        root.style.setProperty("--bgText", "rgba(0, 0, 0, 0.8)");
        root.style.setProperty("--bgTextSoft", "rgba(0, 0, 0, 0.5)");

        root.style.setProperty("--bgOpacStrong", "rgba(0, 0, 0, 0.9)");
        root.style.setProperty("--bgOpac", "rgba(0, 0, 0, 0.7)");
        root.style.setProperty("--bgOpacSoft", "rgba(0, 0, 0, 0.4)");
        root.style.setProperty("--bgOpacSoftest", "rgba(0, 0, 0, 0.1)");

        root.style.setProperty("--opacFill", "0.5");
        root.style.setProperty("--opacLight", "0.15");

        root.style.setProperty("--on", "rgba(0, 200, 75, 0.2)");
        root.style.setProperty("--off", "rgba(225, 0, 75, 0.2)");
        root.style.setProperty("--onText", "rgb(0, 200, 75)");
        root.style.setProperty("--offText", "rgb(225, 0, 75)");

        root.style.setProperty("--invert", "invert(20%)");

        effectFluent();
        colorLight = 90;
        bloomPass.strength = 0.5;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.975;

        changeScene();
    }
);
settingTheme.setChange();

settingGlass = new SETTINGSTOOGLE(buttonGlass, "glass",
    () => {
        settingGlass.setOnUI();
        root.style.setProperty("--filterGlass", "blur(16px)");
        effectFluent();
    },
    () => {
        settingGlass.setOffUI();
        root.style.setProperty("--filterGlass", "initial");
        effectFluent();
    }
);
settingGlass.setChange();

settingColorSelector = new SETTINGSVALUE(groupColors, colorText, "colorSelector",
    (value, group, text) => {
        switch (value) {
            case 0:
                text.innerText = "Rosa azucarada"
                settingColor.changeSetting([300, 100, 70]);
                break;
            case 1:
                text.innerText = "Indigo"
                settingColor.changeSetting([264, 100, 55]);
                break;
            case 2:
                text.innerText = "Mar azul"
                settingColor.changeSetting([212, 100, 50]);
                break;
            case 3:
                text.innerText = "Bosque esmeralda"
                settingColor.changeSetting([150, 100, 50]);
                break;
            case 4:
                text.innerText = "Oro de desierto"
                settingColor.changeSetting([52, 100, 50]);
                break;
            case 5:
                text.innerText = "Melocotón"
                settingColor.changeSetting([30, 100, 55]);
                break;
            case 6:
                text.innerText = "Rosa mosqueta"
                settingColor.changeSetting([350, 100, 65]);
                break;
        }

        root.style.setProperty("--colorMain", "hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
        root.style.setProperty("--colorMainOpacSoft", "hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%, 0.075)");
        root.style.setProperty("--colorMainOpac", "hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%, 0.15)");
        root.style.setProperty("--colorMainFill", "hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%, 0.3)");

        materialIcoB.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
        materialIcoWA.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
        //materialTorusB.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
        materialTorusB = new MeshPhysicalNodeMaterial();
        materialTorusB.clearcoatNode = float( 1 );
        materialTorusB.clearcoatRoughnessNode = float( 0 );
        materialTorusB.metalnessNode = float( 0.55 );
        materialTorusB.roughnessNode = float( 0.45 );
        materialTorusB.normalNode = normalMap( texture( normalMapFlakes, paintUV ), paintNormalScale );
        materialTorusB.colorNode = color( new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)") );
        meshTorusB.material = materialTorusB;
        lightPointA.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
        lightPointB.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
        changeMaterial();
        changeScene();
    }
);
settingColorSelector.createDropDown();

//TODO TOOLTIP
const screenType = (yTool, logScreenY, valueX) => {
    const isMoreY = logScreenY > 50;
    let positionWay;
    isMoreY ? positionWay = (yTool - displayTool.clientHeight - 10) : positionWay = (yTool + 10);
    toolMove.style.transform = "translateX(" + valueX + "px) translateY(" + positionWay + "px)"
}

document.addEventListener("mousemove", (e) => {
    const logScreenY = (e.pageY / window.innerHeight) * 100;
    let positionWay = e.pageX - displayTool.clientWidth / 2;
    if (e.pageX <= 180) {
        positionWay = e.pageX + 10
    }

    if (e.pageX >= window.innerWidth - 180) {
        positionWay = (e.pageX - 10) - displayTool.clientWidth
    }
    screenType(e.pageY, logScreenY, positionWay);
});

//TODO INFO
let showContext;
let showWarning;
settingTool = new SETTINGSTOOGLE(buttonTool, "tool",
    () => {
        settingTool.setOnUI();
        showContext = true;
    },
    () => {
        settingTool.setOffUI();
        showContext = false;
    }
);
settingTool.setChange();

settingToolWarn = new SETTINGSTOOGLE(buttonToolWarn, "toolWarn",
    () => {
        settingToolWarn.setOnUI();
        showWarning = true;
    },
    () => {
        settingToolWarn.setOffUI();
        showWarning = false;
    }
);
settingToolWarn.setChange();

//TODO INFORMACIÓN
const getInformation = (idEvent, typeMessage, svg, title, type, textA, textB) => {
    idEvent.addEventListener("mouseenter", () => {
        idEvent.style.cursor = "none";
    });

    idEvent.addEventListener("mouseleave", () => {
        idEvent.style.cursor = "default";
    });

    idEvent.addEventListener("mousemove", (e) => {
        if ((showContext && typeMessage == "context") || (showWarning && typeMessage == "warning") || typeMessage == "important") {
            toolMove.style.visibility = "visible";
            displayTool.style.scale = 1;
            displayTool.style.opacity = 1;

            e.target.addEventListener("mouseout", () => {

                toolMove.style.visibility = "hidden";
                displayTool.style.scale = 0.8;
                displayTool.style.opacity = 0;

            });

            if (svg != null) {
                svgInfo.style.display = "flex";
                svgInfo.style.background = svg;
            } else {
                svgInfo.style.display = "none";
                svgInfo.style.background = "transparent";
            }

            titleTool.innerText = title;
            subtitleTool.innerText = type;
            infoToolA.innerText = textA;

            if (textB != null) {
                infoToolB.innerText = textB;
                infoToolB.style.display = "flex";
            } else {
                infoToolB.innerText = "";
                infoToolB.style.display = "none";
            }
        }
    })
}

getInformation(textEnergyId, "context", null, "Energía del alma", "Recurso",
"Recurso común para comprar mejoras y acciones.",
null
);

getInformation(buttonAntialias, "warning", null, "Aviso", "Recarga manual",
"Al aplicarlo, se recomienda refrescar la página para surtir cambios después de guardar manualmente el archivo.",
null
);

getInformation(resetConfig, "warning", null, "¿Seguro?", "Acción no recomendable",
"Una vez presionado, los datos de configuración se restablecerán.",
"En efecto, no podrás volver los datos que has cambiado."
);

getInformation(textInfoPower, "context", null, "Poder", "Atributo general",
"Poder que suma todos los atributos del alma y equipamentos del alma.",
null
);

getInformation(textPower, "context", null, "Potencia", "Atributo",
"Atributo que aumenta el ataque, la potencia del toque y la producción baja.",
"Cada 15 puntos, +ataque; Cada 5 puntos, +toque y +producción."
);

getInformation(textVita, "context", null, "Vitalidad", "Atributo",
"Atributo que aumenta la salud, el coste de la energía y la producción alta.",
"Cada 5 puntos, +salud y ++producción; Cada 100 puntos, -coste."
);

getInformation(textRes, "context", null, "Dureza", "Atributo",
"Atributo que aumenta el aguante, la defensa y el impulso de energía.",
"Cada 50 puntos, +aguante; Cada 15 puntos, +energía; La defensa depende de los puntos."
);

getInformation(textLea, "context", null, "Lealtad", "Atributo",
"Atributo que aumenta el crecimiento de la lealtad y la lealtad permanente.",
"Cada 5 puntos, +lealtad permanente. El crecimiento de los creyentes depende de la lealtad permanente."
);

getInformation(textHealth, "context", null, "Salud", "Atributo de vitalidad",
"Atributo que indica cúanta vida tiene el alma.",
"Si la vida es 0, se reiniciará los creyentes hasta 0 y se perderá la mitad de energía y el progreso."
);

getInformation(textStamina, "context", null, "Aguante", "Atributo de dureza",
"Atributo que indica cúanta resistencia tiene el alma",
"El aguante se expresa como porcentaje del crecimiento de los creyentes; Si el aguante es 0, el crecimiento de éste se detiene."
);

getInformation(textDefen, "context", null, "Defensa", "Atributo de dureza",
"Atributo que indica cúanta armadura tiene el alma.",
"La armadura máxima llega hasta 85%."
);

getInformation(textAtk, "context", null, "Ataque", "Atributo de potencia",
"Atributo que indica cúanto daño puede causar contra los Kurotamas (Almas negras).",
null
);

getInformation(textTap, "context", null, "Toque", "Atributo de potencia",
"Atributo que indica cúanta cantidad de progreso acumula por toque.",
null
);

getInformation(textEner, "context", null, "Energía", "Atributo de dureza",
"Atributo que indica cúanta cantidad de energía acumula cuando la barra de progreso está lleno.",
"Nota: cuanto mayor energía tiene, el coste afectará en relación de esa energía almacenada, pues el alma tiene los límites de almacenar energía."
);

getInformation(textCost, "context", null, "Coste", "Atributo de vitalidad",
"Atributo que divide el coste de la barra del progreso necesita para acumular la energía.",
null
);

getInformation(textPro, "context", null, "Producción", "Atributo de vitalidad o potencia",
"Atributo que acumula progreso por 5 segundos.",
null
);

getInformation(textMaxP, "context", null, "Máxima población", "Atributo de lealtad",
"Atributo que maximiza la población de los creyentes.",
null
);

getInformation(textPeopleRate, "context", null, "Crecimiento", "Atributo de lealtad",
"Atributo que crece los creyentes por 10 segundos.",
"Cada dicho tiempo, si alcalza la máxima población, tiene una probabilidad de 50% de abandonar el 50% de creyentes respecto a la máxima población."
);

getInformation(gemSoulBox, "context", null, "Alma gema", "Recurso valioso",
"Útil para compras de mejoras permanentes y potenciadores de tiempo.",
null
);

getInformation(iconPeople, "context", null, "Creyentes", "Recurso especial",
"Los creyentes apoyan al alma y benefician los recursos que aceleran el proceso del alma.",
"Además, también pueden adquirir experiencia por persona cada 10 segundos."
)

getInformation(textLevelMain, "context", null, "Nivel del alma", "XP",
"Subir nivel hará que los entrenamientos progrese rápido.",
"Cada nivel, +puntos de entrenamiento."
)

//TOOLTIP
let showWord;
settingToolTip = new SETTINGSTOOGLE(buttonToolTip, "toolTip",
    () => {
        settingToolTip.setOnUI();
        showWord = true;
    },
    () => {
        settingToolTip.setOffUI();
        showWord = false;
    }
);
settingToolTip.setChange();

const goToolTip = (idEvent, position, words, type = "word") => {
    const updateToolTip = () => {
        computePosition(idEvent, tooltip, {
            placement: position,
            middleware: [offset(12), shift({padding: 18})]
        }).then(({x, y}) => {
            Object.assign(tooltip.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }
    
    const showTooltip = () => {
        if (showWord && type == "word" || type == "number") {
            tooltip.style.opacity = 1;
            tooltip.style.scale = 1;
            if (typeof words == "string") {
                tooltip.innerText = words;
            } else {
                tooltip.innerText = words();
            }
            updateToolTip();
        }
    }
    
    const hideTooltip = () => {
        tooltip.style.opacity = 0;
        tooltip.style.scale = 0.8;
    }

    [
        ['mouseenter', showTooltip],
        ['mouseleave', hideTooltip]
    ].forEach(([event, listener]) => {
        idEvent.addEventListener(event, listener);
    });
}

goToolTip(openHome, "right", "Inicio");
goToolTip(openProfile, "left", "Perfil");
goToolTip(openMoreMenu, "top", "No está disponible aún")
goToolTip(exiterTrain, "left", "Salir");
goToolTip(buttonPeople, "left", () => progressMultiplierPeople + "× progreso, " + energyMultiplierPeople + "× energía");
goToolTip(openStats, "top", "Estadísticas");
goToolTip(openTrain, "top", "Entrenamiento");
goToolTip(buttonExitGame, "top", "Salir");
goToolTip(buttonSaveAs, "top", "Guardar como");
goToolTip(buttonSave, "top", "Guardar");
goToolTip(barEnergy, "top", () => Number(progress.toFixed(2)) + " / " + progressTotal, "number");
goToolTip(barEXP, "right", () => Math.floor(gameSB.data["expMain"]) + " / " + mainEXP.showRequired(), "number");

updateStats();

};

//TODO OUT INIT
//TODO LOADING and WELCOME
window.addEventListener("load", () => {
    blockLoader.style.animation = "playFade 0.8s forwards ease-in";
});

buttonConfirmProtection.addEventListener("click", () => {
    closeWindow(windowProtection);
});

const openWelcome = () => {
    textWelcomer.remove();
    setTimeout(() => {
        svgWelcomer.style.translate = "0% -150px"
        blockLoader.remove();
        boxFiles.style.scale = 1;
        boxFiles.style.opacity = 1;
        boxFiles.style.pointerEvents = "inherit";
    }, 310)
    blockWelcomer.removeEventListener("click", openWelcome);
}

blockWelcomer.addEventListener("click", openWelcome);

//TODO New Game

let fileHandle = null;

const quitWelcome = () => {
    blockWelcomer.style.opacity = 0;
    blockWelcomer.style.pointerEvents = "none";
    setTimeout(() => {
        taskBox.style.translate = "0px 0px";
        gemSoulBox.style.translate = "0px 0px";
    }, 310)
}

const setSettingToogle = (objectSetting) => {
	objectSetting.setToogle();
}

const setSettingRanger = (objectSetting) => {
    objectSetting.ranger();
}

const setSettingDropDown = (objectSetting) => {
    objectSetting.droper();
}

const setSettings = () => {
    setSettingRanger(settingSoundAmbient);
    setSettingRanger(settingSoundInteract);
    setSettingRanger(settingSoundSystem);
    setSettingRanger(settingResolution);
    setSettingRanger(settingRotateDamp);
    setSettingRanger(settingRotateSpeed);
    setSettingRanger(settingRotateSpeedAuto);
    setSettingRanger(settingZoomSpeed);

    setSettingDropDown(settingColorSelector);

    setSettingToogle(settingSearch);
    setSettingToogle(settingScrollBar);
    setSettingToogle(settingClickSplash);
    setSettingToogle(settingClickText);
    setSettingToogle(settingAntialias);
    setSettingToogle(settingStatsFPS);
    setSettingToogle(settingBloom);
    setSettingToogle(settingImage);
    setSettingToogle(settingRender);
    setSettingToogle(settingTerrain);
    setSettingToogle(settingTerrainAnimation);
    setSettingToogle(settingShadow);
    setSettingToogle(settingControl);
    setSettingToogle(settingRotation);
    setSettingToogle(settingNotif);
    setSettingToogle(settingTool);
    setSettingToogle(settingToolWarn);
    setSettingToogle(settingToolTip);
	setSettingToogle(settingTheme);
    setSettingToogle(settingGlass);
}

const onBeforeUnload = () => {
	window.onbeforeunload = (event) => {
		event.returnValue = ""
	}
}

buttonNewGame.addEventListener("click", () => {
    openWindow(windowProtection);
    quitWelcome();
	buttonSave.style.opacity = 0.5;
	buttonSave.style.pointerEvents = "none";
    buttonSaveAs.children[0].className = "fi-rr-add-document subIcon";
    mainTitle.innerText = "Soul Breaker";

    init();
    setSettings();
    playAnimate = true;
    firstStartup = false;

	onBeforeUnload();
})

buttonLoadGame.addEventListener("click", async () => {
	try {
        pushNotification("Cargando...", "process");
		[fileHandle] = await window.showOpenFilePicker({
			types: [
				{
					description: 'txt',
					accept: {
						'text/*': ['.txt']
					}
				},
			],
			excludeAcceptAllOption: true,
			multiple: false
		});
		let fileData = await fileHandle.getFile();
		let text = await fileData.text();
        const mySentenceSB = "Gracias por jugar Soul Breaker"
        const bytes = CryptoJS.AES.decrypt(text, mySentenceSB)
        let gameSBFile = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		
		if (gameSBFile.codeGame == "Soul Breaker") {
			quitWelcome();
			buttonSave.style.opacity = 1;
			buttonSave.style.pointerEvents = "inherit";
            const fileString = fileHandle.name;
            idTextFile.innerText = fileString.substring(0, fileString.length - 4);
            mainTitle.innerText = "Soul Breaker - " + fileString.substring(0, fileString.length - 4);

            Object.assign(gameSB.settings, gameSBFile.settings);
            Object.assign(gameSB.data, gameSBFile.data);
            init();
            playAnimate = true;
            setSettings();
            firstStartup = false;

            gameSBFile = null;
			onBeforeUnload();
            pushNotification("Se ha cargado el juego con éxito.", "success");
		} else {
            pushNotification("El archivo no es original en este juego", "error");
            setNewGame();
            init();
            playAnimate = true;
            setSettings();
            onBeforeUnload();
		}
	} catch (err) {
        console.log(err.name);
        console.log(err.message);
        console.error(err);
        if (err.name == "AbortError") {
            pushNotification("Se ha cancelado solicitar carga del archivo.", "error");
        }

        if (err.name == "SyntaxError") {
            pushNotification("El tipo de archivo del texto es inválido. Inténtalo de nuevo.", "error");
        }

        if (err.name == "TypeError") {
            pushNotification("Parece que esta función no está disponible. ¿Estás en un navegador diferente de los Chromium o usas en el móvil?", "error");
        }

        if (err.message == "Malformed UTF-8 data") {
            pushNotification("Los datos UTF-8 de este archivo está mal formados o su formato del texto es inválido. Inténtalo de nuevo.", "error");
        }
	}
})

const save = async () => {
	try {
        pushNotification("Guardando...", "process");
        const mySentenceSB = "Gracias por jugar Soul Breaker"
	    let stream = await fileHandle.createWritable();
	    await stream.write(CryptoJS.AES.encrypt(JSON.stringify(gameSB), mySentenceSB).toString());
	    await stream.close();
        pushNotification("Se ha guardado el juego con éxito.", "success");
	} catch (err) {
        console.log(err.name);
        console.log(err.message);
        console.error(err);
        if (err.name == "InvalidStateError") {
            pushNotification("EL disco duro está ocupado escribiendo el archivo.", "error");
        }

        if (err.name == "NotAllowedError") {
            pushNotification("No se ha podido guardar el juego por los permisos bloqueados del navegador.", "error");
        }
    }
}

buttonSave.addEventListener("click", save);

buttonSaveAs.addEventListener("click", async () => {
	try {
        pushNotification("Creando archivo...", "process");
		fileHandle = await window.showSaveFilePicker({
			types: [
				{
					description: 'txt',
					accept: {
						'text/*': ['.txt']
					}
				},
			],
			excludeAcceptAllOption: true
		});
		save();
		buttonSave.style.opacity = 1;
		buttonSave.style.pointerEvents = "all";
		const fileString = fileHandle.name;
        idTextFile.innerText = fileString.substring(0, fileString.length - 4);
        mainTitle.innerText = "Soul Breaker - " + fileString.substring(0, fileString.length - 4);
        pushNotification("Se ha creado el archivo con éxito.", "success");
	} catch (err) {
        console.log(err.name);
        console.log(err.message);
        console.error(err);
        if (err.name == "AbortError") {
            pushNotification("Se ha cancelado solicitar guardar como archivo.", "error");
        }

        if (err.name == "TypeError") {
            pushNotification("Parece que esta función no está disponible. ¿Estás en un navegador diferente de los Chromium o usas en el móvil?", "error");
        }
    }
})

buttonExitGame.addEventListener("click", () => {
    location.reload();
})

//TODO DATA
resetConfig.addEventListener("click", () => {
    gameSB.settings = {};
    setSettingDefault();
    setSettings();
});

localStorage.clear();
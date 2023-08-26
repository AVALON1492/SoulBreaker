import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';

//

import {computePosition, offset} from '@floating-ui/dom';

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

export let gameSB;
const setNewGame = () => {
    gameSB = {
        codeGame: "Soul Breaker",
        version: versionActual,
        settings: {},
        data: {
            gemSoul: 0,
            valuePower: 0,
            valueHealth: 0,
            valueDef: 0,
            totalPower: 0,
            totalTime: 0,
            totalClicks: 0,
            totalEnergy: 0,
            totalTrain: 0,
            valueEnergy: 0,
            lvlTotalClicks: 0,
            lvlTotalTime: 0,
            lvlTotalEnergy: 0,
            lvlTotalTrain: 0,
            lvlTotalPower: 0
        }
    }
}

setNewGame();

//TODO POP-UP WINDOW
const openWindow = (idWindow) => {
    tapeWindow.style.display = "block";
    idWindow.style.display = "flex";
    setTimeout(() => {
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
settingTool,
settingToolWarn,
settingToolTip,
settingTheme,
settingGlass;

class SETTINGS {
	constructor(valueObject, setDefault) {
        gameSB.settings[valueObject] = setDefault;
		this.valueObject = valueObject;
		this.setDefault = setDefault;
	}

    isNewDefault() {
		if (gameSB.settings[this.valueObject] == undefined) {
			gameSB.settings[this.valueObject] = this.setDefault;
		}
	}

    getValue() {
        return gameSB.settings[this.valueObject];
    }
}

class SETTINGSTOOGLE extends SETTINGS {
    constructor(button, valueObject, setDefault, setFunctionOn, setFunctionOff) {
        super(valueObject, setDefault);
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

    setOnUI() {
        this.svgInput.style.opacity = 1;
        this.textInput.innerText = "Encendido";
        this.textInput.style.color = "var(--onText)";
        this.textInput.style.background = "var(--on)";
        this.textInput.style.boxShadow = `0px 0px 0px 2px var(--onText),
                                          inset 0px 0px 0px 3px var(--on)`;
    }

    setOffUI() {
        this.svgInput.style.opacity = 0.4;
        this.textInput.innerText = "Apagado";
        this.textInput.style.color = "var(--offText)";
        this.textInput.style.background = "var(--off)";
        this.textInput.style.boxShadow = `0px 0px 0px 2px var(--offText),
                                          inset 0px 0px 0px 3px var(--off)`;
    }
}

class SETTINGSVALUE extends SETTINGS {
    constructor(button, textRanger = null, valueObject, setDefault, functioner) {
        super(valueObject, setDefault);
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

    resetRanger(idReset) {
        idReset.addEventListener("click", () => {
            this.changeSetting(this.setDefault);
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
    constructor(valueObject, setDefault) {
        super(valueObject, setDefault);
    }

    changeSetting(value) {
        if (value != undefined) {
            gameSB.settings[this.valueObject] = value;
        }
    }
}

function init() {
const settingColor = new SETTINGSARRAY("color", [264, 100, 50]);

//AUTOSETTINGS
let colorLight = 90;
let valueShadersTerrain = 12;
const changeMaterial = () => {
    console.log(valueShadersTerrain)
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

//TODO AUDIO
document.addEventListener("click", () => {
    audioAmbient.play();
    audioClick.load();
});

audioAmbient.loop = true;

settingSoundAmbient = new SETTINGSVALUE(rangeSoundAmbient, textSoundAmbient, "soundAmbient", 100,
    (value) => {
        audioAmbient.volume = value / 100;
    }
);
settingSoundAmbient.createRanger();

settingSoundInteract = new SETTINGSVALUE(rangeSoundInteract, textSoundInteract, "valueSoundInteract", 100,
    (value) => {
        audioClick.volume = value / 100;
    }
);
settingSoundInteract.createRanger();

settingSoundSystem = new SETTINGSVALUE(rangeSoundSystem, textSoundSystem, "valueSoundSystem", 100,
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

            auxMenuTrain.style.opacity = 0;
            auxMenuTrain.style.pointerEvents = "none";
            if (auxCardTrain != null) {
                auxCardTrain.parentElement.className = "cardStats";
                auxCardTrain.parentElement.style.rotate = "0deg";
                auxCardTrain.parentElement.style.scale = "1";
            }
            menuNoneTrain.style.opacity = 1;
            menuNoneTrain.style.pointerEvents = "inherit";

            menu.style.translate = "0px";
            auxOrder = order;
            auxFunc = func;
            auxMenuPerfil = menu;
            auxMenuTrain = menuNoneTrain;
            auxCardTrain = null;
        }
    });
}

goPerfilMenu(openStats, boxPerfilStats, "Estadísticas", "fi-rr-chart-histogram", 0);
goPerfilMenu(openTrain, boxPerfilTrain, "Entrenamiento", "fi-rr-bullseye-arrow", 1, inTrainMenu);

const goMenuTrain = (idEvent, menu, className) => {
    idEvent.addEventListener("click", () => {
        if (auxMenuTrain != menu) {
            auxMenuTrain.style.opacity = 0;
            auxMenuTrain.style.pointerEvents = "none";
            if (auxCardTrain != null) {
                auxCardTrain.parentElement.className = "cardStats";
                auxCardTrain.parentElement.style.rotate = "0deg";
                auxCardTrain.parentElement.style.scale = "1";
            }
            idEvent.parentElement.className = "cardStats " + className;
            idEvent.parentElement.style.rotate = "4deg";
            idEvent.parentElement.style.scale = "0.9";
            menu.style.opacity = 1;
            menu.style.pointerEvents = "inherit";
            auxMenuTrain = menu;
            auxCardTrain = idEvent;
        }
    })
}

goMenuTrain(openPower, menuPower, "redShadow");
goMenuTrain(openVita, menuVita, "greenShadow");
goMenuTrain(openRes, menuRes, "blueShadow");
goMenuTrain(openLea, menuLea, "yellowShadow");

//MENU SYSTEM
let auxIdEvent = null;
let auxGoMenu = null;
let auxTask = null;
let isOpenMenu = false;
const closeMenuAnimation = () => {
    auxIdEvent.style.opacity = 1;
    auxIdEvent.style.pointerEvents = "inherit";
    auxGoMenu.style.display = "none"
}

const closeMenu = (idEvent) => {
    idEvent.addEventListener("mousedown", () => {
        taskHome.style.borderRadius = "42px";
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
            exiterTrain.style.display = "none";
            statsTrain.style.display = "none";
            statsInfoTask.style.display = "flex";
            timeInfoTask.style.display = "none";
            setTimeout(() => {
                updateStats();
            }, 500)
        }
        
        menu.style.display = "flex"
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

closeMenu(goPower);
closeMenu(goVita);
closeMenu(goRes);
closeMenu(goLea);

const startTrain = (idEvent) => {
    idEvent.addEventListener("mousedown", () => {
        taskHome.style.width = "400px";
        openHome.style.display = "none";
        openProfile.style.display = "none";
        exiterTrain.style.display = "flex";
        statsTrain.style.display = "flex";
        statsInfoTask.style.display = "none";
        timeInfoTask.style.display = "flex";
    });
}

startTrain(goPower);
startTrain(goVita);
startTrain(goRes);
startTrain(goLea);

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

settingSearch = new SETTINGSTOOGLE(buttonSearch, "search", true,
    () => {
        settingSearch.setOnUI();
        showSearch();
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
settingScrollBar = new SETTINGSTOOGLE(buttonScrollBar, "scrollBar", false,
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

//TODO NOTIFICATION
const pushNotification = (desc) => {
    const createNotif = document.createElement("div");
    createNotif.className = "popUpNotification";

    const textNotif = document.createElement("div");
    textNotif.className = "boxDesc";
    textNotif.innerText = desc;

    createNotif.appendChild(textNotif);
    document.body.appendChild(createNotif);

    setTimeout(() => {
        createNotif.style.translate = "-50% 0%";
        audioNotif.load();
    }, 10);

    setTimeout(() => {
        createNotif.style.translate = "-50% calc(-100% - 60px)";
    }, 5000);

    setTimeout(() => {
        createNotif.remove();
    }, 6000);
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

//
//TODO GAME
//

settingClickSplash = new SETTINGSTOOGLE(buttonClickSplash, "clickSplash", true,
    () => {
        settingClickSplash.setOnUI();
    },
    () => {
        settingClickSplash.setOffUI();
    }
);
settingClickSplash.setChange();

settingClickText = new SETTINGSTOOGLE(buttonClickText, "clickText", true,
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

let progressTotal;
let touchPower;
let gainEnergy;
let lowCost;
let production;

const updateStats = () => {
    touchPower = 1 + Math.floor(gameSB.data["valuePower"]) / 10 * 0.1;
    gainEnergy = 1 + Math.floor(gameSB.data["valueDef"]) / 20 * 0.05;
    lowCost = 1 + Math.floor(gameSB.data["valueHealth"]) / 100 * 0.01;
    production = 0 + Math.floor(gameSB.data["valuePower"]) / 10 * 0.05 + Math.floor(gameSB.data["valueHealth"]) / 10 * 0.15;

    textTouchPower.innerText = Number(touchPower.toFixed(2));
    textGainEnergy.innerText = Number(gainEnergy.toFixed(2));
    textLowCost.innerText = "x" + Number(lowCost.toFixed(2));
    textProduction.innerText = Number(production.toFixed(2)) + " / 5s";

    progressTotal = Number((10 / lowCost + 10 * ((gameSB.data["valueEnergy"] / lowCost ** (1 / 1.5)) ** 1.5)).toFixed(0));
    gameSB.data["totalPower"] = gameSB.data["valuePower"] + gameSB.data["valueHealth"] + gameSB.data["valueDef"];
    totalPower.innerText = gameSB.data["totalPower"];
}

//TODO STATS GENERAL
textTimeTotal.innerText = gameSB.data["totalTime"] + " min";
textTotalClicks.innerText = gameSB.data["totalClicks"];

const upClick = () => {
    gameSB.data["totalClicks"] = gameSB.data["totalClicks"] + 1;
    textTotalClicks.innerText = gameSB.data["totalClicks"];
}

textTotalEnergy.innerText = gameSB.data["totalEnergy"];
const upEnergy = (amount) => {
    gameSB.data["totalEnergy"] = gameSB.data["totalEnergy"] + amount;
    textTotalEnergy.innerText = gameSB.data["totalEnergy"];
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
    textTimeTotal.innerText = gameSB.data["totalTime"] + " min";
    timeAchieve.update();
    trainAchieve.update();
    powerAchieve.update();

    textTotalAwards.innerText = (gameSB.data["lvlTotalClicks"] + gameSB.data["lvlTotalTime"] + gameSB.data["lvlTotalEnergy"] + gameSB.data["lvlTotalClicks"]) + " / " + totalAwards;
}, 60000);

//

let progress = 0;
infoEnergy.innerText = Number(gameSB.data["valueEnergy"].toFixed(2));
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

const gainProgress = (gain, e, isManually = false) => {
    progress += gain;
    if (progress >= progressTotal) {
        progress = 0;
        const amount = gainEnergy;
        upEnergy(Number(amount.toFixed(2)));
        gameSB.data["valueEnergy"] += Number(amount.toFixed(2));
        infoEnergy.innerText = Number(gameSB.data["valueEnergy"].toFixed(2));
        progressTotal = Number((10 / lowCost + 10 * ((gameSB.data["valueEnergy"] / lowCost ** (1 / 1.5)) ** 1.5)).toFixed(0));
        energyAchieve.update();

        if (settingClickText.getValue() && isManually) {
            const boxNumber = document.createElement("div");
            boxNumber.className = "boxerNumber";
            const textNumber = document.createElement("div");
            textNumber.className = "texterNumber";
            const svg = document.createElement("div");
            svg.className = "svgResource";
            svg.innerHTML = `<svg width="20" height="28" viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M30.2307 1.21802C30.3188 0.82251 30.4091 0.416992 30.5 0C12.3076 13.5551 3.0224 27.8737 0.647034 39.3245C0.223755 41.1479 0 43.0477 0 45C0 58.8071 11.1929 70 25 70C38.8071 70 50 58.8071 50 45C50 37.3114 46.5292 30.4335 41.069 25.8475C27.5489 13.2605 28.4195 9.35107 30.2307 1.21802Z" fill="var(--colorMain)"/>
            <circle cx="25" cy="45" r="16" fill="white"/>
            <circle cx="25" cy="45" r="10" fill="var(--colorMainFill)"/>
            </svg>`;

            boxNumber.style.left = (e.clientX) + "px";
            boxNumber.style.top = (e.clientY - 20) + "px";
            boxNumber.appendChild(textNumber);
            boxNumber.appendChild(svg);
            document.body.appendChild(boxNumber);

            textNumber.innerText = "+" + gainEnergy;

            setTimeout(() => {
                document.body.removeChild(boxNumber);
            }, 1200);
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
}, 5000)

//
//TODO THREE JS
//
const scene = new THREE.Scene();
const color = new THREE.Color("hsl(264, 100%, 90%)");
scene.background = color;
scene.fog = new THREE.FogExp2(color, 0.0016);

//TODO CAMERAS
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 4800);
camera.lookAt(0,0,0);
camera.position.set(0, 100, 400);

//TODO RENDER
let renderer = new THREE.WebGLRenderer({canvas: worldGame, powerPreference: "high-performance", antialias: false});
settingAntialias = new SETTINGSTOOGLE(buttonAntialias, "antialias", false,
    () => {
        settingAntialias.setOnUI();
        renderer["antialias"] = true;
    },
    () => {
        settingAntialias.setOffUI();
        renderer["antialias"] = false;
    }
);
settingAntialias.setChange();

renderer.setClearColor(color);
renderer.setSize( window.innerWidth / 1, window.innerHeight / 1 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

settingResolution = new SETTINGSVALUE(rangeResolution, textResolution, "resolution", 1,
    (value) => {
        renderer.setPixelRatio( window.devicePixelRatio * value );
        composer.renderer = renderer;
    }
);
const composer = new EffectComposer(renderer);
settingResolution.createRanger();
settingResolution.resetRanger(resetResolution);

const stats = new Stats();
document.body.appendChild(stats.dom);
settingStatsFPS = new SETTINGSTOOGLE(buttonStatsFPS, "statsFPS", false,
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

settingBloom = new SETTINGSTOOGLE(buttonBloom, "bloom", false,
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

settingImage = new SETTINGSTOOGLE(buttonImage, "image", false,
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

settingRender = new SETTINGSTOOGLE(buttonRender, "render", false,
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

const geometryIcoA = new THREE.IcosahedronGeometry(60, 5);
const materialIcoA = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.55, side: THREE.BackSide });
const meshIcoA = new THREE.Mesh( geometryIcoA, materialIcoA );
orb.add( meshIcoA );

const geometryIcoB = new THREE.IcosahedronGeometry(40, 5);
const materialIcoB = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, fog: false, side: THREE.BackSide, roughness: 1, clearcoat: 0.75, clearcoatRoughness: 0.25 });
const meshIcoB = new THREE.Mesh( geometryIcoB, materialIcoB );
orb.add( meshIcoB );

const geometryIcoC = new THREE.IcosahedronGeometry(28, 5);
const materialIcoC = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
const meshIcoC = new THREE.Mesh( geometryIcoC, materialIcoC );
orb.add( meshIcoC );

const geometryIcoD = new THREE.IcosahedronGeometry(56, 5);
const materialIcoD = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.55, side: THREE.BackSide });
const meshIcoD = new THREE.Mesh( geometryIcoD, materialIcoD );
orb.add( meshIcoD );

const geometryIcoWA = new THREE.IcosahedronGeometry(44, 5);
const materialIcoWA = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, wireframe: true, roughness: 1, clearcoat: 0.75, clearcoatRoughness: 0.25 });
const meshIcoWA = new THREE.Mesh( geometryIcoWA, materialIcoWA );
orb.add( meshIcoWA );

const torus = new THREE.Group();

const geometryTorusA = new THREE.TorusGeometry(80, 12, 30, 96);
const materialTorusA = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.9, side: THREE.BackSide });
const meshTorusA = new THREE.Mesh( geometryTorusA, materialTorusA );
torus.add( meshTorusA );

const geometryTorusB = new THREE.TorusGeometry(80, 9, 30, 96);
const materialTorusB = new THREE.MeshPhysicalMaterial({ color: 0x6600ff, roughness: 1, clearcoat: 1, clearcoatRoughness: 0.15 });
const meshTorusB = new THREE.Mesh( geometryTorusB, materialTorusB );
torus.add( meshTorusB );
orb.add(torus);

scene.add(orb);

const geometryTerrain = new THREE.PlaneGeometry(3500, 3500, 150, 150);
const geometryTerrainStatic = new THREE.PlaneGeometry(3500, 3500, 150, 150);
const materialTerrain = new THREE.MeshStandardMaterial({ color: 0x6600ff, roughness: 0.5, metalness: 0.4 });
const meshTerrain = new THREE.Mesh( geometryTerrain, materialTerrain );
scene.add( meshTerrain );

settingTerrain = new SETTINGSTOOGLE(buttonTerrain, "terrain", false,
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

settingTerrainAnimation = new SETTINGSTOOGLE(buttonTerrainAnimation, "terrainAnimation", true,
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

settingShadow = new SETTINGSTOOGLE(buttonShadow, "shadow", false,
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
settingControl = new SETTINGSTOOGLE(buttonControl, "control", false,
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
controls.zoomSpeed = 2;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 300;
controls.maxDistance = 800;

settingRotation = new SETTINGSTOOGLE(buttonRotation, "rotation", true,
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

settingRotateDamp = new SETTINGSVALUE(rangeRotateDamp, textRotateDamp, "rotateDamp", 0.05,
    (value) => {
        controls.dampingFactor = value;
    }
);
settingRotateDamp.createRanger();
settingRotateDamp.resetRanger(resetRotateDamp);

settingRotateSpeed = new SETTINGSVALUE(rangeRotateSpeed, textRotateSpeed, "rotateSpeed", 1,
    (value) => {
        controls.rotateSpeed = value;
    }
);
settingRotateSpeed.createRanger();
settingRotateSpeed.resetRanger(resetRotateSpeed);

settingRotateSpeedAuto = new SETTINGSVALUE(rangeRotateSpeedAuto, textRotateSpeedAuto, "rotateSpeedAuto", 1,
    (value) => {
        controls.autoRotateSpeed = value;
    }
);
settingRotateSpeedAuto.createRanger();
settingRotateSpeedAuto.resetRanger(resetRotateSpeedAuto);

settingZoomSpeed = new SETTINGSVALUE(rangeZoomSpeed, textZoomSpeed, "zoomSpeed", 2,
    (value) => {
        controls.zoomSpeed = value;
    }
);
settingZoomSpeed.createRanger();
settingZoomSpeed.resetRanger(resetZoomSpeed);

//TODO ANIMATION
scene.matrixWorldAutoUpdate = true;
const animate = () => {
    requestAnimationFrame(animate);

    if (playAnimate) {
        controls.update();

        //Animation
        const time = clock.getElapsedTime();

        if (settingTerrainAnimation.getValue()) {
            const positionWaves = geometryTerrain.attributes.position;
            positionWaves.needsUpdate = true;

            const countPar = positionWaves.count;
            for (let i = 0; i < countPar; i++) {

                const z = 12 * Math.sin(i / 3 + Math.sin(time) / 5 + time) + 12 * Math.cos(-i / 12 + time);
                positionWaves.setZ(i, z);

            }
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
        const scaleD = Math.cos((time * 1.25) * 1.333 + 0.5) * 0.025;

        meshIcoA.scale.set(1 + scaleA, 1 + scaleA, 1 + scaleA);
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

settingTheme = new SETTINGSTOOGLE(buttonTheme, "theme", false,
    (input) => {
        input["svg"].className = "fi-rr-moon subIcon"
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

settingGlass = new SETTINGSTOOGLE(buttonGlass, "glass", false,
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

settingColorSelector = new SETTINGSVALUE(groupColors, colorText, "colorSelector", 1,
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
        materialTorusB.color = new THREE.Color("hsl(" + settingColor.getValue()[0] + ", " + settingColor.getValue()[1] + "%, " + settingColor.getValue()[2] + "%)");
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
    const logScreenX = (e.pageX / window.outerWidth) * 100;
    const logScreenY = (e.pageY / window.outerHeight) * 100;
    const isLessX = logScreenX < 50;
    let positionWay;
    isLessX ? positionWay = e.pageX + 10 : positionWay = (e.pageX - 10) - displayTool.clientWidth
    screenType(e.pageY, logScreenY, positionWay);
});

//TODO INFO
let showContext;
let showWarning;
settingTool = new SETTINGSTOOGLE(buttonTool, "valueTool", true,
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

settingToolWarn = new SETTINGSTOOGLE(buttonToolWarn, "valueToolWarn", true,
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
    idEvent.addEventListener("mousemove", (e) => {
        if ((showContext && typeMessage == "context") || (showWarning && typeMessage == "warning") || typeMessage == "important") {
            toolMove.style.visibility = "visible"
            displayTool.style.transform = "scale(1)"
            displayTool.style.opacity = "1"

            e.target.addEventListener("mouseout", () => {

                toolMove.style.visibility = "hidden"
                displayTool.style.transform = "scale(0.8)"
                displayTool.style.opacity = "0"

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
"Recurso común para comprar mejoras y acciones",
null
);

getInformation(buttonAntialias, "warning", null, "Aviso", "Se reiniciará la página",
"Al aplicarlo, se refrescará la página volviendo al inicio",
null
);

getInformation(resetConfig, "warning", null, "¿Seguro?", "Acción no recomendable",
"Una vez presionado, los datos de configuración se restablecerán despúes de reiniciar la página",
"En efecto, no podrás volver los datos que has cambiado"
);

getInformation(resetAll, "important", null, "Hora de despedir...", "Acción no recomendable",
"Una vez presionado, todos los datos se perderán despúes de reiniciar la página",
"En efecto, no podrás recuperar los datos que has progresado una vez hecho esta acción"
);

getInformation(textInfoPower, "context", null, "Poder", "Atributo general",
"Poder que suma todos los atributos del alma y equipamentos del alma.",
null
);

getInformation(textPower, "context", null, "Potencia", "Atributo",
"Atributo que aumenta el ataque, la potencia del toque y la producción baja",
"Cada 25 puntos, +ataque; Cada 10 puntos, +toque y +producción"
);

getInformation(textVita, "context", null, "Vitalidad", "Atributo",
"Atributo que aumenta la salud, el coste de la energía y la producción alta",
"Cada 10 puntos, +salud y ++producción; Cada 100 puntos, -coste"
);

getInformation(textRes, "context", null, "Dureza", "Atributo",
"Atributo que aumenta el aguante, la defensa y el impulso de energía",
"Cada 300 puntos, +aguante; Cada 20 puntos, +energía; La defensa depende de los puntos"
);

getInformation(textLea, "context", null, "Lealtad", "Atributo",
"Atributo que aumenta el crecimiento de la lealtad y la lealtad permanente",
"Cada 15 puntos, +lealtad permanente; Cada 5 puntos; +crecimiento de la lealtad"
);

getInformation(textHealth, "context", null, "Salud", "Atributo de vitalidad",
"Atributo que indica cúanta vida tiene el alma",
"Si su vida es 0, se reiniciará las creencias hasta su lealtad permanente y se perderá la mitad de energía y el progreso"
);

getInformation(textStamina, "context", null, "Aguante", "Atributo de dureza",
"Atributo que indica cúanta resistencia tiene el alma",
"Si su aguante es inferior a 50%, el crecimiento de la lealtad se detendrá; Si su aguante es inferior a 10%, el crecimiento de la lealtad lo declarará como pérdida hasta 5x"
);

getInformation(textDefen, "context", null, "Defensa", "Atributo de dureza",
"Atributo que indica cúanta armadura tiene el alma",
"La armadura máxima llega hasta 85%"
);

getInformation(textAtk, "context", null, "Ataque", "Atributo de potencia",
"Atributo que indica cúanto daño puede causar contra los Kurotamas (Almas negras)",
null
);

getInformation(textTap, "context", null, "Toque", "Atributo de potencia",
"Atributo que indica cúanta cantidad de progreso acumula por toque",
null
);

getInformation(textEner, "context", null, "Energía", "Atributo de dureza",
"Atributo que indica cúanta cantidad de energía acumula cuando la barra de progreso está lleno",
"Nota: cuanto mayor energía tiene, el coste afectará en relación de esa energía almacenada, pues el alma tiene los límites de almacenar energía"
);

getInformation(textCost, "context", null, "Coste", "Atributo de vitalidad",
"Atributo que divide el coste de la barra del progreso necesita para acumular la energía",
null
);

getInformation(textPro, "context", null, "Producción", "Atributo de vitalidad o potencia",
"Atributo que acumula progreso por 5 segundos",
null
);

getInformation(textLeaP, "context", null, "Lealtad permanente", "Atributo de lealtad",
"Atributo que fija la cantidad de las creencias sin sufrir pérdidas",
null
);

getInformation(textLeaC, "context", null, "Crecimiento", "Atributo de lealtad",
"Atributo que crece las creencias por 10 segundos",
null
);

getInformation(gemSoulBox, "context", null, "Alma gema", "Recurso valioso",
"Útil para compras de mejoras permanentes y potenciadores de tiempo",
null
);

//TOOLTIP
let showWord;
settingToolTip = new SETTINGSTOOGLE(buttonToolTip, "valueToolTip", true,
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
            middleware: [offset(12)]
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
            if (words == "showProgressEnergy") {
                tooltip.innerText = (Number(progress.toFixed(2)) + " / " + progressTotal);
            } else {
                tooltip.innerText = words;
            }
            updateToolTip();
        }
    }
    
    const hideTooltip = () => {
        tooltip.style.opacity = 0;
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
goToolTip(exiterTrain, "left", "Salir");
goToolTip(openStats, "top", "Estadísticas");
goToolTip(openTrain, "top", "Entrenamiento");
goToolTip(buttonExitGame, "top", "Salir");
goToolTip(buttonSaveAs, "top", "Guardar como");
goToolTip(buttonSave, "top", "Guardar");
goToolTip(barEnergy, "top", "showProgressEnergy", "number");

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

const setSettingNewDefaultToogle = (objectSetting) => {
	objectSetting.isNewDefault();
	objectSetting.setToogle();
}

const setSettingNewDefaultRanger = (objectSetting) => {
    objectSetting.isNewDefault();
    objectSetting.ranger();
}

const setSettingNewDefaultDropDown = (objectSetting) => {
	objectSetting.isNewDefault();
    objectSetting.droper();
}

const setNewDefault = () => {
    setSettingNewDefaultRanger(settingSoundAmbient);
    setSettingNewDefaultRanger(settingSoundInteract);
    setSettingNewDefaultRanger(settingSoundSystem);
    setSettingNewDefaultRanger(settingResolution);
    setSettingNewDefaultRanger(settingRotateDamp);
    setSettingNewDefaultRanger(settingRotateSpeed);
    setSettingNewDefaultRanger(settingRotateSpeedAuto);
    setSettingNewDefaultRanger(settingZoomSpeed);

    setSettingNewDefaultDropDown(settingColorSelector);

    setSettingNewDefaultToogle(settingSearch);
    setSettingNewDefaultToogle(settingScrollBar);
    setSettingNewDefaultToogle(settingClickSplash);
    setSettingNewDefaultToogle(settingClickText);
    setSettingNewDefaultToogle(settingAntialias);
    setSettingNewDefaultToogle(settingStatsFPS);
    setSettingNewDefaultToogle(settingBloom);
    setSettingNewDefaultToogle(settingImage);
    setSettingNewDefaultToogle(settingRender);
    setSettingNewDefaultToogle(settingTerrain);
    setSettingNewDefaultToogle(settingTerrainAnimation);
    setSettingNewDefaultToogle(settingShadow);
    setSettingNewDefaultToogle(settingControl);
    setSettingNewDefaultToogle(settingRotation);
    setSettingNewDefaultToogle(settingTool);
    setSettingNewDefaultToogle(settingToolWarn);
    setSettingNewDefaultToogle(settingToolTip);
	setSettingNewDefaultToogle(settingTheme);
    setSettingNewDefaultToogle(settingGlass);
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

    setNewGame();

    init();
    playAnimate = true;
	setNewDefault();

    console.log(JSON.stringify(gameSB));
	onBeforeUnload();
})

buttonLoadGame.addEventListener("click", async () => {
	try {
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
        gameSB = null;
        console.log(gameSB);
		gameSB = JSON.parse(text);
        console.log(gameSB);
		
		if (gameSB.codeGame == "Soul Breaker") {
			quitWelcome();
			buttonSave.style.opacity = 1;
			buttonSave.style.pointerEvents = "inherit";
            idTextFile.innerText = fileHandle.name;

            init();
            playAnimate = true;
            setNewDefault();
            //init();

			onBeforeUnload();
		} else {
			console.error("El archivo introducido es inválido");
            setNewGame();
		}
	} catch {
		console.error("Se ha cancelado la solicitud");
	}
})

const save = async () => {
	try {
	let stream = await fileHandle.createWritable();
	await stream.write(JSON.stringify(gameSB));
	await stream.close();
	} catch {}
}

buttonSave.addEventListener("click", save);

buttonSaveAs.addEventListener("click", async () => {
	try {
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
		idTextFile.innerText = fileHandle.name;
	} catch {}
})

buttonExitGame.addEventListener("click", () => {
    location.reload();
})

//TODO DATA
resetConfig.addEventListener("click", () => {
    location.reload();
});

resetAll.addEventListener("click", () => {
    location.reload();
});

localStorage.clear();
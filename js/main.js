import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';

//

import {computePosition, offset} from '@floating-ui/dom';

import Stats from 'three/addons/libs/stats.module'

//TODO SETTINGS
const root = document.querySelector(":root");

class SETTINGS {
	constructor(valueStorage, setDefault) {
        this.valueStorage = valueStorage;
        this.setDefault = setDefault;
        if (typeof(Storage) !== "undefined") {
			if (localStorage[valueStorage]) {
			} else {
				localStorage[valueStorage] = JSON.stringify(setDefault);
			}
		}
        this.reset();
	}

    get getLocalStorage() {
        return JSON.parse(localStorage[this.valueStorage].toLowerCase());
    }

    reset() {
        resetConfig.addEventListener("click", () => {
            localStorage[this.valueStorage] = JSON.stringify(this.setDefault);
        });
    }
}

class SETTINGSTOOGLE extends SETTINGS {
    constructor(button, valueStorage, setDefault) {
        super(valueStorage, setDefault);
        this.button = button;
        this.svgInput = button.children[0];
        this.textInput = button.children[2].children[0];
        this.caller = null;
    }

    changeSetting() {
        const isTrue = localStorage[this.valueStorage] == "true";
        isTrue ? localStorage[this.valueStorage] = false : localStorage[this.valueStorage] = true;
    }

    setSettingToogle(boolean) {
        localStorage[this.valueStorage] = boolean;
        this.switcher(this.caller);
    }

    switcher = (functioner) => {
        let actionToogle;
        const isTrue = localStorage[this.valueStorage] == "true";
        isTrue ? actionToogle = functioner.on : actionToogle = functioner.off;
        
        if (actionToogle != null) {
            actionToogle({svg: this.svgInput, text: this.textInput});
        }
    }

    create = (functionSetting) => {
        this.caller = functionSetting;
        this.switcher(functionSetting);
    
        this.button.addEventListener("click", () => {
            this.changeSetting();
            this.switcher(functionSetting);
        })
    }

    setOnUI() {
        this.svgInput.style.opacity = 1;
        this.textInput.innerText = "Activado";
        this.textInput.style.color = "var(--onText)";
        this.textInput.style.background = "var(--on)";
    }

    setOffUI() {
        this.svgInput.style.opacity = 0.4;
        this.textInput.innerText = "Desactivado";
        this.textInput.style.color = "var(--offText)";
        this.textInput.style.background = "var(--off)";
    }
}

class SETTINGSVALUE extends SETTINGS {
    constructor(button, textRanger = null, valueStorage, setDefault) {
        super(valueStorage, setDefault);
        this.button = button;
        this.textRanger = textRanger;
        this.caller = null;
    }

    changeSetting(value) {
        if (value != undefined) {
            localStorage[this.valueStorage] = value;
        }
    }

    //RANGER
    ranger(functioner) {
        const caller = functioner;
        caller(this.setRanger());
    }

    createRanger = (functioner) => {
        this.caller = functioner;
        this.ranger(functioner);
    
        this.button.addEventListener("input", (e) => {
            this.changeSetting(e.target.value);
            this.ranger(functioner);
        })
    }

    resetRanger = (idReset) => {
        idReset.addEventListener("click", () => {
            this.changeSetting(this.setDefault);
            this.caller(this.setRanger());
        });
    }

    setRanger = () => {
        const val = this.getLocalStorage;
        this.textRanger.innerText = val;
        this.button.value = val;
        this.button.style.backgroundSize = (val - this.button.min) * 100 / (this.button.max - this.button.min) + "% 100%";
        return val;
    }

    //DROPDOWN
    droper = (functioner) => {
        const caller = functioner;
        const val = this.getLocalStorage;
        caller(val, this.button, this.textRanger);
    }

    createDropDown = (functioner) => {
        for(let i = 0; i < this.button.children.length; i++) {
            this.button.children[i].value = i;
        }

        this.droper(functioner);

        this.button.addEventListener("click", (e) => {
            this.changeSetting(e.target.value);
            this.droper(functioner);
        })
    }
}

class SETTINGSARRAY extends SETTINGS {
    constructor(valueStorage, setDefault) {
        super(valueStorage, setDefault);
    }

    changeSetting(value) {
        if (value != undefined) {
            localStorage[this.valueStorage] = JSON.stringify(value);
        }
    }

    changeSettingOnePicker(position, value) {
        const values = JSON.parse(localStorage[this.valueStorage]);
        if (value != undefined) {
            values[position] = value;
            localStorage[this.valueStorage] = JSON.stringify(values);
        }
    }

    get getLocalStorage() {
        return JSON.parse(localStorage[this.valueStorage]);
    }
}

const settingColor = new SETTINGSARRAY("valueColor", [264, 100, 50]);
const valueShadersTerrain = new SETTINGSARRAY("valueShaders", [0, 20]);

//AUTOSETTINGS
let colorLight;
const changeMaterial = () => {
    try {
        materialTerrain.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + (settingColor.getLocalStorage[2] - (valueShadersTerrain.getLocalStorage[0] - valueShadersTerrain.getLocalStorage[1])) + "%)");
    } catch {}
}

const changeScene = () => {
    try {
        scene.background = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + colorLight + "%)");
        scene.fog.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + colorLight + "%)");
    } catch {}
}

//TODO POSTPROCESSING
//EFECTO BLOOM
const bloomPass = new UnrealBloomPass(new THREE.Vector2(2048, 2048));

//TODO FUNCTIONS
const showSearch = () => {
    textSearch.style.opacity = 1;
    textSearch.style.pointerEvents = "all";
    buttonEraseSearch.style.opacity = 1;
    buttonEraseSearch.style.pointerEvents = "all";
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

let auxMenu = null;
const goMenu = (idEvent, menu, name, className) => {
    idEvent.addEventListener("click", () => {
        goMain.style.pointerEvents = "all";
        goMain.style.opacity = 1;
        goNext.style.opacity = 1;
        svgNextIn.className = "svgIconIn " + className;
        svgNext.style.transform = "scale(1) rotateZ(0deg)";
        nextText.style.transform = "translateX(0px)";
        nextText.innerText = name;
        menu.style.transform = "translateX(0px)";
        mainMenu.style.transform = "translateX(-640px)";
        iconHome.style.opacity = 0.4;
        iconHome.style.scale = 0.8;
        auxMenu = menu;
        if (localStorage["valueSearch"] == "true" && nextText.innerText == "Configuración") {
            showSearch();
        }
    });
}

goMenu(goSettings, menuSettings, "Configuración", "mainHomeSvg");
goMenu(goStats, menuStats, "Estadísticas", "statsSvg");
goMenu(goAward, menuAward, "Logros", "awardSvg");
goMenu(goTutorial, menuTutorial, "Tutorial", "tipSvg");
goMenu(goAbout, menuAbout, "Acerca de", "aboutSvg");
goMenu(goVersions, menuVersions, "Versiones", "versionSvg");

goMain.addEventListener("click", () => {
    goMain.style.pointerEvents = "none";
    goMain.style.opacity = 0;
    goNext.style.opacity = 0;
    svgNext.style.transform = "scale(0) rotateZ(-45deg)";
    nextText.style.transform = "translateX(-200px)";
    auxMenu.style.transform = "translateX(640px)";
    mainMenu.style.transform = "translateX(0px)";
    iconHome.style.opacity = 1;
    iconHome.style.scale = 1;
    hideSearch();
});

//MENU SYSTEM
let auxIdEvent = null;
let auxGoMenu = null;
let isOpenMenu = false;
const closeMenuAnimation = () => {
    auxIdEvent.style.opacity = 1;
    auxIdEvent.style.pointerEvents = "all";
    auxGoMenu.style.opacity = 0;
    auxGoMenu.style.scale = 0.8;
    auxGoMenu.style.pointerEvents = "none";
}

const closeMenu = (idEvent) => {
    idEvent.addEventListener("mousedown", () => {
        taskHome.style.borderRadius = "36px";
        taskHome.style.height = "calc(72px)"
        lineHome.style.transform = "translateX(-50%) translateY(0px)"
        home.style.transition = "0.36s cubic-bezier(0.2, 1, 0.4, 1)";
        home.style.height = "84px";
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

const goOpen = (idEvent, menu, moreTask = false) => {
    idEvent.addEventListener("click", () => {
        taskHome.style.borderRadius = "12px 12px 36px 36px";
        home.style.transition = "0.44s cubic-bezier(0.2, 1.36, 0.4, 1)";
        home.style.height = "calc(800px)";
        if (window.innerHeight < 860) {
            home.style.height = "calc(" + window.innerHeight + "px - 60px)";
        }
        idEvent.style.opacity = 0;
        idEvent.style.pointerEvents = "none";
        menu.style.opacity = 1;
        menu.style.scale = 1;
        menu.style.pointerEvents = "all";
        blockContent.style.display = "block";
        isOpenMenu = true;

        if (moreTask) {
            taskHome.style.height = "calc(144px)"
            lineHome.style.transform = "translateX(-50%) translateY(-72px)"
        } else {
            taskHome.style.height = "calc(72px)"
            lineHome.style.transform = "translateX(-50%) translateY(0px)"
        }

        if (auxIdEvent != null) {
            closeMenuAnimation();
        }

        auxGoMenu = menu;
        auxIdEvent = idEvent;
    });
}

goOpen(openHome, startMenu);
goOpen(openProfile, profileMenu, true);

window.addEventListener("resize", () => {
    if (isOpenMenu) {
        home.style.height = "calc(800px)";
        if (window.innerHeight < 860) {
            home.style.height = "calc(" + window.innerHeight + "px - 60px)";
        }
    }
})

//TODO PAGE
let page = 1;
const pageLimit = 2;

const setPage = (page) => {
    idPage.innerText = page + " / " + pageLimit;
    switch (page) {
        case 1:
            idDescTut.innerText = "Te damos la bienvenida a este tutorial para recomendarte a jugar con experiencias sin problemas. Este juego consiste en una plataforma idle basado de un mundo relajante 3D con colores. Pero hay una manera más divertida y activa para no quedarse aburrido, introduciremos unos nuevos mecanismos del juego, a dificultad incremental. A continuación, veremos las siguientes indicaciones que vamos a aprender.";
            titleTut.innerText = "Bienvenida del tutorial";
            imgTut.className = "boxImg tut1Png";
            break;
        case 2:
            idDescTut.innerText = "???";
            titleTut.innerText = "???";
            imgTut.className = "boxImg tut2Png";
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

const settingSearch = new SETTINGSTOOGLE(buttonSearch, "valueSearch", true);
settingSearch.create({
    on: () => {
        settingSearch.setOnUI();
        showSearch();
    },

    off:() => {
        settingSearch.setOffUI();
        hideSearch();
    }
})

hideSearch();

//TODO POP-UP WINDOW
const openWindow = (idWindow) => {
    tapeWindow.style.display = "block";
    idWindow.style.display = "flex";
    setTimeout(() => {
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

const settingClickSplash = new SETTINGSTOOGLE(buttonClickSplash, "valueClickSplash", true);
settingClickSplash.create({
    on: () => {
        settingClickSplash.setOnUI();
    },

    off:() => {
        settingClickSplash.setOffUI();
    }
})

const settingClickText = new SETTINGSTOOGLE(buttonClickText, "valueClickText", true);
settingClickText.create({
    on: () => {
        settingClickText.setOnUI();
    },

    off:() => {
        settingClickText.setOffUI();
    }
})

//TODO RESOURCES GENERAL
if (typeof(Storage) !== "undefined") {
    if (localStorage["gemSoul"]) {
    } else {
        localStorage["gemSoul"] = 0;
    }
}

textGemSoul.innerText = Number(localStorage["gemSoul"]);

//TODO STATS GENERAL
if (typeof(Storage) !== "undefined") {
    if (localStorage["totalTime"]) {
    } else {
        localStorage["totalTime"] = 0;
    }
}

textTimeTotal.innerText = Number(localStorage["totalTime"]) + " min";

if (typeof(Storage) !== "undefined") {
    if (localStorage["totalClicks"]) {
    } else {
        localStorage["totalClicks"] = 0;
    }
}

textTotalClicks.innerText = Number(localStorage["totalClicks"]);
const upClick = () => {
    localStorage["totalClicks"] = Number(localStorage["totalClicks"]) + 1;
    textTotalClicks.innerText = Number(localStorage["totalClicks"]);
}

if (typeof(Storage) !== "undefined") {
    if (localStorage["totalEnergy"]) {
    } else {
        localStorage["totalEnergy"] = 0;
    }
}

textTotalEnergy.innerText = Number(localStorage["totalEnergy"]);
const upEnergy = (amount) => {
    localStorage["totalEnergy"] = Number(localStorage["totalEnergy"]) + amount;
    textTotalEnergy.innerText = Number(localStorage["totalEnergy"]);
}

//TODO LOGROS
class ACHIEVE {
    constructor(data, dataLVL, goals, rewards, idLevel, idBarProgress, idTextProgress, idTextReward, idDesc, desc1, desc2) {
        this.data = data;
        this.dataLVL = dataLVL;
        if (typeof(Storage) !== "undefined") {
			if (localStorage[dataLVL]) {
			} else {
				localStorage[dataLVL] = 0;
			}
		}
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
            const level = Number(localStorage[this.dataLVL]);
            this.idLevel.innerText = "Nivel " + level;
            if (level < this.goals.length) {
                this.idLevel.innerText = "Nivel " + level;
                this.idDesc.innerText = this.desc1 + this.goals[level] + this.desc2;
                this.idTextProgress.innerText = Number(localStorage[this.data]) + " / " + this.goals[level];
                this.idTextReward.innerText = "+" + this.rewards[level];
                this.idBarProgress.style.width = (Number(localStorage[this.data]) / this.goals[level]) * 100 + "%";

                if(Number(localStorage[this.data]) >= this.goals[level]) {
                    pushNotification("Has completado el logro. Has obtenido " + this.rewards[level] + " almas gemas.");
                    localStorage["gemSoul"] = Number(localStorage["gemSoul"]) + this.rewards[level];
                    textGemSoul.innerText = Number(localStorage["gemSoul"]);
                    localStorage[this.dataLVL] = Number(localStorage[this.dataLVL]) + 1;
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

textTotalAwards.innerText = (Number(localStorage["lvlTotalClicks"]) + Number(localStorage["lvlTotalTime"]) + Number(localStorage["lvlTotalEnergy"])) + " / 30";
setInterval(() => {
    localStorage["totalTime"] = Number(localStorage["totalTime"]) + 1;
    textTimeTotal.innerText = Number(localStorage["totalTime"]) + " min";
    timeAchieve.update();

    textTotalAwards.innerText = (Number(localStorage["lvlTotalClicks"]) + Number(localStorage["lvlTotalTime"]) + Number(localStorage["lvlTotalEnergy"])) + " / 30";
}, 60000);

//

if (typeof(Storage) !== "undefined") {
    if (localStorage["valueEnergy"]) {
    } else {
        localStorage["valueEnergy"] = JSON.stringify(0);
    }
}

let progress = 0;
let progressTotal = Number((10 + 10 * (Number(localStorage["valueEnergy"]) ** 1.4)).toFixed(0));
infoEnergy.innerText = Number(localStorage["valueEnergy"]);
progressEnergy.style.width = (progress / progressTotal) * 100 + "%";

worldGame.addEventListener("mousedown", (e) => {
    upClick();
    clickAchieve.update();
    progress += 1;
    if (progress >= progressTotal) {
        progress = 0;
        const amount = 1;
        upEnergy(amount);
        localStorage["valueEnergy"] = Number(localStorage["valueEnergy"]) + amount;
        infoEnergy.innerText = Number(localStorage["valueEnergy"]);
        progressTotal = Number((10 + 10 * (Number(localStorage["valueEnergy"]) ** 1.4)).toFixed(0));
        energyAchieve.update();

        //

        if (localStorage["valueClickText"] == "true") {
            const boxNumber = document.createElement("div");
            boxNumber.className = "boxerNumber";
            const textNumber = document.createElement("div");
            textNumber.className = "texterNumber";
            const svg = document.createElement("div");
            svg.className = "svgResource";
            svg.innerHTML = `<svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50ZM30 50C30 61.0457 38.9543 70 50 70C61.0457 70 70 61.0457 70 50C70 38.9543 61.0457 30 50 30C38.9543 30 30 38.9543 30 50Z" fill="var(--colorMain)"/>
            <circle cx="50" cy="50" r="27.5" stroke="var(--bgSecond)" stroke-width="15"/>
            </svg>`;

            boxNumber.style.left = (e.clientX) + "px";
            boxNumber.style.top = (e.clientY - 20) + "px";
            boxNumber.appendChild(textNumber);
            boxNumber.appendChild(svg);
            document.body.appendChild(boxNumber);

            textNumber.innerText = "+" + 1;

            setTimeout(() => {
                document.body.removeChild(boxNumber);
            }, 1200);
        }
    }

    progressEnergy.style.width = (progress / progressTotal) * 100 + "%";

    if (localStorage["valueClickSplash"] == "true") {
        const splash = document.createElement("div");
        splash.className = "splasher";
        splash.style.left = (e.clientX - 40) + "px";
        splash.style.top = (e.clientY - 40) + "px";
        document.body.appendChild(splash);
        setTimeout(() => {
            document.body.removeChild(splash);
        }, 300)
    }
    
});

//
//TODO THREE JS
//

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const color = new THREE.Color("hsl(264, 100%, 90%)");
scene.background = color;
scene.fog = new THREE.FogExp2(color, 0.0016);

//TODO CAMERAS
const camera = new THREE.PerspectiveCamera(0, window.innerWidth / window.innerHeight, 10, 4800);
camera.fov = 75;
camera.lookAt(0,0,0);
camera.position.set(0, 100, 400);

//TODO RENDER
let renderer;
const settingAntialias = new SETTINGSTOOGLE(buttonAntialias, "valueAntialias", false);
settingAntialias.create({
    on: () => {
        settingAntialias.setOnUI();
        renderer = new THREE.WebGLRenderer({canvas: worldGame, powerPreference: "high-performance", antialias: true});
    },

    off:() => {
        settingAntialias.setOffUI();
        renderer = new THREE.WebGLRenderer({canvas: worldGame, powerPreference: "high-performance", antialias: false});
    }
})

buttonAntialias.addEventListener("click", () => {
    location.reload();
})

//renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(color);
renderer.setPixelRatio( window.devicePixelRatio * 1 );
renderer.setSize( window.innerWidth / 1, window.innerHeight / 1 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

const settingResolution = new SETTINGSVALUE(rangeResolution, textResolution, "valueResolution", 1);
const composer = new EffectComposer(renderer);
settingResolution.createRanger(
    (value) => {
    renderer.setPixelRatio( window.devicePixelRatio * value );
    composer.renderer = renderer;
});

settingResolution.resetRanger(resetResolution);

const stats = new Stats();
document.body.appendChild(stats.dom);
const settingStatsFPS = new SETTINGSTOOGLE(buttonStatsFPS, "valueStatsFPS", false);
settingStatsFPS.create({
    on: () => {
        settingStatsFPS.setOnUI();
        document.body.appendChild(stats.dom);
    },

    off:() => {
        settingStatsFPS.setOffUI();
        document.body.removeChild(stats.dom);
    }
})

//TODO COMPOSER
const renderScene = new RenderPass(scene, camera);

const settingBloom = new SETTINGSTOOGLE(buttonBloom, "valueBloom", false);
settingBloom.create({
    on: () => {
        settingBloom.setOnUI();
        composer.insertPass(bloomPass, 1);
        valueShadersTerrain.changeSettingOnePicker(0, 24);
        changeMaterial();
    },

    off:() => {
        settingBloom.setOffUI();
        composer.removePass(bloomPass);
        valueShadersTerrain.changeSettingOnePicker(0, 12);
        changeMaterial();
    }
});

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.8;

const settingImage = new SETTINGSTOOGLE(buttonImage, "valueImage", false);
settingImage.create({
    on: () => {
        settingImage.setOnUI();
        composer.insertPass(afterImagePass, 2);
    },

    off:() => {
        settingImage.setOffUI();
        composer.removePass(afterImagePass);
    }
});

const settingRender = new SETTINGSTOOGLE(buttonRender, "valueRender", false);
settingRender.create({
    on: () => {
        settingRender.setOnUI();
        composer.insertPass(renderScene, 0);
        buttonBloom.style.opacity = 1;
        buttonImage.style.opacity = 1;
        buttonBloom.style.pointerEvents = "all";
        buttonImage.style.pointerEvents = "all";
    },

    off:() => {
        settingRender.setOffUI();
        composer.removePass(renderScene);
        buttonBloom.style.opacity = 0.2;
        buttonImage.style.opacity = 0.2;
        buttonBloom.style.pointerEvents = "none";
        buttonImage.style.pointerEvents = "none";
        settingBloom.setSettingToogle(false);
        settingImage.setSettingToogle(false);
    }
})

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

const settingTerrain = new SETTINGSTOOGLE(buttonTerrain, "valueTerrain", false);
settingTerrain.create({
    on: (input) => {
        input["svg"].className = "fi-rr-grid-alt subIcon";
        input["text"].innerText = "Alámbrica";
        materialTerrain.wireframe = true;
    },

    off:(input) => {
        input["svg"].className = "fi-rr-square subIcon";
        input["text"].innerText = "Plana";
        materialTerrain.wireframe = false;
    }
})

const settingTerrainAnimation = new SETTINGSTOOGLE(buttonTerrainAnimation, "valueTerrainAnimation", true);
settingTerrainAnimation.create({
    on: (input) => {
        input["svg"].className = "fi-rr-water subIcon";
        input["text"].innerText = "Animado";
        meshTerrain.geometry = geometryTerrain;
    },

    off:(input) => {
        input["svg"].className = "fi-rr-align-justify subIcon";
        input["text"].innerText = "Estático";
        meshTerrain.geometry = geometryTerrainStatic;
    }
})

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

/*const sphereSize = 100;
const pointLightHelper = new THREE.PointLightHelper( lightPointB, sphereSize );
scene.add( pointLightHelper );*/

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

const settingShadow = new SETTINGSTOOGLE(buttonShadow, "valueShadow", false);
settingShadow.create({
    on: (input) => {
        input["svg"].className = "fi-rr-opacity subIcon";
        settingShadow.setOnUI();
        renderer.shadowMap.enabled = true;
        directionalLight.castShadow = true;
    },

    off:(input) => {
        input["svg"].className = "fi-rr-circle-dashed subIcon";
        settingShadow.setOffUI();
        renderer.shadowMap.enabled = false;
        directionalLight.castShadow = false;
    }
})

/*const helper = new THREE.DirectionalLightHelper( directionalLight, 5, 0x000000 );
scene.add( helper );

const helperA = new THREE.CameraHelper( directionalLight.shadow.camera );
scene.add( helperA );*/

//TODO CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
const settingControl = new SETTINGSTOOGLE(buttonControl, "valueControl", false);
settingControl.create({
    on: () => {
        settingControl.setOnUI();
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null,
            RIGHT: null
        }
    },

    off:() => {
        settingControl.setOffUI();
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }
    }
})

controls.autoRotateSpeed = 1;
controls.rotateSpeed = 1;
controls.enableDamping = true;
controls.enablePan = false;
controls.zoomSpeed = 2;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 300;
controls.maxDistance = 800;

const settingRotation = new SETTINGSTOOGLE(buttonRotation, "valueRotation", true);
settingRotation.create({
    on: () => {
        settingRotation.setOnUI();
        controls.autoRotate = true;
    },

    off:() => {
        settingRotation.setOffUI();
        controls.autoRotate = false;
    }
})

const settingRotateDamp = new SETTINGSVALUE(rangeRotateDamp, textRotateDamp, "valueRotateDamp", 0.05);
settingRotateDamp.createRanger(
    (value) => {
        controls.dampingFactor = value;
    }
)

settingRotateDamp.resetRanger(resetRotateDamp);

const settingRotateSpeed = new SETTINGSVALUE(rangeRotateSpeed, textRotateSpeed, "valueRotateSpeed", 1);
settingRotateSpeed.createRanger(
    (value) => {
        controls.rotateSpeed = value;
    }
)

settingRotateSpeed.resetRanger(resetRotateSpeed);

const settingRotateSpeedAuto = new SETTINGSVALUE(rangeRotateSpeedAuto, textRotateSpeedAuto, "valueRotateSpeedAuto", 1);
settingRotateSpeedAuto.createRanger(
    (value) => {
        controls.autoRotateSpeed = value;
    }
)

settingRotateSpeedAuto.resetRanger(resetRotateSpeedAuto);

const settingZoomSpeed = new SETTINGSVALUE(rangeZoomSpeed, textZoomSpeed, "valueZoomSpeed", 2);
settingZoomSpeed.createRanger(
    (value) => {
        controls.zoomSpeed = value;
    }
)

settingZoomSpeed.resetRanger(resetZoomSpeed);

//TODO ANIMATION
scene.matrixWorldAutoUpdate = true;
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();

    //Animation
    const time = clock.getElapsedTime();

    if (localStorage["valueTerrainAnimation"] == "true") {
        const positionWaves = geometryTerrain.attributes.position;
        positionWaves.needsUpdate = true;

        const countPar = positionWaves.count;
        for (let i = 0; i < countPar; i++) {

            const z = 12 * Math.sin(i / 3 + Math.sin(time) / 5 + time) + 12 * Math.cos(-i / 12 + time);
            positionWaves.setZ(i, z);

        }
    }

    if (time < 6/4) {
        const adFov = (6 - time*4)**2.4;
        camera.fov = 75 + adFov;
    }
    

    const scaleA = Math.cos(time * 1.25) * 0.025;
    const scaleD = Math.cos((time * 1.25) * 1.333 + 0.5) * 0.025;

    meshIcoA.scale.set(1 + scaleA, 1 + scaleA, 1 + scaleA);
    meshIcoD.scale.set(1 + scaleD, 1 + scaleD, 1 + scaleD);

	torus.rotation.set((time / 5), (time / 5) * 2, (time / 5));

	const moveOrb = Math.cos(time * 2) * 8;
	orb.position.y = moveOrb;

    //Update sizes
	sizes.width = worldGame.clientWidth;
	sizes.height = worldGame.clientHeight;

    //Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

    //Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render( scene, camera );

    const delta = clock.getDelta();
    if (localStorage["valueRender"] == "true") {
        if (localStorage["valueBloom"] == "true" || localStorage["valueImage"] == "true") {
            composer.render(delta);
        }
    }

    stats.update();

    const isVertical = window.innerWidth < window.innerHeight;
    isVertical ? blockAspectRatioDetector.style.display = "flex" : blockAspectRatioDetector.style.display = "none";
}

animate();

//SETTINGS OT
const settingTheme = new SETTINGSTOOGLE(buttonTheme, "valueTheme", false);
const settingGlass = new SETTINGSTOOGLE(buttonGlass, "valueGlass", false);

const effectFluent = () => {
    let themeRgb;
    let themeOpacity;
    if (!settingTheme.getLocalStorage) {
        themeRgb = "rgba(255, 255, 255, ";
        themeOpacity = "0.8)";
    } else {
        themeRgb = "rgba(20, 20, 20, ";
        themeOpacity = "0.8)";
    }

    if (!settingGlass.getLocalStorage) {
        themeOpacity = "1)";
    }

    root.style.setProperty("--bgFluent", themeRgb + themeOpacity);
}

settingTheme.create({
    on: (input) => {
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
        bloomPass.strength = 0.42;
        bloomPass.radius = 1.5;
        bloomPass.threshold = 0.8;

        changeScene();
    },
    
    off:(input) => {
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
        root.style.setProperty("--opacLight", "0.1");

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
});

settingGlass.create({
    on: () => {
        settingGlass.setOnUI();
        root.style.setProperty("--filterGlass", "blur(16px)");
        effectFluent();
    },

    off:() => {
        settingGlass.setOffUI();
        root.style.setProperty("--filterGlass", "initial");
        effectFluent();
    }
});

const settingColorSelector = new SETTINGSVALUE(groupColors, colorText, "valueColorSelector", 1);
settingColorSelector.createDropDown((value, group, text) => {
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
            text.innerText = "Cielo azul"
            settingColor.changeSetting([200, 100, 50]);
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

    root.style.setProperty("--colorMain", "hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%)");
    root.style.setProperty("--colorMainOpacSoft", "hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%, 0.075)");
    root.style.setProperty("--colorMainOpac", "hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%, 0.15)");
    root.style.setProperty("--colorMainFill", "hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%, 0.3)");

    materialIcoB.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%)");
    materialIcoWA.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%)");
    materialTorusB.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%)");
    lightPointA.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%)");
    lightPointB.color = new THREE.Color("hsl(" + settingColor.getLocalStorage[0] + ", " + settingColor.getLocalStorage[1] + "%, " + settingColor.getLocalStorage[2] + "%)");
    changeMaterial();
    changeScene();
})

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
const settingTool = new SETTINGSTOOGLE(buttonTool, "valueTool", true);
settingTool.create({
    on: () => {
        settingTool.setOnUI();
        showContext = true;
    },

    off:() => {
        settingTool.setOffUI();
        showContext = false;
    }
})

const settingToolWarn = new SETTINGSTOOGLE(buttonToolWarn, "valueToolWarn", true);
settingToolWarn.create({
    on: () => {
        settingToolWarn.setOnUI();
        showWarning = true;
    },

    off:() => {
        settingToolWarn.setOffUI();
        showWarning = false;
    }
})

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
const settingToolTip = new SETTINGSTOOGLE(buttonToolTip, "valueToolTip", true);
settingToolTip.create({
    on: () => {
        settingToolTip.setOnUI();
        showWord = true;
    },

    off:() => {
        settingToolTip.setOffUI();
        showWord = false;
    }
})

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
                tooltip.innerText = (progress + " / " + progressTotal);
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
goToolTip(openStats, "top", "Estadísticas");
goToolTip(openTrain, "top", "Entrenamiento");
goToolTip(barEnergy, "top", "showProgressEnergy", "number");

//TODO DATA
resetConfig.addEventListener("click", () => {
    location.reload();
});

resetAll.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

//TODO LOADING and WELCOME
window.addEventListener("load", () => {
    blockLoader.style.animation = "playFade 0.8s forwards ease-in";
    if (typeof(Storage) !== "undefined") {
        if (localStorage["popupSec"]) {
        } else {
            localStorage["popupSec"] = true;
        }
    }
    
    setTimeout(() => {
        if (localStorage["popupSec"] == "true") {
                openWindow(windowProtection);
        }
    }, 300)
    
    
    buttonConfirmProtection.addEventListener("click", () => {
        closeWindow(windowProtection);
        localStorage["popupSec"] = "false";
    })
});

blockWelcomer.addEventListener("click", () => {
    blockWelcomer.style.opacity = 0;
    blockWelcomer.style.pointerEvents = "none"
    setTimeout(() => {
        blockWelcomer.remove();
        blockLoader.remove();
        home.style.translate = "0px 0px";
        gemSoulBox.style.translate = "0px 0px";
    }, 310)
});
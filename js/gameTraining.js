import { gameSB, mainEXP } from "./main.js";

const splashEffect = (e) => {
    audioScore.load();
    if (gameSB.settings["valueClickSplash"] == "true") {
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

//TODO POP-UP WINDOW
const openWindow = (idWindow, type) => {
    barTrainer.style.translate = "-50% 0px";
    textTrainUp.style.translate = "0px 0px";
    idWindow.style.display = type;
    setTimeout(() => {
        idWindow.style.scale = "1";
        idWindow.style.opacity = "1";
    }, 10)
}

const closeWindow = (idWindow) => {
    barTrainer.style.translate = "-50% -100px";
    textTrainUp.style.translate = "0px -100px";
    idWindow.style.scale = "0.8";
    idWindow.style.opacity = "0";
    setTimeout(() => {
        idWindow.style.display = "none";
    }, 310);
}

//

const root = document.querySelector(":root");
root.style.setProperty("--x", window.innerWidth / 2 + "px");
root.style.setProperty("--y", window.innerHeight / 2 + "px");
window.addEventListener("resize", () => {
    root.style.setProperty("--x", window.innerWidth / 2 + "px");
    root.style.setProperty("--y", window.innerHeight / 2 + "px");
});

let timeTraining = 0;
let timerTraining = null;
let score = 0;
let scoreTrain = 0;
let barScore = 0;
const timerNumber = 4200;
let timerPower = null;
let timerVita = null;
let timerRes = null;
let patron = 0;
let num = 0;
let dir = 0;
let waiter = 0;

const calcScore = (amount) => {
    mainEXP.gain(((amount ** 2) + (gameSB.data["lvlMain"] - 1) * 0.1) ** 1.9);
    score += amount;
    scoreTrain += amount;
    if (scoreTrain >= 10) {
        scoreTrain -= 10;
        barScore += amount + (gameSB.data["lvlMain"] - 1) * 0.1;
        textTotalTrainSession.innerText = "+" + Math.floor(barScore);
    }
    inBarTrainer.style.width = (scoreTrain / 10) * 100 + "%";
    boxScore.className = "boxScorer scoreAnimation";
    boxScore.innerText = "×" + score;
}

const calcTime = () => {
    let min = 0;
    timeTraining++;
    min = Math.floor(timeTraining / 60);
    if (timeTraining % 60 < 10) {
        timeTextTraining.innerText = min + ":0" + timeTraining % 60;
    } else {
        timeTextTraining.innerText = min + ":" + timeTraining % 60;
    }
}

const calcRecordCombo = (valueCombo) => {
    if (score >= gameSB.data.combo[valueCombo]) {
        gameSB.data.combo[valueCombo] = score;
        infoRecordCombo.innerHTML = "Récord: " + gameSB.data.combo[valueCombo];
        textComboMax.innerHTML = "Récord: " + gameSB.data.combo[valueCombo];
    }
}

const resetTime = () => {
    timeTraining = 0;
    timeTextTraining.innerText = "0:00";
}

//TODO ANIMATION
const animationEnded = (idEvent, className) => {
    idEvent.addEventListener('webkitAnimationEnd', function () {
        this.className = className;
    });
}

animationEnded(boxScore, "boxScorer");
animationEnded(boxStars, "boxScorer");
animationEnded(failBox, "");
animationEnded(boxCards, "gridInline4");

boxTrainNope.addEventListener("click", () => {
    boxCards.className = "gridInline4 getAttention"
})

const timerAction = () => {
    return timerNumber / Math.min(1 + (Math.sqrt(score / 1.1) / 7.5), 4);
}

//TODO POWER
const createListOfDisc = (n) => {
    const listDisc = [];
    for(let i = 0; i < n; i++) {
        listDisc[i] = document.createElement("div");
        listDisc[i].value = 1;
        listDisc[i].className = "disc";
        listDisc[i].style.animation = "playDisc " + timerAction() + "ms cubic-bezier(.5,0,.5,1) forwards";
    }

    return listDisc;
}

const createLine = (n, isInverted, isVertical) => {
    let column = 0, row = 0, boxRow = [];
    const jLength = boxPower.querySelectorAll(".boxRowPower");
    const iLength = boxPower.children[0].querySelectorAll(".inboxPower");

    const listDisc = createListOfDisc(n);

    let typeNumber = 1;
    if (isInverted) {
        typeNumber = -1;
    }

    if (!isVertical) {
        if (!isInverted) {
            column = Number((Math.random() * (iLength.length - n)).toFixed());
            row = Number((Math.random() * (jLength.length - 1)).toFixed());
        } else {
            column = Number((Math.random() * (iLength.length - n) + n - 1).toFixed());
            row = Number((Math.random() * (jLength.length - 1)).toFixed());
        }

        boxRow = boxPower.children[row].querySelectorAll(".inboxPower");
        boxRow[column].appendChild(listDisc[0]);
        setTimeout(() => {
            if (boxRow[0][column].children[0].value == 1) {
                calcRecordCombo("power");
                gameOverSimple();
            }
            boxRow[column].removeChild(listDisc[0]);
        }, timerAction());

        for (let i = 1; i < n; i++) {
            setTimeout(() => {
                boxRow[column + i * typeNumber].appendChild(listDisc[i]);
            }, i * timerAction() / 4);

            setTimeout(() => {
                if (boxRow[0][column].children[0].value == 1) {
                    calcRecordCombo("power");
                    gameOverSimple();
                }
                boxRow[column + i * typeNumber].removeChild(listDisc[i]);
            }, ((i + 3) * timerAction()) / 3);
        }

    } else {
        if (!isInverted) {
            column = Number((Math.random() * (iLength.length - 1)).toFixed());
            row = Number((Math.random() * (jLength.length - n)).toFixed());
        } else {
            column = Number((Math.random() * (iLength.length - 1)).toFixed());
            row = Number((Math.random() * (jLength.length - n) + n - 1).toFixed());
        }

        for(let i = 0; i < n; i++) {
            boxRow[i] = boxPower.children[row + i * typeNumber].querySelectorAll(".inboxPower");
        }

        boxRow[0][column].appendChild(listDisc[0]);
        setTimeout(() => {
            if (boxRow[0][column].children[0].value == 1) {
                calcRecordCombo("power");
                gameOverSimple();
            }
            boxRow[0][column].removeChild(listDisc[0]);
        }, timerAction());

        for (let i = 1; i < n; i++) {
            setTimeout(() => {
                boxRow[i][column].appendChild(listDisc[i]);
            }, i * timerAction() / 4);

            setTimeout(() => {
                const isOver = boxRow[i][column].children[0].value == 1;
                isOver ? gameOverSimple() : null;
                boxRow[i][column].removeChild(listDisc[i]);
            }, ((i + 3) * timerAction()) / 3);
        }
    }
}

boxPower.addEventListener("mousedown", (event) => {
    if (event.target.className == "disc") {
        if (event.target.value == 1) {
            event.target.style.background = "var(--colorMain)"
            event.target.style.pointerEvents = "inherit";
            event.target.value = 0;
            calcScore(1);
            splashEffect(event);
        }
    } else {
        calcRecordCombo("power");
        gameOverSimple();
    }
});

//TODO VITA
let isLightOn = false;
let isPlaying = false;
const startSystemVita = (idEvent, action) => {
    idEvent.addEventListener(action, () => {
        if (!isPlaying) {
            isPlaying = true;
            circleVita.innerText = "";
            discVita.style.display = "block";
            discVita.style.translate = (30 + Number((Math.random() * (window.innerWidth - 350 - 112 - 30)).toFixed())) + "px " + (100 + Number((Math.random() * (window.innerHeight - 280 - 112 - 100)).toFixed())) + "px";
            createIntervalVita();
        }

        if (!isLightOn) {
            playgroundVita.style.display = "none";
            discVita.style.zIndex = "12";
            isLightOn = true;
        } else {
            playgroundVita.style.display = "block";
            discVita.style.zIndex = "6";
            isLightOn = false;
        }
    }, false);
}

const sumDiscVita = (e) => {
    calcScore(1);
    splashEffect(e);
    discVita.style.translate = (30 + Number((Math.random() * (window.innerWidth - 350 - 112 - 30)).toFixed())) + "px " + (100 + Number((Math.random() * (window.innerHeight - 280 - 112 - 100)).toFixed())) + "px";
}

discVita.addEventListener("mouseenter", (e) => {
    sumDiscVita(e);
});

discVita.addEventListener("touchstart", (e) => {
    event.preventDefault();
    const touchObj = e.touches[0];
    sumDiscVita(touchObj);
});

startSystemVita(circleVita, "mousedown");

//TODO RES
let numDirection = -1;
let auxNumDirection = 0;
const calcDirections = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const posX = window.innerWidth / 2;
    const posY = window.innerHeight / 2 - 40;
    const angle = Number((180 * (Math.atan2(mouseY - posY, mouseX - posX) + Math.PI) / Math.PI).toFixed(1));
    if (angle > 22.5 && angle <= 67.5) {
        numDirection = 1;
    } else if (angle > 67.5 && angle <= 112.5) {
        numDirection = 2;
    } else if (angle > 112.5 && angle <= 157.5) {
        numDirection = 3;
    } else if (angle > 157.5 && angle <= 202.5) {
        numDirection = 4;
    } else if (angle > 202.5 && angle <= 247.5) {
        numDirection = 5;
    } else if (angle > 247.5 && angle <= 292.5) {
        numDirection = 6;
    } else if (angle > 292.5 && angle <= 337.5) {
        numDirection = 7;
    } else if (angle > 337.5 || angle <= 22.5) {
        numDirection = 0;
    }

    boxRes.querySelectorAll(".boxPlate")[auxNumDirection].style.borderBottomColor = "var(--bgOpacSoftest)";
    boxRes.querySelectorAll(".boxPlate")[auxNumDirection].style.boxShadow = "0px 3px 0px var(--colorMainFill)";
    boxRes.querySelectorAll(".boxPlate")[auxNumDirection].style.scale = "1";
    boxRes.querySelectorAll(".boxPlate")[numDirection].style.borderBottomColor = "var(--colorMainFill)";
    boxRes.querySelectorAll(".boxPlate")[numDirection].style.boxShadow = "0px 3px 0px var(--colorMain)";
    boxRes.querySelectorAll(".boxPlate")[numDirection].style.scale = "1.1";
    
    if (numDirection >= 0) {
        auxNumDirection = numDirection;
    }
}

boxRes.addEventListener("mousemove", (event) => {
    calcDirections(event);
}, false);

boxRes.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touchObj = event.touches[0];
    calcDirections(touchObj);
}, false);

const createListOfCubes = (n, dir, type, isInverted) => {
    let goInverted = 1;
    if (isInverted) {
        goInverted = -1;
    }
    const listCubes = [];
    for(let i = 0; i < n; i++) {
        listCubes[i] = document.createElement("div");
        listCubes[i].className = "cube";

        if (type == "line") {
            listCubes[i].value = dir;
            if (dir % 2 != 0) {
                listCubes[i].className = "cube rot45";
            }
            listCubes[i].style.animation = "playCube" + dir + " " + timerAction() + "ms cubic-bezier(.85,.95,.95,1) forwards";
        } else if (type == "curve") {
            listCubes[i].value = Math.abs(dir + i * goInverted) % 8;
            if ((dir + i) % 2 != 0) {
                listCubes[i].className = "cube rot45";
            }
            listCubes[i].style.animation = "playCube" + Math.abs(dir + i * goInverted) % 8 + " " + timerAction() + "ms cubic-bezier(.85,.95,.95,1) forwards";
        }
    }

    return listCubes;
}

const createAtk = (n, dir, type, isInverted) => {
    const listCubes = createListOfCubes(n, dir, type, isInverted);

    for(let i = 0; i < n; i++) {
        const diff = (i * 1000) / Math.min(1 + (Math.sqrt(score / 1.1) / 7.5), 4);
        setTimeout(() => {
            boxRes.appendChild(listCubes[i]);
        }, diff);

        setTimeout(() => {
            if (listCubes[i].value == numDirection) {
                calcScore(1);
                audioScore.load();
            } else {
                calcRecordCombo("res");
                gameOverSimple();
            }
            listCubes[i].remove();
        }, timerAction() + diff);
    }
}

//TODO TIMERS
const buttonsTraining = (point, opac, text) => {
    goPlay.style.pointerEvents = point;
    goPlay.style.opacity = opac;
    goPlay.children[0].innerText = text;
}

let isTraining = false;
let openedBox = null;
exiterTrain.addEventListener("click", () => {
    setTimeout(() => {
        buttonsTraining("inherit", 1, "Empezar");
    }, 14000);
    resetTime();
    closeWindow(boxComboScore);
    closeWindow(boxComboStars);
    closeWindow(openedBox);
    if (goPlay.value == "Potencia") {
        gameSB.data["valuePower"] += Math.floor(barScore);
        numberPower.innerText = gameSB.data["valuePower"];
        calcRecordCombo("power");
    } else if (goPlay.value == "Vitalidad") {
        gameSB.data["valueHealth"] += Math.floor(barScore);
        numberVita.innerText = gameSB.data["valueHealth"];
        clearInterval(timerVita);
        isLightOn = false;
        isPlaying = false;
        playgroundVita.style.display = "block";
        circleVita.innerText = "Iniciar";
        discVita.style.zIndex = "6";
        discVita.style.display = "none";
        calcRecordCombo("vita");
    } else if (goPlay.value == "Dureza") {
        gameSB.data["valueDef"] += Math.floor(barScore);
        numberRes.innerText = gameSB.data["valueDef"];
        if (numDirection >= 0) {
            boxRes.querySelectorAll(".boxPlate")[numDirection].style.borderBottomColor = "var(--bgOpacSoftest)";
            boxRes.querySelectorAll(".boxPlate")[numDirection].style.boxShadow = "0px 3px 0px var(--colorMainFill)";
            boxRes.querySelectorAll(".boxPlate")[numDirection].style.scale = "1";
        }
        numDirection = -1;
        calcRecordCombo("res");
    } else if (goPlay.value == "Lealtad") {
        //gameSB.data["valueLea"] += Math.floor(barScore);
        //numberLea.innerText = gameSB.data["valueLea"];
        calcRecordCombo("lea");
    }
    clearInterval(timerTraining);
    isTraining = false;
    score = 0;
    scoreTrain = 0;
    barScore = 0;
    waiter = 0;
    inBarTrainer.style.width = "0%";
    textTotalTrainSession.innerText = "+0";
    boxScore.innerText = "x" + score;
    failBox.style.display = "none";
});

const createIntervalPower = () => {
    timerPower = setTimeout(() => {
        if (waiter == 0) {
            patron = Number((Math.random() * 3 + 1).toFixed(0));
            num = Number((Math.random() * 2 + 3).toFixed(0));
            switch (patron) {
                case 1:
                    createLine(num, false, false);
                    break;
                case 2:
                    createLine(num, true, false);
                    break;
                case 3:
                    createLine(num, false, true);
                    break;
                case 4:
                    createLine(num, true, true);
                    break;
            }
        } else {
            waiter--;
        }
        
        if (isTraining) {
            setTimeout(() => {
                createIntervalPower();
            }, (timerAction() * num / 4) / 4);
        }
    }, timerAction() - waiter * 4000);
}

const svgOpenEyes = `<svg width="132" height="57" viewBox="0 0 132 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M35 15.5L39.1421 40C83.2446 73.2311 28 42 17.5 44.5C7 47 0.5 42.5 0.5 42.5C6.57318 43.0033 14.5222 36.5006 35 15.5Z" fill="var(--colorMain)"/>
<path d="M116.5 29.5L113.357 40.9062C79 63 114.689 43.5022 119.5 45C124.311 46.4978 131.274 43.2977 131.274 43.2977C128.43 43.3392 122 39.5 116.5 29.5Z" fill="var(--colorMain)"/>
<mask id="path-3-inside-1_345_43" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.3251 46.9213C25.2752 43.6227 22.3655 36.4432 25.1075 30.1216C32.7952 12.3976 50.4498 0 71 0C91.5502 0 109.205 12.3976 116.892 30.1216C119.634 36.4432 116.725 43.6227 110.675 46.9213C98.8879 53.3479 85.3704 57 71 57C56.6295 57 43.1121 53.3479 31.3251 46.9213Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.3251 46.9213C25.2752 43.6227 22.3655 36.4432 25.1075 30.1216C32.7952 12.3976 50.4498 0 71 0C91.5502 0 109.205 12.3976 116.892 30.1216C119.634 36.4432 116.725 43.6227 110.675 46.9213C98.8879 53.3479 85.3704 57 71 57C56.6295 57 43.1121 53.3479 31.3251 46.9213Z" fill="white"/>
<path d="M116.892 30.1216L111.388 32.5091L116.892 30.1216ZM110.675 46.9213L107.803 41.6534L110.675 46.9213ZM25.1075 30.1216L19.603 27.734L25.1075 30.1216ZM30.612 32.5091C37.3826 16.8996 52.9252 6 71 6V-6C47.9744 -6 28.2078 7.8956 19.603 27.734L30.612 32.5091ZM71 6C89.0748 6 104.617 16.8996 111.388 32.5091L122.397 27.734C113.792 7.8956 94.0256 -6 71 -6V6ZM107.803 41.6534C96.8747 47.6117 84.342 51 71 51V63C86.3989 63 100.901 59.0842 113.547 52.1892L107.803 41.6534ZM71 51C57.658 51 45.1253 47.6117 34.1973 41.6534L28.4529 52.1892C41.0989 59.0842 55.6011 63 71 63V51ZM111.388 32.5091C112.757 35.6647 111.441 39.6695 107.803 41.6534L113.547 52.1892C122.008 47.5759 126.512 37.2216 122.397 27.734L111.388 32.5091ZM19.603 27.734C15.4878 37.2216 19.9918 47.5759 28.4529 52.1892L34.1973 41.6534C30.5587 39.6695 29.2433 35.6647 30.612 32.5091L19.603 27.734Z" fill="var(--colorMain)" mask="url(#path-3-inside-1_345_43)"/>
<mask id="path-5-inside-2_345_43" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M93.1652 37.9036C94.0291 40.4628 92.4764 43.1076 89.9128 43.9584C83.9669 45.9317 77.6082 47 71 47C64.3918 47 58.0331 45.9317 52.0872 43.9584C49.5236 43.1076 47.9708 40.4628 48.8347 37.9036C51.956 28.6573 60.7005 22 71 22C81.2994 22 90.044 28.6574 93.1652 37.9036Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M93.1652 37.9036C94.0291 40.4628 92.4764 43.1076 89.9128 43.9584C83.9669 45.9317 77.6082 47 71 47C64.3918 47 58.0331 45.9317 52.0872 43.9584C49.5236 43.1076 47.9708 40.4628 48.8347 37.9036C51.956 28.6573 60.7005 22 71 22C81.2994 22 90.044 28.6574 93.1652 37.9036Z" fill="var(--colorMain)"/>
<path d="M88.0229 38.2638C82.6788 40.0374 76.9579 41 71 41V53C78.2585 53 85.2549 51.826 91.8027 49.653L88.0229 38.2638ZM71 41C65.0421 41 59.3211 40.0374 53.9771 38.2638L50.1973 49.653C56.745 51.826 63.7415 53 71 53V41ZM54.5196 39.8226C56.8425 32.9413 63.352 28 71 28V16C58.0491 16 47.0695 24.3734 43.1499 35.9846L54.5196 39.8226ZM71 28C78.648 28 85.1575 32.9413 87.4804 39.8226L98.8501 35.9846C94.9305 24.3734 83.9509 16 71 16V28ZM53.9771 38.2638C54.1107 38.3081 54.2903 38.4219 54.4277 38.6707C54.5843 38.9541 54.6632 39.3971 54.5196 39.8226L43.1499 35.9846C41.0723 42.1392 44.9415 47.9087 50.1973 49.653L53.9771 38.2638ZM91.8027 49.653C97.0585 47.9087 100.928 42.1392 98.8501 35.9846L87.4804 39.8226C87.3368 39.3971 87.4157 38.9542 87.5723 38.6707C87.7097 38.4219 87.8893 38.3082 88.0229 38.2638L91.8027 49.653Z" fill="black" fill-opacity="0.5" mask="url(#path-5-inside-2_345_43)"/>
</svg>`;

const svgCloseEyes = `<svg width="50" height="21.59" viewBox="0 0 132 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M35 15.5L39.1421 40C83.2446 73.2311 28 42 17.5 44.5C7 47 0.5 42.5 0.5 42.5C6.57318 43.0033 14.5222 36.5006 35 15.5Z" fill="var(--colorMain)"/>
<path d="M116.5 29.5L113.357 40.9062C79 63 114.689 43.5022 119.5 45C124.311 46.4978 131.274 43.2977 131.274 43.2977C128.43 43.3392 122 39.5 116.5 29.5Z" fill="var(--colorMain)"/>
<mask id="path-3-inside-1_345_42" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.3251 46.9213C25.2752 43.6227 22.3655 36.4432 25.1075 30.1216C32.7952 12.3976 50.4498 0 71 0C91.5502 0 109.205 12.3976 116.892 30.1216C119.634 36.4432 116.725 43.6227 110.675 46.9213C98.8879 53.3479 85.3704 57 71 57C56.6295 57 43.1121 53.3479 31.3251 46.9213Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.3251 46.9213C25.2752 43.6227 22.3655 36.4432 25.1075 30.1216C32.7952 12.3976 50.4498 0 71 0C91.5502 0 109.205 12.3976 116.892 30.1216C119.634 36.4432 116.725 43.6227 110.675 46.9213C98.8879 53.3479 85.3704 57 71 57C56.6295 57 43.1121 53.3479 31.3251 46.9213Z" fill="var(--colorMain)"/>
<path d="M116.892 30.1216L111.388 32.5091L116.892 30.1216ZM110.675 46.9213L107.803 41.6534L110.675 46.9213ZM25.1075 30.1216L19.603 27.734L25.1075 30.1216ZM30.612 32.5091C37.3826 16.8996 52.9252 6 71 6V-6C47.9744 -6 28.2078 7.8956 19.603 27.734L30.612 32.5091ZM71 6C89.0748 6 104.617 16.8996 111.388 32.5091L122.397 27.734C113.792 7.8956 94.0256 -6 71 -6V6ZM107.803 41.6534C96.8747 47.6117 84.342 51 71 51V63C86.3989 63 100.901 59.0842 113.547 52.1892L107.803 41.6534ZM71 51C57.658 51 45.1253 47.6117 34.1973 41.6534L28.4529 52.1892C41.0989 59.0842 55.6011 63 71 63V51ZM111.388 32.5091C112.757 35.6647 111.441 39.6695 107.803 41.6534L113.547 52.1892C122.008 47.5759 126.512 37.2216 122.397 27.734L111.388 32.5091ZM19.603 27.734C15.4878 37.2216 19.9918 47.5759 28.4529 52.1892L34.1973 41.6534C30.5587 39.6695 29.2433 35.6647 30.612 32.5091L19.603 27.734Z" fill="var(--colorMain)" mask="url(#path-3-inside-1_345_42)"/>
<path d="M106.315 36.8715C107.76 38.8706 107.191 41.6879 105 42.8208C94.6285 48.1831 82.8866 51.0134 70.9146 50.9999C58.9435 50.9864 47.2102 48.1299 36.854 42.745C34.665 41.6067 34.1025 38.787 35.5527 36.7909C36.8408 35.0179 39.266 34.5419 41.2086 35.5564C50.2383 40.2721 60.4779 42.7741 70.9257 42.7859C81.3739 42.7977 91.6205 40.3188 100.663 35.6232C102.608 34.6133 105.032 35.0953 106.315 36.8715Z" fill="black" fill-opacity="0.5"/>
</svg>`;

const createIntervalVita = () => {
    timerVita = setTimeout(() => {
        if (isPlaying) {
            createIntervalVita();
        } else {
            clearTimeout(timerVita);
        }

        patron = Number((Math.random() * 8 + 1).toFixed(0));
        if (patron <= 4) {
            warningEyes.style.display = "flex";
            setTimeout(() => {
                audioEye.load();
                audioEye.play();
                warningEyes.style.display = "none";
                eye1.innerHTML = svgOpenEyes;
                eye2.innerHTML = svgOpenEyes;
                circleVita.style.pointerEvents = "none";
                if (isLightOn) {
                    circleVita.innerText = "Otra vez";
                    discVita.style.display = "flex";
                    calcRecordCombo("vita");
                    gameOverSimple();
                    playgroundVita.style.display = "block";
                    discVita.style.zIndex = "6";
                    clearInterval(timerVita);
                    isPlaying = false;
                    isLightOn = false;
                }
            }, (timerAction() * 1.5) / 2.5);
            
            setTimeout(() => {
                eye1.innerHTML = svgCloseEyes;
                eye2.innerHTML = svgCloseEyes;
                circleVita.style.pointerEvents = "inherit";
            }, (timerAction() * 1.5) / 1.25);
        }
    }, timerAction() * 1.5);
}

const createIntervalRes = () => {
    timerRes = setTimeout(() => {
        if (waiter == 0) {
            patron = Number((Math.random() * 2 + 1).toFixed(0));
            num = Number((Math.random() * 2 + 3).toFixed(0));
            dir = Number((Math.random() * 7).toFixed(0));
            switch (patron) {
                case 1:
                    createAtk(num, dir, "line", false);
                    break;
                case 2:
                    createAtk(num, dir, "curve", false);
                    break;
                case 3:
                    createAtk(num, dir, "curve", true);
                    break;
            }
        } else {
            waiter--;
        }

        if (isTraining) {
            setTimeout(() => {
                createIntervalRes();
            }, timerAction() / 4);
        }
    }, timerAction() * 1.18 - waiter * 4000);
}

const setColorClassNames = (color) => {
    barTrainer.className = color + "BarShadow";
    inBarTrainer.className = color + "Color";
    textTrainUp.className = color + "Letter " + color + "LetterShadow";
    statsTrain.className = color + "ColorOpac";
    textTotalTrainSession.className = color + "Letter " + color + "LetterShadow";
}

const goTrainer = (interval, box, color, classSvg, type = "flex") => {
    setColorClassNames(color);
    svgTrain.className = classSvg;
    timerTraining = setInterval(() => {
        calcTime();
    }, 1000)
    openWindow(boxComboScore, "flex");
    openWindow(boxComboStars, "flex");
    openWindow(box, type);
    openedBox = box;
    buttonsTraining("none", 0.3, "Limpiando...");
    isTraining = true;
    let caller = interval;
    if (caller != null) {
        caller();
    }
    failBox.style.display = "block";
    failBox.className = "";
    gameSB.data["totalTrain"] += 1;
    textTotalTrain.innerText = gameSB.data["totalTrain"];
    textTrainUp.innerText = "×" + (1 + (gameSB.data["lvlMain"] - 1) * 0.1);
}

goPlay.addEventListener("click", () => {
    console.log(goPlay.value)
    if (goPlay.value == "Potencia") {
        goTrainer(createIntervalPower, boxPower, "red", "statsSvgPower", "grid");
    } else if (goPlay.value == "Vitalidad") {
        goTrainer(null, boxVita, "green", "statsSvgVita");
    } else if (goPlay.value == "Dureza") {
        goTrainer(createIntervalRes, boxRes, "blue", "statsSvgRes");
    } else if (goPlay.value == "Lealtad") {
        goTrainer(null, boxLea, "yellow", "statsSvgLea");
    }
});

//TODO GAME OVERS
const gameOverSimple = () => {
    if (isTraining) {
        audioGameOver.load();
    }
    waiter = 1;
    score = 0;
    boxScore.innerText = "x" + score;
    failBox.className = "blockFail";
}
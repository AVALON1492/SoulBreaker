import { gameSB, mainEXP } from "./main.js";

const splashEffect = (e) => {
    audioScore.autoplay = true;
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
let star = 0;
const timerNumber = 4200;
let timerPower = null;
let timerVita = null;
let timerRes = null;
let patron = 0;
let num = 0;
let waiter = 0;

const calcScore = (amount) => {
    mainEXP.gain(((amount ** (1.5 - Math.sqrt(amount) / 4)) + (gameSB.data["lvlMain"] - 1) * 0.1) ** 1.92);

    score += amount;
    scoreTrain += amount;
    if (amount >= 2) {
        star++;
        boxStars.className = "boxScorer scoreAnimation";
        boxStars.innerText = "×" + star;
    }
    if (scoreTrain >= 10) {
        scoreTrain -= 10;
        barScore += 1 + (gameSB.data["lvlMain"] - 1) * 0.1;
        textTotalTrainSession.innerText = "+" + Math.floor(barScore);
    }
    inBarTrainer.style.width = (scoreTrain / 10) * 100 + "%";
    boxScore.className = "boxScorer scoreAnimation";
    boxScore.innerText = "×" + score;
    textTrainUp.innerText = "×" + (1 + (gameSB.data["lvlMain"] - 1) * 0.1);
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
        infoRecordCombo.innerText = "Récord: " + gameSB.data.combo[valueCombo];
        textComboMax.innerText = "Récord: " + gameSB.data.combo[valueCombo];
    }
}

const calcRecordComboStar = (valueCombo) => {
    if (star >= gameSB.data.comboStar[valueCombo]) {
        gameSB.data.comboStar[valueCombo] = star;
        infoRecordStars.innerText = "Récord: " + gameSB.data.comboStar[valueCombo];
        textComboStarsMax.innerText = "Récord stars: " + gameSB.data.comboStar[valueCombo];
    }
}

const appearStar = (idBox, type, time, prob = 30) => {
    if (Math.random() * 100 < prob) {
        const createStar = document.createElement("i");
        createStar.className = "fi fi-rr-star iconStar center";
        createStar.style.transition = time + "ms linear"
        const pos = (Math.random() * (window.innerWidth - (window.innerWidth / 4) * 2)) + (window.innerWidth / 4);
        createStar.style.translate = pos + "px -120px";
        setTimeout(() => {
            createStar.style.translate = pos + "px " + (window.innerHeight + 240) + "px";
        }, 10);

        idBox.appendChild(createStar);

        createStar.addEventListener("click", (e) => {
            calcScore(3);
            splashEffect(e);
            createStar.remove();
        })

        createStar.addEventListener("webkitTransitionEnd", () => {
            calcRecordComboStar(type);
            gameOverStar();
            createStar.remove();
        })
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
for (let i = 0; i < boxPower.querySelectorAll(".inboxPower").length; i++) {
    const object = boxPower.querySelectorAll(".inboxPower")[i];
    object.id = "tilePower" + Math.floor(i / 10) + "" + i % 10;
}

const createDisc = () => {
    let disc;
    disc = document.createElement("div");
    disc.value = 1;
    disc.className = "disc";
    disc.style.animation = "playDisc " + timerAction() + "ms cubic-bezier(.5,0,.5,1) forwards";
    return disc;
}

const createLine = (n, isInverted, isVertical) => {
    let start = [0, 0];
    let long = [5, 10];
    let idBox;
    let posInv = 0;
    let isX = 1 * !isVertical, isY = 1 * isVertical;
    let typeNumber = 1;

    isInverted ? typeNumber = -1 : null;
    isInverted ? posInv = n - 1 : posInv = 0;
    start[isX] = Number((Math.random() * (long[isX] - n) + posInv).toFixed());
    start[isY] = Number((Math.random() * (long[isY] - 1)).toFixed());

    for (let i = 0; i < n; i++) {
        setTimeout(() => {
            const disc = createDisc();
            idBox = document.getElementById("tilePower" + ((start[0] + i * typeNumber * isY)) + "" + ((start[1] + i * typeNumber * isX)));
            idBox.appendChild(disc);
            disc.addEventListener("webkitAnimationEnd", () => {
                if (disc.value == 1) {
                    calcRecordCombo("power");
                    calcRecordComboStar("power");
                    gameOverSimple();
                }

                disc.remove();
            })

            if (!isTraining) {
                document.querySelectorAll(".disc").forEach((object) => {
                    object.remove();
                });
            }
        }, i * timerAction() / n);
    }

    appearStar(boxPower, "power", 10000);
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
    appearStar(boxVita, "vita", 8000, 10);
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
let angle = 0;
const calcDirections = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const posX = window.innerWidth / 2;
    const posY = window.innerHeight / 2 - 40;
    angle = Number((180 * (Math.abs(Math.atan2(-mouseY + posY, -mouseX + posX) - Math.PI)) / Math.PI).toFixed(1));
    shieldPlate.style.rotate = -(90 + angle) + "deg";
}

boxRes.addEventListener("mousemove", (event) => {
    calcDirections(event);
}, false);

boxRes.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touchObj = event.touches[0];
    calcDirections(touchObj);
}, false);

const createBalls = (n, type, isInverted) => {
    const dir = Math.random() * 359;
    let goInverted;
    isInverted ? goInverted = -1 : goInverted = 1;

    for(let i = 0; i < n; i++) {
        const dirRad = (dir * Math.PI / 180) + Math.PI / 2;
        const dirRadI = (Math.abs(dir + (30 + Math.min(score, 200) * 0.1) * i * goInverted) * Math.PI / 180) + Math.PI / 2;
        const ball = document.createElement("div");
        ball.className = "cube";
        setTimeout(() => {
            ball.style.transition = timerAction() + "ms linear";
        }, i * (800 - Math.min(score, 300)) + 50);

        if (type == "line") {
            ball.value = dir;
            ball.style.translate = window.innerWidth * Math.sin(dirRad) / 2 + "px " + window.innerWidth * Math.cos(dirRad) / 2 + "px";
            setTimeout(() => {
                ball.style.translate = 136 * Math.sin(dirRad) + "px " + 136 * Math.cos(dirRad) + "px";
            }, i * (800 - Math.min(score, 300)) + 100);
        } else if (type == "curve") {
            ball.value = Math.abs(dir + (30 + Math.min(score, 200) * 0.1) * i * goInverted) % 360;
            ball.style.translate = window.innerWidth * Math.sin(dirRadI) / 2 + "px " + window.innerWidth * Math.cos(dirRadI) / 2 + "px";
            setTimeout(() => {
                ball.style.translate = 136 * Math.sin(dirRadI) + "px " + 136 * Math.cos(dirRadI) + "px";
            }, i * (800 - Math.min(score, 300)) + 100);
        }

        setTimeout(() => {
            boxRes.appendChild(ball);
        }, i * (800 - Math.min(score, 300)));

        ball.addEventListener("webkitTransitionEnd", () => {
            const angleOffset = Math.abs(angle - ball.value);
            if (angleOffset < 45 || angleOffset > 315) {
                calcScore(1);
                shieldPlate.className = "boxPlate boxPlateAnimation";
                animationEnded(shieldPlate, "boxPlate");
            } else {
                calcRecordCombo("res");
                calcRecordComboStar("res");
                gameOverSimple();
            }

            ball.remove();
        });
    }

    appearStar(boxRes, "res", 10000, 40);
}

//TODO LEA
let haveSoundLea = true;
soundGameLea.addEventListener("click", () => {
    if (haveSoundLea) {
        haveSoundLea = false;
        soundGameLea.className = "fi-rr-volume-mute buttonTask onPoint";
        textPointChallenge.innerText = "+7 puntos por ronda";
    } else {
        haveSoundLea = true;
        soundGameLea.className = "fi-rr-volume buttonTask onPoint";
        textPointChallenge.innerText = "+5 puntos por ronda";
    }
})
const simonButtons = document.getElementsByClassName("pieceSimonDice");

class SIMON {
    constructor(simonButtons, buttonSimon) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 1000;
        this.sequence = [];
        this.speed = 1000;
        //
        this.buttons = Array.from(simonButtons);
        this.buttonSimon = buttonSimon;
        //
        this.buttonSounds = [
            new Audio("public/sound/simon/fa_verde.wav"),
            new Audio("public/sound/simon/mi_rojo.wav"),
            new Audio("public/sound/simon/re_amarillo.wav"),
            new Audio("public/sound/simon/do_azul.wav"),
        ]
    }

    init() {
        this.buttonSimon.onclick = () => this.startGame();
    }

    startGame() {
        audioAmbient.muted = true;
        audioClick.muted = true;
        audioScore.muted = true;
        audioNotif.muted = true;
        this.buttonSimon.style.pointerEvents = "none";
        exiterTrain.style.pointerEvents = "none";
        soundGameLea.style.pointerEvents = "none";
        textPointChallenge.style.pointerEvents = "none";
        exiterTrain.style.opacity = 0;
        soundGameLea.style.opacity = 0;
        textPointChallenge.style.opacity = 0;
        this.updateRound(0);
        this.userPosition = 0;
        this.speed = 1000;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    updateRound(value) {
        this.round = value;
        this.buttonSimon.innerText = "Ronda " + (value + 1);
    }

    createSequence() {
        return Array.from({length: this.totalRounds}, () => this.getRandomColor());
    }

    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    buttonClick(value) {
        this.validateChosenColor(value);
    }

    validateChosenColor(value) {
        if (this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].autoplay = haveSoundLea;
            this.buttonSounds[value].load();
            calcScore(1);
            if (this.round === this.userPosition) {
                this.updateRound(this.round + 1);
                this.speed = Math.max(this.speed / 1.04, 500);
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost();
        }
    }

    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            calcScore(5 + !haveSoundLea * 2);
            this.userPosition = 0;
            this.showSequence();
        };
    }

    showSequence() {
        boxSimon.style.pointerEvents = "none";
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].autoplay = haveSoundLea;
            this.buttonSounds[this.sequence[sequenceIndex]].load();
            this.toogleButtonStyle(button);
            setTimeout(() => this.toogleButtonStyle(button), this.speed / 2);
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                boxSimon.style.pointerEvents = "inherit";
                clearInterval(timer);
            }
        }, this.speed);
    }

    toogleButtonStyle(button) {
        button.classList.toggle("active");
    }

    gameLost() {
        audioAmbient.muted = false;
        audioClick.muted = false;
        audioScore.muted = false;
        audioNotif.muted = false;
        exiterTrain.style.pointerEvents = "inherit";
        soundGameLea.style.pointerEvents = "inherit";
        textPointChallenge.style.pointerEvents = "inherit";
        exiterTrain.style.opacity = 1;
        soundGameLea.style.opacity = 1;
        textPointChallenge.style.opacity = 1;
        this.buttonSimon.style.pointerEvents = "inherit";
        this.buttonSimon.innerText = "Iniciar";
        boxSimon.style.pointerEvents = "none";
        calcRecordCombo("lea");
        calcRecordComboStar("lea");
        gameOverSimple();
    }

    gameWon() {
        this.buttonSimon.style.pointerEvents = "inherit";
        this.buttonSimon.innerText = "¡Wow! 🏆";
        boxSimon.style.pointerEvents = "none";
        this.updateRound("🏆");
    }
}

const simon = new SIMON(simonButtons, circleLea);
simon.init();

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
        document.querySelectorAll(".iconStar").forEach((object) => {
            object.remove();
        });
        document.querySelectorAll(".cube").forEach((object) => {
            object.remove();
        });
        clearTimeout(timerRes);
    }, 5000);
    resetTime();
    closeWindow(boxComboScore);
    closeWindow(boxComboStars);
    closeWindow(openedBox);
    if (goPlay.value == "Potencia") {
        gameSB.data["valuePower"] += Math.floor(barScore);
        numberPower.innerText = gameSB.data["valuePower"];
        clearTimeout(timerPower);
        calcRecordCombo("power");
        calcRecordComboStar("power");
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
        calcRecordComboStar("vita");
    } else if (goPlay.value == "Dureza") {
        gameSB.data["valueDef"] += Math.floor(barScore);
        numberRes.innerText = gameSB.data["valueDef"];
        clearTimeout(timerRes);
        calcRecordCombo("res");
        calcRecordComboStar("res");
    } else if (goPlay.value == "Lealtad") {
        gameSB.data["valueLea"] += Math.floor(barScore);
        numberLea.innerText = gameSB.data["valueLea"];
        calcRecordCombo("lea");
        calcRecordComboStar("lea");
    }
    clearInterval(timerTraining);
    isTraining = false;
    score = 0;
    scoreTrain = 0;
    star = 0;
    barScore = 0;
    waiter = 0;
    inBarTrainer.style.width = "0%";
    textTotalTrainSession.innerText = "+0";
    boxScore.innerText = "×" + score;
    boxStars.innerText = "×" + star;
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
    }, timerAction() - waiter * 3000);
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
                audioEye.autoplay = true;
                audioEye.load();
                warningEyes.style.display = "none";
                eye1.innerHTML = svgOpenEyes;
                eye2.innerHTML = svgOpenEyes;
                circleVita.style.pointerEvents = "none";
                if (isLightOn) {
                    circleVita.innerText = "Otra vez";
                    discVita.style.display = "flex";
                    calcRecordCombo("vita");
                    calcRecordComboStar("vita");
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
            num = Number((Math.random() * 2 + 8).toFixed(0));
            switch (patron) {
                case 1:
                    createBalls(num, "line", false);
                    break;
                case 2:
                    createBalls(num, "curve", false);
                    break;
                case 3:
                    createBalls(num, "curve", true);
                    break;
            }
        } else {
            waiter--;
        }

        if (isTraining) {
            setTimeout(() => {
                createIntervalRes();
            }, num * (800 - Math.min(score, 300)));
        }
    }, timerAction() - waiter * 3000);
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
    star = 0;
    boxScore.innerText = "×" + score;
    boxStars.innerText = "×" + star;
    failBox.className = "blockFail";
}

const gameOverStar = () => {
    star = 0;
    boxStars.innerText = "×" + star;
}
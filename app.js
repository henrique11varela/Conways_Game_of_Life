/* window.addEventListener('load', () => { */
const canvas = document.getElementById("canvas");
const vmin = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
canvas.height = vmin * .8;
canvas.width = vmin * .8;
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');
const pixelGap = 2 //space between cells

let settings = {
    elements: {
        framerate: document.getElementById("framerate"),
        resolution: document.getElementById("resolution"),
        playBtn: document.getElementById("btn-play"),
        stepBtn: document.getElementById("btn-step"),
        applyBtn: document.getElementById("btn-apply")
    },
    values: {
        framerate: 10, //rough framerate of animation
        resolution: 20 //number of cells on smallest side
    }
};

//*Constants

//*Settings
if (window.innerWidth > 768) {
    settings.values.resolution = 40;
}
let pixelSize = canvas.width / settings.values.resolution; //size of cell

//*GLOBALS
//Innerworkings
let mat = [];
//Draw
let coordinateX = -1;
let coordinateY = -1;
let color;
//Animation interval
let intervalID;

//! SETUP
settings.elements.framerate.value = settings.values.framerate;
settings.elements.resolution.value = settings.values.resolution;

function applySettings() {
    if (settings.values.resolution != settings.elements.resolution.value) {
        settings.values.resolution = settings.elements.resolution.value;
        buildMat();
        pixelSize = canvas.width / settings.values.resolution;
        draw();
    }
    if (settings.values.framerate != settings.elements.framerate.value) {
        settings.values.framerate = settings.elements.framerate.value;
        if (settings.elements.playBtn.innerHTML == "PAUSE") {
            stopAnimation();
            startAnimation();
        }
    }
}

settings.elements.framerate.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        applySettings();
    }
});

settings.elements.resolution.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        applySettings();
    }
});

//! EVENTS
// Button events
settings.elements.playBtn.addEventListener('click', startAnimation);
settings.elements.stepBtn.addEventListener('click', animate);
settings.elements.applyBtn.addEventListener("click", applySettings);

// canvas Draw mouse
canvas.addEventListener('mousedown', onMouseDown = (event) => { //MOUSE DOWN
    let coordinateX = Math.floor((event.clientX - rect.left) / pixelSize);
    let coordinateY = Math.floor((event.clientY - rect.top) / pixelSize);
    color = !mat[coordinateX][coordinateY];
    mat[coordinateX][coordinateY] = color;
    ctx.fillStyle = color ? "black" : "white";
    ctx.fillRect(coordinateX * pixelSize, coordinateY * pixelSize, pixelSize - pixelGap, pixelSize - pixelGap);
    canvas.addEventListener('mousemove', onMouseMove = (event) => { //MOUSE MOVE
        let tempX = Math.floor((event.clientX - rect.left) / pixelSize);
        let tempY = Math.floor((event.clientY - rect.top) / pixelSize);
        if (coordinateX != tempX || coordinateY != tempY) {
            coordinateX = tempX;
            coordinateY = tempY;
            mat[coordinateX][coordinateY] = color;
            ctx.fillStyle = color ? "black" : "white";
            ctx.fillRect(coordinateX * pixelSize, coordinateY * pixelSize, pixelSize - pixelGap, pixelSize - pixelGap);
        }
    });
});

canvas.addEventListener('mouseup', onMouseUp = () => { //MOUSE UP
    coordinateX = -1;
    coordinateY = -1;
    canvas.removeEventListener('mousemove', onMouseMove);
});

// canvas Draw touch
canvas.addEventListener('touchstart', onTouchDown = (event) => { //Touch DOWN
    let coordinateX = Math.floor((event.changedTouches[0].clientX - rect.left) / pixelSize);
    let coordinateY = Math.floor((event.changedTouches[0].clientY - rect.top) / pixelSize);
    color = !mat[coordinateX][coordinateY];
    mat[coordinateX][coordinateY] = color;
    ctx.fillStyle = color ? "white" : "black";
    ctx.fillRect(coordinateX * pixelSize, coordinateY * pixelSize, pixelSize - pixelGap, pixelSize - pixelGap);
    canvas.addEventListener('touchmove', onTouchMove = (event) => { //Touch MOVE
        let tempX = Math.floor((event.changedTouches[0].clientX - rect.left) / pixelSize);
        let tempY = Math.floor((event.changedTouches[0].clientY - rect.top) / pixelSize);
        if (coordinateX != tempX || coordinateY != tempY) {
            coordinateX = tempX;
            coordinateY = tempY;
            mat[coordinateX][coordinateY] = color;
            ctx.fillStyle = color ? "white" : "black";
            ctx.fillRect(coordinateX * pixelSize, coordinateY * pixelSize, pixelSize - pixelGap, pixelSize - pixelGap);
        }
    });
});

canvas.addEventListener('touchend', onTouchUp = () => { //Touch UP
    coordinateX = -1;
    coordinateY = -1;
    canvas.removeEventListener('touchmove', onTouchMove);
});

//! ANIMATION
function startAnimation() {
    if (settings.values.framerate > 60) {
        settings.values.framerate = 60;
        settings.elements.framerate.value = 60;
    }
    intervalID = setInterval(() => { animate(); }, 1000 / settings.values.framerate);
    settings.elements.playBtn.removeEventListener('click', startAnimation);
    settings.elements.playBtn.addEventListener('click', stopAnimation);
    settings.elements.playBtn.innerHTML = "PAUSE";
    settings.elements.playBtn.classList.add("btn-on");
}

function stopAnimation() {
    clearInterval(intervalID);
    intervalID = null;
    settings.elements.playBtn.removeEventListener('click', stopAnimation);
    settings.elements.playBtn.addEventListener('click', startAnimation);
    settings.elements.playBtn.innerHTML = "PLAY";
    settings.elements.playBtn.classList.remove("btn-on");
}

function animate() {
    update(mat);
    draw(mat);
}

//! BUILD MAT
function buildMat() {
    mat = [];
    for (let i = 0; i < settings.values.resolution; i++) {
        mat.push([]);
        for (let j = 0; j < settings.values.resolution; j++) {
            mat[i].push(false);
        }
    }
}

//! DRAW 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            ctx.fillStyle = mat[i][j] ? "black" : "white";
            ctx.fillRect(pixelSize * i, pixelSize * j, pixelSize - pixelGap, pixelSize - pixelGap);
        }
    }
}

//! UPDATE 
function update() {
    let nm = [];
    for (let i = 0; i < mat.length; i++) {
        nm.push([]);
        for (let j = 0; j < mat[i].length; j++) {
            let counter = 0;
            if (i != 0) {
                // look N
                counter += mat[i - 1][j] ? 1 : 0;
                if (j != 0) { // look NW
                    counter += mat[i - 1][j - 1] ? 1 : 0;
                }
                if (j != mat[i].length - 1) { // look NE
                    counter += mat[i - 1][j + 1] ? 1 : 0;
                }
            }
            if (i != mat.length - 1) {
                //look down
                counter += mat[i + 1][j] ? 1 : 0;
                if (j != 0) { // look SW
                    counter += mat[i + 1][j - 1] ? 1 : 0;
                }
                if (j != mat[i].length - 1) { // look SE
                    counter += mat[i + 1][j + 1] ? 1 : 0;
                }
            }
            if (j != 0) {
                //look W
                counter += mat[i][j - 1] ? 1 : 0;
            }
            if (j != mat[i].length - 1) {
                //look E
                counter += mat[i][j + 1] ? 1 : 0;
            }
            if (!mat[i][j] && counter == 3) {//if dead
                nm[i].push(true);
            } else if (mat[i][j] && ((counter < 2) || (counter > 3))) { // if alive
                nm[i].push(false);
            } else {
                nm[i].push(mat[i][j]);
            }
        }
    }
    mat = nm;
}

//! MAIN
buildMat();
update();
draw();
/* }); */
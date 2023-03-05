let elements = {
    canvas: document.getElementById("canvas"),
    canvasRect: this.canvas.getBoundingClientRect(),
    canvasCtx: this.canvas.getContext('2d'),
    framerate: document.getElementById("framerate"),
    resolution: document.getElementById("resolution"),
    playBtn: document.getElementById("btn-play"),
    stepBtn: document.getElementById("btn-step"),
    applyBtn: document.getElementById("btn-apply")
};
let values = {
    pixelSize: 10,
    pixelGap: 2,
    framerate: 10, //rough framerate of animation
    resolution: 20 //number of cells on smallest side
};
let mat = [];
let coordinateX = -1;
let coordinateY = -1;
let color;
let intervalID;

//Apply settings
function applySettings() {
    if (values.resolution != elements.resolution.value) {
        values.resolution = elements.resolution.value;
        buildMat();
        values.pixelSize = elements.canvas.width / values.resolution;
        draw();
    }
    if (values.framerate != elements.framerate.value) {
        if (elements.framerate.value > 60) {
            elements.framerate.value = 60;
        }
        values.framerate = elements.framerate.value;
        if (elements.playBtn.innerHTML == "PAUSE") {
            stopAnimation();
            startAnimation();
        }
    }
}

//Framerate Enter event
elements.framerate.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        applySettings();
    }
});

//Resolution Enter event
elements.resolution.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        applySettings();
    }
});

//Start animation
function startAnimation() {
    intervalID = setInterval(() => { animate(); }, 1000 / values.framerate);
    elements.playBtn.removeEventListener('click', startAnimation);
    elements.playBtn.addEventListener('click', stopAnimation);
    elements.playBtn.innerHTML = "PAUSE";
    elements.playBtn.classList.add("btn-on");
}

//Stop animation
function stopAnimation() {
    clearInterval(intervalID);
    intervalID = null;
    elements.playBtn.removeEventListener('click', stopAnimation);
    elements.playBtn.addEventListener('click', startAnimation);
    elements.playBtn.innerHTML = "PLAY";
    elements.playBtn.classList.remove("btn-on");
}

//Animate
function animate() {
    update();
    draw();
}

function mouseMoveOn(event) {
    let tempX = Math.floor((event.clientX - elements.canvasRect.left) / values.pixelSize);
    let tempY = Math.floor((event.clientY - elements.canvasRect.top) / values.pixelSize);
    if (coordinateX != tempX || coordinateY != tempY) {
        coordinateX = tempX;
        coordinateY = tempY;
        mat[coordinateX][coordinateY] = color;
        elements.canvasCtx.fillStyle = color ? "black" : "white";
        elements.canvasCtx.fillRect(coordinateX * values.pixelSize, coordinateY * values.pixelSize, values.pixelSize - values.pixelGap, values.pixelSize - values.pixelGap);
    }
}

function mouseDrawOn(event) {
    coordinateX = Math.floor((event.clientX - elements.canvasRect.left) / values.pixelSize);
    coordinateY = Math.floor((event.clientY - elements.canvasRect.top) / values.pixelSize);
    color = !mat[coordinateX][coordinateY];
    mat[coordinateX][coordinateY] = color;
    elements.canvasCtx.fillStyle = color ? "black" : "white";
    elements.canvasCtx.fillRect(coordinateX * values.pixelSize, coordinateY * values.pixelSize, values.pixelSize - values.pixelGap, values.pixelSize - values.pixelGap);
    elements.canvas.addEventListener('mousemove', mouseMoveOn);
}

function mouseMoveOff(event) {
    coordinateX = -1;
    coordinateY = -1;
    elements.canvas.removeEventListener('mousemove', mouseMoveOn);
}

function buildMat() {
    mat = [];
    for (let i = 0; i < values.resolution; i++) {
        mat.push([]);
        for (let j = 0; j < values.resolution; j++) {
            mat[i].push(false);
        }
    }
}

function draw() {
    elements.canvasCtx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            elements.canvasCtx.fillStyle = mat[i][j] ? "black" : "white";
            elements.canvasCtx.fillRect(values.pixelSize * i, values.pixelSize * j, values.pixelSize - values.pixelGap, values.pixelSize - values.pixelGap);
        }
    }
}

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








function Main() {
    //resolution for desktop
    if (window.innerWidth > 768) {
        values.resolution = 40;
    }
    elements.canvas.width = elements.canvasRect.width;
    elements.canvas.height = elements.canvasRect.height;
    // pixelsize calc
    values.pixelSize = elements.canvas.width / values.resolution;
    elements.framerate.value = values.framerate;
    elements.resolution.value = values.resolution;
    //add event listeners
    elements.playBtn.addEventListener('click', startAnimation);
    elements.stepBtn.addEventListener('click', animate);
    elements.applyBtn.addEventListener("click", applySettings);
    elements.canvas.addEventListener('mousedown', mouseDrawOn);
    elements.canvas.addEventListener('mouseup', mouseMoveOff);

    buildMat();
    update();
    draw();
}

Main();
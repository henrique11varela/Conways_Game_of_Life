window.addEventListener('load', () => {

    //*Constants
    const vmin = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    const canvas = document.getElementById("canvas");
    canvas.height = vmin * .8;
    canvas.width = vmin * .8;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const framerateInput = document.getElementById("framerate");
    const resolutionInput = document.getElementById("resolution");
    const playBtn = document.getElementById("btn-play");
    const stepBtn = document.getElementById("btn-step");
    const pixelGap = 2; //space between cells

    //*Settings
    let framerate = 10; //rough framerate of animation
    let resolution; //number of cells on smallest side
    if (window.innerWidth > 768) {
        resolution = 40;
    } else {
        resolution = 20;
    }
    let pixelSize = canvas.width / resolution; //size of cell

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
    framerateInput.value = framerate;
    resolutionInput.value = resolution;

    //! EVENTS
    // Button events
    playBtn.addEventListener('click', startAnimation);
    stepBtn.addEventListener('click', animate);

    // resolution Enter
    resolutionInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter" && resolutionInput.value != resolution) {
            resolution = parseInt(resolutionInput.value);
            buildMat();
            pixelSize = canvas.width / resolution;
            draw();
        }
    });
    
    // framerate Enter
    framerateInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter" && framerateInput.value != framerate) {
            framerate = parseInt(framerateInput.value);
            stopAnimation();
            startAnimation();
        }
    });

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
        framerate = framerateInput.value;
        if (framerate < 1) {
            framerate = 1;
            framerateInput.value = 1;
        } else if (framerate > 60) {
            framerate = 60;
            framerateInput.value = 60;
        }
        intervalID = setInterval(() => { animate(); }, 1000 / framerate);
        playBtn.removeEventListener('click', startAnimation);
        playBtn.addEventListener('click', stopAnimation);
        playBtn.innerHTML = "PAUSE";
    }

    function stopAnimation() {
        clearInterval(intervalID);
        intervalID = null;
        playBtn.removeEventListener('click', stopAnimation);
        playBtn.addEventListener('click', startAnimation);
        playBtn.innerHTML = "PLAY";
    }

    function animate() {
        update(mat);
        draw(mat);
    }

    //! BUILD MAT
    function buildMat() {
        mat = [];
        for (let i = 0; i < resolution; i++) {
            mat.push([]);
            for (let j = 0; j < resolution; j++) {
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
});
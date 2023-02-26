window.addEventListener('load', () => {
    // Constants
    const canvas = document.getElementById("canvas");
    const vmin = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    canvas.width = vmin * 0.9;
    canvas.height = vmin * 0.9;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const minSideSize = canvas.width < canvas.height ? canvas.width : canvas.height;
    const resolution = 20; //number of cells on smallest side
    const pixelSize = minSideSize / resolution; //size of cell
    const pixelGap = 3; //space between cells
    const framerate = 2; //rough framerate of animation

    //draw
    let coordinateX = -1;
    let coordinateY = -1;
    let color;


    //innerworkings
    let mat = [];

    /* LOOP */
    let intervalID;

    function startAnimation() {
        intervalID = window.setInterval(() => { animate(); }, 1000 / framerate);
        let btn = document.getElementById("btn-play");
        btn.addEventListener('click', stopAnimation);
        btn.innerHTML = "Pause";
    }
    
    function stopAnimation() {
        clearInterval(intervalID);
        intervalID = null;
        let btn = document.getElementById("btn-play");
        btn.addEventListener('click', startAnimation);
        btn.innerHTML = "Play";
    }

    function animate() {
        update(mat);
        draw(mat);
    }

    /* DRAW */
    function draw() {
        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < mat[i].length; j++) {
                ctx.fillStyle = mat[i][j] ? "white" : "black";
                ctx.fillRect(pixelSize * j, pixelSize * i, pixelSize - pixelGap, pixelSize - pixelGap);
            }
        }
    }

    //MOUSE

    canvas.addEventListener('mousedown', onMouseDown = (event) => { //MOUSE DOWN
        let coordinateX = Math.floor((event.clientX - rect.left) / pixelSize);
        let coordinateY = Math.floor((event.clientY - rect.top) / pixelSize);
        color = !mat[coordinateX][coordinateY];
        mat[coordinateX][coordinateY] = color;
        ctx.fillStyle = color ? "white" : "black";
        ctx.fillRect(coordinateX * pixelSize, coordinateY * pixelSize, pixelSize - pixelGap, pixelSize - pixelGap);
        canvas.addEventListener('mousemove', onMouseMove = (event) => { //MOUSE MOVE
            let tempX = Math.floor((event.clientX - rect.left) / pixelSize);
            let tempY = Math.floor((event.clientY - rect.top) / pixelSize);
            if (coordinateX != tempX || coordinateY != tempY) {
                coordinateX = tempX;
                coordinateY = tempY;
                mat[coordinateX][coordinateY] = color;
                ctx.fillStyle = color ? "white" : "black";
                ctx.fillRect(coordinateX * pixelSize, coordinateY * pixelSize, pixelSize - pixelGap, pixelSize - pixelGap);
            }
        });
    });

    canvas.addEventListener('mouseup', onMouseUp = () => { //MOUSE UP
        coordinateX = -1;
        coordinateY = -1;
        canvas.removeEventListener('mousemove', onMouseMove);
    });

    //Controls

    document.getElementById("btn-play").addEventListener('click', startAnimation);

    /* 
    TODO UPDATE */
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
                console.log(counter);//!--------------------------------------------
            }
        }
        mat = nm;
    }








    for (let i = 0; i < canvas.height / pixelSize; i++) {
        mat.push([]);
        for (let j = 0; j < canvas.width / pixelSize; j++) {
            mat[i].push(false);
        }
    }
    console.log(mat);//!--------------------------------------------
    //update();
    console.log(mat);//!--------------------------------------------
    draw();
    //animate();
});
/* 
TODO: update
TODO: play/pause button
TODO: pause not working
Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
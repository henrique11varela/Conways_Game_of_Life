window.addEventListener('load', () => {
    // Constants
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const minSideSize = canvas.width < canvas.height ? canvas.width : canvas.height;
    const resolution = 20;
    const pixelSize = minSideSize / resolution;
    const pixelGap = 3;
    const framerate = 1;

    //draw
    let coordinateX = -1;
    let coordinateY = -1;


    //innerworkings
    let mat = [];

    /* LOOP */
    function animate() {
        //update(mat);
        draw(mat);
        setTimeout(() => {
            window.requestAnimationFrame(animate);
        }, 1000 / framerate);
    }

    /* DRAW */
    function draw(m) {
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                ctx.fillStyle = m[i][j] ? "white" : "black";
                ctx.fillRect(pixelSize * j, pixelSize * i, pixelSize - pixelGap, pixelSize - pixelGap);
            }
        }
    }

    //MOUSE
    
    canvas.addEventListener('mousedown', onMouseDown = (event) => {
        let coordinateX = Math.floor((event.clientX - rect.left) / pixelSize);
        let coordinateY = Math.floor((event.clientY - rect.top) / pixelSize);
        console.log("down", coordinateX, coordinateY);
        canvas.addEventListener('mousemove', onMouseMove = (event) => {
            let tempX = Math.floor((event.clientX - rect.left) / pixelSize);
            let tempY = Math.floor((event.clientY - rect.top) / pixelSize);
            if (coordinateX != tempX || coordinateY != tempY) {
                coordinateX = tempX;
                coordinateY = tempY;
                console.log("move", coordinateX, coordinateY);
            }
        });
    });
    
    canvas.addEventListener('mouseup', onMouseUp = () => {
        console.log("up");
        coordinateX = -1;
        coordinateY = -1;
        canvas.removeEventListener('mousemove', onMouseMove);
    });
    
    /* 
    TODO UPDATE */
    function update() {
        let nm = [];
        for (let i = 0; i < mat.length; i++) {
            nm.push([]);
            for (let j = 0; j < mat[i].length; j++) {
                let counter = 0;
                if (i != 0) {
                    //look up

                }
                if (i != mat.length - 1) {
                    //look down
                }
                if (j != 0) {
                    //look left
                }
                if (j != mat[i].length - 1) {
                    //look right
                }
                if (!mat[i][j] && counter == 3) {//if dead
                    nm[i].push(1);
                } else if (mat[i][j] && ((counter < 2) || (counter > 3))) { // if alive
                    nm[i].push(0);
                } else {
                    nm[i].push(mat[i][j]);
                }
            }
        }
        mat = nm;
    }








    for (let i = 0; i < canvas.height / pixelSize; i++) {
        mat.push([]);
        for (let j = 0; j < canvas.width / pixelSize; j++) {
            mat[i].push(0);
        }
    }
    console.log(mat);
    update(mat);
    console.log(mat);
    draw(mat);
    //animate();
});
/* 
TODO: update
TODO: play/pause button
TODO: draw on click
Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
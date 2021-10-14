main();
function main() {
    /*========== Create a WebGL Context ==========*/
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#c");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL unavailable');
    } else {
        console.log('WebGL is good to go');
    }

    /*========== Define and Store the Geometry ==========*/

    /*====== Define front-face vertices ======*/
    const firstSquare = [
        // front face
        -0.3 , -0.3, -0.3,
        0.3, -0.3, -0.3,
        0.3, 0.3, -0.3,

        -0.3, -0.3, -0.3,
        -0.3, 0.3, -0.3,
        0.3, 0.3, -0.3,
    ];

    /*====== Define front-face buffer ======*/
    const origBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstSquare), gl.STATIC_DRAW);

    /*========== Shaders ==========*/

    /*====== Define shader source ======*/
    const vsSource = `
        attribute vec4 aPosition;
        void main() {
            gl_Position = aPosition;
        }
    `;

    const fsSource = `
        void main() {
            gl_FragColor = vec4(1, 0, 0, 1);
        }
    `;

    /*====== Create shaders ======*/
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);

    /*====== Compile shaders ======*/
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    /*====== Create shader program ======*/
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    /*====== Link shader program ======*/
    gl.linkProgram(program);
    gl.useProgram(program);


    /*========== Connect the attribute with the vertex shader ===================*/        
    const posAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribLocation);
        
    /*========== Drawing ======================== */
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the points on the screen
    const mode = gl.LINE_LOOP;
    const first = 0;
    const count = 6;
    gl.drawArrays(mode, first, count);
} // be sure to close the main function with a curly brace.
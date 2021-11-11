import { BoxBufferGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, ShaderMaterial, Vector2 } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube() {
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(2, 2, 2);
    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({

        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new Vector2() }

        },

        //vertexShader: ``,


        fragmentShader: `

        precision mediump float;
        float pi = 3.14159265359;
        float intesity = 0.16;
    
        void main() {
            float colorX = gl_FragCoord.x * intesity * (pi * 2.0);
            float colorY = gl_FragCoord.y * intesity * (pi * 2.0);
    
            float rValue = sin(colorX * colorY);
            float gValue = cos(colorX * colorY);
            float bValue = tan(colorX * colorY);
       
            gl_FragColor = vec4(rValue, gValue, bValue, 1);          
        }    
    `
    });
    // const material = new MeshPhongMaterial({color: 0x44aa88});
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry, material);
    return cube;
}

export { createCube };
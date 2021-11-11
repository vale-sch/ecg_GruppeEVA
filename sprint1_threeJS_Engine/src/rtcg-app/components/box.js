import { BoxBufferGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, ShaderMaterial, Vector2, Vector3 } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube() {
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(10, 10, 10);


    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({

        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new Vector2() },

            ambientColor: new Vector3(255, 0, 0),
            diffuseColor: new Vector3(255, 0 , 255),
            specularColor: new Vector3(255,255,255),
            lightPos: new Vector3(0, 10, 10),
        

        },

        vertexShader: `
            uniform mat4 normalMat;
            varying vec3 normalInterp;
            varying vec3 vertPos;
            varying vec4 fragColor;
            
            void main(){
                vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
                vertPos = vec3(vertPos4) / vertPos4.w;
                normalInterp = vec3(normalMat * vec4(normal, 0.0));
                gl_Position = projectionMatrix * vertPos4;
                fragColor =  vec4(normal, 1);
            }
        `,


        fragmentShader: `
            varying vec4 fragColor;
            varying vec3 normalInterp;

            precision mediump float;
            float pi = 3.14159265359;
            float intesity = 0.0016;
        
            void main() {
                float colorX = gl_FragCoord.x * intesity * (pi * 2.0);
                float colorY = gl_FragCoord.y * intesity * (pi * 2.0);
        
                float rValue = sin(colorX * colorY);
                float gValue = cos(colorX * colorY);
                float bValue = tan(colorX * colorY);
        
                gl_FragColor = vec4(rValue, gValue, bValue, 1) * 0.6 + fragColor * 0.4;          
            }    
        `
    });
    // const material = new MeshPhongMaterial({color: 0x44aa88});
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry, material);
    return cube;
}

export { createCube };
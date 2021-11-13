import { Uniform, BoxBufferGeometry, TorusKnotGeometry, Mesh, PlaneGeometry, MeshPhongMaterial, ShaderMaterial, Vector2, Vector3, DoubleSide } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube() {
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(10, 10, 10);

    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new Vector2() },
            lightPos: new Uniform(new Vector3(0, 0, 0)),
            intensity: { value: 0.0016 },
            lightIntensity: { value: 1.0 },
            lightPosX: { value: 0.0 },
            aValue: { value: 1.0 }


        },

        vertexShader: `
            uniform vec3 lightPos;
            uniform float lightIntensity;
            uniform float lightPosX;
            varying vec3 normalInterp;
            varying vec3 vertPos;
            varying vec4 fragColor;
            
            void main(){
                vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
                normalInterp = vec3(normalMatrix * normal);
                gl_Position = projectionMatrix * vertPos4;
                float intensity = dot(normalInterp, vec3(lightPosX, lightPos.y, lightPos.z)) ;
                fragColor = vec4((normalInterp * intensity), 1.0 )* lightIntensity;
            }
        `,


        fragmentShader: `
            varying vec4 fragColor;
            varying vec3 normalInterp;
            uniform float intensity;
            uniform float aValue;
            precision mediump float;
            float pi = 3.14159265359;
        
            void main() {
                float colorX = gl_FragCoord.x * intensity * (pi * 2.0);
                float colorY = gl_FragCoord.y * intensity * (pi * 2.0);
        
                float rValue = sin(colorX * colorY) ;
                float gValue = cos(colorX * colorY);
                float bValue = tan(colorX * colorY);
        
                gl_FragColor = vec4(rValue* fragColor.x, gValue* fragColor.y, bValue* fragColor.z, aValue) ;          
            }    
        `
    });
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry, material);
    return cube;
}

function createTorusKnot() {
    //ERstellungderGeometrie
    const geometry = new TorusKnotGeometry(5, 2, 50, 8);


    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new Vector2() },
            lightPos: new Uniform(new Vector3(0, 0, 0)),
            intensity: { value: 0.0016 },
            lightIntensity: { value: 1.0 },
            lightPosX: { value: 0.0 },
            aValue: { value: 1.0 }


        },

        vertexShader: `
            uniform vec3 lightPos;
            uniform float lightIntensity;
            uniform float lightPosX;
            varying vec3 normalInterp;
            varying vec3 vertPos;
            varying vec4 fragColor;
            
            void main(){
                vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
                normalInterp = vec3(normalMatrix * normal);
                gl_Position = projectionMatrix * vertPos4;
                float intensity = dot(normalInterp, vec3(lightPosX, lightPos.y, lightPos.z)) ;
                fragColor = vec4((normalInterp * intensity), 1.0 )* lightIntensity;
            }
        `,


        fragmentShader: `
            varying vec4 fragColor;
            varying vec3 normalInterp;
            uniform float intensity;
            uniform float aValue;
            precision mediump float;
            float pi = 3.14159265359;
        
            void main() {
                float colorX = gl_FragCoord.x * intensity * (pi * 2.0);
                float colorY = gl_FragCoord.y * intensity * (pi * 2.0);
        
                float rValue = sin(colorX * colorY) ;
                float gValue = cos(colorX * colorY);
                float bValue = tan(colorX * colorY);
        
                gl_FragColor = vec4(rValue* fragColor.x, gValue* fragColor.y, bValue* fragColor.z, aValue) ;          
            }    
        `
    });

    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const sphere = new Mesh(geometry, material);
    return sphere;
}
function createPlane() {
    const geometry = new PlaneGeometry(60, 60);
    const material = new MeshPhongMaterial({ color: 'grey', side: DoubleSide });

    const plane = new Mesh(geometry, material);
    return plane;

}

export { createCube, createTorusKnot, createPlane };
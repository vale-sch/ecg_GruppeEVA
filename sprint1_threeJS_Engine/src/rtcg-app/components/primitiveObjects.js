import { Uniform, BoxBufferGeometry, TorusKnotGeometry, SphereGeometry, Mesh, PlaneGeometry, MeshPhongMaterial, ShaderMaterial, Vector2, Vector3, DoubleSide } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube(light, camera) {
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(10, 10, 10);

    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new Vector2() },
            lightPos: new Uniform(light.position),
            cameraPos: new Uniform(camera.position),
            positionOffset: new Uniform(new Vector3(0, 0, 0)),
            intensity: { value: 0.0016 },
            lightIntensity: { value: 1.0 },
            aValue: { value: 1.0 }

        },

        vertexShader: `
        uniform vec3 lightPos;
        uniform vec3 cameraPos;
        uniform float lightIntensity;
        varying vec3 vertPos;
        varying vec4 fragColor;

        //returns the mirrored vector of the light angle hitting the vertex, which is used for the specular calculation in phong model
        vec3 getIdealReflexionVec(vec3 normalInterp) {
            return -1.*reflect(lightPos, normalInterp);
        }

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vec3 normalInterp = -1.*(normalMatrix * normal);
            vec3 lightPosModelView = vec3(vec4(lightPos, 1.0));
            //hard code red diffuse
            float diffuseValue = dot(normalize(normalInterp), normalize(position-lightPos));
            vec4 diffuseColor = vec4(vec3(0,1,1) * diffuseValue, 1);
            //hard code green spec

            vec3 vertexToCameraDirection = cameraPos - position;

            float specularValue = dot(normalize(getIdealReflexionVec(normalInterp)), normalize(vertexToCameraDirection));
            vec4 specularColor = vec4(vec3(1,1,1) * specularValue, 1);

            fragColor = diffuseColor + specularColor;

            //fragColor = vec4((normalInterp * diffuse), 1.0 )* lightIntensity;
        }
        `,


        fragmentShader: `
            varying vec4 fragColor;
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
        
                gl_FragColor = fragColor * aValue;

                //gl_FragColor = vec4(rValue* fragColor.x, gValue* fragColor.y, bValue* fragColor.z, aValue) ;          
            }    
        `
    });
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry, material);
    return cube;
}

function createTorusKnot() {
    //ERstellungderGeometrie
    const geometry = new TorusKnotGeometry(6, 2, 60, 8);


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
    const geometry = new PlaneGeometry(80, 80);
    const material = new MeshPhongMaterial({ color: 'grey', side: DoubleSide });

    const plane = new Mesh(geometry, material);
    return plane;

}

function createSphere(light, camera) {
    //ERstellungderGeometrie
    const geometry = new SphereGeometry(5, 128, 128);

    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {

            // time: { value: 1.0 },
            //resolution: { value: new Vector2() },
            lightPos: new Uniform(light.position),
            cameraPos: new Uniform(camera.position),
            intensity: new Uniform(0.0016),
            lightIntensity: new Uniform(1.0),
            aValue: new Uniform(1.0),
            positionOffset: new Uniform(new Vector3(20, 10, 0)),
            lightColor: new Uniform(light.color),

        },

        vertexShader: `
            uniform vec3 lightPos;
            uniform vec3 lightColor;
            uniform vec3 cameraPos;
            uniform vec3 positionOffset;
            uniform float lightIntensity;
            varying vec4 fragColor;
            varying vec3 actualPosition;

            vec4 getDiffuseColor(vec3 normalInterp);
            vec4 getSpecularColor(vec3 normalInterp);
            vec3 getIdealReflexionVec(vec3 normalInterp);
            
            void main(){

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vec3 normalInterp = (normalMatrix * normal);
                vec3 lightPos = vec3(modelViewMatrix * vec4(lightPos, 1.0));
                
                vec4 diffuseColor = getDiffuseColor(normalInterp);
                vec4 specularColor = 0.6 * getSpecularColor(normalInterp);
                vec4 ambientColor = vec4(1,0,0,1);

                fragColor = diffuseColor + specularColor;

                //fragColor = vec4((normalInterp * diffuse), 1.0 )* lightIntensity;
            }

            vec4 getDiffuseColor(vec3 normalInterp) {
                float diffuseValue = dot(normalize(-1.*normalInterp), normalize(position-lightPos));
                return vec4(lightColor * diffuseValue, 1);
            }

            vec4 getSpecularColor(vec3 normalInterp) {
                vec4 specularColor = vec4(0,0,0,0);
                vec3 vertexToCameraDirection = cameraPos - (position+positionOffset);
                float specularValue = dot(normalize(getIdealReflexionVec(normalInterp)), normalize(vertexToCameraDirection));
                
                if(specularValue > 0.0){
                    specularColor = vec4(vec3(1,1,1) * specularValue, 1);
                }
                return specularColor;
            }

            //returns the mirrored vector of the light angle hitting the vertex, which is used for the specular calculation in phong model
            vec3 getIdealReflexionVec(vec3 normalInterp) {
                return reflect((position+positionOffset)-lightPos, normalInterp);
            }

        `,


        fragmentShader: `
            varying vec4 fragColor;
            uniform float intensity;
            uniform float aValue;
            precision mediump float;
            float pi = 3.14159265359;
        
            void main() {
                float colorX = gl_FragCoord.x * intensity * (pi * 2.0);
                float colorY = gl_FragCoord.y * intensity * (pi * 2.0);
        
                float rValue = sin(colorX * colorY);
                float gValue = cos(colorX * colorY);
                float bValue = tan(colorX * colorY);
        
                gl_FragColor = fragColor * aValue;

                //gl_FragColor = vec4(rValue* fragColor.x, gValue* fragColor.y, bValue* fragColor.z, aValue) ;          
            }    
        `
    });
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const sphere = new Mesh(geometry, material);
    return sphere;
}

export { createCube, createTorusKnot, createPlane, createSphere };
import { Uniform, BoxBufferGeometry, TorusKnotGeometry, SphereGeometry, Mesh, PlaneGeometry, MeshPhongMaterial, ShaderMaterial, Vector2, Vector3, DoubleSide } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube(light, camera) {
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(10, 10, 10, 7, 7, 7);

    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {
            uLight_Pos: new Uniform(light.position),
            uCamera_Pos: new Uniform(camera.position),
            uLight_Intensity: new Uniform(1.0),
            uPosition_Offset: new Uniform(new Vector3(20, 10, 0)),
            uLight_Color: new Uniform(light.color),

            uSlider_Red: new Uniform(1.0),
            uSlider_Green: new Uniform(1.0),
            uSlider_Blue: new Uniform(1.0),
            uSlider_Alpha: new Uniform(1.0),
            uSlider_Brightness: new Uniform(1.0),
            uSlider_Stripe_Frequency: new Uniform(0.0016),

            uToggle_Color: new Uniform(false),
            uToggle_Alpha: new Uniform(false),
            uToggle_Brightness: new Uniform(false),
            uToggle_Invert: new Uniform(false),
            uToggle_Stripes: new Uniform(false)
        },

        vertexShader: `
            uniform vec3 uLight_Pos;
            uniform vec3 uLight_Color;
            uniform vec3 uCamera_Pos;
            uniform vec3 uPosition_Offset;
            uniform float uLight_Intensity;
            varying vec4 vColor;
            varying vec3 actualPosition;

            vec4 getDiffuseColor(vec3 normalInterp);
            vec4 getSpecularColor(vec3 normalInterp);
            vec3 getIdealReflexionVec(vec3 normalInterp);
            
            void main(){

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vec3 normalInterp = (normalMatrix * normal);
               // vec3 lightPos = vec3(modelViewMatrix * vec4(uLight_Pos, 1.0));
                
                vec4 diffuseColor = 0.6 * getDiffuseColor(normalInterp);
                vec4 specularColor = 0.6 * getSpecularColor(normalInterp);
                vec4 ambientColor = vec4(uLight_Color,1);

                vColor = diffuseColor + specularColor + ambientColor;

                //vColor = vec4((normalInterp * diffuse), 1.0 )* uLight_Intensity;
            }

            vec4 getDiffuseColor(vec3 normalInterp) {
                float diffuseValue = dot(normalize(-1.*normalInterp), normalize(position-uLight_Pos));
                return vec4(uLight_Color * diffuseValue, 1);
            }

            vec4 getSpecularColor(vec3 normalInterp) {
                vec4 specularColor = vec4(0,0,0,0);
                vec3 vertexToCameraDirection = uCamera_Pos - (position+uPosition_Offset);
                float specularValue = dot(normalize(getIdealReflexionVec(normalInterp)), normalize(vertexToCameraDirection));
                
                if(specularValue > 0.0){
                    specularColor = vec4(normalize(vec3(1,1,1)) * specularValue, 1);
                }
                return specularColor;
            }

            //returns the mirrored vector of the light angle hitting the vertex, which is used for the specular calculation in phong model
            vec3 getIdealReflexionVec(vec3 normalInterp) {
                return reflect((position+uPosition_Offset)-uLight_Pos, normalInterp);
            }

        `,


        fragmentShader: `
        precision mediump float;    
        
        uniform float uSlider_Red;
        uniform float uSlider_Green;
        uniform float uSlider_Blue;
        uniform float uSlider_Alpha;
        uniform float uSlider_Brightness;
        uniform float uSlider_Stripe_Frequency;

        uniform bool uToggle_Color;
        uniform bool uToggle_Alpha;
        uniform bool uToggle_Brightness;
        uniform bool uToggle_Invert;
        uniform bool uToggle_Stripes;

        float pi = 3.14159265359;

        varying lowp vec4 vColor;
        
        void main() {
            gl_FragColor = vColor;

            if(uToggle_Stripes) {
                float x_color = gl_FragCoord.x * uSlider_Stripe_Frequency * (2.0*pi);
                float y_color = gl_FragCoord.y * uSlider_Stripe_Frequency * (2.0*pi);

                float r_value = sin(x_color * y_color);
                float g_value = cos(x_color * y_color);
                float b_value = tan(x_color * y_color);

                gl_FragColor = 0.3 * vec4(r_value, g_value, b_value, 1) + 0.7 * gl_FragColor;
            }

            if(uToggle_Color) {
                gl_FragColor.r = gl_FragColor.r * uSlider_Red;
                gl_FragColor.g = gl_FragColor.g * uSlider_Green;
                gl_FragColor.b = gl_FragColor.b * uSlider_Blue;
            }

            if(uToggle_Alpha) {
                gl_FragColor.a = gl_FragColor.a * uSlider_Alpha;
            }

            if(uToggle_Brightness) {
                gl_FragColor.r = gl_FragColor.r * uSlider_Brightness;
                gl_FragColor.g = gl_FragColor.g * uSlider_Brightness;
                gl_FragColor.b = gl_FragColor.b * uSlider_Brightness;
            }

            if(uToggle_Invert) {
                gl_FragColor.r = 1.0 - gl_FragColor.r;
                gl_FragColor.g = 1.0 - gl_FragColor.g;
                gl_FragColor.b = 1.0 - gl_FragColor.b;
            }

        }
            `  });
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry, material);
    return cube;
}

function createTorusKnot(light, camera) {
    //ERstellungderGeometrie
    const geometry = new TorusKnotGeometry(6, 2, 60, 8);


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
                
                vec4 diffuseColor = 0.6 * getDiffuseColor(normalInterp);
                vec4 specularColor = 0.6 * getSpecularColor(normalInterp);
                vec4 ambientColor = vec4(lightColor,1);

                fragColor = diffuseColor + specularColor + ambientColor;

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
                    specularColor = vec4(normalize(vec3(1,1,1)) * specularValue, 1);
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
        
                //gl_FragColor = fragColor * aValue;

                gl_FragColor = 0.3 * vec4(rValue, gValue, bValue, 1) + 0.7 * fragColor;          
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
                
                vec4 diffuseColor = 0.6 * getDiffuseColor(normalInterp);
                vec4 specularColor = 0.6 * getSpecularColor(normalInterp);
                vec4 ambientColor = vec4(lightColor,1);

                fragColor = (diffuseColor + specularColor + ambientColor) * lightIntensity;

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
                    specularColor = vec4(normalize(vec3(1,1,1)) * specularValue, 1);
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

               // gl_FragColor = 0.1 * vec4(rValue, gValue, bValue, 1) + 0.9 * fragColor;          
            }    
        `
    });
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const sphere = new Mesh(geometry, material);
    return sphere;
}

export { createCube, createTorusKnot, createPlane, createSphere };
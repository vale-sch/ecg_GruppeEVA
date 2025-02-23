import { Uniform, BoxBufferGeometry, TorusKnotGeometry, SphereGeometry, ConeGeometry, Mesh, PlaneGeometry, MeshPhongMaterial, ShaderMaterial, Vector2, Vector3, DoubleSide, Color } from '../../../js/three.module.js';

function createCube(light, camera) {
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(0.2, 0.2, 0.2);

    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {
            uLight_Pos: new Uniform(light.position),
            uCamera_Pos: new Uniform(camera.position),
            uLight_Intensity: new Uniform(1.0),
            uPosition_Offset: new Uniform(new Vector3(20, 10, 0)),
            uLight_Color: new Uniform(light.color),

            uSlider_Red: new Uniform(0),
            uSlider_Green: new Uniform(0),
            uSlider_Blue: new Uniform(0),
            uSlider_Alpha: new Uniform(1.0),
            uSlider_Brightness: new Uniform(1.0),
            uSlider_Stripe_Frequency: new Uniform(0.0016),

            uToggle_Invert: new Uniform(false),
            uToggle_Stripes: new Uniform(false),
            uToggle_Brightness: new Uniform(false),
            uToggle_Color: new Uniform(false)

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
            
            vec4 diffuseColor = getDiffuseColor(normalInterp);
            vec4 specularColor = uLight_Intensity * getSpecularColor(normalInterp);
            vec4 ambientColor = vec4(uLight_Color,1);

            vColor = diffuseColor + specularColor + ambientColor;
        }

        vec4 getDiffuseColor(vec3 normalInterp) {
            float diffuseValue = dot(normalize(normalInterp), normalize(uLight_Pos-position));
            return vec4(uLight_Color * diffuseValue, 1);
        }

        vec4 getSpecularColor(vec3 normalInterp) {
            vec4 specularColor = vec4(0,0,0,0);
            vec3 vertexToCameraDirection = uCamera_Pos - (position+uPosition_Offset);
            float specularValue = dot(normalize(getIdealReflexionVec(normalInterp)), normalize(vertexToCameraDirection));
            
            if(specularValue > 0.0){
                specularColor = vec4(normalize(vec3(0.4,0.4,0.4)) * specularValue, 1);
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
        uniform bool uToggle_Stripes;
        uniform bool uToggle_Brightness;
        uniform bool uToggle_Invert;
        uniform bool uToggle_Color;
        
     

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
function createCone(light, camera) {
    //ERstellungderGeometrie
    const geometry = new ConeGeometry(0.15, 0.5, 32);

    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {
            uLight_Pos: new Uniform(light.position),
            uCamera_Pos: new Uniform(camera.position),
            uLight_Intensity: new Uniform(1.0),
            uPosition_Offset: new Uniform(new Vector3(20, 10, 0)),
            uLight_Color: new Uniform(light.color),

            uSlider_Red: new Uniform(0),
            uSlider_Green: new Uniform(0),
            uSlider_Blue: new Uniform(0),
            uSlider_Alpha: new Uniform(1.0),
            uSlider_Brightness: new Uniform(1.0),
            uSlider_Stripe_Frequency: new Uniform(0.0016),

            uToggle_Invert: new Uniform(false),
            uToggle_Stripes: new Uniform(false),
            uToggle_Brightness: new Uniform(false),
            uToggle_Color: new Uniform(false)

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
            
            vec4 diffuseColor = getDiffuseColor(normalInterp);
            vec4 specularColor = uLight_Intensity * getSpecularColor(normalInterp);
            vec4 ambientColor = vec4(uLight_Color,1);

            vColor = diffuseColor + specularColor + ambientColor;
        }

        vec4 getDiffuseColor(vec3 normalInterp) {
            float diffuseValue = dot(normalize(normalInterp), normalize(uLight_Pos-position));
            return vec4(uLight_Color * diffuseValue, 1);
        }

        vec4 getSpecularColor(vec3 normalInterp) {
            vec4 specularColor = vec4(0,0,0,0);
            vec3 vertexToCameraDirection = uCamera_Pos - (position+uPosition_Offset);
            float specularValue = dot(normalize(getIdealReflexionVec(normalInterp)), normalize(vertexToCameraDirection));
            
            if(specularValue > 0.0){
                specularColor = vec4(normalize(vec3(0.4,0.4,0.4)) * specularValue, 1);
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
        uniform bool uToggle_Stripes;
        uniform bool uToggle_Brightness;
        uniform bool uToggle_Invert;
        uniform bool uToggle_Color;
        
     

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
    const geometry = new TorusKnotGeometry(0.15, 0.05, 60, 8);


    //ERstellungdesStandardBasismaterials
    const material = new ShaderMaterial({
        transparent: true,
        uniforms: {
            uLight_Pos: new Uniform(light.position),
            uCamera_Pos: new Uniform(camera.position),
            uLight_Intensity: new Uniform(1.0),
            uPosition_Offset: new Uniform(new Vector3(20, 10, 0)),
            uLight_Color: new Uniform(light.color),

            uSlider_Red: new Uniform(0),
            uSlider_Green: new Uniform(0),
            uSlider_Blue: new Uniform(0),
            uSlider_Alpha: new Uniform(1.0),
            uSlider_Brightness: new Uniform(1.0),
            uSlider_Stripe_Frequency: new Uniform(0.0016),

            uToggle_Invert: new Uniform(false),
            uToggle_Stripes: new Uniform(false),
            uToggle_Brightness: new Uniform(false),
            uToggle_Color: new Uniform(false)

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
            
            vec4 diffuseColor = getDiffuseColor(normalInterp);
            vec4 specularColor = uLight_Intensity * getSpecularColor(normalInterp);
            vec4 ambientColor = vec4(uLight_Color,1);

            vColor = diffuseColor + specularColor + ambientColor;
        }

        vec4 getDiffuseColor(vec3 normalInterp) {
            float diffuseValue = dot(normalize(normalInterp), normalize(uLight_Pos-position));
            return vec4(uLight_Color * diffuseValue, 1);
        }

        vec4 getSpecularColor(vec3 normalInterp) {
            vec4 specularColor = vec4(0,0,0,0);
            vec3 vertexToCameraDirection = uCamera_Pos - (position+uPosition_Offset);
            float specularValue = dot(normalize(getIdealReflexionVec(normalInterp)), normalize(vertexToCameraDirection));
            
            if(specularValue > 0.0){
                specularColor = vec4(normalize(vec3(0.4,0.4,0.4)) * specularValue, 1);
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
        uniform bool uToggle_Stripes;
        uniform bool uToggle_Brightness;
        uniform bool uToggle_Invert;
        uniform bool uToggle_Color;
        
     

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
    const sphere = new Mesh(geometry, material);
    return sphere;
}
function createPlane() {
    const geometry = new PlaneGeometry(5, 5);
    const material = new MeshPhongMaterial({ color: 'grey', side: DoubleSide });

    const plane = new Mesh(geometry, material);
    return plane;

}

function createSphere(color) {
    //ERstellungderGeometrie
    const geometry = new SphereGeometry(0.05, 128, 128);

    //ERstellungdesStandardBasismaterials
    const material = new MeshPhongMaterial({ transparent: true });
    material.color = new Color(color);

    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const sphere = new Mesh(geometry, material);
    return sphere;
}

export { createCube, createTorusKnot, createCone, createPlane, createSphere };
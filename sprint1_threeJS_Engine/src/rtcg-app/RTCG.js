import { createCamera } from './components/camera.js';
import { createCube, createTorusKnot, createPlane } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { createRenderer } from './systems/renderer.js';
import { Animator } from './systems/Animator.js';
import { Resizer } from './systems/Resizer.js';
import { CameraHelper } from 'https://unpkg.com/three@0.127.0/build/three.module.js';


let camera;
let renderer;
let scene;
let resizer;
let animator;
let light;

let alphaVal;
let intensity;
let lightInten;
let lightPosX;
let lightColor;


let cube;
let torusKnot;
let plane;

class RTCG {
    //1.ErstellungeinerInstanzderRTCG-App
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();

        container.append(renderer.domElement);

        resizer = new Resizer(container, camera, renderer, this.render);

        this.createSceneContent();


        scene.add(light);
        const helper = new CameraHelper(light.shadow.camera);
        scene.add(helper);
        scene.add(cube);
        scene.add(torusKnot);
        scene.add(plane);



        animator = new Animator(this.render);
        animator.add(cube);
        animator.add(torusKnot);
        animator.add(plane);

        animator.addContinuousAnimation(cube, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(torusKnot, "rotate", { x: 1, y: 1 });
        animator.start();

        this.getSliders();

    }
    createSceneContent() {

        light = createLight();
        light.position.set(0, 21, 0);
        console.log(light);

        cube = createCube();
        torusKnot = createTorusKnot();
        plane = createPlane();


        cube.castShadow = true;
        torusKnot.castShadow = true;

        plane.receiveShadow = true;

        cube.position.set(15, 10, 0);
        torusKnot.position.set(-15, 10, 0);
        plane.position.set(0, 0, -10);
        plane.rotation.set(-180, 0, 0);
    }
    //2.RenderingderSzene
    render() {
        renderer.render(scene, camera);
    }

    getSliders() {
        intensity = document.getElementById('intensity');
        intensity.addEventListener('change', this.changeColIntensity);

        lightInten = document.getElementById('lightInten');
        lightInten.addEventListener('change', this.changeLightIntensity);

        lightPosX = document.getElementById('lightPosX');
        lightPosX.addEventListener('change', this.changeLightPosX);

        alphaVal = document.getElementById('alphaVal');
        alphaVal.addEventListener('change', this.changeAlphaValue);

        lightColor = document.getElementById('color');
        lightColor.addEventListener('change', this.changeLightColor);

        this.setLightPosFirstTime();
    }
    changeColIntensity() {
        cube.material.uniforms.intensity.value = intensity.value;
        torusKnot.material.uniforms.intensity.value = intensity.value;
    }
    changeAlphaValue() {
        cube.material.uniforms.aValue.value = alphaVal.value;
        torusKnot.material.uniforms.aValue.value = alphaVal.value;
    }
    changeLightIntensity() {
        light.intensity = lightInten.value;
        cube.material.uniforms.lightIntensity.value = light.intensity;
        torusKnot.material.uniforms.lightIntensity.value = light.intensity;
    }
    setLightPosFirstTime() {
        cube.material.uniforms.lightPos.value = light.position;
        torusKnot.material.uniforms.lightPos.value = light.position;
    }
    changeLightPosX() {
        cube.material.uniforms.lightPos.value = light.position;
        torusKnot.material.uniforms.lightPos.value = light.position;
        light.position.set(lightPosX.value, light.position.y, light.position.z);
    }
    changeLightColor() {

        light.color = hexToRgb(lightColor.value);

        console.log(light.color);
    }

}
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}
export { RTCG };
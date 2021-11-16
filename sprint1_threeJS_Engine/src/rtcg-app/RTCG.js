import { createCamera } from './components/camera.js';
import { createCube, createTorusKnot, createPlane, createSphere } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { createRenderer } from './systems/renderer.js';
import { Animator } from './systems/Animator.js';
import { Resizer } from './systems/Resizer.js';
import { CameraHelper } from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { PointLightHelper } from 'https://unpkg.com/three@0.127.0/build/three.module.js';



let camera;
let renderer;
let scene;
let resizer;
let animator;

let alphaVal;
let intensity;
let lightInten;
let lightPosX;
let lightPosY;
let lightPosZ;
let lightColor;

let cube;
let torusKnot;
let plane;
let helper;
let light;
let sphere;


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
        scene.add(helper);
        scene.add(sphere);
        scene.add(cube);
        scene.add(torusKnot);
        scene.add(plane);

        animator = new Animator(this.render);
        animator.add(cube);
        animator.add(torusKnot);
        animator.add(sphere);

        animator.addContinuousAnimation(cube, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(torusKnot, "rotate", { x: 1, y: 1 });
        //animator.addContinuousAnimation(sphere, "rotate", { x: 1, y: 1 });
        animator.start();

        this.getSliders();

    }
    createSceneContent() {

        light = createLight();
        light.position.set(0, 30, 0);
        helper = new PointLightHelper(light);
        //helper = new CameraHelper(light.shadow.camera);

        cube = createCube(light, camera);
        sphere = createSphere(light, camera);


        torusKnot = createTorusKnot();
        plane = createPlane();

        cube.castShadow = true;
        torusKnot.castShadow = true;
        sphere.castShadow = true;

        plane.receiveShadow = true;

        cube.position.set(0, 10, 0);
        torusKnot.position.set(-20, 10, 0);
        sphere.position.set(20, 10, 0);
        plane.position.set(0, 0, -10);
        plane.rotation.set(-180, 0, 0);
        this.setLightPosFirstTime();
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

        lightPosY = document.getElementById('lightPosY');
        lightPosY.addEventListener('change', this.changeLightPosY);

        lightPosZ = document.getElementById('lightPosZ');
        lightPosZ.addEventListener('change', this.changeLightPosZ);

        alphaVal = document.getElementById('alphaVal');
        alphaVal.addEventListener('change', this.changeAlphaValue);

        lightColor = document.getElementById('color');
        lightColor.addEventListener('change', this.changeLightColor);

        this.setLightPosFirstTime();
    }
    changeColIntensity() {
        cube.material.uniforms.intensity.value = intensity.value;
        torusKnot.material.uniforms.intensity.value = intensity.value;
        sphere.material.uniforms.intensity.value = intensity.value;
    }
    changeAlphaValue() {
        cube.material.uniforms.aValue.value = alphaVal.value;
        torusKnot.material.uniforms.aValue.value = alphaVal.value;
        sphere.material.uniforms.aValue.value = alphaVal.value;
    }
    changeLightIntensity() {
        sphere.material.uniforms.lightIntensity.value = light.intensity;
    }
    setLightPosFirstTime() {
        cube.material.uniforms.lightPos.value = light.position;
        torusKnot.material.uniforms.lightPos.value = light.position;
        sphere.material.uniforms.lightPos.value = light.position;
    }
    changeLightPosX() {
        light.position.set(parseInt(lightPosX.value), light.position.y, light.position.z);
    }
    changeLightPosY() {
        light.position.set(light.position.x, parseInt(lightPosY.value), light.position.z);
    }
    changeLightPosZ() {
        light.position.set(light.position.x, light.position.y, parseInt(lightPosZ.value));
    }
    changeLightColor() {
        sphere.material.uniforms.lightColor = hexToRgb(lightColor.value);
        light.color = hexToRgb(lightColor.value);
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
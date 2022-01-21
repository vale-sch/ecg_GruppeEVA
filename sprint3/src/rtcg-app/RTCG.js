import { createCamera } from './components/camera.js';
import { createSpeaker } from './components/speaker.js';
import { createCube, createTorusKnot, createPlane, createSphere, createCone } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { createRenderer } from './systems/renderer.js';
import { HandtrackingUtils, createToggleAudioButtonLeft, createToggleAudioButtonRight, createDraggableObject, createSliderObject, world, createToggleStripesButton, createInvertButton, createColorButton, createBrightnessButton, createToggleAudioSync } from '../rtcg-app/systems/VRUtils/HandtrackingUtils.js'
import * as THREE from '../../js/three.module.js';

const clock = new THREE.Clock();

let camera;
let renderer;
let scene;
let speaker1;
let speaker2;

let torusKnot;
let plane;
let helper;
let light;
let sphereRedSlider;
let sphereGreenSlider;
let sphereBlueSlider;
let sphereAlphaSlider;
let sphereBrightnessSlider;
let sphereStripesFrequenzySlider;
let sphereLightXPosSlider;
let sphereLightYPosSlider;
let sphereLightZPosSlider;
let sceneObjects = new Array();

let cube;
let cone;


class RTCG {

    constructor() {
        renderer = createRenderer();
        camera = createCamera();
        scene = createScene();

        new HandtrackingUtils(scene, renderer, camera);
        this.createSceneContent();
        this.addToScene();

        window.addEventListener('resize', onWindowResize);
        animate();
    }

    createSceneContent() {

        light = createLight();
        light.position.set(0, 2, -1);

        helper = new THREE.PointLightHelper(light, 0.15, new THREE.Color("rgb(255, 255, 0)"));

        cube = createCube(light, camera);
        createDraggableObject(cube);

        cone = createCone(light, camera);
        createDraggableObject(cone);

        torusKnot = createTorusKnot(light, camera);
        createDraggableObject(torusKnot);

        speaker1 = createSpeaker(light, camera);
        createDraggableObject(speaker1);
        speaker1.castShadow = true;

        speaker2 = createSpeaker(light, camera);
        createDraggableObject(speaker2);
        speaker2.castShadow = true;

        sceneObjects.push(cube, cone, torusKnot);
        plane = createPlane();
        cube.castShadow = true;
        torusKnot.castShadow = true;
        cone.castShadow = true;
        plane.receiveShadow = true;

        sphereRedSlider = createSphere("rgb(0, 0, 0)");
        sphereGreenSlider = createSphere("rgb(0, 0, 0)");
        sphereBlueSlider = createSphere("rgb(0, 0, 0)");
        sphereAlphaSlider = createSphere("rgb(0, 0, 0)");
        sphereBrightnessSlider = createSphere("rgb(0, 0, 0)");
        sphereStripesFrequenzySlider = createSphere("rgb(255, 255, 255)");
        sphereLightXPosSlider = createSphere("rgb(255, 255, 0)");
        sphereLightYPosSlider = createSphere("rgb(255, 255, 0)");
        sphereLightZPosSlider = createSphere("rgb(255, 255, 0)");

        createSliderObject(sphereRedSlider, sceneObjects, "uSlider_Red");
        createSliderObject(sphereGreenSlider, sceneObjects, "uSlider_Green");
        createSliderObject(sphereBlueSlider, sceneObjects, "uSlider_Blue");
        createSliderObject(sphereAlphaSlider, sceneObjects, "uSlider_Alpha");
        createSliderObject(sphereBrightnessSlider, sceneObjects, "uSlider_Brightness");
        createSliderObject(sphereStripesFrequenzySlider, sceneObjects, "uSlider_Stripe_Frequency");
        createSliderObject(sphereLightXPosSlider, sceneObjects, "uLight_PosX", light);
        createSliderObject(sphereLightYPosSlider, sceneObjects, "uLight_PosY", light);
        createSliderObject(sphereLightZPosSlider, sceneObjects, "uLight_PosZ", light);

        createColorButton(sceneObjects);
        createToggleStripesButton(sceneObjects);
        createInvertButton(sceneObjects);
        createBrightnessButton(sceneObjects);

        this.moveObject(torusKnot, -1, 0, -2);
        this.moveObject(cube, 0, 0, -2);
        this.moveObject(cone, 1, 0, -2);
        this.moveObject(speaker1, -2, 0, -3);
        this.moveObject(speaker2, 2, 0, -3);

        sphereRedSlider.position.set(1, 1.8, 0.5);
        sphereGreenSlider.position.set(1, 1.7, 0.5);
        sphereBlueSlider.position.set(1, 1.6, 0.5);
        sphereAlphaSlider.position.set(1, 1.5, -0.5);
        sphereBrightnessSlider.position.set(1, 1.4, 0);
        sphereStripesFrequenzySlider.position.set(1, 1.3, 0.5);
        sphereLightXPosSlider.position.set(1, 1.2, 0);
        sphereLightYPosSlider.position.set(1, 1.1, -0.5);
        sphereLightZPosSlider.position.set(1, 1, 0.5);

        //Audio Test
        let listener = new THREE.AudioListener();
        camera.add(listener);

        let sound1 = new THREE.PositionalAudio(listener);
        let sound2 = new THREE.PositionalAudio(listener);

        let audioLoader = new THREE.AudioLoader();
        audioLoader.load('./src/rtcg-app/sounds/test.ogg', function (buffer) {
            sound1.setLoop(true);
            sound1.setBuffer(buffer);
            sound1.setRefDistance(0.5);
        });
        audioLoader.load('./src/rtcg-app/sounds/test.ogg', function (buffer) {
            sound2.setLoop(true);
            sound2.setBuffer(buffer);
            sound2.setRefDistance(0.5);
        });

        createToggleAudioButtonLeft(sound1);
        createToggleAudioButtonRight(sound2);
        createToggleAudioSync(sound1, sound2);

        speaker1.add(sound1);
        speaker2.add(sound2);

        plane.position.set(0, -1, -2);
        plane.rotation.set(190, 0, 0);
    }
    addToScene() {
        scene.add(light);
        scene.add(helper);
        scene.add(speaker1);
        scene.add(speaker2);
        scene.add(torusKnot);
        scene.add(plane);
        scene.add(cube);
        scene.add(cone)
        scene.add(sphereRedSlider);
        scene.add(sphereGreenSlider);
        scene.add(sphereBlueSlider);
        scene.add(sphereAlphaSlider);
        scene.add(sphereBrightnessSlider);
        scene.add(sphereStripesFrequenzySlider);
        scene.add(sphereLightXPosSlider);
        scene.add(sphereLightYPosSlider);
        scene.add(sphereLightZPosSlider);
    }

    moveObject(object, x, y, z) {
        object.position.set(x, y, z);
        if (object.material.uniforms.positionOffset) {
            object.material.uniforms.positionOffset.x = x;
            object.material.uniforms.positionOffset.y = y;
            object.material.uniforms.positionOffset.z = z;
        }

    }


}
function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    const delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    renderer.xr.updateCamera(camera);

    world.execute(delta, elapsedTime);

    animateObject(torusKnot);
    animateObject(cone);
    animateObject(cube);

    //morphMesh();
    renderer.render(scene, camera);
}

function animateObject(object) {
    object.rotation.x += 0.01;
    object.rotation.y += 0.01;
    object.rotation.z += 0.01;
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
export { RTCG };
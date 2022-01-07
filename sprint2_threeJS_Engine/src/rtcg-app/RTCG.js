import { createCamera } from './components/camera.js';
import { createCube, createTorusKnot, createPlane, createSphere, createCone } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { SliderController } from './systems/SliderController.js';
import { MorphCube, morphMesh } from './systems/MorphCube.js';
import { createRenderer } from './systems/renderer.js';
import { HandtrackingUtils, createDraggableObject, createSliderObject, world, createToggleStripesButton, createInvertButton, createColorButton } from '../rtcg-app/systems/VRUtils/HandtrackingUtils.js'
import * as THREE from '../../js/three.module.js';
import { Animator } from './systems/Animator.js';

const clock = new THREE.Clock();

let camera;
let renderer;
let scene;
let resizer;
let animator;

let torusKnot;
let plane;
let helper;
let light;
let sphereRedSlider;
let sphereGreenSlider;
let sphereBlueSlider;
let sphereAlphalider;
let sphereStripesFrequenzySlider;
let sphereLightPosSlider;
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
        scene.add(light);
        scene.add(helper);

        scene.add(torusKnot);
        scene.add(plane);
        scene.add(cube);
        scene.add(cone)
        scene.add(sphereRedSlider);
        scene.add(sphereGreenSlider);
        scene.add(sphereBlueSlider);
        scene.add(sphereAlphalider);
        scene.add(sphereStripesFrequenzySlider);
        scene.add(sphereLightPosSlider);
        /*animator = new Animator(render);
        animator.add(morph);
        animator.add(torusKnot);
        animator.add(sphere);

        animator.addContinuousAnimation(torusKnot, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(morph, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(sphere, "rotate", { x: 1, y: 1 });
        animator.start();*/

        //new SliderController(cube, torusKnot, sphereRedSlider);
        //new MorphCube(cube);

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

        sceneObjects.push(cube, cone, torusKnot);
        plane = createPlane();
        cube.castShadow = true;
        torusKnot.castShadow = true;
        cone.castShadow = true;
        plane.receiveShadow = true;

        sphereRedSlider = createSphere("rgb(0, 0, 0)");
        sphereGreenSlider = createSphere("rgb(0, 0, 0)");
        sphereBlueSlider = createSphere("rgb(0, 0, 0)");
        sphereAlphalider = createSphere("rgb(0, 0, 0)");


        sphereStripesFrequenzySlider = createSphere("rgb(255, 255, 255)");
        sphereLightPosSlider = createSphere("rgb(255, 255, 0)");

        createSliderObject(sphereRedSlider, sceneObjects, "uSlider_Red");
        createSliderObject(sphereGreenSlider, sceneObjects, "uSlider_Green");
        createSliderObject(sphereBlueSlider, sceneObjects, "uSlider_Blue");
        createSliderObject(sphereAlphalider, sceneObjects, "uSlider_Alpha");
        createSliderObject(sphereStripesFrequenzySlider, sceneObjects, "uSlider_Stripe_Frequency");
        createSliderObject(sphereLightPosSlider, sceneObjects, "uLight_Pos", light);

        createColorButton(sceneObjects);
        createToggleStripesButton(sceneObjects);
        createInvertButton(sceneObjects);

        this.moveObject(torusKnot, -1, 0, -2);
        this.moveObject(cube, 0, 0, -2);
        this.moveObject(cone, 1, 0, -2);

        sphereRedSlider.position.set(1, 1.8, 0.5);
        sphereGreenSlider.position.set(1, 1.7, 0.5);
        sphereBlueSlider.position.set(1, 1.6, 0.5);
        sphereAlphalider.position.set(1, 1.5, -0.5);
        sphereStripesFrequenzySlider.position.set(1, 1.4, 0.5);
        sphereLightPosSlider.position.set(1, 1.3, 0);

        plane.position.set(0, -1, -2);
        plane.rotation.set(190, 0, 0);
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
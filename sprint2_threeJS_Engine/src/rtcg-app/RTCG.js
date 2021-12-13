import { createCamera } from './components/camera.js';
import { createCube, createTorusKnot, createPlane, createSphere } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { SliderController } from './systems/SliderController.js';
import { MorphCube, morphMesh } from './systems/MorphCube.js';
import { createRenderer } from './systems/renderer.js';
import { HandtrackingUtils, createDraggableObject, world } from '../rtcg-app/systems/VRUtils/HandtrackingUtils.js'
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
let sphere;

let morph;



class RTCG {

    constructor() {
        renderer = createRenderer();
        camera = createCamera();
        scene = createScene();
        new HandtrackingUtils(scene, renderer, camera);
        this.createSceneContent();
        scene.add(light);
        scene.add(helper);
        scene.add(sphere);
        scene.add(torusKnot);
        scene.add(plane);
        scene.add(morph);

        /*animator = new Animator(render);
        animator.add(morph);
        animator.add(torusKnot);
        animator.add(sphere);

        animator.addContinuousAnimation(torusKnot, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(morph, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(sphere, "rotate", { x: 1, y: 1 });
        animator.start();*/

        new SliderController(morph, torusKnot, sphere);
        new MorphCube(morph);

        window.addEventListener('resize', onWindowResize);
        animate();

    }

    createSceneContent() {

        light = createLight();
        light.position.set(0, 15, 0);

        helper = new THREE.PointLightHelper(light);

        morph = createCube(light, camera);
        createDraggableObject(morph);

        sphere = createSphere(light, camera);
        createDraggableObject(sphere);


        torusKnot = createTorusKnot(light, camera);
        createDraggableObject(torusKnot);

        plane = createPlane();

        morph.castShadow = true;
        torusKnot.castShadow = true;
        sphere.castShadow = true;

        plane.receiveShadow = true;

        this.moveObject(torusKnot, -1, 0, -2);
        this.moveObject(sphere, 1, 0, -2);
        this.moveObject(morph, 0, -0.5, -3);
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
    animateObject(sphere);
    animateObject(morph);

    morphMesh();
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
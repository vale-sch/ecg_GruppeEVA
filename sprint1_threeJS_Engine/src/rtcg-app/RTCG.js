import { createCamera } from './components/camera.js';
import { createCube, createSphere } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { createRenderer } from './systems/renderer.js';
import { Animator } from './systems/Animator.js';
import { Resizer } from './systems/Resizer.js';
import { ToolSwitcher } from './systems/ToolSwitcher.js';
import { Raycaster, Vector2 } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

let camera;
let renderer;
let scene;
let resizer;
let animator;
let toolSwitcher;
let raycaster;
let mouse;
let startPos = {}
let endPos = {}
let mouseDown = false;
let changeCol;
var lightDir;
let colGrad;
let alphaVal;
let hasSliders = false;
let light;
class RTCG {
    //1.ErstellungeinerInstanzderRTCG-App
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);

        resizer = new Resizer(container, camera, renderer, this.render);

        const cube = createCube();
        const sphere = createSphere();
        sphere.position.set(-20, 0, 0);

        light = createLight();

        scene.add(cube);
        scene.add(sphere);
        scene.add(light);
        light.position.set(-1, 2, 4);

        animator = new Animator(this.render);
        animator.add(cube);
        animator.add(sphere);

        toolSwitcher = new ToolSwitcher(animator, renderer, camera);
        // toolSwitcher.turnOnMouseAnimationAppending(cube);
        /*animator.addTimeRestrainedAnimation(cube, "move", {x: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {y: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {x: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {y: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {z: 10}, 1, false, 1);*/
        animator.addContinuousAnimation(cube, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(sphere, "rotate", { x: 1, y: 1 });
        animator.start();

        this.getSliders();

    }

    //2.RenderingderSzene
    render() {
        let raycaster = new Raycaster();
        const intersects = raycaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }
        if (hasSliders) {
            light.position.set(lightDir.value * 10, lightDir.value * 2, 4);

        }

        renderer.render(scene, camera);
    }

    getSliders() {
        changeCol = document.querySelector('#colChange');
        lightDir = document.getElementById('lightDir');
        colGrad = document.querySelector('#colGrad');
        alphaVal = document.querySelector('#alphaVal');
        hasSliders = true;
    }
}

export { RTCG };
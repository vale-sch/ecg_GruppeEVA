import { createCamera } from './components/camera.js';
import { createCube } from './components/box.js';
import { createScene } from './components/scene.js';
import { createRenderer } from './systems/renderer.js';
import { Animator } from './systems/Animator.js';
import { Resizer } from './systems/Resizer.js';
import { ToolSwitcher } from './systems/ToolSwitcher.js';
import { Raycaster, Vector2, ShaderMaterial } from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { createSphere } from './components/sphere.js';
import { createPlane } from './components/plane.js';

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
let material;

class RTCG {
    //1.ErstellungeinerInstanzderRTCG-App
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);

        resizer = new Resizer(container, camera, renderer, this.render);

        material = new ShaderMaterial({

            uniforms: {
                Time: { value: 0.0 },
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,

        });

        const plane = createPlane(material);
        scene.add(plane);

        animator = new Animator(this.render, plane);
        animator.add(plane);
        animator.add(camera);

        toolSwitcher = new ToolSwitcher(animator, renderer, camera);
        toolSwitcher.turnOnMouseAnimationAppending(plane);
        /*animator.addTimeRestrainedAnimation(cube, "move", {x: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {y: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {x: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {y: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {z: 10}, 1, false, 1);*/
        //animator.addContinuousAnimation(sphere, "rotate", { x: 1, y: 1 });
        animator.start();

    }

    //2.RenderingderSzene
    render() {
        let raycaster = new Raycaster();
        const intersects = raycaster.intersectObjects(scene.children);

        /*for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }*/

        material.uniforms.Time.value += 0.01;

        renderer.render(scene, camera);
    }
}

export { RTCG };
import { createCamera } from './components/camera.js';
import { createCube } from './components/box.js';
import { createScene } from './components/scene.js';
import { createRenderer } from './systems/renderer.js';
import { Animator } from './systems/Animator.js';
import { Resizer } from './systems/Resizer.js';
import { ToolSwitcher } from './systems/ToolSwitcher.js';
import { Raycaster, Vector2, Vector3, Matrix3, ShaderMaterial } from 'https://unpkg.com/three@0.127.0/build/three.module.js';
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
let Time = 0;
let q = new Vector3(0.25, 0.25, 0.25);
let u = new Vector3(-0.5, 0, 0);
let v = new Vector3(0, -0.5, 0);
let cube;

function planeIntersect(p1, p2, q, u, v) {
    let a = new Vector3(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
    let b = new Vector3(p1.x - q.x, p1.y - q.y, p1.z - q.z);
    let m = new Matrix3()
    m.set(a.x, u.x, v.x, a.y, u.y, v.y, a.z, u.z, v.z);
    m.invert();
    b.applyMatrix3(m);
    return b;
}
function sMax(a,b,k) {
    return ((a+b)+Math.sqrt((a-b)*(a-b)+k))/2;
}

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

        cube = createCube(material);
        scene.add(cube);

        animator = new Animator(this.render, cube);
        animator.add(cube);
        animator.add(camera);

        toolSwitcher = new ToolSwitcher(animator, renderer, camera);
        toolSwitcher.turnOnMouseAnimationAppending(cube);
        /*animator.addTimeRestrainedAnimation(cube, "move", {x: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {y: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {x: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {y: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(cube, "move", {z: 10}, 1, false, 1);*/
        animator.addContinuousAnimation(cube, "rotate", { x: 1, y: 1 });
        animator.start();

    }


    //2.RenderingderSzene
    render() {
        let raycaster = new Raycaster();
        const intersects = raycaster.intersectObjects(scene.children);

        material.uniforms.Time.value += 0.01;
        Time += 0.01;
        let variation = Math.sin(Time) * Math.sin(Time);
        let posArr = [];
        for (let i = 0; i < cube.geometry.attributes.position.count; i++) {
            let xIndex = i * 3 + 0;
            let yIndex = i * 3 + 1;
            let zIndex = i * 3 + 2;
            let vec = new Vector3(cube.geometry.attributes.position.array[xIndex], cube.geometry.attributes.position.array[yIndex], cube.geometry.attributes.position.array[zIndex]);

            let p1 = new Vector3(0, 0, 0);
            let r = planeIntersect(p1, vec, q, u, v);
            //console.log(r);
            let dist = 0;
            if (0 <= r.x && r.x <= 1 && 0 <= r.y && r.y <= 1 && 0 <= r.z && r.z <= 1) {
                dist = vec.length() * r.x;
            }
            //vec.setLength(1 * variation);
            //vec.setLength(1 * Math.max(dist, variation));
            vec.setLength(1 * sMax(dist, variation*1.5, 0.5));
            posArr.push(vec.x);
            posArr.push(vec.y);
            posArr.push(vec.z);
        }
        let nArr = [];
        for (let i = 0; i < posArr.length / 3; i++) {
            let xIndexU = i * 3 + 0;
            let yIndexU = i * 3 + 1;
            let zIndexU = i * 3 + 2;

            let U = new Vector3(posArr[xIndexU], posArr[yIndexU], posArr[zIndexU]);

            U.normalize();
            nArr.push(U.x);
            nArr.push(U.y);
            nArr.push(U.z);
        }

        cube.geometry.attributes.position.set(posArr, 0);
        cube.geometry.attributes.normal.set(nArr, 0);
        cube.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
}

export { RTCG };
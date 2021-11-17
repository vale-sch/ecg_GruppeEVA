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
let sideLength = 1;
let cubeArray =
    [new Vector3(sideLength / 2, sideLength / 2, sideLength / 2),
    new Vector3(-sideLength / 2, -sideLength / 2, -sideLength / 2),
    new Vector3(-sideLength, 0, 0),
    new Vector3(0, -sideLength, 0),
    new Vector3(-sideLength, 0, 0),
    new Vector3(0, 0, -sideLength),
    new Vector3(0, -sideLength, 0),
    new Vector3(0, 0, -sideLength),
    new Vector3(sideLength, 0, 0),
    new Vector3(0, sideLength, 0),
    new Vector3(sideLength, 0, 0),
    new Vector3(0, 0, sideLength),
    new Vector3(0, sideLength, 0),
    new Vector3(0, 0, sideLength)];
let morph;

function inRange(v, min, max) {
    if (v >= min && v <= max) {
        return true;
    }
    return false;
}

function planeIntersect(p1, p2, q, u, v) {
    let a = new Vector3(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
    let b = new Vector3(p1.x - q.x, p1.y - q.y, p1.z - q.z);
    let m = new Matrix3()
    m.set(a.x, u.x, v.x, a.y, u.y, v.y, a.z, u.z, v.z);
    m.invert();
    b.applyMatrix3(m);
    if (inRange(b.x, 0, 1) && inRange(b.y, 0, 1) && inRange(b.z, 0, 1)) {
        let intersection = new Vector3(p1.x + b.x * (p2.x - p1.x), p1.y + b.x * (p2.y - p1.y), p1.z + b.x * (p2.z - p1.z) );
        return {valid: true, result: b, intersection, distance: p1.distanceTo(intersection)};
    }
    return {valid: false};
}

function distToCube(p1, p2) {
    let dist = Infinity;
    for (let i = 0; i < 3; i++) {
        let a = cubeArray[i * 2 + 2];
        let b = cubeArray[i * 2 + 1 + 2];
        let res = planeIntersect(p1, p2, cubeArray[0], a, b);
        if(res.valid) {
            dist = Math.min(dist, res.distance);
        }
    }
    for (let i = 0; i < 3; i++) {
        let a = cubeArray[i * 2 + 8];
        let b = cubeArray[i * 2 + 1 + 8];
        let res = planeIntersect(p1, p2, cubeArray[1], a, b);
        if(res.valid) {
            dist = Math.min(dist, res.distance);
        }
    }
    return dist;
}

function sMax(a, b, k) {
    return ((a + b) + Math.sqrt((a - b) * (a - b) + k)) / 2;
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

        morph = createCube(material);
        //morph = createSphere(material);
        scene.add(morph);

        animator = new Animator(this.render, morph);
        animator.add(morph);
        animator.add(camera);

        toolSwitcher = new ToolSwitcher(animator, renderer, camera);
        toolSwitcher.turnOnMouseAnimationAppending(morph);
        /*animator.addTimeRestrainedAnimation(morph, "move", {x: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(morph, "move", {y: 3.5}, 2, false, 0);
        animator.addTimeRestrainedAnimation(morph, "move", {x: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(morph, "move", {y: -7}, 2, false, 0);
        animator.addTimeRestrainedAnimation(morph, "move", {z: 10}, 1, false, 1);*/
        animator.addContinuousAnimation(morph, "rotate", { x: 1, y: 1 });
        animator.start();

    }


    //2.RenderingderSzene
    render() {
        let raycaster = new Raycaster();
        const intersects = raycaster.intersectObjects(scene.children);

        material.uniforms.Time.value += 0.02;
        Time += 0.001;
        let variation = Math.sin(Time) * Math.sin(Time) * 1.5;

        for (let i = 0; i < morph.geometry.attributes.position.count; i++) {
            let v = new Vector3();
            v.fromBufferAttribute(morph.geometry.attributes.position,i);

            let dist = distToCube(morph.position,v);
            
            v.setLength(1 * sMax(dist, variation, 0.01));
            //v.setLength(1 * Math.max(dist, variation));

            morph.geometry.attributes.position.setXYZ(i,v.x,v.y,v.z);
        }

        morph.geometry.computeVertexNormals();
        morph.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
}

export { RTCG };
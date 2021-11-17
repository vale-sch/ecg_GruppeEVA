import { createCamera } from './components/camera.js';
import { createCube, createTorusKnot, createPlane, createSphere } from './components/primitiveObjects.js';
import { createScene } from './components/scene.js';
import { createLight } from './components/lighting.js';
import { createRenderer } from './systems/renderer.js';
import { Animator } from './systems/Animator.js';
import { Resizer } from './systems/Resizer.js';
import { PointLightHelper, Vector3, Matrix3 } from 'https://unpkg.com/three@0.127.0/build/three.module.js';



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

let torusKnot;
let plane;
let helper;
let light;
let sphere;


let Time = 0;
let sideLength = 5;
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
        scene.add(torusKnot);
        scene.add(plane);
        scene.add(morph);

        animator = new Animator(this.render);
        animator.add(morph);
        animator.add(torusKnot);
        animator.add(sphere);
        animator.add(light);

        animator.addContinuousAnimation(torusKnot, "rotate", { x: 1, y: 1 });
        animator.addContinuousAnimation(morph, "rotate", { x: 1, y: 1 });
        animator.addTimeRestrainedAnimation(light, "move", { x: 10, y: 0 }, 2, true, 0);

        animator.addContinuousAnimation(sphere, "rotate", { x: 1, y: 1 });
        animator.start();

        this.getSliders();

    }
    createSceneContent() {

        light = createLight();
        light.position.set(0, 30, 0);

        helper = new PointLightHelper(light);

        morph = createCube(light, camera);
        sphere = createSphere(light, camera);


        torusKnot = createTorusKnot(light, camera);
        plane = createPlane();

        morph.castShadow = true;
        torusKnot.castShadow = true;
        sphere.castShadow = true;

        plane.receiveShadow = true;

        this.moveObject(torusKnot, -20, 0, 0);
        this.moveObject(sphere, 20, 0, 0);

        plane.position.set(0, -10, -10);
        plane.rotation.set(-180, 0, 0);
        this.setLightPosFirstTime();
    }
    //2.RenderingderSzene
    render() {
        renderer.render(scene, camera);
        morphMesh();
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
        //morph.material.uniforms.intensity.value = intensity.value;
        // torusKnot.material.uniforms.intensity.value = intensity.value;
        // sphere.material.uniforms.intensity.value = intensity.value;
    }
    changeAlphaValue() {
        //morph.material.uniforms.aValue.value = alphaVal.value;
        // torusKnot.material.uniforms.aValue.value = alphaVal.value;
        // sphere.material.uniforms.aValue.value = alphaVal.value;
    }
    changeLightIntensity() {
        // sphere.material.uniforms.lightIntensity.value = light.intensity;
        //morph.material.uniforms.lightIntensity.value = light.intensity;
        // torusKnot.material.uniforms.lightIntensity.value = light.intensity;

    }
    setLightPosFirstTime() {
        //morph.material.uniforms.lightPos.value = light.position;
        // torusKnot.material.uniforms.lightPos.value = light.position;
        // sphere.material.uniforms.lightPos.value = light.position;
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
        light.color.set(lightColor.value);
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
function morphMesh() {
    // material.uniforms.Time.value += 0.02;
    Time += 0.005;
    let variation = Math.sin(Time) * Math.sin(Time) * 7.5;

    for (let i = 0; i < morph.geometry.attributes.position.count; i++) {
        let v = new Vector3();
        v.fromBufferAttribute(morph.geometry.attributes.position, i);

        let dist = distToCube(morph.position, v);

        v.setLength(1 * sMax(dist, variation, 0.01));
        //v.setLength(1 * Math.max(dist, variation));

        morph.geometry.attributes.position.setXYZ(i, v.x, v.y, v.z);
    }

    morph.geometry.computeVertexNormals();
    morph.geometry.attributes.position.needsUpdate = true;
}
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
        let intersection = new Vector3(p1.x + b.x * (p2.x - p1.x), p1.y + b.x * (p2.y - p1.y), p1.z + b.x * (p2.z - p1.z));
        return { valid: true, result: b, intersection, distance: p1.distanceTo(intersection) };
    }
    return { valid: false };
}

function distToCube(p1, p2) {
    let dist = Infinity;
    for (let i = 0; i < 3; i++) {
        let a = cubeArray[i * 2 + 2];
        let b = cubeArray[i * 2 + 1 + 2];
        let res = planeIntersect(p1, p2, cubeArray[0], a, b);
        if (res.valid) {
            dist = Math.min(dist, res.distance);
        }
    }
    for (let i = 0; i < 3; i++) {
        let a = cubeArray[i * 2 + 8];
        let b = cubeArray[i * 2 + 1 + 8];
        let res = planeIntersect(p1, p2, cubeArray[1], a, b);
        if (res.valid) {
            dist = Math.min(dist, res.distance);
        }
    }
    return dist;
}

function sMax(a, b, k) {
    return ((a + b) + Math.sqrt((a - b) * (a - b) + k)) / 2;
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
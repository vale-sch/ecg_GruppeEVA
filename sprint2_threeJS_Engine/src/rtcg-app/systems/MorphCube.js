
import * as THREE from '../../../js/three.module.js';


let Time = 0;
let sideLength = 5;
let morph;
let cubeArray =
    [new THREE.Vector3(sideLength / 2, sideLength / 2, sideLength / 2),
    new THREE.Vector3(-sideLength / 2, -sideLength / 2, -sideLength / 2),
    new THREE.Vector3(-sideLength, 0, 0),
    new THREE.Vector3(0, -sideLength, 0),
    new THREE.Vector3(-sideLength, 0, 0),
    new THREE.Vector3(0, 0, -sideLength),
    new THREE.Vector3(0, -sideLength, 0),
    new THREE.Vector3(0, 0, -sideLength),
    new THREE.Vector3(sideLength, 0, 0),
    new THREE.Vector3(0, sideLength, 0),
    new THREE.Vector3(sideLength, 0, 0),
    new THREE.Vector3(0, 0, sideLength),
    new THREE.Vector3(0, sideLength, 0),
    new THREE.Vector3(0, 0, sideLength)];

class MorphCube {
    constructor(_morph) {
        morph = _morph;
    }
}
export { MorphCube }

function morphMesh() {
    // material.uniforms.Time.value += 0.02;
    Time += 0.005;
    let variation = Math.sin(Time) * Math.sin(Time) * 7.5;

    for (let i = 0; i < morph.geometry.attributes.position.count; i++) {
        let v = new THREE.Vector3();
        v.fromBufferAttribute(morph.geometry.attributes.position, i);

        let dist = distToCube(morph.position, v);

        v.setLength(1 * sMax(dist, variation, 0.01));
        //v.setLength(1 * Math.max(dist, variation));

        morph.geometry.attributes.position.setXYZ(i, v.x, v.y, v.z);
    }

    morph.geometry.computeVertexNormals();
    morph.geometry.attributes.position.needsUpdate = true;
}

export { morphMesh }

function inRange(v, min, max) {
    if (v >= min && v <= max) {
        return true;
    }
    return false;
}

function planeIntersect(p1, p2, q, u, v) {
    let a = new THREE.Vector3(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
    let b = new THREE.Vector3(p1.x - q.x, p1.y - q.y, p1.z - q.z);
    let m = new THREE.Matrix3()
    m.set(a.x, u.x, v.x, a.y, u.y, v.y, a.z, u.z, v.z);
    m.invert();
    b.applyMatrix3(m);
    if (inRange(b.x, 0, 1) && inRange(b.y, 0, 1) && inRange(b.z, 0, 1)) {
        let intersection = new THREE.Vector3(p1.x + b.x * (p2.x - p1.x), p1.y + b.x * (p2.y - p1.y), p1.z + b.x * (p2.z - p1.z));
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
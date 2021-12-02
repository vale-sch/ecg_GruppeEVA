import { PerspectiveCamera } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new PerspectiveCamera(
        45,//FOV
        aspectRatio,//AspectRatio
        0.1,//NearClip
        100,//FarClip
    );
    //RückstellungderKamera
    camera.position.set(0, 5, 55);
    return camera;
}

export { createCamera };
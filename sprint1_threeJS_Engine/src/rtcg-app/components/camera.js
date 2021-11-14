import { PerspectiveCamera } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCamera() {
    const camera = new PerspectiveCamera(
        35,//FOV
        1,//AspectRatio
        0.1,//NearClip
        100,//FarClip
    );
    //RückstellungderKamera
    camera.position.set(0, 20, 75);
    return camera;
}

export { createCamera };
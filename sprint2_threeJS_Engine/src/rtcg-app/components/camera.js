import { PerspectiveCamera } from '../../../js/three.module.js';

function createCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new PerspectiveCamera(
        50, aspectRatio, 0.1, 100
    );
    //RückstellungderKamera
    camera.position.set((0, 5, 0));
    return camera;
}

export { createCamera };
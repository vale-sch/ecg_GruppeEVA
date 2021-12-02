import { WebGLRenderer, PCFSoftShadowMap, sRGBEncoding } from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { VRButton } from './VRButton.js';
function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = PCFSoftShadowMap;

    renderer.outputEncoding = sRGBEncoding;
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    return renderer;
}

export { createRenderer };
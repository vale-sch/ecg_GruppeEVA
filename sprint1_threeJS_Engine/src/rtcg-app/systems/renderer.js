import { WebGLRenderer, PCFSoftShadowMap } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    return renderer;
}

export { createRenderer };
// hier noch der lighting code wie bei der camera.js
import { DirectionalLight } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';


function createLight(color, intensity) {
    if (!color) color = "#ffffff";
    if (!intensity) intensity = 1;

    const light = new DirectionalLight(color, intensity);
    light.castShadow = true;
    return light;
}

export { createLight }
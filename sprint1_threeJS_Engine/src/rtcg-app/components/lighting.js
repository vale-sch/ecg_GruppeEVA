// hier noch der lighting code wie bei der camera.js
import { PointLight } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';


function createLight(color, intensity) {
    if (!color) color = "#ffffff";
    if (!intensity) intensity = 1;

    const light = new PointLight(color, intensity);
    light.castShadow = true;
    light.shadow.camera.left = -28;
    light.shadow.camera.right = 28;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -12;
    return light;
}

export { createLight }
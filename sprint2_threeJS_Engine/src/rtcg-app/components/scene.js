import { Color, Scene } from '../../../js/three.module.js';
function createScene() {
    const scene = new Scene();
    scene.background = new Color(0x444444);;
    return scene;
}
export { createScene };
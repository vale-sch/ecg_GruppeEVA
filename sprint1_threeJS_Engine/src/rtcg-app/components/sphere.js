import { SphereBufferGeometry, Mesh } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createSphere(material) {
    //Erstellung der Geometrie
    const geometry = new SphereBufferGeometry(4, 32, 16);
    //Erzeugung eines Meshes das Geometrie und Material beinhaltet
    const sphere = new Mesh(geometry, material);
    return sphere;
}

export { createSphere };
import { PlaneGeometry, Mesh } from 'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createPlane(material) {
  //Erstellung der Geometrie
    const geometry = new PlaneGeometry(1,1);
    //Erzeugung eines Meshes das Geometrie und Material beinhaltet
    const plane = new Mesh(geometry, material);
    return plane;
}

export { createPlane };
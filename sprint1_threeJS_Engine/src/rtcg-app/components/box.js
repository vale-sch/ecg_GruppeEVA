import {BoxBufferGeometry,Mesh,MeshBasicMaterial} from'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube(){
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(2,2,2);
    //ERstellungdesStandardBasismaterials
    const material = new MeshBasicMaterial();
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry,material);
    return cube;
}

export{createCube};
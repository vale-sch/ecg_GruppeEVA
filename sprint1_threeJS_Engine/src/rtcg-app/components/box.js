import {BoxBufferGeometry,Mesh,MeshBasicMaterial,MeshPhongMaterial} from'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube(){
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(2,2,2);
    //ERstellungdesStandardBasismaterials
    const material = new MeshPhongMaterial({color: 0x44aa88});
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry,material);
    return cube;
}

export{createCube};
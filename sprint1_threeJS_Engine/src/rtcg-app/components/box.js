import {BoxBufferGeometry,Mesh,MeshBasicMaterial} from'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCube(material){
    //ERstellungderGeometrie
    const geometry = new BoxBufferGeometry(1,1,1,7,7,7);
    //ErzeugungeinesMeshesmdassGeometrieundMaterialbeinhaltet
    const cube = new Mesh(geometry,material);
    return cube;
}

export{createCube};
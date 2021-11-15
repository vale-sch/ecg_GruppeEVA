import {PerspectiveCamera} from'https://unpkg.com/three@0.127.0/build/three.module.js ';

function createCamera(){
    const camera = new PerspectiveCamera(
        90,//FOV
        1,//AspectRatio
        0.1,//NearClip
        100,//FarClip
        );
        //RückstellungderKamera
    camera.position.set(2,2,2);
    camera.lookAt(0,0,0);
    return camera;
}

export{createCamera};
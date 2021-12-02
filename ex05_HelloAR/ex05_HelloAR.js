import * as THREE from './modules/three.module.js';
import {ARButton} from './ARButton.js';

// global variabes see p.194
var gl, cube, sphere, light, camera, scene;

init();
animate();

function init() {
    // create context
    gl = new THREE.WebGLRenderer({antialias: true});
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(window.innerWidth, window.innerHeight);
    gl.outputEncoding = THREE.sRGBEncoding;
    gl.xr.enabled = true;
    document.body.appendChild(gl.domElement);
    document.body.appendChild(ARButton.createButton(gl));
    
    // create and set the camera
    const angleOfView = 55;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);

    // add fog
    const fog = new THREE.Fog("gray", 1, 90);
    scene.fog = fog;
    
    // GEOMETRY
    // Create the upright plane
    const planeWidth = 256;
    const planeHeight = 128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );
    // Create the cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );
    // Create the Sphere
    const sphereRadius = 5;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 32;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );

    // MATERIALS and TEXTURES
    const textureLoader = new THREE.TextureLoader();

    // plane
    const planeTextureMap = textureLoader.load('textures/pebbles.jpg');
    // increase resolution and hence decrease size of the stones
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);
    // enable mipmap
    planeTextureMap.minFilter = THREE.NearestFilter;
    // anisotropy
    planeTextureMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    // normal map
    const planeNormalMap = textureLoader.load('textures/pebbles_normal.png');
    planeNormalMap.wrapS = THREE.RepeatWrapping;
    planeNormalMap.wrapT = THREE.RepeatWrapping;
    planeNormalMap.minFilter = THREE.NearestFilter;
    planeNormalMap.repeat.set(16, 16);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        normalMap: planeNormalMap
    });

    // cube
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 'pink'
    });

    // sphere
    const sphereTextureMap = textureLoader.load('textures/earth2.png');
    sphereTextureMap.wrapS = THREE.ClampToEdgeWrapping;
    sphereTextureMap.wrapT = THREE.ClampToEdgeWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: sphereTextureMap,
        color: 'tan'
    });

    
    // LIGHTS
    // directional lighting
    const color = 0xffffff;
    const intensity = 0.7;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 30, 30);
    scene.add(light);
    // ambient lighting
    const ambientColor = 0xaaaaff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // MESH
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //plane.translateZ(0);
    //plane.translateY(-2);
    plane.rotation.x = Math.PI / 2;
    //scene.add(plane);
    light.target = plane;
    scene.add(light.target);

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, -30);
    scene.add(cube);

    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, -30);
    scene.add(sphere);

}

function animate() {
    gl.setAnimationLoop(draw);
}

// DRAW
function draw(time) {
    time *= 0.001;

    if (resizeDisplay) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.rotation.y += 0.01;

    light.position.x = 20*Math.cos(time);
    light.position.y = 20*Math.sin(time);

    gl.render(scene, camera);        
}

// UPDATE RESIZE
function resizeDisplay() {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}
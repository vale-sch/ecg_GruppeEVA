import {
    Object3D, Button, Intersectable, HandsInstructionText, OffsetFromCamera,
    NeedCalibration, Draggable, Slider, InstructionSystem,
    CalibrationSystem, ButtonSystem, DraggableSystem, SliderSystem, HandRaySystem
} from './HandtrackingCore.js';

import { XRControllerModelFactory } from './XRControllerModelFactory.js';
import { OculusHandModel } from './OculusHandModel.js';
import { OculusHandPointerModel } from './OculusHandPointerModel.js';
import { createText } from './Text2D.js';
import { World, } from './ecsy.module.js';
import * as THREE from '../../../../js/three.module.js'


const world = new World();
let audioStateLeftBox = false;
let audioStateRightBox = false;
let menuMesh;
class HandtrackingUtils {

    constructor(scene, renderer, camera) {


        // controllers
        const controller1 = renderer.xr.getController(0);
        scene.add(controller1);

        const controller2 = renderer.xr.getController(1);
        scene.add(controller2);

        const controllerModelFactory = new XRControllerModelFactory();

        // Hand 1
        const controllerGrip1 = renderer.xr.getControllerGrip(0);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        scene.add(controllerGrip1);

        const hand1 = renderer.xr.getHand(0);
        hand1.add(new OculusHandModel(hand1));
        const handPointer1 = new OculusHandPointerModel(hand1, controller1);
        hand1.add(handPointer1);

        scene.add(hand1);

        // Hand 2
        const controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        scene.add(controllerGrip2);

        const hand2 = renderer.xr.getHand(1);
        hand2.add(new OculusHandModel(hand2));
        const handPointer2 = new OculusHandPointerModel(hand2, controller2);
        hand2.add(handPointer2);
        scene.add(hand2);


        const menuGeometry = new THREE.PlaneGeometry(0.24, 0.5);
        const menuMaterial = new THREE.MeshPhongMaterial({
            opacity: 0,
            transparent: true,
        });
        menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
        menuMesh.position.set(0.4, 1, - 1);
        menuMesh.rotation.y = - Math.PI / 12;
        scene.add(menuMesh);


        const exitButton = makeButtonMesh(0.2, 0.1, 0.01, 0xff0000);
        const exitButtonText = createText('exit', 0.06);
        exitButton.add(exitButtonText);
        exitButtonText.position.set(0, 0, 0.0051);
        exitButton.position.set(0.5, 0.8, -0.5);
        exitButton.rotation.set(0, -45, 0);
        menuMesh.add(exitButton);





        const exitText = createText('Exiting session...', 0.04);
        exitText.position.set(0, 1, - 0.3);
        exitText.visible = false;
        scene.add(exitText);

        const redSliderText = createText('RED', 0.04);
        redSliderText.position.set(1, 1.8, -0.65);
        redSliderText.rotation.set(0, 4.5, 0);
        scene.add(redSliderText);

        const greenSliderText = createText('GREEN', 0.04);
        greenSliderText.position.set(1, 1.7, -0.65);
        greenSliderText.rotation.set(0, 4.5, 0);
        scene.add(greenSliderText);

        const blueSliderText = createText('BLUE', 0.04);
        blueSliderText.position.set(1, 1.6, -0.65);
        blueSliderText.rotation.set(0, 4.5, 0);
        scene.add(blueSliderText);

        const alphaSliderText = createText('ALPHA', 0.04);
        alphaSliderText.position.set(1, 1.5, -0.65);
        alphaSliderText.rotation.set(0, 4.5, 0);
        scene.add(alphaSliderText);

        const BrightnessSliderText = createText('BRIGHTNESS', 0.04);
        BrightnessSliderText.position.set(1, 1.4, -0.65);
        BrightnessSliderText.rotation.set(0, 4.5, 0);
        scene.add(BrightnessSliderText);

        const stripesFrequencyText = createText('STRIPES', 0.04);
        stripesFrequencyText.position.set(1, 1.3, -0.65);
        stripesFrequencyText.rotation.set(0, 4.5, 0);
        scene.add(stripesFrequencyText);

        const lightPosXText = createText('LIGHT X-POS', 0.04);
        lightPosXText.position.set(1, 1.2, -0.65);
        lightPosXText.rotation.set(0, 4.5, 0);
        scene.add(lightPosXText);

        const lightPosYText = createText('LIGHT Y-POS', 0.04);
        lightPosYText.position.set(1, 1.1, -0.65);
        lightPosYText.rotation.set(0, 4.5, 0);
        scene.add(lightPosYText);

        const lightPosZText = createText('LIGHT Z-POS', 0.04);
        lightPosZText.position.set(1, 1, -0.65);
        lightPosZText.rotation.set(0, 4.5, 0);
        scene.add(lightPosZText);


        world
            .registerComponent(Object3D)
            .registerComponent(Button)
            .registerComponent(Intersectable)
            .registerComponent(HandsInstructionText)
            .registerComponent(OffsetFromCamera)
            .registerComponent(NeedCalibration)
            .registerComponent(Draggable)
            .registerComponent(Slider);

        world
            .registerSystem(InstructionSystem, { controllers: [controllerGrip1, controllerGrip2] })
            .registerSystem(CalibrationSystem, { renderer: renderer, camera: camera })
            .registerSystem(ButtonSystem)
            .registerSystem(SliderSystem)
            .registerSystem(DraggableSystem)
            .registerSystem(HandRaySystem, { handPointers: [handPointer1, handPointer2] });

        const menuEntity = world.createEntity();
        menuEntity.addComponent(Intersectable);
        menuEntity.addComponent(OffsetFromCamera, { x: 0.4, y: 0, z: - 1 });
        menuEntity.addComponent(NeedCalibration);
        menuEntity.addComponent(Object3D, { object: menuMesh });

        const ebEntity = world.createEntity();
        ebEntity.addComponent(Intersectable);
        ebEntity.addComponent(Object3D, { object: exitButton });
        const ebAction = function () {

            exitText.visible = true;
            setTimeout(function () {

                exitText.visible = false; renderer.xr.getSession().end();

            }, 2000);

        };

        ebEntity.addComponent(Button, { action: ebAction });






    }


}
function createDraggableObject(object) {
    const entity = world.createEntity();
    entity.addComponent(Intersectable);
    entity.addComponent(Object3D, { object: object });
    entity.addComponent(Draggable);
}
function createToggleStripesButton(objectsWithUniform) {

    const stripesButton = makeButtonMesh(0.33, 0.15, 0.01, 0x000000);
    const stripesButtonText = createText('TOGGLE STRIPES', 0.03);
    stripesButton.add(stripesButtonText);
    stripesButtonText.position.set(0, 0, 0.0051);
    stripesButton.position.set(0.5, 0.6, -0.5);
    stripesButton.rotation.set(0, -45, 0);
    menuMesh.add(stripesButton);

    const tSEntity = world.createEntity();
    tSEntity.addComponent(Intersectable);
    tSEntity.addComponent(Object3D, { object: stripesButton });
    tSEntity.objectsWithUniform = objectsWithUniform;
    const tSAction = function () {

        tSEntity.objectsWithUniform.forEach(object => {
            if (object.material.uniforms.uToggle_Stripes.value == true)
                object.material.uniforms.uToggle_Stripes.value = false;
            else
                object.material.uniforms.uToggle_Stripes.value = true;
        });

    };

    tSEntity.addComponent(Button, { action: tSAction });
}
function createInvertButton(objectsWithUniform) {

    const invertButton = makeButtonMesh(0.33, 0.15, 0.01, 0x000000);
    const invertButtonText = createText('TOGGLE INVERT', 0.03);
    invertButton.add(invertButtonText);
    invertButtonText.position.set(0, 0, 0.0051);
    invertButton.position.set(0.5, 0.4, -0.5);
    invertButton.rotation.set(0, -45, 0);
    menuMesh.add(invertButton);

    const tIEntity = world.createEntity();
    tIEntity.addComponent(Intersectable);
    tIEntity.addComponent(Object3D, { object: invertButton });
    tIEntity.objectsWithUniform = objectsWithUniform;
    const tIAction = function () {

        tIEntity.objectsWithUniform.forEach(object => {
            if (object.material.uniforms.uToggle_Invert.value == true)
                object.material.uniforms.uToggle_Invert.value = false;
            else
                object.material.uniforms.uToggle_Invert.value = true;
        });

    };

    tIEntity.addComponent(Button, { action: tIAction });
}
function createColorButton(objectsWithUniform) {

    const invertButton = makeButtonMesh(0.33, 0.15, 0.01, 0x000000);
    const invertButtonText = createText('TOGGLE COLOR', 0.03);
    invertButton.add(invertButtonText);
    invertButtonText.position.set(0, 0, 0.0051);
    invertButton.position.set(0.5, 0.2, -0.5);
    invertButton.rotation.set(0, -45, 0);
    menuMesh.add(invertButton);

    const tIEntity = world.createEntity();
    tIEntity.addComponent(Intersectable);
    tIEntity.addComponent(Object3D, { object: invertButton });
    tIEntity.objectsWithUniform = objectsWithUniform;
    const tCAction = function () {

        tIEntity.objectsWithUniform.forEach(object => {
            if (object.material.uniforms.uToggle_Color.value == true)
                object.material.uniforms.uToggle_Color.value = false;
            else
                object.material.uniforms.uToggle_Color.value = true;
        });

    };

    tIEntity.addComponent(Button, { action: tCAction });
}
function createBrightnessButton(objectsWithUniform) {

    const brightnessButton = makeButtonMesh(0.33, 0.15, 0.01, 0x000000);
    const brightnessButtonText = createText('TOGGLE BRIGHTNESS', 0.03);
    brightnessButton.add(brightnessButtonText);
    brightnessButtonText.position.set(0, 0, 0.0051);
    brightnessButton.position.set(0.5, 0, -0.5);
    brightnessButton.rotation.set(0, -45, 0);
    menuMesh.add(brightnessButton);

    const tBEntity = world.createEntity();
    tBEntity.addComponent(Intersectable);
    tBEntity.addComponent(Object3D, { object: brightnessButton });
    tBEntity.objectsWithUniform = objectsWithUniform;
    const tBAction = function () {

        tBEntity.objectsWithUniform.forEach(object => {
            if (object.material.uniforms.uToggle_Brightness.value == true)
                object.material.uniforms.uToggle_Brightness.value = false;
            else
                object.material.uniforms.uToggle_Brightness.value = true;
        });

    };

    tBEntity.addComponent(Button, { action: tBAction });
}
function createToggleAudioButtonLeft(sound1) {

    const soundButtonRight = makeButtonMesh(0.33, 0.14, 0.01, 0x000000);
    const soundButtonTextRight = createText('TOGGLE LEFT SOUND', 0.03);
    soundButtonRight.add(soundButtonTextRight);
    soundButtonTextRight.position.set(0, 0, 0.0051);
    soundButtonRight.position.set(0.5, -0.2, -0.5);
    soundButtonRight.rotation.set(0, -45, 0);
    menuMesh.add(soundButtonRight);

    const tSEntity = world.createEntity();
    tSEntity.addComponent(Intersectable);
    tSEntity.addComponent(Object3D, { object: soundButtonRight });
    const tSAction = function () {

        if (!audioStateLeftBox) {
            sound1.play();
            audioStateLeftBox = true;
        } else {
            sound1.stop();
            audioStateLeftBox = false;
        }

    };

    tSEntity.addComponent(Button, { action: tSAction });
}
function createToggleAudioButtonRight(sound2) {

    const soundButtonLeft = makeButtonMesh(0.33, 0.14, 0.01, 0x000000);
    const soundButtonTextLeft = createText('TOGGLE RIGHT SOUND', 0.03);
    soundButtonLeft.add(soundButtonTextLeft);
    soundButtonTextLeft.position.set(0, 0, 0.0051);
    soundButtonLeft.position.set(0.5, -0.4, -0.5);
    soundButtonLeft.rotation.set(0, -45, 0);
    menuMesh.add(soundButtonLeft);

    const tSEntity = world.createEntity();
    tSEntity.addComponent(Intersectable);
    tSEntity.addComponent(Object3D, { object: soundButtonLeft });
    const tSAction = function () {

        if (!audioStateRightBox) {
            sound2.play();
            audioStateRightBox = true;
        } else {
            sound2.stop();
            audioStateRightBox = false;
        }

    };

    tSEntity.addComponent(Button, { action: tSAction });
}
function createToggleAudioSync(sound1, sound2) {

    const soundButtonSync = makeButtonMesh(0.33, 0.14, 0.01, 0x000000);
    const soundButtonTextSync = createText('TOGGLE SYNC SOUND', 0.03);
    soundButtonSync.add(soundButtonTextSync);
    soundButtonTextSync.position.set(0, 0, 0.0051);
    soundButtonSync.position.set(0.5, -0.6, -0.5);
    soundButtonSync.rotation.set(0, -45, 0);
    menuMesh.add(soundButtonSync);

    const tSEntity = world.createEntity();
    tSEntity.addComponent(Intersectable);
    tSEntity.addComponent(Object3D, { object: soundButtonSync });
    const tSAction = function () {
        if (audioStateLeftBox) {
            sound1.stop();
            sound1.play();
        }
        if (audioStateRightBox) {
            sound2.stop();
            sound2.play();
        }
    };

    tSEntity.addComponent(Button, { action: tSAction });
}
function createSliderObject(object, objectsWithUniform, uniformName, light) {
    const entity = world.createEntity();
    entity.addComponent(Intersectable);
    entity.addComponent(Object3D, { object: object });
    entity.addComponent(Slider);
    entity.objectsWithUniform = objectsWithUniform;
    entity.uniformName = uniformName;
    if (light)
        entity.light = light;
}

export { HandtrackingUtils, createToggleAudioSync, createToggleAudioButtonRight, createToggleAudioButtonLeft, createDraggableObject, createSliderObject, createToggleStripesButton, createInvertButton, createColorButton, createBrightnessButton, world }

function makeButtonMesh(x, y, z, color) {

    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const buttonMesh = new THREE.Mesh(geometry, material);
    return buttonMesh;

}
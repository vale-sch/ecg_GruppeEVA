import {
    Object3D, Button, Intersectable, HandsInstructionText, OffsetFromCamera,
    NeedCalibration, Randomizable, Draggable, RandomizerSystem, InstructionSystem,
    CalibrationSystem, ButtonSystem, DraggableSystem, HandRaySystem
} from './HandtrackingCore.js';

import { XRControllerModelFactory } from './XRControllerModelFactory.js';
import { OculusHandModel } from './OculusHandModel.js';
import { OculusHandPointerModel } from './OculusHandPointerModel.js';
import { createText } from './Text2D.js';
import { World, } from './ecsy.module.js';
import * as THREE from '../../../../js/three.module.js'


const world = new World();


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
        const menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
        menuMesh.position.set(0.4, 1, - 1);
        menuMesh.rotation.y = - Math.PI / 12;
        scene.add(menuMesh);


        const exitButton = makeButtonMesh(0.2, 0.1, 0.01, 0xff0000);
        const exitButtonText = createText('exit', 0.06);
        exitButton.add(exitButtonText);
        exitButtonText.position.set(0, 0, 0.0051);
        exitButton.position.set(1, - 0.18, -0.5);
        exitButton.rotation.set(0, -45, 0);
        menuMesh.add(exitButton);



        const exitText = createText('Exiting session...', 0.04);
        exitText.position.set(0, 1.5, - 0.6);
        exitText.visible = false;
        scene.add(exitText);

        world
            .registerComponent(Object3D)
            .registerComponent(Button)
            .registerComponent(Intersectable)
            .registerComponent(HandsInstructionText)
            .registerComponent(OffsetFromCamera)
            .registerComponent(NeedCalibration)
            .registerComponent(Randomizable)
            .registerComponent(Draggable);

        world
            .registerSystem(RandomizerSystem)
            .registerSystem(InstructionSystem, { controllers: [controllerGrip1, controllerGrip2] })
            .registerSystem(CalibrationSystem, { renderer: renderer, camera: camera })
            .registerSystem(ButtonSystem)
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

export { HandtrackingUtils, createDraggableObject, world }

function makeButtonMesh(x, y, z, color) {

    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const buttonMesh = new THREE.Mesh(geometry, material);
    return buttonMesh;

}
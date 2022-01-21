import { Plane, Vector3 } from '../../../../js/three.module.js';
import { System, Component, TagComponent, Types } from './ecsy.module.js';

class Object3D extends Component { }
export { Object3D };
Object3D.schema = {
    object: { type: Types.Ref }
};

class Button extends Component { }
Button.schema = {
    // button states: [none, hovered, pressed]
    currState: { type: Types.String, default: 'none' },
    prevState: { type: Types.String, default: 'none' },
    action: { type: Types.Ref, default: () => { } }
};
export { Button };
class ButtonSystem extends System {

    execute( /*delta, time*/) {
        this.queries.buttons.results.forEach(entity => {

            const button = entity.getMutableComponent(Button);
            const buttonMesh = entity.getComponent(Object3D).object;
            if (button.currState == 'none') {

                buttonMesh.scale.set(1, 1, 1);

            } else {

                buttonMesh.scale.set(1.1, 1.1, 1.1);

            }

            if (button.currState == 'pressed' && button.prevState != 'pressed') {

                button.action();

            }

            // preserve prevState, clear currState
            // HandRaySystem will update currState
            button.prevState = button.currState;
            button.currState = 'none';

        });

    }

}
export { ButtonSystem };
ButtonSystem.queries = {
    buttons: {
        components: [Button]
    }
};

class Draggable extends Component { }
export { Draggable };
Draggable.schema = {
    // draggable states: [detached, hovered, to-be-attached, attached, to-be-detached]
    state: { type: Types.String, default: 'none' },
    originalParent: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null }
};

class DraggableSystem extends System {

    execute( /*delta, time*/) {

        this.queries.draggable.results.forEach(entity => {

            const draggable = entity.getMutableComponent(Draggable);
            const object = entity.getComponent(Object3D).object;
            if (draggable.originalParent == null) {

                draggable.originalParent = object.parent;

            }

            switch (draggable.state) {

                case 'to-be-attached':
                    draggable.attachedPointer.children[0].attach(object);
                    draggable.state = 'attached';
                    break;
                case 'to-be-detached':
                    draggable.originalParent.attach(object);
                    draggable.state = 'detached';
                    break;
                default:
                    object.scale.set(1, 1, 1);

            }

        });

    }

}

export { DraggableSystem };
DraggableSystem.queries = {
    draggable: {
        components: [Draggable]
    }
};
class Slider extends Component {
}

export { Slider };
Slider.schema = {
    // Slider states: [detached, hovered, to-be-attached, attached, to-be-detached]
    state: { type: Types.String, default: 'none' },
    originalParent: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null }
};

class SliderSystem extends System {
    execute( /*delta, time*/) {

        this.queries.slider.results.forEach(entity => {

            const slider = entity.getMutableComponent(Slider);
            const object = entity.getComponent(Object3D).object;

            switch (slider.state) {
                case 'to-be-attached':
                    slider.state = 'attached';
                    break;
                case 'to-be-detached':
                    slider.state = 'detached';
                    break;
                case "attached":
                    object.scale.set(1.1, 1.1, 1.1);

                    if (slider.attachedPointer.children[0].position.z <= 0.5 && slider.attachedPointer.children[0].position.z >= -0.5) {
                        object.position.z = slider.attachedPointer.children[0].position.z;
                        if (entity.uniformName == "uSlider_Red" || entity.uniformName == "uSlider_Green" || entity.uniformName == "uSlider_Blue" || entity.uniformName == "uSlider_Alpha") {
                            if (entity.uniformName == "uSlider_Red") {
                                object.material.color.r = -(slider.attachedPointer.children[0].position.z - 0.5);
                            }
                            if (entity.uniformName == "uSlider_Green") {
                                object.material.color.g = -(slider.attachedPointer.children[0].position.z - 0.5);
                            }
                            if (entity.uniformName == "uSlider_Blue") {
                                object.material.color.b = -(slider.attachedPointer.children[0].position.z - 0.5);
                            }
                            if (entity.uniformName == "uSlider_Alpha") {
                                object.material.opacity = -(slider.attachedPointer.children[0].position.z - 0.5);
                            }
                            entity.objectsWithUniform.forEach((object) => {
                                object.material.uniforms[entity.uniformName].value = -(slider.attachedPointer.children[0].position.z - 0.5);
                            })

                        }
                        if (entity.uniformName == "uSlider_Brightness") {
                            entity.objectsWithUniform.forEach((object) => {
                                object.material.uniforms[entity.uniformName].value = -4 * (slider.attachedPointer.children[0].position.z);
                            })
                        }
                        if (entity.uniformName == "uSlider_Stripe_Frequency") {
                            entity.objectsWithUniform.forEach((object) => {
                                object.material.uniforms[entity.uniformName].value = (slider.attachedPointer.children[0].position.z + 0.2516) * 0.01;
                            })
                        }
                        if (entity.uniformName == "uLight_PosX") {
                            entity.objectsWithUniform.forEach((object) => {
                                object.material.uniforms.uLight_Pos.value = new Vector3(slider.attachedPointer.children[0].position.z * -5, object.material.uniforms.uLight_Pos.value.y, object.material.uniforms.uLight_Pos.value.z);
                            })
                            entity.light.position.set(slider.attachedPointer.children[0].position.z * -5, entity.light.position.y, entity.light.position.z);

                        }
                        if (entity.uniformName == "uLight_PosY") {
                            entity.objectsWithUniform.forEach((object) => {
                                object.material.uniforms.uLight_Pos.value = new Vector3(object.material.uniforms.uLight_Pos.value.x, slider.attachedPointer.children[0].position.z * -5, object.material.uniforms.uLight_Pos.value.z);
                            })
                            entity.light.position.set(entity.light.position.x, slider.attachedPointer.children[0].position.z * -5, entity.light.position.z);

                        }
                        if (entity.uniformName == "uLight_PosZ") {
                            entity.objectsWithUniform.forEach((object) => {
                                object.material.uniforms.uLight_Pos.value = new Vector3(object.material.uniforms.uLight_Pos.value.x, object.material.uniforms.uLight_Pos.value.y, slider.attachedPointer.children[0].position.z * -5);
                            })
                            entity.light.position.set(entity.light.position.x, entity.light.position.y, slider.attachedPointer.children[0].position.z * -5);

                        }
                    }
                    break;

                default:
                    object.scale.set(1, 1, 1);

            }

        });

    }

}
export { SliderSystem };


SliderSystem.queries = {
    slider: {
        components: [Slider]
    }
};

class Intersectable extends TagComponent { }
export { Intersectable };
let distance;
let intersectingEntity;
let isObjectAttached;
class HandRaySystem extends System {

    init(attributes) {

        this.handPointers = attributes.handPointers;

    }

    execute( /*delta, time*/) {

        this.handPointers.forEach(hp => {
            if (intersectingEntity != null && isObjectAttached) {
                if (intersectingEntity.hasComponent(Slider)) {
                    const slider = intersectingEntity.getMutableComponent(Slider);
                    if (!hp.isPinched() && hp.isAttached() && slider.state == 'attached') {
                        slider.state = 'to-be-detached';
                        slider.attachedPointer = null;
                        hp.setAttached(false);
                        isObjectAttached = false;
                        hp.pinched = false;
                        intersectingEntity = null;
                        distance = null;

                    }
                    return;
                }

                if (intersectingEntity.hasComponent(Draggable)) {
                    const draggable = intersectingEntity.getMutableComponent(Draggable);
                    if (!hp.isPinched() && hp.isAttached() && draggable.state == 'attached') {
                        draggable.state = 'to-be-detached';
                        draggable.attachedPointer = null;
                        hp.setAttached(false);
                        isObjectAttached = false;
                        hp.pinched = false;
                        intersectingEntity = null;
                        distance = null;

                    }
                    return;
                }
            }

            intersectingEntity = null;
            distance = null;
            this.queries.intersectable.results.forEach(entity => {

                const object = entity.getComponent(Object3D).object;
                const intersections = hp.intersectObject(object, false);
                if (intersections && intersections.length > 0) {

                    if (distance == null || intersections[0].distance < distance) {

                        distance = intersections[0].distance;
                        intersectingEntity = entity;

                    }
                }

            });
            if (distance) {
                hp.setCursor(distance);
                if (intersectingEntity.hasComponent(Button)) {
                    const button = intersectingEntity.getMutableComponent(Button);
                    if (hp.isPinched())
                        button.currState = 'pressed';
                    else if (button.currState != 'pressed')
                        button.currState = 'hovered';
                }

                if (intersectingEntity.hasComponent(Slider)) {
                    const slider = intersectingEntity.getMutableComponent(Slider);
                    const object = intersectingEntity.getComponent(Object3D).object;
                    object.scale.set(1.1, 1.1, 1.1);
                    if (hp.isPinched()) {
                        if (!hp.isAttached() && slider.state != 'attached') {
                            isObjectAttached = true;
                            slider.state = 'to-be-attached';
                            slider.attachedPointer = hp;
                            hp.setAttached(true);
                        }
                    }
                }

                if (intersectingEntity.hasComponent(Draggable)) {

                    const draggable = intersectingEntity.getMutableComponent(Draggable);
                    const object = intersectingEntity.getComponent(Object3D).object;
                    object.scale.set(1.1, 1.1, 1.1);
                    if (hp.isPinched()) {
                        if (!hp.isAttached() && draggable.state != 'attached') {
                            isObjectAttached = true;
                            draggable.state = 'to-be-attached';
                            draggable.attachedPointer = hp;
                            hp.setAttached(true);

                        }
                    }
                }
            } else {
                hp.setCursor(1.5);
            }
        });

    }

}
export { HandRaySystem };
HandRaySystem.queries = {
    intersectable: {
        components: [Intersectable]
    }
};

class HandsInstructionText extends TagComponent { }

export { HandsInstructionText };

class InstructionSystem extends System {

    init(attributes) {

        this.controllers = attributes.controllers;

    }

    execute( /*delta, time*/) {

        let visible = false;
        this.controllers.forEach(controller => {

            if (controller.visible) {

                visible = true;

            }

        });

        this.queries.instructionTexts.results.forEach(entity => {

            const object = entity.getComponent(Object3D).object;
            object.visible = visible;

        });

    }

}
export { InstructionSystem };
InstructionSystem.queries = {
    instructionTexts: {
        components: [HandsInstructionText]
    }
};

class OffsetFromCamera extends Component { }
export { OffsetFromCamera };
OffsetFromCamera.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 },
};

class NeedCalibration extends TagComponent { }
export { NeedCalibration };
class CalibrationSystem extends System {

    init(attributes) {

        this.camera = attributes.camera;
        this.renderer = attributes.renderer;

    }

    execute( /*delta, time*/) {

        this.queries.needCalibration.results.forEach(entity => {

            if (this.renderer.xr.getSession()) {

                const offset = entity.getComponent(OffsetFromCamera);
                const object = entity.getComponent(Object3D).object;
                const xrCamera = this.renderer.xr.getCamera();
                object.position.x = xrCamera.position.x + offset.x;
                object.position.y = xrCamera.position.y + offset.y;
                object.position.z = xrCamera.position.z + offset.z;
                entity.removeComponent(NeedCalibration);

            }

        });

    }

}
export { CalibrationSystem };
CalibrationSystem.queries = {
    needCalibration: {
        components: [NeedCalibration]
    }
};


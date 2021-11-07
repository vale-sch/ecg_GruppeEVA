import {Raycaster, Vector2} from 'https://unpkg.com/three@0.127.0/build/three.module.js';

class ToolSwitcher {

    constructor(animator, renderer, camera) {
        this.camera = camera;
        this.animator = animator;
        this.renderer = renderer;
        this.raycaster = new Raycaster(); // create once
        this.mouse = new Vector2(); // create once
        this.canvas = $('#scene-container').get(0);
        this.mouseDown = false;
        this.startPos = {};
    }

    turnOnMouseAnimationAppending(cube) {
        $('#scene-container').get(0).addEventListener("mousemove", (event) => {
            this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
            //console.log("x: " + this.mouse.x + " y: " + this.mouse.y);
            let currentPos = {x: this.mouse.x, y: this.mouse.y}

            this.raycaster.setFromCamera( this.mouse, this.camera );
            if(this.mouseDown) {
                let endPos = {x : (this.startPos.x + currentPos.x)/2  , y:  (this.startPos.y + currentPos.y)/2 }
                this.animator.addTimeRestrainedAnimation(cube, "move", endPos, 0.1);
                this.startPos = endPos;
            }
        })
        
        $('#scene-container').get(0).addEventListener("mousedown", (event) => {
            this.mouseDown = true;
            this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
            this.startPos = {x: this.mouse.x, y: this.mouse.y};
        })

        $('#scene-container').get(0).addEventListener("mouseup", (event) => {
            this.mouseDown = false;
            //mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
            //mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
            //endPos = {x: (mouse.x-startPos.x)*100, y: (mouse.y-startPos.y)*100};

            //animator.addTimeRestrainedAnimation(cube, "move", endPos, 0.5);
        })
    }
}

export {ToolSwitcher}
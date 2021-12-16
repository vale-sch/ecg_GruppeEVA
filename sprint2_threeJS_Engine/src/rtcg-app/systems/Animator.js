class Animator {

    constructor(renderFunc) {
        this.renderFunc = renderFunc;
        this.objectsToAnimate = [];
        this.deltaTime = 0;
        this.lastFrame = 0;
        this.currentFps = 0;
        this.fpsCounter = $("#fps-counter").get(0)
    }

    start() {
        this.lastFrame = performance.now();
        this.animate(this.lastFrame);
    }

    add(object) {
        object.animations = { animationStacks: [], animationObjects: [] };
        this.objectsToAnimate.push(object);

    }
    remove(object) {
        var increment = 0;
        this.objectsToAnimate.forEach(element => {
            increment++;
            if (element == object)
                this.objectsToAnimate.splice(increment - 1, 1);
        });
    }
    animate(currentFrame) {
        this.deltaTime = currentFrame == this.lastFrame ? currentFrame / 1000 : (currentFrame - this.lastFrame) / 1000;
        this.currentFps = Math.floor(1 / this.deltaTime);
        this.fpsCounter.innerHTML = this.currentFps + " fps";

        //update
        let self = this;
        this.objectsToAnimate.forEach((obj) => {
            obj.animations.animationObjects.forEach((animationObject) => {
                animationObject.func(self.deltaTime);
                obj.animations.animationObjects = obj.animations.animationObjects.filter((animationObject) => animationObject.done == false);
            })
        })

        this.objectsToAnimate.forEach((obj) => {
            let activeStack = obj.animations.animationStacks[0];
            if (!activeStack) return;
            if (activeStack.counter < 1) {
                obj.animations.animationStacks.push(obj.animations.animationStacks.shift()); // pop first element of animationStack and push to end
                activeStack.counter = activeStack.length;
            }
            else {
                let animationObject = activeStack[0];
                if (animationObject.done) {
                    activeStack.counter--;
                    activeStack.push(activeStack.shift()); // pop first element of animationStack and push to end
                    animationObject.done = false;
                    animationObject.timeLeft = animationObject.originalTime;
                }
                else
                    animationObject.func(self.deltaTime);
            }
        })

        //render scene
        this.renderFunc();
        this.lastFrame = currentFrame;
        window.requestAnimationFrame((currentFrame) => {
            this.animate(currentFrame);
        });
    }

    addContinuousAnimation(object, type, directionAmountObject) {
        if (type == "rotate")
            this.createAndPushAnimationObject(object, object.animations.animationObjects, directionAmountObject, this.rotate);
        else if (type == "scale")
            this.createAndPushAnimationObject(object, object.animations.animationObjects, directionAmountObject, this.scale);
        else if (type == "move")
            this.createAndPushAnimationObject(object, object.animations.animationObjects, directionAmountObject, this.move);
    }

    addTimeRestrainedAnimation(object, type, directionAmountObject, time, reverse, index) {
        let targetArray = null;
        if (index >= 0) {
            targetArray = object.animations.animationStacks[index];
            if (!targetArray) {
                object.animations.animationStacks.push([]);
                targetArray = object.animations.animationStacks[index];
                targetArray.counter = 0;
            }
            targetArray.counter++;
        }
        else
            targetArray = object.animations.animationObjects;

        if (type == "rotate")
            this.createAndPushAnimationObject(object, targetArray, directionAmountObject, this.lerpRotate, time, reverse);
        else if (type == "scale")
            this.createAndPushAnimationObject(object, targetArray, directionAmountObject, this.lerpScale, time, reverse);
        else if (type == "move")
            this.createAndPushAnimationObject(object, targetArray, directionAmountObject, this.lerpMove, time, reverse);
    }

    createAndPushAnimationObject(object, targetArray, directionAmountObject, animationFunc, timeInS, reverse, index) {
        if ('X' in directionAmountObject || 'x' in directionAmountObject) {
            targetArray.push({
                self: object,
                func: animationFunc,
                direction: "x",
                amount: directionAmountObject.x,
                originalTime: timeInS,
                timeLeft: timeInS,
                reverse: reverse,
                done: false,
            });
        }
        if ('Y' in directionAmountObject || 'y' in directionAmountObject) {
            targetArray.push({
                self: object,
                func: animationFunc,
                direction: "y",
                amount: directionAmountObject.y,
                originalTime: timeInS,
                timeLeft: timeInS,
                reverse: reverse,
                done: false,
            });
        }
        if ('Z' in directionAmountObject || 'z' in directionAmountObject) {
            targetArray.push({
                self: object,
                func: animationFunc,
                direction: "z",
                amount: directionAmountObject.z,
                originalTime: timeInS,
                timeLeft: timeInS,
                reverse: reverse,
                done: false,
            });
        }
    }

    rotate(deltaTime) {
        if (this.direction == "x")
            this.self.rotation.x += this.amount * deltaTime;
        if (this.direction == "y")
            this.self.rotation.y += this.amount * deltaTime;
        if (this.direction == "z")
            this.self.rotation.z += this.amount * deltaTime;
    }

    scale(deltaTime) {
        if (this.direction == "x")
            this.self.scale.x += this.amount * deltaTime;
        if (this.direction == "y")
            this.self.scale.y += this.amount * deltaTime;
        if (this.direction == "z")
            this.self.scale.z += this.amount * deltaTime;
    }

    move(deltaTime) {
        if (this.direction == "x")
            this.self.position.x += this.amount * deltaTime;
        if (this.direction == "y")
            this.self.position.y += this.amount * deltaTime;
        if (this.direction == "z")
            this.self.position.z += this.amount * deltaTime;
    }

    lerpRotate(deltaTime) {
        this.timeLeft -= deltaTime;
        if (this.timeLeft > 0) {
            if (this.direction == "x")
                this.self.rotation.x += this.amount * deltaTime;
            if (this.direction == "y")
                this.self.rotation.y += this.amount * deltaTime;
            if (this.direction == "z")
                this.self.rotation.z += this.amount * deltaTime;
        }
        else if (this.reverse) {
            this.amount *= -1;
            this.timeLeft = this.originalTime;
        }
        else
            this.done = true;
    }

    lerpScale(deltaTime) {
        this.timeLeft -= deltaTime;
        if (this.timeLeft > 0) {
            if (this.direction == "x")
                this.self.scale.x += this.amount * deltaTime;
            if (this.direction == "y")
                this.self.scale.y += this.amount * deltaTime;
            if (this.direction == "z")
                this.self.scale.z += this.amount * deltaTime;
        }
        else if (this.reverse) {
            this.amount *= -1;
            this.timeLeft = this.originalTime;
        }
        else
            this.done = true;
    }

    lerpMove(deltaTime) {
        this.timeLeft -= deltaTime;
        if (this.timeLeft > 0) {
            if (this.direction == "x")
                this.self.position.x += this.amount * deltaTime;
            if (this.direction == "y")
                this.self.position.y += this.amount * deltaTime;
            if (this.direction == "z")
                this.self.position.z += this.amount * deltaTime;
        }
        else if (this.reverse) {
            this.amount *= -1;
            this.timeLeft = this.originalTime;
        }
        else
            this.done = true;
    }
}


export { Animator }
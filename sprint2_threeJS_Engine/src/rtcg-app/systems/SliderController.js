let frequVal;
let boolStripes;

let alphaVal;
let boolAlphaVal;

let boolRGB;
let rVal;
let gVal;
let bVal;

let brightVal;
let boolBrightVal;

let boolInvertCol;
let boolAniCam;

let lightIten;
let lightPosX;
let lightPosY;
let lightPosZ;
let lightColor;
let torusKnot;
let sphere;
let morph;

class SliderController {
    constructor(_morph, _torusKnot, _sphere) {
        morph = _morph;
        torusKnot = _torusKnot;
        sphere = _sphere;
        this.getSliders();
    }

    getSliders() {

        frequVal = document.getElementById('frequency');
        boolStripes = document.getElementById('bFrequ');
        frequVal.addEventListener('change', this.changeColFrequency);
        boolStripes.addEventListener('change', this.getBoolFrequency);

        boolRGB = document.getElementById('bRGB');
        rVal = document.getElementById('rVal');
        gVal = document.getElementById('gVal');
        bVal = document.getElementById('bVal');
        boolRGB.addEventListener('change', this.getBoolRGB);
        rVal.addEventListener('change', this.changeRGBValue);
        gVal.addEventListener('change', this.changeRGBValue);
        bVal.addEventListener('change', this.changeRGBValue);

        alphaVal = document.getElementById('alphaVal');
        boolAlphaVal = document.getElementById('bAValue');
        boolAlphaVal.addEventListener('change', this.getBoolAlpha);
        alphaVal.addEventListener('change', this.changeAlphaValue);


        brightVal = document.getElementById('brightVal');
        boolBrightVal = document.getElementById('bBrightValue');
        boolBrightVal.addEventListener('change', this.getBoolBright);
        brightVal.addEventListener('change', this.changeBrightValue);

        boolInvertCol = document.getElementById('bInvertValue');
        boolInvertCol.addEventListener('change', this.getBoolInvert);

        boolAniCam = document.getElementById('aniLight');
        boolAniCam.addEventListener('change', this.getBoolLightAnimation);


        lightIten = document.getElementById('lightInten');
        lightIten.addEventListener('change', this.changeLightIntensity);

        lightPosX = document.getElementById('lightPosX');
        lightPosX.addEventListener('change', this.changeLightPosX);

        lightPosY = document.getElementById('lightPosY');
        lightPosY.addEventListener('change', this.changeLightPosY);

        lightPosZ = document.getElementById('lightPosZ');
        lightPosZ.addEventListener('change', this.changeLightPosZ);


        lightColor = document.getElementById('color');
        lightColor.addEventListener('change', this.changeLightColor);

        this.getBoolFrequency();
        this.getBoolBright();
        this.getBoolRGB();
        // this.getBoolLightAnimation();
        this.getBoolAlpha();
        this.getBoolInvert();

    }
    getBoolFrequency() {
        morph.material.uniforms.uToggle_Stripes.value = boolStripes.checked;
        torusKnot.material.uniforms.uToggle_Stripes.value = boolStripes.checked;
    }
    changeColFrequency() {
        morph.material.uniforms.uSlider_Stripe_Frequency.value = frequVal.value;
        torusKnot.material.uniforms.uSlider_Stripe_Frequency.value = frequVal.value;
    }
    getBoolAlpha() {
        morph.material.uniforms.uToggle_Alpha.value = boolAlphaVal.checked;
        torusKnot.material.uniforms.uToggle_Alpha.value = boolAlphaVal.checked;
    }
    changeAlphaValue() {
        morph.material.uniforms.uSlider_Alpha.value = alphaVal.value;
        torusKnot.material.uniforms.uSlider_Alpha.value = alphaVal.value;
    }
    getBoolRGB() {
        morph.material.uniforms.uToggle_Color.value = boolRGB.checked;
        torusKnot.material.uniforms.uToggle_Color.value = boolRGB.checked;
    }
    changeRGBValue() {
        morph.material.uniforms.uSlider_Red.value = rVal.value;
        morph.material.uniforms.uSlider_Green.value = gVal.value;
        morph.material.uniforms.uSlider_Blue.value = bVal.value;

        torusKnot.material.uniforms.uSlider_Red.value = rVal.value;
        torusKnot.material.uniforms.uSlider_Green.value = gVal.value;
        torusKnot.material.uniforms.uSlider_Blue.value = bVal.value;
    }

    getBoolBright() {
        morph.material.uniforms.uToggle_Brightness.value = boolBrightVal.checked;
        torusKnot.material.uniforms.uToggle_Brightness.value = boolBrightVal.checked;
    }
    changeBrightValue() {
        morph.material.uniforms.uSlider_Brightness.value = brightVal.value;
        torusKnot.material.uniforms.uSlider_Brightness.value = brightVal.value;
    }

    getBoolInvert() {
        morph.material.uniforms.uToggle_Invert.value = boolInvertCol.checked;
        torusKnot.material.uniforms.uToggle_Invert.value = boolInvertCol.checked;
    }
    /* getBoolLightAnimation() {
         if (boolAniCam.checked) {
             animator.add(light);
             animator.addTimeRestrainedAnimation(light, "move", { x: 10, y: 0 }, 2, true, 0);
         }
         else
             animator.remove(light);
     }*/

    changeLightIntensity() {
        light.intensity = lightIten.value;
    }

    changeLightPosX() {
        light.position.set(parseInt(lightPosX.value), light.position.y, light.position.z);
    }
    changeLightPosY() {
        light.position.set(light.position.x, parseInt(lightPosY.value), light.position.z);
    }
    changeLightPosZ() {
        light.position.set(light.position.x, light.position.y, parseInt(lightPosZ.value));
    }

    changeLightColor() {
        light.color.set(lightColor.value);
    }
}
export { SliderController }
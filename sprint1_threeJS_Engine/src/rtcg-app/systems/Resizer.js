class Resizer {
    constructor(container, camera, renderer, callback) { 
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;

        this.setCanvasStuff();
        window.addEventListener("resize", () => {
            this.setCanvasStuff();
            callback();
        })

    }
    setCanvasStuff() {
         //1
         this.camera.aspect = this.container.clientWidth/this.container.clientHeight;

         //AktualisierungdesKamera-Frustums
         this.camera.updateProjectionMatrix();

         //2
         this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
 
         //3
         this.renderer.setPixelRatio(window.devicePixelRatio);
    }
}


export { Resizer }
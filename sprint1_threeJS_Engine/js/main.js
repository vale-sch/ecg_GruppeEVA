import {RTCG} from '../src/rtcg-app/RTCG.js';
//Erzeugung der Hauptmethode
function main(){
    //Todo SetupderRTCG-App
    const container = document.querySelector('#scene-container');
    const dudarain_RTCG = new RTCG(container);
}
//main() Aufruf, um die RTCG-App zu starten
main();
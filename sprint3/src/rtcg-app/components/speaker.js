import { createCube, createSphere } from './primitiveObjects.js';

function createSpeaker(light, camera) {

  const speaker = createCube(light, camera);
  const speakerDetail = createSphere(light, camera);
  speaker.attach(speakerDetail);
  speakerDetail.translateZ(0.1);
  return speaker;
}

export { createSpeaker };
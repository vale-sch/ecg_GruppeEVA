import { Uniform, BoxBufferGeometry, TorusKnotGeometry, SphereGeometry, ConeGeometry, Mesh, PlaneGeometry, MeshPhongMaterial, ShaderMaterial, Vector2, Vector3, DoubleSide, Color, SphereBufferGeometry, TetrahedronGeometry, BufferGeometry } from '../../../js/three.module.js';
import { createCube, createTorusKnot, createPlane, createSphere, createCone } from './primitiveObjects.js';

function createSpeaker(light, camera) {
 
  const speaker = createCube(light, camera);
  const speakerDetail = createSphere(light, camera);
  speaker.attach(speakerDetail);
  speakerDetail.translateZ(0.1);
  return speaker;
}

export { createSpeaker };
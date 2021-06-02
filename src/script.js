import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { BackSide, DoubleSide } from 'three';
// Door texture
import doorColorTexture from './door/door.jpg';
import doorAlphaTexture from './door/alpha.jpg';
import doorAmbidentOcclusionTexture from './door/ambientOcclusion.jpg';
import doorHeightTexture from './door/height.jpg';
import doorMetalnessTexture from './door/metalness.jpg';
import doorRoughnessTexture from './door/roughness.jpg';
// Brick Texture
import ambidentOcclusion from './bricks/ambientOcclusion.jpg';
import colorTexture from './bricks/color.jpg';
import normal from './bricks/normal.jpg';
import roughness from './bricks/roughness.jpg';
// Floor Texture
import ambidentOcclusionFloor from './grass/ambientOcclusion.jpg';
import colorFloor from './grass/color.jpg';
import normalFloor from './grass/normal.jpg';
import roughnessFloor from './grass/roughness.jpg';

// Texture
//!Loading Manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log('start');
};
loadingManager.onLoad = () => {
  console.log('Load');
};
loadingManager.onProgress = () => {
  console.log('Progress');
};
loadingManager.onError = () => {
  console.log('error');
};

// Door Texture
const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load(doorColorTexture);
const AlphaTexture = textureLoader.load(doorAlphaTexture);
const AmbidentOcclusionTexture = textureLoader.load(
  doorAmbidentOcclusionTexture
);
const HeightTexture = textureLoader.load(doorHeightTexture);
const MetalnessTexture = textureLoader.load(doorMetalnessTexture);
const RoughnessTexture = textureLoader.load(doorRoughnessTexture);
// Brick Texture
const ambidentBrick = textureLoader.load(ambidentOcclusion);
const colorBrick = textureLoader.load(colorTexture);
const normalBrick = textureLoader.load(normal);
const roughnessBrick = textureLoader.load(roughness);
// Floor Texture
const ambidentTextureFloor = textureLoader.load(ambidentOcclusionFloor);
const colorTextureFloor = textureLoader.load(ambidentOcclusionFloor);
const normalTextureFloor = textureLoader.load(ambidentOcclusionFloor);
const roughnessTextureFloor = textureLoader.load(ambidentOcclusionFloor);

ambidentTextureFloor.repeat.set(8, 8);
colorTextureFloor.repeat.set(8, 8);
normalTextureFloor.repeat.set(8, 8);
roughnessTextureFloor.repeat.set(8, 8);

ambidentTextureFloor.wrapS = THREE.RepeatWrapping;
colorTextureFloor.wrapS = THREE.RepeatWrapping;
normalTextureFloor.wrapS = THREE.RepeatWrapping;
roughnessTextureFloor.wrapS = THREE.RepeatWrapping;

ambidentTextureFloor.wrapT = THREE.RepeatWrapping;
colorTextureFloor.wrapT = THREE.RepeatWrapping;
normalTextureFloor.wrapT = THREE.RepeatWrapping;
roughnessTextureFloor.wrapT = THREE.RepeatWrapping;

// texture-repeat
// texture.repeat.x=2;
// texture.repeat.y=2;
// Texture-wraping
// texture.wrapS=THREE.RepeatWrapping
// texture.wrapT=THREE.RepeatWrapping

// ! offset
// texture.offset.x=0.5
// texture.offset.y=0.5
//! Texture-Rotataion
// texture.rotation=Math.PI*0.25
// texture.center.x=0.5
// texture.center.y=0.5

// To change the texture of closer image
// texture.generateMipmaps = false;
// texture.minFilter = THREE.NearestFilter;
// To change the texture of farther image
// texture.magFilter = THREE.NearestFilter;

// Debug
const gui = new dat.GUI();
// gui.hide()

//! Color and spin gui
// const parameter = {
//   color: 0xff0000,
//   spin: () => {
//     gsap.to(floor.rotation, { duration: 1, y: floor.rotation.y + Math.PI * 2 });
//     gsap.to(floor.rotation, { duration: 4, x: floor.rotation.x + Math.PI * 2 });
//   },
// };

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262937', 1, 15);
scene.fog = fog;

// Objects
const geometry = new THREE.PlaneBufferGeometry(20, 20);

// House
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: colorBrick,
    aoMap: ambidentBrick,
    normalMap: normalBrick,
    roughnessMap: roughnessBrick,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.y = 3;
roof.rotation.y = -2.3;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorTexture,
    transparent: true,
    alphaMap: AlphaTexture,
    aoMap: AmbidentOcclusionTexture,
    displacementMap: HeightTexture,
    displacementScale: 0.1,
    // normalMap
    metalnessMap: MetalnessTexture,
    roughnessMap: RoughnessTexture,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.x = -0.1;
door.position.y = 1;
door.position.z = 2.001;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.4);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.4);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.4);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.8);

house.add(bush1, bush2, bush3, bush4);

// Graveyard
const graves = new THREE.Group();
scene.add(graves);

const graveGeo = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeo, graveMaterial);
  grave.castShadow=true
  grave.position.set(x, 0.3, z);

  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

// Floor Mesh Materials
const material = new THREE.MeshStandardMaterial({
  map: colorTextureFloor,
  aoMap: ambidentTextureFloor,
  normalMap: normalTextureFloor,
  roughnessMap: roughnessTextureFloor,
});

material.color = new THREE.Color('#a9c388');
// Mesh
const floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.13;
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
scene.add(floor);

// Debug
gui.add(floor.position, 'y').min(-3).max(31).step(0.01).name('Y-axix');
gui.add(floor.position, 'x').min(-3).max(31).step(0.01);
gui.add(floor.position, 'z').min(-3).max(31).step(0.01);
gui.add(material, 'wireframe');

// Color and spin GUI
// gui.addColor(parameter, 'color').onChange(() => {
//   material.color.set(parameter.color);
// });
// gui.add(parameter, 'spin');

//! lights
//Ambident Lights
const ambidentLight = new THREE.AmbientLight('#b9d5ff', 0.5);
gui.add(ambidentLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambidentLight);
// Directional Lights
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// Ghost

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0.074;
camera.position.y = 6;
camera.position.z = 12.168;
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262937');

// Shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap

moonLight.castShadow=true
doorLight.castShadow=true
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true
// This to catch shadow
walls.castShadow=true;
bush1.castShadow=true;
bush2.castShadow=true;
bush3.castShadow=true;
bush4.castShadow=true;
// Shadow recive
floor.receiveShadow=true

doorLight.shadow.mapSize.width=256
doorLight.shadow.mapSize.height=256
doorLight.shadow.camera.far=7

ghost1.shadow.mapSize.width=256
ghost1.shadow.mapSize.height=256
ghost1.shadow.camera.far=7

ghost2.shadow.mapSize.width=256
ghost2.shadow.mapSize.height=256
ghost2.shadow.camera.far=7

ghost3.shadow.mapSize.width=256
ghost3.shadow.mapSize.height=256
ghost3.shadow.camera.far=7


/**
 * Animate
 */

const clock = new THREE.Clock();

// Animation
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // floor.rotation.y = 0.5 * elapsedTime;

  //  update ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

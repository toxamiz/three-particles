import * as THREE from "three";
import {createParticleMesh} from "particles";
import {EffectCollection} from "effects/collection";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Collapse from "../src/effects/collapse";
import Spread from "../src/effects/spread";
import Restore from "../src/effects/restore";
import {initControls} from "./controls"

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer = new THREE.WebGLRenderer({canvas: document.getElementById('viewer'), antialias: true, alpha: true});
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

// OrbitControls

let controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = false;
controls.enableZoom = false;
controls.enableKeys = false;
controls.maxPolarAngle = Math.PI;

let geometry = new THREE.SphereGeometry(2);
let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
let mesh = new THREE.Mesh(geometry, material);
let particleMesh = createParticleMesh(mesh, {particlesDensity: 0.1, particlesCount: 5000});
let effectCollection = new EffectCollection();
effectCollection.add(new Collapse('collapse', 60));
effectCollection.add(new Spread('spread', 240));
effectCollection.add(new Restore('restore', 120));
effectCollection.applyEffects(particleMesh);
initControls(effectCollection);

scene.add(particleMesh);

camera.position.z = 5;

let animate = function () {
    requestAnimationFrame(animate);

    effectCollection.update();

    renderer.render(scene, camera);
};

animate();

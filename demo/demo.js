import * as THREE from "three";
import {createParticleMesh} from "particles";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer = new THREE.WebGLRenderer({canvas: document.getElementById('viewer'), antialias: true, alpha: true});
renderer.setClearColor(0x000000, 1);
renderer.setSize( window.innerWidth, window.innerHeight );

let geometry = new THREE.SphereGeometry(2);
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let cube = new THREE.Mesh( geometry, material );
let c = createParticleMesh(cube, {particlesDensity: 0.1, particlesCount: 5000});
console.log(c);
scene.add( c );

camera.position.z = 5;

let animate = function () {
    requestAnimationFrame( animate );

    c.rotation.x += 0.01;
    c.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();

import * as THREE from "three";
import "./style.css";

const mount = document.querySelector("#world-scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b1219");
scene.fog = new THREE.Fog("#0b1219", 12, 28);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(8, 8, 11);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xb9d8ed, 0x342619, 2.1));
const sun = new THREE.DirectionalLight(0xffd89a, 3.2);
sun.position.set(5, 10, 6);
sun.castShadow = true;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(7, 64),
  new THREE.MeshStandardMaterial({ color: "#263c32", roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(14, 28, "#8d7745", "#42534a");
grid.position.y = 0.015;
grid.material.transparent = true;
grid.material.opacity = 0.22;
scene.add(grid);

const island = new THREE.Group();
scene.add(island);

function addBlock(x, z, width, height, depth, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.88 })
  );
  mesh.position.set(x, height / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  island.add(mesh);
  return mesh;
}

addBlock(0, 0, 2.5, 0.55, 2.5, "#786345");
addBlock(0, 0, 1.55, 1.55, 1.55, "#b28a4d");
addBlock(0, -0.15, 0.9, 1.0, 0.9, "#293743");
addBlock(-2.5, 1.4, 1.5, 0.35, 1.3, "#46664a");
addBlock(2.4, -1.8, 1.7, 0.4, 1.4, "#46664a");
addBlock(-3.0, -2.2, 1.1, 0.25, 1.1, "#536d50");

for (const [x, z, s] of [[-2.5,1.4,0.7],[2.4,-1.8,0.8],[-3,-2.2,0.55],[3,2,0.6]]) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.13, s, 7),
    new THREE.MeshStandardMaterial({ color: "#65462d" })
  );
  trunk.position.y = s / 2;
  trunk.castShadow = true;
  tree.add(trunk);
  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(s * 0.55, s * 1.35, 7),
    new THREE.MeshStandardMaterial({ color: "#31563c" })
  );
  crown.position.y = s * 1.25;
  crown.castShadow = true;
  tree.add(crown);
  tree.position.set(x, 0.2, z);
  island.add(tree);
}

let dragging = false;
let previousX = 0;
renderer.domElement.addEventListener("pointerdown", (event) => {
  dragging = true;
  previousX = event.clientX;
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  island.rotation.y += (event.clientX - previousX) * 0.008;
  previousX = event.clientX;
});
renderer.domElement.addEventListener("pointerup", () => { dragging = false; });
renderer.domElement.addEventListener("pointercancel", () => { dragging = false; });

function resize() {
  const width = mount.clientWidth;
  const height = mount.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
new ResizeObserver(resize).observe(mount);
resize();

function animate() {
  requestAnimationFrame(animate);
  if (!dragging) island.rotation.y += 0.0012;
  renderer.render(scene, camera);
}
animate();

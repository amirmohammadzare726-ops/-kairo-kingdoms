import * as THREE from "three";
import "./style.css";

const mount = document.querySelector("#world-scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b151d");
scene.fog = new THREE.Fog("#0b151d", 18, 42);

const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
camera.position.set(0, 11, 19);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc5dce7, 0x293023, 2.1));
const sun = new THREE.DirectionalLight(0xffd7a0, 3.4);
sun.position.set(-8, 15, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: "#123344", roughness: 0.32, metalness: 0.2 })
);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.52;
water.receiveShadow = true;
scene.add(water);

const world = new THREE.Group();
scene.add(world);
const landMaterial = new THREE.MeshStandardMaterial({ color: "#596b4b", roughness: 0.96, flatShading: true });
const shoreMaterial = new THREE.MeshStandardMaterial({ color: "#a18a60", roughness: 1, flatShading: true });
const rockMaterial = new THREE.MeshStandardMaterial({ color: "#59636a", roughness: 1, flatShading: true });
const treeMaterial = new THREE.MeshStandardMaterial({ color: "#315b42", roughness: 1 });
const trunkMaterial = new THREE.MeshStandardMaterial({ color: "#68482d", roughness: 1 });

function createLand(x, z, sx, sz, seed = 0) {
  const geometry = new THREE.IcosahedronGeometry(1, 4);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(positions, i);
    const n = 1 + 0.075 * Math.sin(v.x * 8 + seed) * Math.cos(v.z * 7 - seed) + 0.035 * Math.sin(v.y * 13 + seed);
    v.multiplyScalar(n);
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  const land = new THREE.Mesh(geometry, landMaterial);
  land.scale.set(sx, 0.78, sz);
  land.position.set(x, -0.02, z);
  land.castShadow = true;
  land.receiveShadow = true;
  world.add(land);

  const shore = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 1, 0.28, 16), shoreMaterial);
  shore.scale.set(sx, 1, sz);
  shore.position.set(x, -0.29, z);
  shore.castShadow = true;
  world.add(shore);
}
createLand(0, 0, 6.2, 4.8, 2);
createLand(-7.2, -4.7, 1.9, 1.45, 5);
createLand(7.4, 4.7, 2.0, 1.5, 8);
createLand(7.1, -5.7, 1.15, 0.9, 11);

function addMountain(x, z, height, radius = 0.8) {
  const mountain = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 6), rockMaterial);
  mountain.position.set(x, height / 2 - 0.04, z);
  mountain.rotation.y = 0.35;
  mountain.castShadow = true;
  mountain.receiveShadow = true;
  world.add(mountain);
}
[[-2.4,-1.1,2.5,0.95],[0.2,-2,3.3,1.05],[2.4,0.2,2.3,0.9],[-3.1,1.3,1.7,0.75],[0.1,1.7,1.9,0.7]].forEach(v => addMountain(...v));

function addTree(x, z, scale = 1) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.55 * scale, 7), trunkMaterial);
  trunk.position.y = 0.27 * scale;
  trunk.castShadow = true;
  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.42 * scale, 1.0 * scale, 7), treeMaterial);
  crown.position.y = 0.9 * scale;
  crown.castShadow = true;
  tree.add(trunk, crown);
  tree.position.set(x, 0.03, z);
  world.add(tree);
}
[[-4,-2.7,0.9],[-4.4,0.3,0.8],[4,-2.8,1],[3.8,2.5,0.85],[-1.2,3.1,0.7],[-8,-4.8,0.8],[7.7,4.8,0.9],[7,-5.7,0.7]].forEach(v => addTree(...v));

function addSettlement(x, z, color, size, label) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.8, size, 0.16, 8), shoreMaterial);
  base.position.y = 0.06;
  const tower = new THREE.Mesh(new THREE.BoxGeometry(size * 0.75, size * 1.8, size * 0.75), new THREE.MeshStandardMaterial({ color: "#b9a078", roughness: 0.8 }));
  tower.position.y = size * 0.95;
  tower.castShadow = true;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(size * 0.65, size * 0.75, 4), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.16 }));
  roof.position.y = size * 2.2;
  roof.rotation.y = Math.PI / 4;
  group.add(base, tower, roof);
  group.position.set(x, 0.08, z);
  group.userData.label = label;
  world.add(group);
  return group;
}

const settlements = [
  addSettlement(0, 0, "#e5ad55", 0.68, "پایتخت آذر"),
  addSettlement(-3.7, -1.4, "#69c9d3", 0.43, "شهر بندری"),
  addSettlement(3.4, 1.2, "#69c9d3", 0.42, "شهر کوهستان"),
  addSettlement(-1.5, 2.7, "#8fbd76", 0.34, "روستای سبز"),
  addSettlement(-7.2, -4.7, "#69c9d3", 0.34, "جزیره غربی"),
  addSettlement(7.4, 4.7, "#69c9d3", 0.34, "جزیره شرقی")
];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downX = 0, downY = 0, moved = false;
renderer.domElement.addEventListener("pointerdown", e => { downX = e.clientX; downY = e.clientY; moved = false; });
renderer.domElement.addEventListener("pointermove", e => { if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) moved = true; });
renderer.domElement.addEventListener("pointerup", e => {
  if (moved) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(settlements, true);
  if (!hits.length) return;
  let selected = hits[0].object;
  while (selected.parent && !selected.userData.label) selected = selected.parent;
  const hint = document.querySelector(".scene-hint");
  if (hint) hint.textContent = selected.userData.label || "موقعیت انتخاب شد";
});

let dragging = false, lastX = 0, lastY = 0;
let targetRotationY = -0.25, targetRotationX = 0.18;
renderer.domElement.addEventListener("pointerdown", e => {
  dragging = true; lastX = e.clientX; lastY = e.clientY;
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener("pointermove", e => {
  if (!dragging) return;
  targetRotationY += (e.clientX - lastX) * 0.006;
  targetRotationX = THREE.MathUtils.clamp(targetRotationX + (e.clientY - lastY) * 0.003, -0.12, 0.65);
  lastX = e.clientX; lastY = e.clientY;
});
renderer.domElement.addEventListener("pointerup", () => { dragging = false; });
renderer.domElement.addEventListener("pointercancel", () => { dragging = false; });

function resize() {
  const width = mount.clientWidth, height = mount.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
new ResizeObserver(resize).observe(mount);
resize();

function animate(time) {
  requestAnimationFrame(animate);
  world.rotation.y += (targetRotationY - world.rotation.y) * 0.035;
  world.rotation.x += (targetRotationX - world.rotation.x) * 0.035;
  settlements.forEach((s, i) => { s.children[2].position.y = s.children[2].position.y + Math.sin(time * 0.0015 + i) * 0.0008; });
  renderer.render(scene, camera);
}
animate(0);


const resources = { gold: 1200, wood: 850, stone: 640, food: 1000 };
const buildingLevels = { قلعه: 1, پادگان: 1, معدن: 1, مزرعه: 1 };
const resourceLabels = { gold: "طلا", wood: "چوب", stone: "سنگ", food: "غذا" };
const formatNumber = value => new Intl.NumberFormat("fa-IR").format(value);
function renderResources() {
  for (const [key, value] of Object.entries(resources)) {
    const node = document.querySelector("#" + key);
    if (node) node.textContent = formatNumber(value);
  }
}
document.querySelectorAll(".building").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.building;
    const costs = Object.fromEntries(button.dataset.cost.split(",").map(pair => pair.split(":").map((v, i) => i ? Number(v) : v)));
    const missing = Object.entries(costs).filter(([key, value]) => resources[key] < value);
    const notice = document.querySelector("#notice");
    if (missing.length) {
      notice.textContent = "منابع کافی نیست؛ برای ارتقای " + name + " به " + Object.entries(costs).map(([key, value]) => resourceLabels[key] + " " + formatNumber(value)).join(" و ") + " نیاز داری.";
      return;
    }
    for (const [key, value] of Object.entries(costs)) resources[key] -= value;
    buildingLevels[name] += 1;
    button.querySelector("small").innerHTML = "سطح <i>" + formatNumber(buildingLevels[name]) + "</i> · ارتقا انجام شد";
    notice.textContent = name + " با موفقیت به سطح " + formatNumber(buildingLevels[name]) + " ارتقا یافت. (ذخیره‌سازی آنلاین هنوز فعال نیست.)";
    renderResources();
  });
});
document.querySelector("#collect-income")?.addEventListener("click", () => {
  resources.gold += 80; resources.wood += 55; resources.stone += 35; resources.food += 90;
  renderResources();
  document.querySelector("#notice").textContent = "تولید آزمایشی دریافت شد: ۸۰ طلا، ۵۵ چوب، ۳۵ سنگ و ۹۰ غذا. این مقدار فقط در همین نشست نگهداری می‌شود.";
});
document.querySelector("#reset-camera")?.addEventListener("click", () => {
  targetRotationX = 0.18;
  targetRotationY = -0.25;
  document.querySelector(".scene-hint").textContent = "زاویه دید نقشه بازنشانی شد.";
});
renderResources();

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./StrategyMap.module.css";

export default function StrategyMap({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07131c);
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 150);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xbdeaff, 0x17251f, 2.1));
    const sun = new THREE.DirectionalLight(0xffe5b3, 2.4);
    sun.position.set(-7, 18, 9); scene.add(sun);

    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(52, 42), new THREE.MeshStandardMaterial({ color: 0x102b3c, roughness: 0.92 }));
    ocean.rotation.x = -Math.PI / 2; ocean.position.y = -0.18; scene.add(ocean);

    const landShape = new THREE.Shape();
    landShape.moveTo(-16,-8); landShape.lineTo(-14,-13); landShape.lineTo(-8,-15);
    landShape.lineTo(-3,-13); landShape.lineTo(1,-15); landShape.lineTo(7,-12);
    landShape.lineTo(13,-13); landShape.lineTo(16,-8); landShape.lineTo(14,-3);
    landShape.lineTo(16,2); landShape.lineTo(12,7); landShape.lineTo(13,12);
    landShape.lineTo(7,14); landShape.lineTo(2,12); landShape.lineTo(-3,15);
    landShape.lineTo(-9,12); landShape.lineTo(-14,13); landShape.lineTo(-16,7);
    landShape.lineTo(-14,2); landShape.lineTo(-17,-3); landShape.closePath();
    const land = new THREE.Mesh(new THREE.ExtrudeGeometry(landShape,{depth:0.55,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:0.18,bevelThickness:0.12}), new THREE.MeshStandardMaterial({color:0x34483b,roughness:1}));
    land.rotation.x=-Math.PI/2; land.position.y=0.08; scene.add(land);

    const regionDefs = [
      {p:[[-15,-5],[-12,-12],[-7,-13],[-5,-8],[-8,-3],[-13,0]],c:0x24475a},
      {p:[[-7,-13],[-2,-14],[2,-11],[1,-6],[-5,-7]],c:0x315746},
      {p:[[2,-12],[8,-12],[13,-9],[11,-4],[5,-4],[1,-7]],c:0x5b4930},
      {p:[[12,-7],[16,-4],[14,2],[10,3],[8,-2]],c:0x593544},
      {p:[[-14,1],[-8,-2],[-4,2],[-5,8],[-11,10],[-15,6]],c:0x59404a},
      {p:[[-5,-4],[1,-7],[7,-4],[8,2],[3,6],[-4,4]],c:0x28465b},
      {p:[[8,3],[14,2],[15,8],[10,12],[5,9]],c:0x285342},
      {p:[[-8,8],[-3,5],[3,7],[5,13],[-2,15],[-8,12]],c:0x315746},
      {p:[[-1,0],[4,-2],[8,2],[6,7],[1,7],[-3,4]],c:0x4a3c32}
    ];
    const makePolygon=(points:number[][],color:number,y=0.23)=>{
      const shape=new THREE.Shape(); shape.moveTo(points[0][0],points[0][1]);
      points.slice(1).forEach(p=>shape.lineTo(p[0],p[1])); shape.closePath();
      const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide}));
      mesh.rotation.x=-Math.PI/2; mesh.position.y=y; scene.add(mesh); return mesh;
    };
    regionDefs.forEach(r=>makePolygon(r.p,r.c,0.22));

    const line=(pts:number[][],color:number,opacity=0.7)=>{
      const geo=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(p[0],0.29,p[1])));
      const obj=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity})); scene.add(obj);
    };
    // River and roads link the settlements.
    line([[-13,7],[-9,5],[-6,2],[-2,1],[1,-2],[5,-4],[9,-7],[13,-8]],0x54b9d0,0.9);
    line([[-12,-7],[-7,-5],[-2,-3],[3,-1],[7,3],[12,7]],0xd0b477,0.65);
    line([[-9,10],[-5,6],[0,4],[5,5],[10,9]],0xd0b477,0.55);

    const mountainMat=new THREE.MeshStandardMaterial({color:0x81919a,roughness:1});
    const snowMat=new THREE.MeshStandardMaterial({color:0xc4d0d1,roughness:1});
    const mountains=[[-11,-8],[-9,-7],[-7,-8],[8,-9],[10,-8],[12,-7],[-12,4],[-10,5],[7,10],[9,9]];
    mountains.forEach(([x,z],i)=>{
      const h=1.3+(i%3)*0.45;
      const m=new THREE.Mesh(new THREE.ConeGeometry(0.9+(i%2)*0.25,h,5),mountainMat);m.position.set(x,h/2+0.28,z);scene.add(m);
      const cap=new THREE.Mesh(new THREE.ConeGeometry(0.38,h*0.34,5),snowMat);cap.position.set(x,h*0.83+0.28,z);scene.add(cap);
    });
    const trunkMat=new THREE.MeshStandardMaterial({color:0x63462e});
    const leafMat=new THREE.MeshStandardMaterial({color:0x1c634b});
    [[-13,-1],[-12,-2],[-11,-1],[-6,10],[-5,11],[-4,10],[11,4],[12,5],[13,4],[3,11],[4,12]].forEach(([x,z])=>{
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,0.65,5),trunkMat);trunk.position.set(x,0.55,z);
      const leaves=new THREE.Mesh(new THREE.ConeGeometry(0.58,1.35,6),leafMat);leaves.position.set(x,1.35,z);scene.add(trunk,leaves);
    });

    const cityGold=new THREE.MeshStandardMaterial({color:0xd8b96f,metalness:0.18,roughness:0.75});
    const roof=new THREE.MeshStandardMaterial({color:0x31536b,roughness:0.8});
    const cities=[[-9,-4],[-3,-10],[7,-8],[12,-2],[-11,5],[0,2],[9,7],[-4,10],[3,5]];
    cities.forEach(([x,z],i)=>{
      const base=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.85,0.9),cityGold);base.position.set(x,0.72,z);
      const top=new THREE.Mesh(new THREE.ConeGeometry(0.72,0.75,4),roof);top.position.set(x,1.5,z);top.rotation.y=Math.PI/4;scene.add(base,top);
      const pin=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.8,5),new THREE.MeshStandardMaterial({color:0xf0d28b}));pin.position.set(x,2.05,z);scene.add(pin);
    });
    const keep=new THREE.Group();
    const keepBase=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.35,1.5,8),new THREE.MeshStandardMaterial({color:0x36c7dc,emissive:0x07505a,emissiveIntensity:0.55,metalness:0.25}));
    keepBase.position.y=0.95;keep.add(keepBase);
    const keepRoof=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.25,8),new THREE.MeshStandardMaterial({color:0xd9bb75,metalness:0.2}));keepRoof.position.y=2.3;keep.add(keepRoof);
    [-1,1].forEach(x=>[-1,1].forEach(z=>{const tower=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,2,6),cityGold);tower.position.set(x*0.82,1.2,z*0.82);keep.add(tower)}));
    keep.position.set(0,0,0);scene.add(keep);

    const drag={active:false,x:0,y:0,rx:0.72,ry:-0.42,pointers:new Map<number,{x:number,y:number}>(),pinch:0,zoom:29};
    const resize=()=>{const w=mount.clientWidth||1,h=mount.clientHeight||1;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
    const down=(e:PointerEvent)=>{mount.setPointerCapture?.(e.pointerId);drag.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(drag.pointers.size===1){drag.active=true;drag.x=e.clientX;drag.y=e.clientY}else if(drag.pointers.size===2){const a=[...drag.pointers.values()];drag.pinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);drag.active=false}};
    const move=(e:PointerEvent)=>{if(!drag.pointers.has(e.pointerId))return;const old=drag.pointers.get(e.pointerId)!;drag.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(drag.pointers.size===2){const a=[...drag.pointers.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(drag.pinch>0)drag.zoom=THREE.MathUtils.clamp(drag.zoom-(d-drag.pinch)*0.035,17,43);drag.pinch=d;return}if(drag.active){const dx=e.clientX-old.x,dy=e.clientY-old.y;drag.rx=THREE.MathUtils.clamp(drag.rx+dy*0.004,0.28,1.25);drag.ry+=dx*0.004}};
    const up=(e:PointerEvent)=>{drag.pointers.delete(e.pointerId);if(drag.pointers.size<2)drag.pinch=0;drag.active=drag.pointers.size===1};
    const wheel=(e:WheelEvent)=>{e.preventDefault();drag.zoom=THREE.MathUtils.clamp(drag.zoom+e.deltaY*0.018,17,43)};
    mount.addEventListener("pointerdown",down);mount.addEventListener("pointermove",move);mount.addEventListener("pointerup",up);mount.addEventListener("pointercancel",up);mount.addEventListener("wheel",wheel,{passive:false});window.addEventListener("resize",resize);
    let frame=0;const animate=()=>{frame=requestAnimationFrame(animate);const r=drag.zoom;camera.position.set(Math.sin(drag.ry)*r*Math.sin(drag.rx),Math.cos(drag.rx)*r,Math.cos(drag.ry)*r*Math.sin(drag.rx));camera.lookAt(0,0,0);renderer.render(scene,camera)};resize();animate();
    return()=>{cancelAnimationFrame(frame);mount.removeEventListener("pointerdown",down);mount.removeEventListener("pointermove",move);mount.removeEventListener("pointerup",up);mount.removeEventListener("pointercancel",up);mount.removeEventListener("wheel",wheel);window.removeEventListener("resize",resize);renderer.dispose();mount.innerHTML=""};
  },[]);
  return <div ref={mountRef} className={styles.map+(className?` ${className}`:"")} aria-label="نقشه سه‌بعدی قلمروها"/>;
}

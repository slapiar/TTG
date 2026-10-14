import * as BABYLON from "https://esm.sh/@babylonjs/core@9.29.0";
import "https://esm.sh/@babylonjs/loaders@9.29.0/glTF";
const canvas=document.getElementById("renderCanvas");
const status=document.getElementById("status");
const sound=document.getElementById("sound");
let engine,scene;
try {
 engine=new BABYLON.Engine(canvas,true);
 scene=new BABYLON.Scene(engine);
 const camera=new BABYLON.ArcRotateCamera("camera",Math.PI/2,Math.PI/4,10,new BABYLON.Vector3(0,-5,0),scene);
 camera.attachControl(canvas,true);camera.lowerRadiusLimit=2;camera.upperRadiusLimit=10;camera.wheelDeltaPercentage=.01;
 const light=new BABYLON.HemisphericLight("ambient",new BABYLON.Vector3(0,1,0),scene);light.intensity=.6;
 const directional=new BABYLON.DirectionalLight("sun",new BABYLON.Vector3(0,-.5,-1),scene);directional.position=new BABYLON.Vector3(0,5,5);
 const ground=BABYLON.MeshBuilder.CreateGround("ground",{width:50,height:50},scene);
 const mat=new BABYLON.StandardMaterial("groundMat",scene);mat.diffuseColor=new BABYLON.Color3(.26,.33,.38);ground.material=mat;
 const result=await BABYLON.SceneLoader.ImportMeshAsync("","https://assets.babylonjs.com/meshes/","HVGirl.glb",scene);
 const hero=result.meshes[0];hero.scaling.scaleInPlace(.1);camera.target=hero;
 const samba=scene.getAnimationGroupByName("Samba");
 if(samba){samba.start(true,1,samba.from,samba.to,false);status.textContent="Joyee tancuje · Samba. Hudba sa pripravuje v úlohe #8.";}else{status.textContent="Model sa načítal, animácia Samba sa nenašla."}
 sound.title="Hudobná stopa bude pridaná v úlohe #8";
 engine.runRenderLoop(()=>scene.render());window.addEventListener("resize",()=>engine.resize());
} catch(e){status.textContent="Scéna sa nespustila: "+(e?.message||e);console.error(e);}

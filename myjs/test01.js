
/*
		这是一个测试场景，展示了一个圆环缓冲扭结几何体，尝试了MatCap，天空盒，OrbitControls控制器，后处理。
*/

import * as THREE from 'three';
// 使用OBJ模型导入插件
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 后处理
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
const _floatStrength=0.01;

console.log("import 完成");
// 新建一个场景
const scene=new THREE.Scene();
// 新建一个透视相机
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,5);
camera.focus = true;
const renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );
// light
// 环境光ambientLight
const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
scene.add( ambientLight );
// 太阳光dirLight
const dirLight=new THREE.DirectionalLight( 0xcccccc, 0.8 );
scene.add(dirLight);

// 新建一个圆环缓冲扭结几何体
const geometry = new THREE.TorusKnotGeometry( 1, 0.4, 1000, 64 );
// 贴图加载器
const textureLoader = new THREE.TextureLoader( );
// 加载一张贴图
const texture = textureLoader.load( './textures/MatCap/resin.png' );
texture.encoding=THREE.sRGBEncoding;
// 新建一个MatCap的材质
const material=new THREE.MeshMatcapMaterial({
	color:0xffffff,
	matcap: texture,
});

const mesh =new THREE.Mesh(geometry,material);

mesh.position.set(0,0.5,0);

scene.add(mesh);

//cubemap
const path = './textures/SkyBox/indoor/';
const format = '.png';
const urls = [
	path + 'px' + format, path + 'nx' + format,
	path + 'py' + format, path + 'ny' + format,
	path + 'pz' + format, path + 'nz' + format
];
// 创建一个反射cube
const reflectionCube = new THREE.CubeTextureLoader().load( urls );
scene.background = reflectionCube;

const sphere=new THREE.SphereGeometry(500, 60, 40);
sphere.scale(-1,1,1);
// 加载一张贴图

const rgbeLoader = new RGBELoader();

const HDRtexture =rgbeLoader.load( './textures/SkyBox/indoor/SkyCube.hdr' );

// 新建一个HDR的材质
const HDRmaterial=new THREE.MeshBasicMaterial({
	map: HDRtexture
});
const sphereMesh=new THREE.Mesh(sphere,HDRmaterial);
sphereMesh.position.set(0,0,0);
scene.add(sphereMesh);

const time=new THREE.Clock();

const controls = new OrbitControls( camera, renderer.domElement );

const composer = new EffectComposer( renderer );
// 添加基础pass
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
// 添加抗锯齿
// const  smaaPass = new SMAAPass();
// composer.addPass( smaaPass );

function animate() {
	requestAnimationFrame( animate );
	
	objMoving(mesh);
	camera.lookAt(mesh.position);
	composer.render();
}

function objMoving(obj){
	obj.rotation.x += 0.01;
	obj.position.y += Math.sin(time.getElapsedTime())*_floatStrength;
	// console.log(Math.sin(time.getElapsedTime())*_floatStrength);
	obj.rotation.y += 0.01;
}

animate();
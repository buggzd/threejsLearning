import * as THREE from 'three';
// 使用OBJ模型导入插件
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const _floatStrength=0.01;

console.log("import 完成");
// 新建一个场景
const scene=new THREE.Scene();
// 新建一个透视相机
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
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
// 贴图
const textureLoader = new THREE.TextureLoader( );
const texture = textureLoader.load( './textures/MatCap/resin.png' );

const material=new THREE.MeshMatcapMaterial({
	color:0xffffff,
	matcap: texture,
});

const mesh =new THREE.Mesh(geometry,material);

mesh.position.set(0,0.5,0);

scene.add(mesh);

const time=new THREE.Clock();

const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
	requestAnimationFrame( animate );
	
	objMoving(mesh);
	camera.lookAt(mesh.position);
	renderer.render( scene, camera );
}

function objMoving(obj){
	obj.rotation.x += 0.01;
	obj.position.y += Math.sin(time.getElapsedTime())*_floatStrength;
	// console.log(Math.sin(time.getElapsedTime())*_floatStrength);
	obj.rotation.y += 0.01;
}

animate();
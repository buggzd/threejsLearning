import * as THREE from 'three';
// 相机控制
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 加载HDR贴图的时候需要使用RGBE加载器
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";


// 初始化场景
const scene=new THREE.Scene();
// 初始化相机
const camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 初始化渲染器
const renderer=new THREE.WebGLRenderer({antialias:true});
// 初始化控制器
const controls = new OrbitControls( camera, renderer.domElement );

init();
animate();


function init(){
    initCamera();
    initRenderer();
    loadSkyBox();
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render(scene,camera);
}

// 初始化渲染器
function initRenderer(){
    renderer.render(scene,camera);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);
}

// 初始化相机
function initCamera(){

    camera.position.set(0,15,5);
}

// 加载天空盒
function loadSkyBox(){
// 使用六面贴图
//cubemap，需要在这个文件夹下放切割好的6个贴图
const path = './textures/SkyBox/Sky01/';
const format = '.png';
const urls = [
	path + 'px' + format, path + 'nx' + format,
	path + 'py' + format, path + 'ny' + format,
	path + 'pz' + format, path + 'nz' + format
];
// 创建一个反射cubeTexture
const reflectionCube = new THREE.CubeTextureLoader().load( urls );
// 把这个天空盒设置为背景
scene.background = reflectionCube;

}



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
// 初始化物体
const cube=new THREE.BoxGeometry(1,1,1);
const material=new THREE.MeshBasicMaterial({color:0x888888});
const cubeMesh=new THREE.Mesh(cube,material);

scene.add(cubeMesh);

// 方法一使用六面贴图
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


// 方法二：直接读取hdr贴图，修改贴图格式为 等距圆柱投影的环境贴图，也被叫做经纬线映射贴图
// 加载HDR贴图
const rgbeLoader = new RGBELoader();
// 异步加载，不用异步会出错
rgbeLoader.loadAsync("./textures/SkyBox/indoor/SkyCube.hdr").then((HDRtexture) => {
    // 等距圆柱投影的环境贴图，也被叫做经纬线映射贴图
    HDRtexture.mapping = THREE.EquirectangularReflectionMapping
    // 设置背景图
    scene.background = HDRtexture
    // 设置默认环境
    scene.environment = HDRtexture
});
// 因为使用了hdr在不支持hdr的显示器上需要使用toneMapping
// 色调映射属性.toneMapping用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围(HDR)效果
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 色调映射的曝光级别。默认是1,曝光度值越大，图像亮度越高
// 可以尝试不同值去测试显示效果 比如0:看不到  0.1:很暗  200:过于亮，轮廓感不清楚
renderer.toneMappingExposure = 2;
//是否乘以gamma输出，默认值false
renderer.gammaOutput = false;





camera.position.set(0,0,5);
camera.lookAt(cubeMesh.position);

renderer.render(scene,camera);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

function animate() {
	requestAnimationFrame( animate );
	renderer.render(scene,camera);
}

animate();
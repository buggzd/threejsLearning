# 场景
和unity的场景类似，但是需要自己手动新建场景实例。
```js
const scene=new THREE.Scene();
```
# 相机
```js
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,5);
```
# 模型
three里的模型和unity类似。
一个物体（mesh）需要有 几何形体（geometry），材质（material）。
这里的mesh就可以理解为unity里的meshrenderer需要的。
## 创建几何体
```js
// 新建一个圆环缓冲扭结几何体
const geometry = new THREE.TorusKnotGeometry( 1, 0.4, 1000, 64 );

```
## 创建几何体的material
```js
// 贴图加载器
const textureLoader = new THREE.TextureLoader( );
// 加载一张贴图
const texture = textureLoader.load( './textures/MatCap/resin.png' );
// 新建一个MatCap的材质
const material=new THREE.MeshMatcapMaterial({
	color:0xffffff,
	matcap: texture,
});
```
## 创建渲染的mesh
```js
const mesh =new THREE.Mesh(geometry,material);
//设置mesh的位置
mesh.position.set(0,0.5,0);
// 创建好的mesh需要添加到场景中
scene.add(mesh);
```
# 渲染器
```js
// 创建一个WebGL的渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染图像的长宽
renderer.setSize( window.innerWidth, window.innerHeight );
// 把渲染的图像作为HTML元素传给body
document.body.appendChild( renderer.domElement );

//渲染循环队列
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
```

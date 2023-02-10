# 坐标系
threejs使用的是右手坐标系。
![image.png](https://s2.loli.net/2023/02/09/VvLd5aQUWX71tFG.png)
# 色彩空间
默认threejs使用的是Linear（线性空间），可以使用sRGB和Gamma。
贴图解码：
```js
texture.encoding = THREE.sRGBEncoding;
// or
texture.encoding = THREE.GammaEncoding;
```
渲染器输出解码：
```js
// 设置renderer的输出为sRGB
renderer.outputEncoding = THREE.sRGBEncoding;
// 设置renderer的输出为Gamma空间
renderer.outputEncoding = THREE.GammaEncoding;
```
# 
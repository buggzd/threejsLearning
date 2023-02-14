为了方便调整参数，比如物体移动速度，物体颜色等信息，使用Dat.GUI库扩展。

# 引用
```js
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
```
这里的lil-gui就是dat.gui的移植版本。

# 快速上手
为了方便统一控制参数，可以创建一个GUI控制器统一管理参数。
```js
const indexControl = new function() {
    this.speed = 0.01;
    this.moveRange = 0.1;
    this.color = 0xffffff;
}
```
初始化一个gui
```js
// 初始化GUI
const gui = new GUI();
```
把控制器的控制参数添加给GUI
```js
// 添加控制参数
    gui.add(indexControl, 'speed', 0, 0.1);
    gui.add(indexControl, 'moveRange', 0, 1);
    gui.addColor(indexControl, 'color');
    
```

# 参考
官方：< https://lil-gui.georgealways.com >
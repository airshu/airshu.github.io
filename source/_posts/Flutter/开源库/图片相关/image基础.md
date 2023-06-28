---
title: Image基础
tags: Flutter
---

图片也是一种二进制文件，图片的原始数据中每个像素在内存中一般占用2-4个字节


|type  |  bits   | memory
|--- | --- | ---
|ARGB_8888|32|4*w*h
|ARBG_4444|16|2*w*h
|RGB_565|16|2*w*h
|ALPHA_8|8|1*w*h

## Flutter中常见的图片相关API

### RawImage

#### 属性

##### color、colorBlendMode

color指定混合色，colorBlendMode指定混合模式


##### fit

缩放方式，如果只设置width、height的其中一个，则另一个属性会按照fit的设置来缩放

- fill：拉伸填充
- contain：这是图片的默认适应规则，图片会在保证图片本身长宽比不变的情况下缩放以适应当前显示空间，图片不会变形
- cover：会按图片的长宽比放大后居中填满显示空间，图片不会变形，超出显示空间部分会被剪裁
- fitWidth：图片的宽度会缩放到显示空间的宽度，高度会按比例缩放，然后居中显示，图片不会变形，超出显示空间部分会被剪裁
- fitHeight：图片的高度会缩放到显示空间的高度，宽度会按比例缩放，然后居中显示，图片不会变形，超出显示空间部分会被剪裁
- none：图片没有适应策略，会在显示空间内显示图片，如果图片比显示空间大，则显示空间只会显示图片中间部分
- scaleDown：



### Image

封装了RawImage，方便使用

```dart

Widget image = Image.asset("images/yuan.png");

Widget image = Image.network("http://img.rangaofei.cn/01b18.jpg");

Widget image = Image.file(file);

Widget image = Image.memory(byteList);

```

### 属性

- image：ImageProvider类型，定义了图片数据获取和加载的相关接口


### CircleAvatar

圆形图片

```dart

CircleAvatar(
    child: Text("头像"),
    backgroundImage: AssetImage("images/yuan.png"),
    backgroundColor: Colors.red,
    radius: 50.0,
),

```

### DecorationImage

```dart
Container(
    decoration: BoxDecoration(
        image: DecorationImage(image: AssetImage("images/yuan.png"))),
);
```

### Ink.image

```dart
Ink.image(image: AssetImage("images/timg.jpeg"));
```

### ImageIcon

```dart
ImageIcon(AssetImage("images/timg.jpeg"));
```


### FadeInImage


## 注意

flutter默认提供图片内存的缓存，但没有磁盘缓存，可以使用[flutter_cached_network_image](https://github.com/Baseflow/flutter_cached_network_image)来做磁盘缓存

## 参考

- [Flutter实战：图片及ICON](https://book.flutterchina.club/chapter3/img_and_icon.html)
- [Flutter实战：图片加载原理与缓存](https://book.flutterchina.club/chapter14/image_and_cache.html)
- [Flutter中的Image入门讲解](https://juejin.cn/post/6844903735873765384)
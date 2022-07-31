---
title: PaintingContext
toc: true
tags: Flutter
---


## 概要

![](./PaintingContext_1.png)

- 继承自ClipContext，提供裁剪相关辅助方法
- _currentLayer、_recorder、_canvas用于具体的绘制操作
- _containerLayer


## 基本概念

### Canvas

Canvas是 Engine(C++) 层到 Framework(Dart) 层的桥接，真正的功能在 Engine 层实现。Canvas 向 Framework 层曝露了与绘制相关的基础接口，如：draw*、clip*、transform以及scale等，RenderObject 正是通过这些基础接口完成绘制任务的。

> 通过这套接口进行的所有操作都将被PictureRecorder记录下来。

除了正常的绘制操作(draw*)，Canvas 还支持矩阵变换(transformation matrix)、区域裁剪(clip region)，它们将作用于其后在该 Canvas 上进行的所有绘制操作。

```dart

void scale(double sx, [double sy]);
void rotate(double radians) native;
void transform(Float64List matrix4);

void clipRect(Rect rect, { ClipOp clipOp = ClipOp.intersect, bool doAntiAlias = true });
void clipPath(Path path, {bool doAntiAlias = true});

void drawColor(Color color, BlendMode blendMode);
void drawLine(Offset p1, Offset p2, Paint paint);
void drawRect(Rect rect, Paint paint);
void drawCircle(Offset c, double radius, Paint paint);
void drawImage(Image image, Offset p, Paint paint);
void drawParagraph(Paragraph paragraph, Offset offset);

```

### Picture

其本质是一系列「graphical operations」的集合，对 Framework 层透明。
Future<Image> toImage(int width, int height)，通过toImage方法可以将其记录的所有操作经光栅化后生成Image对象。

### PictureRecorder

其主要作用是记录在Canvas上执行的「graphical operations」，通过Picture#endRecording最终生成Picture。

### Scene

一系列 Picture、Texture 合成的结果。UI 帧刷新时，在 Rendering Pipeline 中 Flutter UI 经 build、layout、paint 等步骤后最终生成 Scene。
其后通过window.render将该 Scene 送入 Engine 层，最终经 GPU 光栅化后显示在屏幕上。

### SceneBuilder

用于将多个图层(Layer)、Picture、Texture 合成为 Scene。

```dart

void main() {
  PictureRecorder recorder = PictureRecorder();
  // 初始化 Canvas 时，传入 PictureRecorder 实例
  // 用于记录发生在该 canvas 上的所有操作
  //
  Canvas canvas = Canvas(recorder);

  Paint circlePaint= Paint();
  circlePaint.color = Colors.blueAccent;

  // 调用 Canvas 的绘制接口，画一个圆形
  //
  canvas.drawCircle(Offset(400, 400), 300, circlePaint);

  // 绘制结束，生成Picture
  //
  Picture picture = recorder.endRecording();

  SceneBuilder sceneBuilder = SceneBuilder();
  sceneBuilder.pushOffset(0, 0);
  // 将 picture 送入 SceneBuilder
  //
  sceneBuilder.addPicture(Offset(0, 0), picture);
  sceneBuilder.pop();

  // 生成 Scene
  //
  Scene scene = sceneBuilder.build();

  window.onDrawFrame = () {
    // 将 scene 送入 Engine 层进行渲染显示
    //
    window.render(scene);
  };
  window.scheduleFrame();
}

```

## 参考

- [深入浅出 Flutter Framework 之 PaintingContext](https://zxfcumtcs.github.io/2020/05/23/deepinto-flutter-paintingcontext/)
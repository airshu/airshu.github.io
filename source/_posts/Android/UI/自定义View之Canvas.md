---
title: 自定义View之Canvas
toc: true
tags: Android
---


## 目录

[自定义View](/Android/UI/自定义View/)
[自定义View之Canvas](/Android/UI/自定义View之Canvas/)
[自定义View之Paint](/Android/UI/自定义View之Paint/)

## API

### 颜色填充

```java
canvas.drawColor(Color.BLACK);
canvas.drawColor(Color.parse("#88880000"); // 半透明红色
canvas.drawRGB(100, 200, 100);
canvas.drawARGB(100, 100, 200, 100);
```

### 画圆

```java

/**
前两个参数 centerX centerY 是圆心的坐标，第三个参数 radius 是圆的半径，单位都是像素
*/
drawCircle(float centerX, float centerY, float radius, Paint paint) 

canvas.drawCircle(300, 300, 200, paint);

```

### 画矩形

```java
paint.setStyle(Style.FILL);
canvas.drawRect(100, 100, 500, 500, paint);

paint.setStyle(Style.STROKE);
canvas.drawRect(700, 100, 1100, 500, paint);
```


### 画点

```java

/**
x 和 y 是点的坐标
*/
drawPoint(float x, float y, Paint paint)

paint.setStrokeWidth(20);
paint.setStrokeCap(Paint.Cap.ROUND);
canvas.drawPoint(50, 50, paint);

/**
pts 这个数组是点的坐标，每两个成一对
offset 表示跳过数组的前几个数再开始记坐标；count 表示一共要绘制几个点
*/
drawPoints(float[] pts, int offset, int count, Paint paint)
drawPoints(float[] pts, Paint paint) 

float points = {0, 0, 50, 50, 50, 100, 100, 50, 100, 100, 150, 50, 150, 100};
// 绘制四个点：(50, 50) (50, 100) (100, 50) (100, 100)
canvas.drawPoints(points, 2 /* 跳过两个数，即前两个 0 */, 8 /* 一共绘制 8 个数（4 个点）*/, paint);


```


### 画椭圆

```java
/**
left, top, right, bottom 是这个椭圆的左、上、右、下四个边界点的坐标。
*/
drawOval(float left, float top, float right, float bottom, Paint paint)

```

### 画线

```java

/**
startX, startY, stopX, stopY 分别是线的起点和终点坐标。
*/
drawLine(float startX, float startY, float stopX, float stopY, Paint paint) 

canvas.drawLine(200, 200, 800, 500, paint);


/**
批量画线
*/
drawLines(float[] pts, int offset, int count, Paint paint) 
drawLines(float[] pts, Paint paint)

float points = {20, 20, 120, 20, 70, 20, 70, 120, 20, 120, 120, 120, 150, 20, 250, 20, 150, 20, 150, 120, 250, 20, 250, 120, 150, 120, 250, 120};
canvas.drawLines(points, paint); 
```


### 画圆角矩形

```java

/**
left, top, right, bottom 是四条边的坐标，rx 和 ry 是圆角的横向半径和纵向半径。
*/
drawRoundRect(float left, float top, float right, float bottom, float rx, float ry, Paint paint)

canvas.drawRoundRect(100, 100, 500, 300, 50, 50, paint);

```

### 弧形或扇形

```java

/**
drawArc() 是使用一个椭圆来描述弧形的。left, top, right, bottom 描述的是这个弧形所在的椭圆；
startAngle 是弧形的起始角度（x 轴的正向，即正右的方向，是 0 度的位置；顺时针为正角度，逆时针为负角度），
sweepAngle 是弧形划过的角度；
useCenter 表示是否连接到圆心，如果不连接到圆心，就是弧形，如果连接到圆心，就是扇形。
*/
drawArc(float left, float top, float right, float bottom, float startAngle, float sweepAngle, boolean useCenter, Paint paint) 


paint.setStyle(Paint.Style.FILL); // 填充模式
canvas.drawArc(200, 100, 800, 500, -110, 100, true, paint); // 绘制扇形
canvas.drawArc(200, 100, 800, 500, 20, 140, false, paint); // 绘制弧形
paint.setStyle(Paint.Style.STROKE); // 画线模式
canvas.drawArc(200, 100, 800, 500, 180, 60, false, paint); // 绘制不封口的弧形

```

### 画自定义图形

```java


drawPath(Path path, Paint paint)



```

### 画 Bitmap

```java

drawBitmap(Bitmap bitmap, float left, float top, Paint paint) 

```


### 绘制文字

- drawText()
- drawTextRun()
- drawTextOnPath()

```java

drawText(String text, float x, float y, Paint paint)

canvas.drawText(text, 200, 100, paint);
```

### 范围裁切

#### clipRect

```java
canvas.save();
canvas.clipRect(left, top, right, bottom);
canvas.drawBitmap(bitmap, x, y, paint);
canvas.restore();
```

#### clipPath

```java
canvas.save();
canvas.clipPath(path1);
canvas.drawBitmap(bitmap, point1.x, point1.y, paint);
canvas.restore();

```

### 几何变换


- 使用 Canvas 来做常见的二维变换；
- 使用 Matrix 来做常见和不常见的二维变换；
- 使用 Camera 来做三维变换。

#### Canvas二维变换

```java

//translate平移
canvas.save();
canvas.translate(200, 0);
canvas.drawBitmap(bitmap, x, y, paint);
canvas.restore();

//旋转
canvas.save();
canvas.rotate(45, centerX, centerY);
canvas.drawBitmap(bitmap, x, y, paint);
canvas.restore();


//缩放
canvas.save();
canvas.scale(1.3f, 1.3f, x + bitmapWidth / 2, y + bitmapHeight / 2);
canvas.drawBitmap(bitmap, x, y, paint);
canvas.restore();

//错切
canvas.save();
canvas.skew(0, 0.5f);
canvas.drawBitmap(bitmap, x, y, paint);
canvas.restore();
```

#### Matrix二维变换

Matrix 做常见变换的方式：

1. 创建 Matrix 对象；
2. 调用 Matrix 的 pre/postTranslate/Rotate/Scale/Skew() 方法来设置几何变换；
3. 使用 Canvas.setMatrix(matrix) 或 Canvas.concat(matrix) 来把几何变换应用到 Canvas。

```java
Matrix matrix = new Matrix();

...

matrix.reset();
matrix.postTranslate();
matrix.postRotate();

canvas.save();
canvas.concat(matrix);
canvas.drawBitmap(bitmap, x, y, paint);
canvas.restore();


```

#### Camera三维变换

```java
canvas.save();

camera.save(); // 保存 Camera 的状态
camera.rotateX(30); // 旋转 Camera 的三维空间
camera.applyToCanvas(canvas); // 把旋转投影到 Canvas
camera.restore(); // 恢复 Camera 的状态

canvas.drawBitmap(bitmap, point1.x, point1.y, paint);
canvas.restore();
```


## 参考

- [https://rengwuxian.com/ui-1-1/](https://rengwuxian.com/ui-1-1/)
- [https://rengwuxian.com/ui-1-4/](https://rengwuxian.com/ui-1-4/)

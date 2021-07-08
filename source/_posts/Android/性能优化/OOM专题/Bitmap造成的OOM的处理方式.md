---
title: Bitmap造成的OOM的处理方式
tags: Android
toc: true
---


## Bitmap总结

Android中的图片是以Bitmap方式存在的，绘制的时候也是Bitmap，对内存的影响还是很大的。

Bitmap所占用内存的计算公式：图片长度 x 图片宽度 x 像素点的字节数

### 图片常用的压缩格式

- ALPHA_8：每个像素都存储为一个半透明通道
- ARGB_4444：API 13中已弃用
- ARGB_8888：每个像素存储在4个字节
- RGB_565：每个像素存储在2个字节中，只有RGB通道被编码；红色以5位精度存储，绿色以6位精度存储，蓝色以5位精度存储。

### 单个像素点的字节数

- ALPHA_8：表示8位Alpha位图，即透明度占8个位，一个像素点占用1个字节，他没有颜色，只有透明度。
- ARGB_4444：表示16位的ARGB位图，即A=4，R=4，G=4，B=4，一个像素点占4+4+4+4=16位，2个字节。
- ARGB_8888：表示32位ARGB位图，即A=8，R=8，G=8，B=8，一个像素点占8+8+8+8=32位，4个字节。
- RGB_565：表示16位RGB位图，即R=5，G=6，B=5，没有透明度，一个像素点占用5+6+5=16位，2个字节。

### 常用压缩方法

1. 质量压缩

```java
private void compressQuality() {
    Bitmap bm = BitmapFactory.decodeResource(getResources(),R.drawable.test);
    mSrcSize = bm.getByteCount() + "byte"; ByteArrayOutputStream bos = new ByteArrayOutputStream(); bm.compress(Bitmap.CompressFormat.JPEG, 100, bos); byte[] bytes = bos.toByteArray();
    mSrcBitmap = BitmapFactory.decodeByteArray(bytes, 0,bytes.length);
}
```

质量压缩不会减少图片的像素，它是在保持像素的前提下改变图片的位深和透明度来达到压缩的目的；图片的长、宽，像素不改变，占用的内存是不会变的。

质量压缩对png无效，png是无损压缩。


2. 采样率压缩

```java
private void compressSampling() {
    BitmapFactory.Options options = new BitmapFactory.Options(); options.inSampleSize = 2;
    mSrcBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.test, options);
}
```

采样率压缩其原理是缩放 bitamp 的尺寸，通过调节其 inSampleSize 参数，比如调节为 2，宽高会为原来的 1/2，内存变回原来的 1/4.

3. 缩放压缩

```java
private void compressMatrix() {
    Matrix matrix = new Matrix();
    matrix.setScale(0.5f, 0.5f);
    Bitmap bm = BitmapFactory.decodeResource(getResources(), R.drawable.test);
    mSrcBitmap = Bitmap.createBitmap(bm, 0, 0, bm.getWidth(), bm.getHeight(), matrix, true);
    bm = null; 
}
```

放缩法压缩使用的是通过矩阵对图片进行裁剪，也是通过缩放图片尺寸，来达到 压缩图片的效果，和采样率的原理一样。

4. RGB_565压缩

```java
private void compressRGB565() {
    BitmapFactory.Options options = new BitmapFactory.Options(); 
    options.inPreferredConfig = Bitmap.Config.RGB_565; 
    mSrcBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.test, options);
}
```

这是通过压缩像素占用的内存来达到压缩的效果，相比 ARGB_8888 将节省一半的内存开销。


5. createScaledBitmap

```java
private void compressScaleBitmap() {
    Bitmap bm = BitmapFactory.decodeResource(getResources(), R.drawable.test);
    mSrcBitmap = Bitmap.createScaledBitmap(bm, 600, 900, true);
    bm = null; 
}
```

将图片的大小压缩成用户的期望大小，来减少占用内存。

## 参考

- []()

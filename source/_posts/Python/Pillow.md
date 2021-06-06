---
title: Pillow
tags: Python 
toc: true
---

Pillow是用于图像处理的库，可用于图像存储、图像显示、图像处理（改变大小、旋转等）。

## 基本使用

```Python
from PIL import Image
im = Image.open("test.png")
print(im.format, im.size, im.mode)
# format 这个属性标识了图像来源。如果图像不是从文件读取它的值就是None。
# size属性是一个二元tuple，包含width和height（宽度和高度，单位都是px）。 
# mode 属性定义了图像bands的数量和名称，以及像素类型和深度。常见的modes 有 “L” (luminance) 表示灰度图像, “RGB” 表示真彩色图像, and “CMYK” 表示出版图像。

im.show() # 显示图像

```

### 转换文件格式到JPEG

```Python

from __future__ import print_function
import os, sys
from PIL import Image

for infile in sys.argv[1:]:
    f, e = os.path.splitext(infile)
    outfile = f + ".jpg"
    if infile != outfile:
        try:
            Image.open(infile).save(outfile)  # save方法第二个参数可以指定文件格式
        except IOError:
            print("cannot convert", infile)
```

### 创建 JPEG 缩略图

```Python
from __future__ import print_function
import os, sys
from PIL import Image

size = (128, 128)

for infile in sys.argv[1:]:
    outfile = os.path.splitext(infile)[0] + ".thumbnail"
    if infile != outfile:
        try:
            im = Image.open(infile)
            im.thumbnail(size)
            im.save(outfile, "JPEG")
        except IOError:
            print("cannot create thumbnail for", infile)

```

> 重要的一点是这个库不会直接解码或者加载图像栅格数据。当你打开一个文件，只会读取文件头信息用来确定格式，颜色模式，大小等等，文件的剩余部分不会主动处理。这意味着打开一个图像文件的操作十分快速，跟图片大小和压缩方式无关。

### 剪切，粘贴，合并图像

```Python

# 从图像中复制出一个矩形选区¶
box = (100, 100, 400, 400)
region = im.crop(box)
# 矩形选区有一个4元元组定义，分别表示左、上、右、下的坐标。这个库以左上角为坐标原点，单位是px，所以上诉代码复制了一个 300x300 pixels 的矩形选区。这个选区现在可以被处理并且粘贴到原图。

# 处理复制的矩形选区并粘贴到原图
region = region.transpose(Image.ROTATE_180)
im.paste(region, box)

# 分离和合并颜色通道
r, g, b = im.split()
im = Image.merge("RGB", (b, g, r))

out = im.resize((128, 128)) # 缩放
out = im.rotate(45) # 旋转

# 过滤器
from PIL import ImageFilter
out = im.filter(ImageFilter.DETAIL)

# 读取多帧
im = Image.open("animation.gif")
im.seek(1) # skip to the second frame

try:
    while 1:
        im.seek(im.tell()+1) # 这里seek后，可显示当前帧，可转换成Qt中的QPixmap或者QIamge
        # do something to im
except EOFError:
    pass # end of sequence

```

<br/>

## 概念


### Bands（通道）

每张图像都是由一个或者多个数据通道构成，PIL可以在单张图片中合成相同维数和深度的多个通道，如RGB有三个通道，而灰度图像则只有一个通道。getbands方法返回通道名字。

### Mode（模式）

图像的模式定义了图像中像素的类型和深度，它在图像中定义mode模式的概念，如：

- 1:1位像素，表示黑和白，占8bit，在图像表示中称为位图
- L：表示黑白之间的灰度，占8bit像素
- p：8位像素，使用调色版映射
- RGB：为真彩色，占用3x8位像素，其中R为red红色，G为green绿色，B为blue蓝色，三原色叠加形成的色彩变化，如三通道都为0则代表黑色，都为255则代表白色
- RGBA：为带透明蒙版的真彩色，其中的A为alpha透明度，占用4x8位像
- CMYK (4x8-bit 像素, color separation)
- YCbCr (3x8-bit 像素, color video format)
- I (32-bit signed integer 像素)
- F (32-bit floating point 像素)


### Size（大小）

size属性表达大小，返回一个元祖，分别为高、宽值。

### Coordinates System（坐标系统）

PIL使用笛卡尔像素坐标系统，图像的坐标从左上角开始（0,0），坐标值表示像素的角，它实际上位于（0.5,0.5）；python中坐标通常以2元组(X,Y)的形式传递，矩形表示为4元组（l_x,t_y,r_x,b_y），X轴从左到右，Y轴从上到下，顺序是从左上右下表示，从左上角开始，如一个800X600像素的图像矩形表示为（0,0,800,600），它实际上时左上角锁定，向右下延伸的。

### Palatte（调色板）

定义每一个像素的真实颜色

### Info（信息）

info属性包含了图片的一些信息，是一个字典对象。如果是一个动画类型的图片，则里面可包含duration，表示一帧画面的现实时间。

### Filters（过滤器）

提供不同类型的过滤器

- NEAREST
    Pick the nearest pixel from the input image. Ignore all other input pixels.
    最近滤波。从输入图像中选取最近的像素作为输出像素。它忽略了所有其他的像素。
- BILINEAR
    Use linear interpolation over a 2x2 environment in the input image. Note that in the current version of PIL, this filter uses a fixed input environment when downsampling.
    双线性滤波。在输入图像的2x2矩阵上进行线性插值，，做下采样时该滤波器使用了固定输入模板
- BICUBIC
    Use cubic interpolation over a 4x4 environment in the input image. Note that in the current version of PIL, this filter uses a fixed input environment when downsampling.
    双立方滤波。在输入图像的4x4矩阵上进行立方插值，做下采样时该滤波器使用了固定输入模板
- ANTIALIAS
    Calculate the output pixel value using a high-quality resampling filter (a truncated sinc) on all pixels that may contribute to the output value. In the current version of PIL, this filter can only be used with the resize and thumbnail methods.
    平滑滤波，对所有可以影响输出像素的输入像素进行高质量的重采样滤波，以计算输出像素值，这个滤波器只用于改变尺寸和缩略图方法。ANTIALIAS滤波器是下采样，将大图转换为小图或左缩略图时唯一正确的滤波器，BILIEAR和BICUBIC滤波器使用固定的输入模板，用于固定比例的几何变换和上采样是最好的


## 解析动画Gif、Webp

```Python
image = Image.open(path)
while image.tell() < image.n_frames:
	image.seek(image.tell() + 1)
	# image.toqpixmap() 获取当前画面
	# duration 表示一帧的显示时间
	if 'duration' in image.info.keys():
		duration = image.info['duration']
	else:
		duration = 100
	time.sleep(duration/1000)
```

## 参考

- [https://github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)
- [https://www.osgeo.cn/pillow/handbook/tutorial.html](https://www.osgeo.cn/pillow/handbook/tutorial.html)
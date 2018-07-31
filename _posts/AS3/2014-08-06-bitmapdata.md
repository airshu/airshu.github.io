---
layout: post
title: "bitmapdata"
description: ""
category: 
tags: []
---

BitmapData使用过程过的总结：


**构造函数 BitmapData(width, height, transparent, fillColor)**

创建一个具有指定的宽度和高度的 BitmapData 对象。如果为 fillColor 参数指定一个值，则位图中的每个像素都将设置为该颜色。

默认情况下，将位图创建为透明位图，除非您为 transparent 参数传递值 false。创建了不透明位图后，将无法将其更改为透明位图。不透明位图中的每个像素仅使用 24 位的颜色通道信息。如果将位图定义为透明，则每个像素将使用 32 位的颜色通道信息，其中包括 Alpha 透明度通道。

在 AIR 1.5 和 Flash Player 10 中，BitmapData 对象的最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。（因此，如果 BitmapData 对象的宽度为 8,191 像素，则其高度只能为 2,048 像素。）在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。如果指定的宽度值或高度值大于 2880，则不会创建新实例。

这是帮助文档上的解释，在用的时候要注意最后两个参数，比如如果你在截图的时候需要保留透明通道，则需将transparent设置为true，然后根据需求来设置最后一个参数，比如如果要透明，则将其Alpha值设置为0，这时候后面的颜色值就没有效果了；如果需要设置一个背景色，则设置Alpha为FF，再设置后6位的颜色值即可。


	//不使用透明通道，保存一个背景色为0xF3EBDD的位图
	var bmd:BitmapData = new BitmapData(loader.rawContent.width, loader.rawContent.height, false, 0xF3EBDD); 
	
	//保存一个有透明度的位图，背景没有颜色，因为Alpha被设置为0了
	var bmd:BitmapData = new BitmapData(loader.rawContent.width, loader.rawContent.height, true, 0x00000000); 
	
	//保存一个有透明度的位图，且背景色为红色
	var bmd:BitmapData = new BitmapData(loader.rawContent.width, loader.rawContent.height, true, 0xFFFF0000); 

	


**public function draw(source:IBitmapDrawable, matrix:Matrix = null, colorTransform:flash.geom:ColorTransform = null, blendMode:String = null, clipRect:Rectangle = null, smoothing:Boolean = false):void**

使用 Flash 运行时矢量渲染器在位图图像上绘制 source 显示对象。可以指定 matrix、colorTransform、blendMode 和目标 clipRect 参数来控制呈现的执行方式。您可以根据需要指定是否应在缩放时对位图进行平滑处理（这只适用于源对象是 BitmapData 对象的情况）。 

注意：drawWithQuality() 方法与 draw() 方法非常相似，但不使用 Stage.quality 属性确定矢量呈现的品质，您需要为 drawWithQuality() 方法指定 quality 参数。

此方法与如何在创作工具界面中使用对象的标准矢量渲染器来绘制对像直接对应。

源显示对象不对此调用使用其任何已应用的转换。它会被视为存在于库或文件中，没有矩阵转换、没有颜色转换，也没有混合模式。要使用对象自己的 transform 属性来绘制显示对象（如影片剪辑），可以将其 transform 属性对象复制到使用 BitmapData 对象的 Bitmap 对象的 transform 属性。

在 Flash Player 9.0.115.0 及更高版本和 Adobe AIR 中，通过 RTMP 支持此方法。在 Flash Media Server 上，可以在服务器端脚本中控制对流的访问。有关详细信息，请参阅 Server-Side ActionScript Language Reference for Adobe Flash Media Server《Adobe Flash Media Server 服务器端 ActionScript 语言参考》）中的 Client.audioSampleAccess 和 Client.videoSampleAccess。

如果 source 对象和其所有子对象（如果是 Sprite 或 MovieClip 对象）与调用方不来自同一个域，或者不在调用方可通过调用 Security.allowDomain() 方法访问的内容中，则调用 draw() 将引发 SecurityError 异常。此限制不适用于应用程序安全沙箱中的 AIR 内容。

对于使用所加载的位图图像作为 source 也有一些限制。如果所加载的图像来自与调用方相同的域，则调用 draw() 方法成功。此外，图像服务器上的跨域策略文件可以向调用 draw() 方法的 SWF 内容的域授予权限。在这种情况下，必须设置 LoaderContext 对象的 checkPolicyFile 属性，并在调用用于加载图像的 Loader 对象的 load() 方法时使用 LoaderContext 对象作为 context 参数。这些限制不适用于应用程序安全沙箱中的 AIR 内容。

在 Windows 中，draw() 方法无法在 Adobe AIR 的 HTMLLoader 对象中捕获嵌入 HTML 页的 SWF 内容。

draw() 方法无法捕获 Adobe AIR 中的 PDF 内容。也无法捕获 Adobe AIR 中 wmode 属性设置为“window”的 HTML 中嵌入的 SWF 内容。

参数
	source:IBitmapDrawable — 要绘制到 BitmapData 对象的显示对象或 BitmapData 对象。（DisplayObject 和 BitmapData 类实现 IBitmapDrawable 接口。）
 
	matrix:Matrix (default = null) — 一个 Matrix 对象，用于缩放、旋转位图或转换位图的坐标。如果不想将矩阵转换应用于图像，请将此参数设置为恒等矩阵（使用默认 new Matrix() 构造函数创建），或传递 null 值。
 
	colorTransform:flash.geom:ColorTransform (default = null) — 一个 ColorTransform 对象，用于调整位图的颜色值。如果没有提供任何对象，则不会转换位图图像的颜色。如果必须传递此参数但又不想转换图像，请将此参数设置为使用默认 new ColorTransform() 构造函数创建的 ColorTransform 对象。
 
	blendMode:String (default = null) — 来自 flash.display.BlendMode 类的一个字符串值，指定要应用于所生成位图的混合模式。
 
	clipRect:Rectangle (default = null) — 一个 Rectangle 对象，定义要绘制的源对象的区域。 如果不提供此值，则不会进行剪裁，并且将绘制整个源对象。
 
	smoothing:Boolean (default = false) — 一个布尔值，用于确定因在 matrix 参数中指定缩放或旋转而对 BitmapData 对象进行缩放或旋转以后，是否对该对象进行平滑处理。smoothing 参数只有在 source 参数是 BitmapData 对象时才适用。在将 smoothing 设置为 false 的情况下，经过旋转或缩放的 BitmapData 图像可能会显得像素化或带有锯齿。例如，下面两个图像的 source 参数使用同一个 BitmapData 对象，但对左侧的图像，smoothing 参数设置为 true，对右侧的图像，该参数设置为 false：
	在将 smoothing 设置为 true 的情况下绘制位图要比在将 smoothing 设置为 false 的情况下执行相同操作更为缓慢。
	
**应用：**

部分剪切：

	var bmd:BitmapData = new BitmapData(200, 200);
	var m: Matrix = Matrix();
	m.tx = -100;
	m.ty = -100;
	bmd.draw(bmp, m);
	var bmp2 = new Bitmap(bmd);
	addChild(bmp2);
	
第一行，是复制的BitmapData的定义，其中200,200是复制出来的内容的宽和高；
第2～3行，是定义要复制的部分的起始坐标，-100，-100，意思就是从要复制的对象的注册点开始算，x:100，y:100坐标开始复制
第4行是复制，其中bmp就是复制的源（也就是一个显示对象），m就是刚才那个Matrix。
第5行是复制，6～7行是把复制的内容显示出来。
因为第一行定义了要复制的区域大小，2，3行定义了从哪个位置复制，这样就实现了按要求区域复制的功能了。



**public function copyPixels(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, alphaBitmapData:BitmapData = null, alphaPoint:Point = null, mergeAlpha:Boolean = false):void**

为没有拉伸、旋转或色彩效果的图像之间的像素处理提供一个快速例程。此方法在目标 BitmapData 对象的目标点将源图像的矩形区域复制为同样大小的矩形区域。
如果包括 alphaBitmap 参数和 alphaPoint 参数，则可以将另一个图像用作源图像的 Alpha 源。如果源图像具有 Alpha 数据，则这两组 Alpha 数据都用于将源图像中的像素组合到目标图像中。alphaPoint 参数是 Alpha 图像中与源矩形左上角对应的点。源图像和 Alpha 图像交叉区域之外的任何像素都不会被复制到目标图像。
mergeAlpha 属性控制在将透明图像复制到另一透明图像时是否使用 Alpha 通道。若要复制含有 Alpha 通道数据的像素，请将 mergeAlpha 属性设置为 true。默认情况下，mergeAlpha 属性为 false。

 参数
	sourceBitmapData:BitmapData — 要从中复制像素的输入位图图像。源图像可以是另一个 BitmapData 实例，也可以指当前 BitmapData 实例。
 
	sourceRect:Rectangle — 定义要用作输入的源图像区域的矩形。
 
	destPoint:Point — 目标点，它表示将在其中放置新像素的矩形区域的左上角。
 
	alphaBitmapData:BitmapData (default = null) — 第二个 Alpha BitmapData 对象源。
 
	alphaPoint:Point (default = null) — Alpha BitmapData 对象源中与 sourceRect 参数的左上角对应的点。
 
	mergeAlpha:Boolean (default = false) — 要使用 Alpha 通道，请将该值设置为 true。要复制不含 Alpha 通道的像素，请将该值设置为 false。



**应用：**

下例演示如何将一个 BitmapData 对象中 20 x 20 像素的区域内的像素复制到另一个 BitmapData 对象：


	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import flash.geom.Point;

	var bmd1:BitmapData = new BitmapData(40, 40, false, 0x000000FF);
	var bmd2:BitmapData = new BitmapData(80, 40, false, 0x0000CC44);

	var rect:Rectangle = new Rectangle(0, 0, 20, 20);
	var pt:Point = new Point(10, 10);
	bmd2.copyPixels(bmd1, rect, pt);

	var bm1:Bitmap = new Bitmap(bmd1);
	this.addChild(bm1);
	var bm2:Bitmap = new Bitmap(bmd2);
	this.addChild(bm2);
	bm2.x = 50;

参考：

flexinonroids.wordpress.com/2009/06/17/flex-3-bitmapdata-draw-with-transparency/
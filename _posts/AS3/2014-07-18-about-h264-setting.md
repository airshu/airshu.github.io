---
layout: post
title: "about h264 setting"
description: ""
category: 
tags: []
---
{% include JB/setup %}


**什么是H264**

H.264，或称MPEG-4第十部分（AVC,Advanced Video Coding），是由国际电信标准化部门ITU-T和国际标准化组织ISO/IEC于2003年共同推出的最新一代的视频压缩标准。
与就标准相比，它能够在更低带宽下提供优质视频。

**H264和Flash Player**

Flash Player9 就支持了H264回播。Flash Player应该播放 .mp4, .m4v, .m4a, .mov, .3gp文件。H264使用.flv扩展名，也使用新的扩展名。

<table>
	<tr>
		<td>文件扩展名</td>
		<td>FTYP</td>
		<td>MIME 类型</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>.4v</td>
		<td>'F4V'</td>
		<td>video/mp4</td>
		<td>视频</td>
	</tr>
	<tr>
		<td>.f4p</td>
		<td>'F4P'</td>
		<td>video/mp4</td>
		<td>受保护的媒体</td>
	</tr>
	<tr>
		<td>.f4a</td>
		<td>'F4A'</td>
		<td>audio/mp4</td>
		<td>Flash Player音频</td>
	</tr>
	<tr>
		<td>.f4b</td>
		<td>'F4B'</td>
		<td>audio/mp4</td>
		<td>Flash Player有声读物</td>
	</tr>
</table>

<br/>

**H264编码参数**

Profile：对视频压缩特性的描述，表示不同的画质级别。目前有21种标准，但AS中只支持2种选择。

![](http://cainiaoxiaoxiao.u.qiniudn.com/1279272306301.jpg)



Level：对视频本身特性的描述(码率、分辨率、fps)

![](http://cainiaoxiaoxiao.u.qiniudn.com/2222.png)


在直播中使用H264编码：


	var cam:camera = Camera.getCamera();
	var ns:netStream = new NetStream(nc);
	ns.client = this;
	ns.addEventListener(NetStatusEvent.NET_STATUS, onNetStatus); 

	var h264Settings:H264VideoStreamSettings = new H264VideoStreamSettings();
	h264Settings.setProfileLevel(H264Profile.MAIN, H264Level.LEVEL_3_1);
	// 以下方法暂无效，不知道adobe什么时候才实现，用Camera对应的API代替
	//h264Settings.setQuality(0,90);
	//h264Settings.setKeyFrameInterval(15);
	//h264Settings.setMode(width, height, fps);

	ns.videoStreamSettings = h264Settings;
	ns.attachCamera(cam);
	ns.publish("mp4:mplivestream.f4v");
		


**setProfileLevel(profile:String, level:String)**

H264Profile 类是用于设置 H264VideoStreamSettings 类的配置文件的常数值的枚举。(目前只支持两种)

public static const BASELINE:String = "baseline"

用于H.264/AVC基线配置文件的常数。这是 H264VideoStreamSettings 类的默认值。
支持I/P帧，只支持无交错(Progressive)和CAVLC，一般用于低阶或需要额外容错的应用，比如视频通话、手机视频等；

public static const MAIN:String = "main"

用于 H.264/AVC 主配置文件的常数。 
提高I/P/B帧，支持无交错(Progressive)和交错(interlaced)，同样提供对于CAVLC和CABAC的支持


H264Level 类是用于设置 H264VideoStreamSettings 类的级别的常数值的枚举。 

<br/><br/>

参考：

http://en.wikipedia.org/wiki/H264

http://www.adobe.com/devnet/adobe-media-server/articles/h264_encoding.html

http://www.adobe.com/devnet/adobe-media-server/articles/encoding-live-video-h264.html


---
layout: post
title: "getting_started_streaming_media"
description: ""
category: FMS
tags: [fms]
---
{% include JB/setup %}

### 目录
一、支持的客户端，编码器，解码器和文件格式

二、预构建的媒体播放器

三、实时流媒体(HTTP)

四、实时流媒体(RTMP)

五、点播流媒体(HTTP)

六、点播流媒体(RTMP)

七、受保护的点播流媒体(pRTMP)

八、多播媒体(RTMFP)

九、Configure closed captioning

十、配置可交换的音频

十一、配置保护内容

十二、配置HTTP动态流和HTTP实时流

十三、HTTP流配置文件参考

十四、建立自定义媒体播放器

十五、Offline packaging

十六、流媒体问题的一些解决办法



---


##### 一、支持的客户端，编码器，解码器和文件格式
###### 流服务支持的客户端和服务器


##### 二、预构建的媒体播放器


##### 三、实时流媒体(HTTP)

##### 四、实时流媒体(RTMP)

##### 五、点播流媒体(HTTP)

##### 六、点播流媒体(RTMP)

##### 七、受保护的点播流媒体(pRTMP)


##### 八、多播媒体(RTMFP)

**关于多播服务**

**重要：** 多播服务(rootinstall/applications/multicast)不能运行在AMS标准版中。

多播服务是AMS多播解决方案的一部分。多播解决方案包括以下组件：

- 多播配置工具(rootinstall/tools/multicast/configurator)

- Flash Media Live Encoder

捕获、编码和发布实时视频

- 多播服务(rootinstall/applications/multicast)

- 多播播放器(rootinstall/tools/multicast/multicastplayer)


**配置多播事件**

1、打开rootinstall/tools/multicast/configurator/configurator.html。

2、选择多播类型：

- Fusion(simultaneous, cooperative IP and P2P multicast)

- IP Multicast

- Peer to Peer

- Peer to Peer with Peer Discovery

3、对于Fusion和Peer to Peer，输入服务器名称(或IP地址)和多播应用的全路径，比如:rtmfp://ams.example.com/multicast。
如果服务器配置的端口大于1935，需指定端口，比如：rtmfp://ams.example.com:1940/multicast。

4、输入流名字，比如，CorpAllHandsQ2_2010或livestream。

5、输入发布密码。

发布密码指定只有多播服务器才能在组内发布多播流，其他节点只能播放。

6、输入组名字。名字需要唯一。

7、对于IP Multicast 和Fusion，输入IP多播地址和端口。

8、(可选的)如果托管AMS的服务器有一个以上的网络接口卡(NIC)，在地址文本框中为一个NIC输入IP地址。AMS使用这个IP地址来决定发布时访问的接口。

9、(可选的)为了使用[source-specific multicast](http://en.wikipedia.org/wiki/Source-specific_multicast)，在对应的输入框输入IP地址和端口。

10、点击生成。多播配置工具产生以下内容：

- 实时流的名字。

- F4M文件。为了观看此文件，点击观看Manifest文件。

11、为了使用多播播放器，按照下面的步骤：

a 点击保存Manifest文件。

b 保存manifest.f4m文件到multicastplayer.html同目录。默认情况，在rootinstall/tools/multicast/multicastplayer。

12、为了使用Strobe Media Playback，打开配置器。在设置完成后，你将返回到配置并保存f4m文件到相同的文件夹下的作为Strobe Media Playback。



 
**使用Flash Media Live Encoder 发布流**

1、打开Flash Media Live Encoder3.1或更高版本

2、从预设菜单中，选择一个单一的流。多播解决方案不支持multi-bitrate流。

3、对于AMS URL，输入多播服务的URL。如果你在同一台电脑测试，输入：rtmp://localhost/multicast

**注意：**Flash Media Live Encoder 连接AMS是通过RTMP协议传输的，不使用RTMFP。

4、将在多播配置工具中复制的发布流的名字粘贴。

5、点击开始。

6、打开管理员控制台，点击观看Applications>Clients。The RTMP client is the connection from FMLE to the server. The RTMFP client is a server-side peer established by the multicast service to republish the live stream into the target RTMFP Group




**播放多播流**

1、开打rootinstall/tools/multicast/multicastplayer/multicastplayer.html

2、为了在本地系统中运行Flash Player，右键屏幕，选择全局设置：

- 在Flash Player帮助页，选择全局安全设置面板。点击Edit locations > Add location >Browse for folder。选择multicastplayer.swf文件所在目录。
点击添加。

- 在Flash Player设置管理器，选择高级点击Trusted Location Setting。点击添加，选择multicastplayer.swf文件所在目录。

3、重新装载multicastplayer.html。点击运行点对点连接。

4、打开管理员控制台看客户端连接。

 
**用AMS样例播放器播放流**

1、打开rootinstall/samples/videoPlayer/videoplayer.html

2、从rootinstall/tools/multicast/configurator复制t.f4m文件到rootinstall/smaples/videoPlayer文件夹。

3、在样例播放器中，在URL流文本框中输入manifest.f4m， 点击播放。

4、管理员控制台查看信息。


##### 九、Configure closed captioning

##### 十、配置可交换的音频

##### 十一、配置保护内容

##### 十二、配置HTTP动态流和HTTP实时流

##### 十三、HTTP流配置文件参考

##### 十四、建立自定义媒体播放器

###### 为实时或点播服务构建媒体播放器

OSMF 播放器是基于Flash平台的开源播放器。

**连接流服务**

跟所有AMS应用一样，通过NetConnection.connect()来连接，URI参数格式如下：

rtmp://ams-ip-or-dns/serviceName/[formatType:][instanceName/]fileOrStreamName

hostName AMS域名

serviceName 直播或点播

instanceName 如果客户端连接默认的实例，你可以省略或使用_definst_。

fotmatType mp3文件则用mp3:,对mp4/f4v文件，则用mp4:，flv文件不做要求。

fileOrStreamName 文件名或路径，如my_video.mp4或subdir/subdir2/my_video.mp4。

**不支持的ActionScript API**

对于实时和点播服务，客户端不能使用 SharedObject.getRemote()

你不能编辑服务端的代码。但可以通过NetConnection.call()来调用服务器端的方法。

**允许从指定的域连接**

默认情况，可以从任何域连接。

rootinstall/applications/live 或 rootinstall/applications/vod 文件夹：

- 添加一个swf客户端的域，编辑allowedSWFdomains.txt文件。

- 添加一个HTML客户端的域，编辑allowedHTMLdomains.txt文件。

**访问音频和视频的原始数据**

ActionScript中通过BitmapData.draw()和SoundMixer.computeSpectrum()方法访问数据。

默认情况下，AMS阻止你访问流。为了访问，需要做以下事情：

1. 将rootinstall/smaple/applications/live 或 rootinstall/smaple/applications/vod的main.far和main.asc文件复制到rootinstall/applications/live 或 rootinstall/applications/vod

2. 去掉下面两行的注释：

	//p_client.audioSampleAccess = "/";
	//p_client.videoSampleAccess = "/";


**流服务API**

**getStreamLength(streamObj)**

返回流的长度。

**实例**

nc.call("getStreamLength", returnObj, "sample_video");


**getPageUrl()**

返回客户端Swf的URL

//嵌套在html中
getPageUrl 返回： http://www.example.com/trace.html

//没有嵌套在html中
getPageUrl 返回： http://www.example.com/trace.swf

这个值必须是http地址。由于安全原因，本地地址不会显示。

**实例**

nc.call("getPageUrl", returnObj);

**getReferrer()**

返回SWF文件的URL或服务器连接源自哪里

**实例**

myNetConnection.call("getReferrer", returnObj);


###### 构建动态的HTTP流媒体播放器

**使用OSMF**


**理解HTTP动态流的应用结构**

流媒体使用Adobe HDS需要Adobe媒体Manifest文件(.f4m)。

manifest文件包含的信息媒体资源或多播流中的每个流的事件的信息。这些信息包括媒体的位置、DRM额外头数据,媒体引导信息,自适应流比特率等。

为了产生文件，HTTP模块会执行以下步骤：

1. 结合请求URL和HttpStreamingLiveEventPath指令来定位实时事件

2. 从Event.xml和multi-lvevel manifest文件总检索元数据

3. 为了流录制文件(.stream)扫描事件目录

4. 检索每一个流文件对应的内容。每一个.stream文件都来自manifest文件的<media>标签

5. 从.meta文件检索元数据

6. 为引导信息和DRM额外头数据创建链接(如果内容是安全的)

7. 返回生成manifest文档


在rootinstall/applications/livepkgr/streams/_definst_文件夹，实时打包器以流的名字创建文件夹：livestream1，livestream2。实时打包器
在每个文件夹中创建了以下文件：

· livestream#.bootstrap

· livestream#.control

· livestream#.meta

· livestream#.Seg#.f4f

· livestream#.Seg#.f4x

下表描述了每个文件类型：
<table>
	<tr>
		<td>文件</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>livestream#Seg#.f4f</td>
		<td>A segment. The Live Packager outputs one or more F4F files. Each file contains a segment of the source file. Each segment contains the fragmented (and optionally protected) content.</td>
	</tr>
	<tr>
		<td>livestream#Seg#.f4x</td>
		<td>An index file listing the fragment offsets in each .f4f file. The Live Packager outputs one or more F4X files. The HTTP Origin Module uses this file to deliver fragments.</td>
	</tr>
	<tr>
		<td>livestream#.meta</td>
		<td>Contains the stream metadata (bitrate, screen size, and so on).</td>
	</tr>
	<tr>
		<td>livestream#.bootstrap</td>
		<td>Contains the bootstrap information for the stream.</td>
	</tr>
	<tr>
		<td>livestream#.control</td>
		<td>Contains internal metadata that the Live Packager uses to manage stream state.</td>
	</tr>
	<tr>
		<td>livestream#.drmmeta</td>
		<td>Contains additional header information when a stream is encrypted for use with Adobe Access.</td>
	</tr>
</table>


以下是Apache配置HTTP动态流的时候这些文件的URL请求格式：
<table>
	<tr>
		<td>请求格式</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>Fragment</td>
		<td>http://<host>/<location-tag-alias>/streams/<app-name>/streams/<app-instance>/<stream name>Seg<segment #>-Frag<fragment #></td>
	</tr>
	<tr>
		<td>Bootstrap(.bootstrap)</td>
		<td>http://<host>/<location-tag-alias>/streams/<app-name>/streams/<app-instance>/<stream name>.bootstrap</td>
	</tr>
</table>

**流录制文件**

流记录文件(.stream)是一个XML文档,其中包含的物理位置。服务器创建流记录文件时传入流与实时事件相关联。服务器创建的文件的名称在以下位置进行编码

applications/appname/events/appinstancename/eventname/MTg1ODAyNigwNg=.stream

.stream文件格式如下：

	<?xml version="1.0" encoding="UTF-8"?>
	<stream xmlns="http://www.adobe.com/liveevent/1.0">
		<type>
			f4f
		</type>
		<name>
			livestream
		</name>
		<path>
			C:\Program Files\Adobe\Adobe Media Server 5\applications\myapp\streams\_definst_\livestream
		</path>
	</stream>


**.f4m manifest文件实例**



##### 十五、Offline packaging

##### 十六、流媒体问题的一些解决办法
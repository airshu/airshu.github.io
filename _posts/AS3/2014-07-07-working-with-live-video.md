---
layout: post
title: "working with live video"
description: ""
category: FMS
tags: [fms]
---
{% include JB/setup %}

#### 使用实时视频

##### 捕获实时流

###### 使用Flash Media Live Encoder捕获视频

###### 实例：自定义视频捕获应用


##### 添加DVR特征


##### 添加元数据

###### 关于元数据

元数据流媒体让用户有机会获得他们正在查看的信息媒体。元数据可以包含关于视频的信息,例如标题、版权信息、视频的时间,或创建日期。客户端可以使用元数据来设置宽度和高度的视频播放器

###### 向实时流发送元数据

客户端中使用send发送元数据

	NetStream.send(@setDataFrame, onMetaData [, metadata]);
	
onMetaData参数指定回调函数。你可以使用多个数据关键帧，每个数据关键帧必须使用唯一的监听器(如onMetaData1..)

metadata参数可以是Object或Array类型。

	var metaData:Object = new Object();
	metaData.title = "myStream";
	metaData.width = 400;
	metaData.height = 200;
	ns.send("@setDataFrame", "onMetaData", metaData);

清空元数据：

	ns.send("@clearDataFrame", "onMetaData");

	
为了在服务器端添加元数据，使用以下代码：
	
	s = Stream.get("myStream");
	metaData = new Object();
	metaData.title = "myStream";
	metaData.width = 400;
	metaData.height = 200;
	s.send("@setDataFrame", "onMetaData", metaData);

服务器端情况元数据:

	.send("@clearDataFrame", "onMetaData");
	

###### 检索元数据

	netstream.client = this;
	
	function onMetaData(info:Object):void {
		var key:String;
		for (key in info) {
			trace(key + ": " + info[key]);
		}
	}	



###### 实例：向实时视频添加元数据

这个客户端应用有以下功能：

· 捕获和编码视频

· 显示捕获的视频

· 流从客户端到服务器端

· 发送元数据到服务器，客户端播放流时服务器发送元数据到客户端

· 显示来自服务器的流

· 显示元数据

参考 nstall/documentation/smaples/metadata



###### Flash Media Live Encoder 元数据属性
<table>
	<tr>
		<td>元数据属性名</td>
		<td>数据类型</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>lastkeyframetimestamp</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>width</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>videodatarate</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>audiodatarate</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>framerate</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>creationdate</td>
		<td>String</td>
		<td></td>
	</tr>
	<tr>
		<td>createdby</td>
		<td>String</td>
		<td></td>
	</tr>
	<tr>
		<td>audiocodecid</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>videocodecid</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>audiodelay</td>
		<td>Number</td>
		<td></td>
	</tr>
</table>


###### 被录制的实时流的元数据属性

	ns.publish("myCamera", "record");
	
如果你录制流，AMS会添加如下表格中的元数据：

<table>
	<tr>
		<td>元数据属性名</td>
		<td>数据类型</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>audiocodecid</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>canSeekToEnd</td>
		<td>Boolean</td>
		<td></td>
	</tr>
	<tr>
		<td>createdby</td>
		<td>String</td>
		<td></td>
	</tr>
	<tr>
		<td>duration</td>
		<td>Number</td>
		<td></td>
	</tr>
	<tr>
		<td>creationdate</td>
		<td>String</td>
		<td></td>
	</tr>
	<tr>
		<td>videocodecid</td>
		<td>Number</td>
		<td></td>
	</tr>
	
</table>


##### 捕获来自Flash Media Live Encoder的时间码

##### 以RAW格式发布实时流


##### 不同服务器间的多点发布 

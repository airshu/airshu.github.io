---
layout: post
title: "getting started developing applications"
description: ""
category: AS3
tags: [fms]
---

#### 开始开发应用


##### 应用结构

典型的AMS应用有以下部分：

**Client** 客户端显示用户界面，如控制视频的播放、停止。

**Client-side ActionScript** 

**Video or audio files**

**Camera or Microphone**

**Server-Side ActionScript**



##### 设置开发环境

你可以使用任何版本的AMS来开发和测试应用。为了写客户端代码，可以使用Flash Professional，Flash Builder等。
任何文本编辑器写服务器端代码。

**设置开发环境:**

1、安装AMS

2、验证是否安装成功

3、安装Flash Professional或Flash Builder或Flex SDK

4、捕获和编码视频

a 连接一个摄像头或麦克风

b 下载和安装Adobe Media Live Encoder


##### 实例：Hello World应用

###### 概要

**提示：** 以下内容不能在Adobe Media Streaming Server中使用，因为你不能在这个版本上写服务器端代码

这个例子展示了客户端的简单通讯。实例文件在rootinstall/documentation/samples/Hello World文件夹。

###### 写用户接口

###### 写客户端脚本

package {
import flash.display.MovieClip;
import flash.net.Responder;
import flash.net.NetConnection;
import flash.events.NetStatusEvent;
import flash.events.MouseEvent;
public class HelloWorld extends MovieClip {

	public function HelloWorld() {
		textLbl.text = "";
		connectBtn.label = "Connect";
		connectBtn.addEventListener(MouseEvent.CLICK, connectHandler);
	}

	public function connectHandler(event:MouseEvent):void {
		if (connectBtn.label == "Connect") {
			trace("Connecting...");
			nc = new NetConnection();
			// Connect to the server.
			nc.connect("rtmp://localhost/HelloWorld");
			// Call the server's client function serverHelloMsg, in HelloWorld.asc.
			nc.call("serverHelloMsg", myResponder, "World");
			connectBtn.label = "Disconnect";
		} else {
			trace("Disconnecting...");
			// Close the connection.
			nc.close();
			connectBtn.label = "Connect";
			textLbl.text = "";
		}
	}

	private function onReply(result:Object):void {
		trace("onReply received value: " + result);
		textLbl.text = String(result);
	}

}
}



###### 写服务器端脚本

	application.onConnect = function( client ) {
		client.serverHelloMsg = function( helloStr ) {
		return "Hello, " + helloStr + "!";
	}
	application.acceptConnection( client );
	}

###### 编译和运行应用

1、运行服务器

2、编译客户端文件

3、测试。


##### 创建应用的概要


###### 客户端代码

###### 服务器端代码

一般来说，有如下需求的时候服务器端需要写代码：

**Authenticate clients** 权限验证

**Implement connection logic** 实现连接的逻辑

**Update clients** 通过调用远程方法来更新客户端的共享数据

**Connect to other server**  向某个应用或数据库调用web service或socket

服务器端的代码入口为main.asc或yourApplicationName.asc。

该文件应在应用的主目录中，或scripts子目录中。

rootinstall/applications/appName

rootinstall/applications/appName/scripts

默认情况下，应用文件夹在安装目录的的applications文件中，也可以在fms.ini或Vhost.xml文件中设置VHOST.APPSDIR。
在Vhost.xml文件中，编辑AppsDir。



##### 测试应用

###### 测试和调试客户端脚本 


###### 测试和调试服务器端脚本

使用trace()，输出相关数据。日志信息也会保存在rootinstall/logs/_defaultVHost_/yourApplicationName/yourInstanceName/application.xx.log文件中

使用管理员控制台。修改.asc文件之后，需要重启应用才会生效。


**使用管理员控制台调试**

可调式行和可调试会话数由Application.xml配置文件的AllowDebugDefault和MaxPendingDebugConnections决定。默认情况下，是不可调试的。
也可以使用服务器端代码开启调试：

	application.allowDebug = true;
	


##### 部署应用

###### 注册应用

	myNetConnection.connect("rtmp://fms.examples.com/myApplication");
	
	

###### 复制服务器端脚本文件到服务器

###### 复制多媒体文件

###### 复制客户端文件到web服务器


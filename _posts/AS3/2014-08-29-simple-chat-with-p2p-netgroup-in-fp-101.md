---
layout: post
title: "Simple Chat With P2P NetGroup In FP 10.1"
description: ""
category: AS3
tags: [fms,p2p]
---


翻译自：http://tomkrcha.com/?p=1266

这篇文章介绍了最简单的P2P用法，介绍了GroupSpecifier、NetGroup的用法

**步骤一：创建一个ActionSript项目**

使用Flash Player10.1或以上的版本

**步骤二：连接FMS**

首先我们需要用NetConnection连接服务器：

	private const SERVER:String = "rtmfp://p2p.rtmfp.net/";
	private const DEVKEY:String = "YOUR-DEVELOPER-KEY";
	private var nc:NetConnection;
 
	private function connect():void{
	nc = new NetConnection();
	nc.addEventListener(NetStatusEvent.NET_STATUS,netStatus);
	nc.connect(SERVER+DEVKEY);

**步骤三：创建NetGroup**

我们需要创建P2P组然后连接它。首先，新建GroupSpecifier，构造函数中传入组的名称。然后打开服务器通道，指定为NetGroup启动发布流。groupspecWithAuthorizations和groupspecWithoutAuthorizations的区别在于前者可以发送和接收，后者只能接收。

	private function setupGroup():void{
		var groupspec:GroupSpecifier = new GroupSpecifier("myGroup/g1");
		groupspec.serverChannelEnabled = true;
		groupspec.postingEnabled = true;
	 
		netGroup = new NetGroup(nc,groupspec.groupspecWithAuthorizations());
		netGroup.addEventListener(NetStatusEvent.NET_STATUS,netStatus);
	 
	 
		user = "user"+Math.round(Math.random()*10000);
	}
	
**步骤四：监听NetStatusEvent**


	private function netStatus(event:NetStatusEvent):void{
		trace(event.info.code);
	 
		switch(event.info.code){
			case "NetConnection.Connect.Success"://连接成功
				setupGroup();
				break;
	 
			case "NetGroup.Connect.Success"://组连接成功
				connected = true;
	 
				break;
	 
			case "NetGroup.Posting.Notify"://消息接收
				receiveMessage(event.info.message);
				break;
		}
	}
	
**步骤五：发送和接收消息**

	private var seq:int = 0;
	private function sendMessage():void{
		var message:Object = new Object();
		message.sender = netGroup.convertPeerIDToGroupAddress(nc.nearID);
		message.user = txtUser.text;
		message.text = txtMessage.text;
		message.sequence = seq++; // *to keep unique
	 
	 
		netGroup.post(message);
		receiveMessage(message);
	 
		txtMessage.text = "";
	}
	 
	private function receiveMessage(message:Object):void{
		write(message.user+": "+message.text);
	}
	 
	private function write(txt:String):void{
		txtHistory.text += txt+"n";
	}	
	
**步骤六：创建UI**

	<s:TextArea left="10" right="10" top="10" bottom="40" id="txtHistory"/>
	<s:TextInput x="10" id="txtUser" text="{user}" bottom="10"/>
	<s:TextInput left="145" right="88" id="txtMessage" bottom="10" enter="sendMessage()"/>
	<s:Button label="Send" click="sendMessage()" enabled="{connected}" bottom="10" right="10"/>	
	
**
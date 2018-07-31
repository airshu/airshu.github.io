---
layout: post
title: "securing applications"
description: ""
category: AS3
tags: [fms]
---


#### 应用安全

##### 资源访问权限

**关于访问控制**

当用户访问服务器的时候，默认情况下能访问所有的流和共享对象。你可以使用服务端的ActionScript创建动态访问控制列表。

当一个客户端连接服务器，服务器脚本会传递一个Client对象。每个Client对象有readAccess和writeAccess属性。你可以使用这些属性来控制访问权限。


**实现动态访问控制**

clent.readAccess和client.writeAccess属性为字符串类型，值包含了用分号隔开的字符串。

	client.readAccess = "appStreams;/appSO/";
	client.writeAccess = "appStreams/public/;appSO/public/";
	
默认值为"/"，表示可以访问所有的流和共享对象。


*允许访问流*

在main.asc中，添加onConnect()函数来指定目录文件夹：

	application.onConnect = function(client, name) {
		// give this new client the same name as passed in
		client.name = name;
		// give write access
		client.writeAccess = "appStreams/public/";
		// accept the new client's connection
		application.acceptConnection(client);
	}
	

*拒绝访问流*

	application.onConnect = function(client, name) {
		...
		// deny write access to the server
		client.writeAccess = "";
	}
	
*指定访问共享对象*

指定共享对象的名字

	application.onConnect = function(client, name) {
		...
		client.writeAccess = "appSO/public/";
	}
	

##### 客户端权限

###### 使用Client对象属性

**检查客户端IP地址**

client.ip，如果需要，可以拒绝客户端连接：

	if (client.ip.indexOf("60.120") !=0) {
		application.rejectConnection(client, {"Access Denied"} );
	}
	
**检查原始URL**	
	
在main.asc中，client.referrer表示拒绝访问的URL列表。确保连接的客户端是来自你期望的地方。

	referrerList = {};
	referrerList["http://www.example.com"] = true;
	referrerList["http://www.abc.com"] = true;
	
	if (!referrerList[client.referrer]) {
		application.rejectConnection(client, {"Access Denied"} );
	}
	
**使用唯一的key**

1.客户端中，创建一个唯一的key：

	var keyDate = String(new Date().getTime());
	var keyNum = String(Math.random());
	var uniqueKey = keyDate + keyNum;

2.发送到服务器：

	nc.connect("rtmp://www.example.com/someApplication", uniqueKey);
	
3.下面的代码在所有的连接中寻找唯一的key。如果key丢失或者已经存在，则拒绝连接。

	application.onConnect = function( pClient, uniqueKey ) {
		if ( uniqueKey != undefined ) { 
        // require a unique key with connection request
			if ( clientKeyList[uniqueKey] == undefined ) {
            // first time -- allow connection
				pClient.uniqueKey = uniqueKey;
				clientKeyList[uniqueKey] = pClient;
				this.acceptConnection(pClient);
			} else {
				trace( "Connection rejected" );
				this.rejectConnection(pClient);
			}
		}
	}
	application.onDisconnect = function( pClient ) {
		delete clientKeyList[pClient.uniqueKey];
	}
	
**使用访问插件**

**使用Flash Player版本**

有两种方法访问这个值：

虚拟的key： 配置服务器重新映射基于Flash播放器客户端的流

Client.agent 服务器端代码：

	application.onConnect = function( pClient ) {
		var platform = pClient.agent.split(" ");
		var versionMajor = platform[1].split(",")[0];
		var versionMinor = platform[1].split(",")[1];
		var versionBuild = platform[1].split(",")[2];
	}
	
	// output example
	// Client.agent: WIN 9,0,45,0
	// platform[0]: "WIN"
	// versionMajor: 9
	// versionMinor: 0
	// versionBuild: 45

**验证连接的swf文件**

在swf文件连接应用之前，你可以配置服务器来验证客户端swf的权限。验证swf的作用是为了防止有人自己创建swf来访问你的资源。

**指定域时，允许或拒绝连接**

如果你知道合法客户端来自的域，则可以使用一个白名单。相反的，你也可以使用黑名单。

在Adaptor.xml文件添加域列表。

也可以在服务器端代码中保存。下面的例子中，文件bannedIPList.txt包含了不需要的IP地址：

	// bannedIPList.txt file contents:
	// 192.168.0.1
	// 128.493.33.0
	
	function getBannedIPList() {
		var bannedIPFile = new File ("bannedIPList.txt") ;
		bannedIPFile.open("text","read");
		application.bannedIPList = bannedIPFile.readAll();
		bannedIPFile.close();
		delete bannedIPFile;
	}
	
	application.onConnect = function(pClient) {
		var isIPOK = true;
		getBannedIPList();
		for (var index=0; index<this.bannedIPList.length; index++) {
			var currentIP = this.bannedIPList[index];
			if (pClient.ip == currentIP) {
				isIPOK = false;
				trace("ip was rejected");
				break;
			}
		}
	
		if (isIPOK) {
			this.acceptConnection(pClient);
		} else {
			this.rejectConnection(pClient);
		}
	
	}
	
此外，你也能检查来自特殊域的请求来的太快：

	application.VERIFY_TIMEOUT_VALUE = 2000;
	Client.prototype.verifyTimeOut = function() {
		trace (">>>> Closing Connection")
		clearInterval(this.$verifyTimeOut);
		application.disconnect(this);
	}
	
	function VerifyClientHandler(pClient) {
		this.onResult = function (pClientRet) {
			// if the client returns the correct key, then clear timer
			if (pClientRet.key == pClient.verifyKey.key) {
				trace("Connection Passed");
				clearInterval(pClient.$verifyTimeOut);
			}
		}
	}
	
	application.onConnect = function(pClient) {
		this.acceptConnection(pClient);
		// create a random key and package within an Object
		pClient.verifyKey = ({key: Math.random()});
		
		// send the key to the client
		pClient.call("verifyClient",
			new VerifyClientHandler(pClient),
			pClient.verifyKey);
			
		// set a wait timer
		pClient.$verifyTimeOut = setInterval(pClient,
			$verifyTimeOut,
			this.VERIFY_TIMEOUT_VALUE,
			pClient);
	}
		
	application.onDisconnect = function(pClient) {
		clearInterval(pClient.$verifyTimeOut);
	}


##### 用户权限

###### 使用额外资源的权限

对于有限的观众来说，这是他们使用数据库等资源的有效的凭证(登录和密码)。

1.swf向连接请求提供要给用户认证。

客户端一般提供账号和密码：

	var sUsername = "someUsername";
	var sPassword = "somePassword";
	nc.connect("rtmp://server/secure1/", sUsername, sPassword);

2.AMS验证凭证。

你可以使用WebService、LoadVars、XML、NetServices等技术来做验证。



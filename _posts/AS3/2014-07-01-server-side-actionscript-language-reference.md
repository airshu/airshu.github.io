---
layout: post
title: "server side actionscript language reference"
description: ""
category: FMS
tags: [fms]
---
{% include JB/setup %}

#### 服务器端ActionScript语言参考手册

##### Adobe媒体服务器服务端的APIs

##### 全局函数
<table>
	<tr>
		<td>函数名</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>clearInterval()</td>
		<td>停止调用setInterval()</td>
	</tr>
    	<tr>
		<td>getGlobal()</td>
		<td>当secure.asc文件装载好后提供全局对象的访问</td>
	</tr>
    	<tr>
		<td>load()</td>
		<td>装载服务器的asc文件到main.asc文件中，方便管理，不然可能会造成main.asc过大</td>
	</tr>
    	<tr>
		<td>protectedObject()</td>
		<td>保护一个对象的方法</td>
	</tr>
    	<tr>
		<td>setAttribute()</td>
		<td>防止某些方法和属性被枚举、修改和删除</td>
	</tr>
    	<tr>
		<td>setInterval()</td>
		<td>指定一个时间间隔调用某方法，直到调用clearInterval()</td>
	</tr>
    	<tr>
		<td>trace()</td>
		<td>计算表达式并显示结果</td>
	</tr>
</table>

**clearInterval()**

停止调用setInterval()方法。

**参数：**

intervalID：setInterval()方法返回的标识符。

**实例：**

	function callback(){trace("interval called");}
    var intervalID;
    intervalID = setInterval(callback, 1000);
    //sometime later
    clearInterval(intervalID);
    
**getGlobal()**

当secure.asc文件装载好后提供全局对象的访问

**详细**

Adobe Media Server有两个脚本执行模式：安全和普通。在安全模式下，只有secure.asc文件被装载和执行(没有其他脚本被装载)。
getGlobal()和protectedObject()函数都只适用于安全模式。这些函数非常强大，因为它们能够完全的访问脚本环境和创建系统对象。
一旦secure.asc被装载，服务器切换到普通脚本执行状态直到应用被卸载。

**实例：**

var global = getGlobal();

**load()**

装载服务器端asc或js文件到main.asc文件。被装载的文件在main.asc文件成功装载后，application.onAppStart()调用之前编译运行。

**参数：**

filename：文件名

**实例：**

load("myLoadfile.asc");

**protectObject()**

保护一个对象的方法。只能在main.asc中使用

**参数：**

object：保护的对象

**详细**


**实例：**
	
    var sysobj = {};
    sysobj._load = load; // Hide the load function
    load = null; // Make it unavailable unpriviliged code.
    sysobj.load = function(fname){
    // User-defined code to validate/modify fname
    return this._load(fname);
    }
    // Grab the global object.
    var global = getGlobal();
    // Now protect sysobj and make it available as
    // "system" globally. Also, set its attributes
    // so that it is read-only and not deletable.
    global["system"] = protectObject(sysobj);
    setAttributes(global, "system", false, true, true);
    // Now add a global load() function for compatibility.
    // Make it read-only and nondeletable.
    global["load"] = function(path){
    return system.load(path);
    }
	setAttributes(global, "load", false, true, true);


**setAttributes(object, propName, enumerable, readonly, permanent)**

**参数：**

object：一个对象

propName:

enumerable:

readonly:

permanent:




**实例：**


**setInterval(function, interval [, p1, ..., pN])**
**setInterval(object.method, interval [, p1, ..., pN])**

**参数：**

function：一个对象

object.method:

[, p1, ..., pN] 


**返回结果**



**实例：**


**trace()**

**参数：**
expression:

	
###### Application

**属性摘要**
<table>
	<tr>
		<td>属性</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>application.allowDebug</td>
		<td>一个布尔值，是否允许管理员使用管理员API approveDebugSession()方法访问应用</td>
	</tr>
    	<tr>
		<td>application.clients</td>
		<td>只读，所有客户端列表</td>
	</tr>
    	<tr>
		<td>application.config</td>
		<td>提供访问Application.xml配置文件的ApplicationObject元素</td>
	</tr>
    	<tr>
		<td>application.hostname</td>
		<td>只读，主机名</td>
	</tr>
    	<tr>
		<td>application.name</td>
		<td>只读，应用实例的名称</td>
	</tr>
    	<tr>
		<td>application.server</td>
		<td>只读，服务器的平台和版本</td>
	</tr>
</table>


**函数摘要**
<table>
	<tr>
		<td>函数</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>application.acceptConnection()</td>
		<td>接收连接</td>
	</tr>
    	<tr>
		<td>application.broadcastMsg()</td>
		<td>广播</td>
	</tr>
    	<tr>
		<td>application.clearSharedObjects()</td>
		<td>删除共享对象</td>
	</tr>
    	<tr>
		<td>application.clearStream()</td>
		<td>清空录制的流文件</td>
	</tr>
    	<tr>
		<td>application.denyPeerLookup()</td>
		<td></td>
	</tr>
    <tr>
		<td>application.disconnect()</td>
		<td>终止客户端连接</td>
	</tr>
	<tr>
		<td>application.gc()</td>
		<td>垃圾回收</td>
	</tr>
	<tr>
		<td>application.getStats()</td>
		<td>返回一个应用的状态</td>
	</tr>
	<tr>
		<td>application.redirectConnection()</td>
		<td></td>
	</tr>
	<tr>
		<td>application.registerClass()</td>
		<td></td>
	</tr>
	<tr>
		<td>application.registerProxy()</td>
		<td></td>
	</tr>
	<tr>
		<td>application.rejectConnection()</td>
		<td>拒绝连接</td>
	</tr>
	<tr>
		<td>application.sendPeerRedirect()</td>
		<td>当一个节点查找一个对象节点，这个函数发送一个地址数组给对象节点</td>
	</tr>
	<tr>
		<td>application.shutdown()</td>
		<td>卸载应用实例</td>
	</tr>
</table>


**事件监听摘要**
<table>
	<tr>
		<td>事件监听器</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>application.onAppStart()</td>
		<td>应用装载时调用</td>
	</tr>
    	<tr>
		<td>application.onAppStop()</td>
		<td>应用卸载时调用</td>
	</tr>
    	<tr>
		<td>application.onConnect()</td>
		<td>客户端调用NetConnection.connect()时被调用</td>
	</tr>
	<tr>
		<td>application.onConnectAccept()</td>
		<td>连接成功后被调用</td>
	</tr>
		<tr>
		<td>application.onConnectReject()</td>
		<td>连接被拒绝时调用</td>
	</tr>
    	<tr>
		<td>application.onDisconnect()</td>
		<td>客户端断开连接时被调用</td>
	</tr>
    <tr>
		<td>application.onPeerLookup()</td>
		<td>服务器接收查找请求是被调用</td>
	</tr>
	    <tr>
		<td>application.onPublish()</td>
		<td>发布流时被调用</td>
	</tr>
	   <tr>
		<td>application.onStatus()</td>
		<td>服务器处理消息出现错误的时候被调用</td>
	</tr>
	   <tr>
		<td>application.onUnpublish()</td>
		<td>当一个客户端停止发布流的时候被调用</td>
	</tr>
</table>






###### ByteArray

服务器端的ByteArray类等于客户端的ByteArray，除了一下几种情况：

下面两个方法在服务器端没有被实现：

- ByteArray.inflate()
- ByteArray.deflate()

ActionScript3.0 ByteArray使用int或uint数据类型时，服务器端使用Number数据类型。


###### Client

**属性摘要**
<table>
	<tr>
		<td>属性</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.agent</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.audioSampleAccess</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.farAddress</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.farID</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.farNonce</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.id</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.ip</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.nearAddress</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.nearID</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.nearNonce</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.pageUrl</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.potentialNearAddresses</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.protocol</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.protocolVersion</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.readAccess</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.referrer</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.reportedAddresses</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.secure</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.uri</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.videoSampleAccess</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.virtualKey</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.writeAccess</td>
		<td>说明</td>
	</tr>
</table>


**函数摘要**
<table>
	<tr>
		<td>Client.call()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.checkBandwidth()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.getbandwidthLimit()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.getStats()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.introducePeer()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.ping()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.remoteMethod()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.__resolve()</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.setBandwidthLimit()</td>
		<td>说明</td>
	</tr>
</table>


**事件摘要**
<table>
	<tr>
		<td>函数</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Client.onFarAddressChange()</td>
		<td></td>
	</tr>
	<tr>
		<td>Client.onGroupLeave</td>
		<td></td>
	</tr>
	<tr>
		<td>Client.onGroupJoin</td>
		<td></td>
	</tr>
	<tr>
		<td>Client.onReportedAddressChange()</td>
		<td></td>
	</tr>
</table>

###### File

###### GroupSpecifier

###### GroupControl

###### LoadVars

###### Log

日志类允许您创建一个日志对象,可以作为一个可选的参数传递给WebService类的构造函数。

**事件监听摘要**

<table>
	<tr>
		<td>事件监听器</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>Log.onLog()</td>
		<td>当日志消息发送时被调用</td>
	</tr>
</table>

**Log 构造器**

new Log([logLevel] [, logName])

**参数**

logLevel： 有以下几种值
<table>
	<tr>
		<td>值</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>Log.BRIEF</td>
		<td>基本的生命周期事件，接收错误错误消息</td>
	</tr>
	<tr>
		<td>Log.VERBOSE</td>
		<td>所有的生命周期事件，接收错误错误消息</td>
	</tr>
	<tr>
		<td>Log.DEBUG</td>
		<td>Metrics and fine-grained events and errors are received</td>
	</tr>
</table>

**logName**

可选参数，用于区分多个日志。

**实例**

newLog = new Log();


**Log.onLog()**

发送消息时调用


###### MulticastStreamInfo

###### MulticastStreamIngest

###### NetConnection

###### NetGroup

###### NetGroupInfo

###### NetGroupReceiveMode

###### NetGroupReplicationStrategy

###### NetGroupSendMode

###### NetGroupSendResult

###### NetStream

###### ProxyStream


###### SharedObject

SharedObject类让你在服务器和多个客户端之间共享储存数据。共享对象可以是临时的，也可以在应用关闭后持久化。
你可以把他看作实时的数据传输设备。

下面的条目描述了在服务器端使用共享对象的方法：

1 保存和共享数据。一个共享对象可以在服务器和其他客户端之间检索。比如，你可以打开一个远程共享对象，比如一个电话列表，它在
服务器上持久化了。无论哪个客户端作出改变，修改后的数据都可以同步到服务器和其他连接的客户端。

2 实时共享数据。

对于理解服务器端共享对象，下面的信息很重要：

- 服务器端函数SharedObject.get()创建远程共享对象，没有创建本地共享对象的方法。本地共享对象保存在内存中，
除非他们是持久的，这种情况才能保存到.sol文件中。

- 保存在服务器端的远程共享对象的文件扩展名为.fso，它们保存在应用的子目录中。客户端的远程共享对象扩展名为.sor也保存在应用的子目录中。

- 服务器共享对象可以是无持久化的(存在于应用实例的时间中)，或持久化(应用关闭后也能储存)。

- 为了创建持久化共享对象，设置SharedObject.get()的persistence参数为true。

3 每一个远程共享对象都被唯一的名字所标识，包含一组名字-值的键值对。就像其他的ActionScript对象。名字必须是唯一的字符串，值可以为任意的ActionScript数据类型。

- SharedObject.getProperty()获取服务器端远程共享对象的属性。SharedObject.setProperty()设置属性。

- SharedObject.clear()清除共享对象；application.clearSharedObjects()删除多个共享对象。

- 服务器端共享对象可以属于当前应用程序实例或另一个应用程序实例。另一个应用程序实例可以在同一台服务器上或在一个不同的服务器上。
属于不同的应用程序实例的共享对象引用被称为代理共享对象。

SharedObject.lock()可以防止其他客户端修改共享对象。SharedObject.mark()发送change事件。

当你得到一个引用代理共享对象,对象的任何更改发送到拥有对象的实例。成功或失败的任何变化是由使用SharedObject.onSync()事件处理程序。


**属性摘要**
<table>
	<tr>
		<td>属性</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>SharedObject.autoCommit</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.isDirty</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.name</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.resyncDepth</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.version</td>
		<td></td>
	</tr>
</table>

**函数摘要**
<table>
	<tr>
		<td>函数</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>SharedObject.clear()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.close()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.commit()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.flush()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.get()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.getProperty()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.getPropertyNames()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.lock()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.mark()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.purge()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.send()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.setProperty()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.size()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.unlock()</td>
		<td></td>
	</tr>
</table>


**事件监听摘要**
<table>
	<tr>
		<td>事件监听器</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>SharedObject.handlerName()</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.onStatus</td>
		<td></td>
	</tr>
	<tr>
		<td>SharedObject.onSync</td>
		<td></td>
	</tr>
</table>


###### SHA256


###### SOAPCall


###### SOAPFault


###### Stream




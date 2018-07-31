---
layout: post
title: "building peer assisted networking applications"
description: ""
category: AS3
tags: [fms]
---


#### 构建对等的网络应用

##### RTMFP

Flash Player10和AIR1.5支持实时媒体流协议(RTMFP)。RTMFP是建立在UDP协议上的。RTMP是建立在TCP协议上的。UDP提供了更低的延迟。
它能够在两个客户端之间直接传输。

RTMFP提供了以下特征：NAT/firewall traversal, congestion control 和 prioritization， IP地址， mobility， partial reliability。

RTMFP使用了128位加密传输。为了播放RTMFP的流，客户端必须知道发布者的节点ID。节点ID是一个256位的发布者标识符。

[Best practices for real-time collaboration using Adobe Media Server](http://www.adobe.com/devnet/adobe-media-server/articles/real-time-collaboration.html)


###### 关于节点ID

每个客户端都有一个节点ID。

NetConnection.nearID为客户端节点ID，NetConnection.farID为服务器节点ID。

同理在服务器中，client.nearID为服务器节点ID，client.farID为客户端节点ID。

NetConnection.nearID和client.farID值一样，NetConnection.farID和client.nearID值一样。

服务器端还有NetConnection.nearID和NetConnection.farID属性，包含了RTMFP连接的所有节点ID。


######  RTMFP上的单一传播，广播，多点发布

虽然RTMFP经常在对等网络应用中使用，你也可以使用RTMFP在单一传播、广播、多点发布上。简单的替换RTMP协议即可：

	netconnection.connect("rtmfp://fms.exmaple.com/vod");
	
为了在多点发布中使用RTMFP，创建一个服务器端的NetConnection，使用RTMFP URL连接目标服务器。


##### RTMFP 组

**Peer** 节点，组的成员，也叫"node"。一个节点就是一个Flash Player或AIR客户端。

**Group** 1个或多个RTMFP节点组成的集合。

**Bootstrapping** 为了加入组，连接至少一个组成员。你可以写应用逻辑来使得要给客户端加入一个组，或者可以请求AMS自动引导客户端。

组里的节点可以不经过服务器进行数据传输。节点可以共享数据。

使用ActionScript3 GroupSpecifier类来定义组的"groupspec"。传递给NetGroup和NetStream的构造函数。使用NetGroup类管理组和发送ActionScript对象。使用
NetStream类来多播音频和视频。

Groupspecs字符串以"G:"开头，后面接着一串十六进制的数字。


###### 创建一个组

1. 连接AMS
	NetConnection.connect("rtmfp://fms.exmaple.com/p2pexample/test1");
	
注意：如果Adaptor.xml文件将RTMFP禁用了，客户端会接收"NetConnection.Connect.Failed"状态。	
	
2. 在"NetConnection.Connect.Success"中，使用GroupSpecifier类来额创建一个groupspec

	// Called in the "NetConnection.Connect.Success" case in the NetStatusEvent handler.
	private function OnConnect():void{
		connected = true;
		// Create a GroupSpecifier object to pass to the NetGroup constructor.
		// The GroupSpecifier determines the properties of the group
		var groupSpecifier:GroupSpecifier;
		groupSpecifier = new GroupSpecifier("com.example.p2papp");
		groupSpecifier.postingEnabled = true;
		groupSpecifier.multicastEnabled = true;
		// The serverChannel lets the server do auto-bootstrapping
		groupSpecifier.serverChannelEnabled = true;
		netGroup = new NetGroup(netConnection, groupSpecifier.groupspecWithAuthorizations());
		netGroup.addEventListener(NetStatusEvent.NET_STATUS, NetStatusHandler);
	}

3. 在"NetGroup.Connect.Success"中，你可以手动或自动引导节点。


###### 向组里引导一个节点

连接到服务器后，一个节点必须被加入到一个组里，这个技术叫做"bootstrapping"。Bootstrapping允许同一个组的成员互相可见。

为了加入一个组，客户端必须知道组定义的GroupSpecifier。如果两个客户端使用相同的GroupSpecifier，但从不联系，则他们在不同的组。如果两个组有联系，
那他们会合并为一个大组。

每一个客户端都有一个节点ID。客户端和服务器端都可以访问节点ID。

RTMFP中的节点可以使用以下的方法进行引导：

* 服务器自动引导。

当客户端进行RTMFP连接时，服务器使用相同的NetGroup引导他们。客户端需要设置：
	
	GroupSpecifier.serverChannelEnabled为true。
	
* 手动引导

	调用NetGroup.addNeighbor()方法。
	
* LAN节点发现

使用GroupSpecifier类可以激活局域网节点发现。局域网节点发现允许ERMFP NetConnection和NetStream、NetGroup对象自动定位节点和加入组的子组。
下面的代码展示了如果激活LAN节点发现：

	var nc = new NetConnection();
	// Protocol must be RTMFP
	nc.connect("rtmfp://fms.example.com/appname/appinstance");
	var gs = new GroupSpecifier("com.example.discovery-test");
	// Must be enabled for LAN peer discovery to work
	gs.ipMulticastMemberUpdatesEnabled = true;
	// Multicast address over which to exchange peer discovery.
	gs.addIPMulticastAddress("224.0.0.255:30000");
	// Additional GroupSpecifier configuration...
	var ns = new NetStream(nc, gs.toString());	



###### 服务端的RTMFP组

使用服务器端的ActionScript来创建一个RTMFP连接。一个服务器端的netConnection是一个虚拟的Flash客户端。它有自己的RTMFP栈。

注意：服务器端的ActionScript不支持直接在节点之间创建连接。


###### Flash Player 对等节点网络应用安全对话框
当groupsec传递给了NetStream或NetGroup。Flash Player会显示一个"对等互助网络"对话框。该对话框询问用户是否可以使用它们的连接在节点之间共享数据。

如果用户点击允许，对话框就不会在出现。如果用户不允许，所有节点特征将不能使用。你可以使用RTMFP订阅一个纯净的本地IP多播流，这种情况下，对话框不会出现。

当使用IP多播时(没有对等网络的功能)，你可以禁用安全对话框，设置GroupSpecifier.peerToPeerDisabled属性为true。默认为false。


###### 关于RRMFP组的ActionScript类

使用下面的ActionScript类和服务器端ActionScript类来创建RTMFP应用：

* NetConnection

* GroupSpecifier

* NetGroup：管理RTMFP组。该类属性提供了组成员的信息

* NetGroupInfo：指定传输质量。

* NetStream：

* NetStreamMulticastInfo：NetStream.multicastinfo 返回当前Qos状态的NetStreamMulticastInfo对象。

###### 向组里发送一个消息

调用NetGroup.post()方法广播一个ActionScript消息。使用"NetGroup.Posting.Notify"接收。

这个方法类似于服务器端的Application.broadcastMsg()。

* GroupSpecifier.postingEnabled属性必须为true。

* 接收NetGroup.Neighbor.Connect事件早于你调用post()

* 消息使用AMF序列化。一个消息可以是任何形式的AMF对象。不能是MovieClip。

* 消息传输是无序的。

* post()方法返回一个消息ID或null或error。

* post()方法发送一个NetStatusEvent事件"NetGroup.Posting.Notify"

实例：

	private function OnConnect():void{
		StatusMessage("Connected\n");
		connected = true;
		// Create a GroupSpecifier object to pass to the NetGroup constructor.
		// The GroupSpecifier determines the properties of the group
		var groupSpecifier:GroupSpecifier;
		groupSpecifier = new GroupSpecifier("com.aslrexample/" + groupNameText.text);
		groupSpecifier.postingEnabled = true;
		groupSpecifier.serverChannelEnabled = true;
		netGroup = new NetGroup(netConnection, groupSpecifier.groupspecWithAuthorizations());
		netGroup.addEventListener(NetStatusEvent.NET_STATUS, NetStatusHandler);
		StatusMessage("Join \"" + groupSpecifier.groupspecWithAuthorizations() + "\"\n");
	}
	// Called when you the chatText field has focus and you press Enter.
	private function DoPost(e:ComponentEvent):void{
		if(joinedGroup){
			// Build the message to post.
			var message:Object = new Object;
			message.user = userNameText.text;
			message.text = chatText.text;
			message.sequence = sequenceNumber++;
			message.sender = netConnection.nearID;
			// Post the message to the group.
			netGroup.post(message);
			StatusMessage("==> " + chatText.text + "\n")
		} else {
			StatusMessage("Click Connect before sending a chat message");
		}
		ClearChatText();
	}

###### 直接向某个节点发送消息

客户端能直接向组里的一个节点发送消息而不经过服务器。这个特征叫做directed routing。

下面是服务器端directed routing API：

* Netgroup.sendToAllNeighbors()

* NetGroup.sendToNearest()

* NetGroup.sendToNeighbor()

* NetGroup.sendToAllNeighbors()

* NetGroup.sendToNearest()

* NetGroup.sendToNeighbor()

###### 在组里复制一个对象

客户端可以在组里发送ActionScript对象。这个特征叫做object replication(对象复制)。使用该特征可以复制工作空间，创建白板，传输文件，同步节点操作等。

使用以下客户端API：

* NetGroup.addHaveObjects()

* NetGroup.addWantObjects()

* NetGroup.denyRequestedObject()

* NetGroup.removeHaveObjects()

* NetGroup.removeWantObjects()

* NetGroup.writeRequestedObject()

使用以下服务器端API：

* ByteArray 类

* File.readBytes()

* File.writeBytes()


###### 多播

多播是向一个组里的多用户分配视频和音频。服务器不向客户端发送数据。多播允许部分发布者发送大量的数据。为了多播媒体，向NetStream构造器传递groupspec。对多播数据调用NetStream.publish()
或NetStream.play()。

AMS支持应用级别的多播和IP多播。你可以对一个流同时使用应用多播和IP多播，这种情况叫做multicast fusion(多播融合)。

关于多播，需要理解的地方：

* 任何数量的流都可以在组内被发布。However, this practice is not recommended because each group member consumes and relays all streams, even if the streams aren’t playing at that specific client

* 同名的流可以在组内被发布。

* 发布者可以调用NetStream.send()来向组里注入数据。

* When a client is in an RTMFP group in which a live multicast stream is playing, the client may act as a relay point for that stream to some number of direct neighbors. To control this number, use the
NetStream.multicastPushNeighborLimit
property. The default value is to 4. All the peers within a group work
co-operatively to get the stream to each other. Each client is not pulling the stream from the server independently. For this reason, consider the expected average client uplink capacity when selecting the bitrate for the multicast stream you publish. Choosing a bitrate that's too high may result in peers not being able to relay the stream smoothly.


**应用级别多播**

By default, the peer-to-peer mesh distributes streams published into an RTMFP group

**IP 多播**

IP多播使用路由器发送数据到指定的IP地址。

为了发布流到IP多播地址，在发布前调用服务器端方法：
	
	NetStream.setIPMulticastPublishAddress()
	
所有的订阅节点必须添加IP多播地址。GroupSpecifier.addIPMulticastAddress()

默认情况下，应用级别多播和IP多播是并行的。这个技术叫做"fusion multicast"。为了运行IP多播而不用应用级别多播，设置以下属性：

	GroupSpecifier.peerToPeerDisabled=true
	 
	//关闭点对点多播
	GroupSpecifier.multicastEnabled=true 
	
	调用GroupSpecifier.addIPMulticastAddress()
	
====================================================================
**Source-specific IP multicast**

	
**创建客户端无服务器的RTMFP连接**

**融合多播**

**检查多播服务的质量**

**Prevent the server from unloading an application**



**Ingest, convert, and record a multicast stream**

###### 对等网络应用实例


##### Distribute peer introductions across servers
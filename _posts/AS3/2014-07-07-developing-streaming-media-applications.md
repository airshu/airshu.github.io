---
layout: post
title: "developing streaming media applications"
description: ""
category: AS3
tags: [fms]
---

#### 开发流媒体应用

##### 连接服务器

##### 管理连接

##### 流媒体文件

##### 检查视频文件

##### 处理错误

##### 使用播放列表

##### 动态流

#####  当连接断掉时重连流

###### 重连ActionScript API

- NetStream.attach(connection:NetConnection)

- NetStreamPlayTransitions.RESUME

- NetStreamPlayTransitions.APPEND_AND_WAIT

- NetConnection.Connect.Closed

使用这个事件来重连流

- NetConnection.Connect.NetworkChange

通知客户端网络连接改变了。


###### 使用ActionScript API重连流

当NetConnection由于网络改变关闭，流会使用存在的缓存播放一会。同时，客户端代码重连服务器来恢复播放流。

**重连单一流**

1. 调用NetConnection.call()连接服务器A

2. 创建一个NetStream。设置NetStream.bufferTime使得其有足够的数据在连接断开后播放一会儿。

3. 调用NetStream.play2()，使用NetStreamPlayTransitions.RESET来播放"myStream"。

4. 监听NetConnection的"NetConnection.Connect.Closed"事件，如果流断掉了则重连服务器。

5. 调用NetStream.attach(connection:NetConnection)函数使NetStream附加到新的连接上。

6. 调用NetStream.play2()，使用NetStreamPlayTransitions.RESUME来播放"myStream"。

7. 如果你想重连的话，不要调用NetConnection.close()或NetStream.close()。


**重连播放列表**


**服务器负载均衡**

1. 调用NetStream.attch(connection:NetConnection)来连接其他的服务器

2. 成功连接后，调用以前连接上的NetConnection.close()，防止数据泄露。

3. 调用 NetStream.play2() 并设置 NetStreamPlayOptions.transition 的值以执行恢复。将其余的 NetStreamPlayOptions 属性设置为最初调用 NetStream.play() 或 NetStream.play2() 时使用的值以启动流。


**监控网络接口改变**

**监控移动设备上的连接**

**监控RTMPS或RTMPT连接**


###### 授权插件事件和属性

###### 服务器日志

下面的事件在流重连时会写入AMS日志文件中：
<table>
	<tr>
		<td>事件</td>
		<td>目录</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>connect</td>
		<td>session</td>
		<td>重新建立连接后</td>
	</tr>
	<tr>
		<td>play</td>
		<td>stream</td>
		<td>流恢复播放</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>stream</td>
		<td>流停止播放</td>
	</tr>
</table>



##### 快速切换流

##### 快速搜索

##### 检测带宽

###### ActionScript3.0 本地带宽检测

NetConnect.call("checkBandWidth", null);

Application.xml允许带宽检测

	<BandwidthDetection enabled="true">
	<MaxRate>-1</MaxRate>
	<DataSize>16384</DataSize>
	<MaxWait>2</MaxWait>
	</BandwidthDetection>

监听事件，必须实现onBWCheck和onBWDone两个函数：

	class Client {
		public function onBWCheck(... rest):Number {
			return 0;
		}
		public function onBWDone(... rest):void {
			var bandwidthTotal:Number;
			if (rest.length > 0){
				bandwidthTotal = rest[0];
				// This code runs
				// when the bandwidth check is complete.
				trace("bandwidth = " + bandwidthTotal + " Kbps.");
			}
		}
	}
	
onBWCheck()函数是必须的。该函数返回一个值，即使是0，也表明告诉服务器客户端接收到了数据，你可以调用onBWCheck()了。

服务器会在检测带宽之后调用onBWDone()函数。它有四个参数。第一个表示带宽(Kbps)。第二个、第三个还没用到，第四个表示延迟


###### 服务器端初始化带宽检测

	application.onConnect = function (clientObj){
		this.acceptConnection(clientObj);
		clientObj.checkBandwidth();
	}

不需要在客户端手动调用checkBandwidth()函数


**在应用级别禁用带宽检测**

- 修改配置文件rootinstall/applications/applicationname/Application.xml
	
	<Application>
		<Client>
			<BandwidthDetection enabled="false">
			</BandwidthDetection>
		</Client>
	</Application>

- 修改rootinstall/conf/_defaultRoot/_defaultVHost/Application.xml

	<Application>
		...
		<Client>
			...
			<BandwidthDetection enabled="false">
			</BandwidthDetection>
			...
		</Client>
		...
	</Application>


##### 检测流长度
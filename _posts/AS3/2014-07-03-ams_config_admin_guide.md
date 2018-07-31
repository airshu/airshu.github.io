---
layout: post
title: "ams_config_admin_guide"
description: ""
category: AS3
tags: [fms]
---


#### Adobe Media Server Configuration and Administration Guide

##### 第一章、部署服务器

###### 配置端口

Adobe Media Server默认端口为1935和80.Adobe Media 管理员服务器端口为1111。

**端口要求**
<table>
	<tr>
		<td>端口号</td>
		<td>协议</td>
		<td>传输</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>1935</td>
		<td>TRMP/E</td>
		<td>TCP</td>
		<td>默认</td>
	</tr>
	<tr>
		<td>1935</td>
		<td>RTMFP</td>
		<td>UDP</td>
		<td>默认</td>
	</tr>
	<tr>
		<td>80</td>
		<td>RTMP/E,RTMTP,HTTP</td>
		<td>TCP</td>
		<td></td>
	</tr>
	<tr>
		<td>19350-65535</td>
		<td>RTMFP</td>
		<td>UDP</td>
		<td>
		默认情况，客户端使用RTMFP协议，在1935和19350-65535端口上连接AMS。
		
		</td>
	</tr>
	<tr>
		<td>8134</td>
		<td>HTTP</td>
		<td>TCP</td>
		<td></td>
	</tr>
	<tr>
		<td>1111</td>
		<td>RTMP,HTTP</td>
		<td>TCP</td>
		<td>默认情况下，Flash Player，HTML客户端连接AMS管理员服务器的端口。</td>
	</tr>
	<tr>
		<td>443</td>
		<td>RTMPS</td>
		<td>TCP</td>
		<td></td>
	</tr>
</table>

**配置IP地址和端口**

1、打开rootinstall/conf/ams.ini。

2、编辑ADAPTOR.HOSTPORT参数，默认值为：

	ADAPTOR.HOSTPORT = :1935, 80
	
3、保存文件重启服务器。

Adaptor.xml配置文件中Adaptor/HostPortList/HostPort标签中使用ADAPTOR.HOSTPORT参数：

	<HostPort name="edge1" ctl_channel="localhost:19350"
	rtmfp="${ADAPTOR.HOSTPORT}">${ADAPTOR.HOSTPORT}</HostPort>


###### 为RTMFP配置IP地址和端口

**RTMFP连接流**

1、RTMFP客户端在1935端口上连接AMS服务器进行UDP传输。

重要：RTMFP和RTMP/E 客户端使用同样的端口连接AMS。但，RTMFP使用UDP，RTMP/E使用TCP。

2、The amsedge process redirects the connection to an amscore process listening on a UDP port in the range 19350-65535

每一个amscore进程有自己的RTMFP监听器。每一个RTMFP监听器绑定一个UDP端口。当amscore进程开始时，监听器绑定一下可用的UDP端口(Adaptor.xml中Adaptor/RTMFP/Core?hostPortList/HostPort标签指定)。
使用的端口的数量取决于amscore进程使用的数量。amscore进程使用的数量取决于应用程序实例是如何分布的。

**配置RTMFP重定向端口**

1、打开rootinstall/conf/_defaultRoot_/Adaptor.xml文件

2、编辑HostPort标签，默认情况为：

	<Adaptor>
		...
		<RTMFP>
		...
			<Core>
				<HostPortList>
					<HostPort>:19350-65535</HostPort>
				</HostPortList>
			</Core>
		</RTMFP>
	</Adaptor>
	
3、If the RTMFP adaptor is behind a NAT, specify the in-front-of-NAT IP address that clients connect to in the public attribute of the HostPort element. The following example uses 12.34.56.78 for the in-front-of-NAT IP address:
	
	<HostPort public="12.34.56.78:19350-65535">:19350-65535</HostPort>
	
4、保存文件。


**关于HostPort**

HostPort标签的值为以下格式：
	
	<value-of-HostPort> := [<host-port-range> [; <host-port-range> [; ... ] ] ]
	<host-port-range> := [<host>][:<port-range>[, <port-range> ] ]
	<port-range> := <start-port>[ - <end-port> ]
	
下面的例子中，每一个监听器有两个端口集合：一个端口来自host1:2000-2010或host2:3000-3010，一个来自host2:5000或host2:2010-4000。


**配置服务器在NAT后的公共的IP地址**

如果RTMFP适配器在NAT之后，指定客户端连接的HostPort标签public属性来设置in-front-of-NAT IP地址。

	<HostPort public="<in-front-of-NAT-server-IP>:19350-65535">:19350-65535</HostPort>
	
如果你不指定public属性，服务器不会知道in-front-of-NAT 地址。amdedge进程会重定向客户端到正确的端口，但它会告诉客户端behind-NAT地址，这个地址客户端不能接触。

Each HostPort element can specify a public address that corresponds to the specified port. This is the address that is advertised to clients for the given HostPort. To advertise an address, specify a value for the public attribute of the HostPort element. The public attribute has the same format as the HostPort element. The number of ports specified by the public attribute must equal the number of ports specified by the HostPort element. If the core listens on the n-th port of the HostPort value, the n-th port of the public attribute is advertised as its value.

例子中HostPortList使用public属性，如果核心监听器在host1:1005，它的公共广告地址在host2:4005。


**NAT和防火墙穿越**

NAT(网络地址转换)和防火墙过滤可以阻止点对点的连接。在内部网应用程序中,您为了对整个网络进行控制,执行以下操作以确保客户可以创建点对点连接:

- 允许在任何防火墙进行UDP通讯
- 使用IFTF BEHAVE工作组推荐的NAT或防火墙
- Use the TURN proxy support in Flash Player to send traffic to a proxy in a DMZ that can comply with the previous recommendations. 
See [Best practices for real-time collaboration using Adobe Media Server.](http://www.adobe.com/devnet/adobe-media-server/articles/real-time-collaboration.html)

In an Internet application, the application developer must choose how to handle cases in which a firewall or NAT blocks a direct peer-to-peer connection. To create an application that works for connections that aren’t peer-to-peer, create a protocol fallback to client-server RTMP and/or RTMPT. To create an application that never relays media through the server (even though some clients may not see the media), don’t create a protocol fallback

**理解NAT的类型**

**Cone**	当想所有节点说话时重用同样的地址和端口

多 IP地址，对称的	向一个新节点说话时，使用新地址和端口

单一 IP地址，对称的	向一个新节点说话时，使用相同的地址和端口

理解NAT和防火墙的过滤行为很重要：

None	没有过滤功能的叫"full cone"

Address-restricted	节点限制在已经使用过的地址

Address and port-restricted	节点限制在已经使用过的地址和端口

In addition, some NAT and firewall behaviors aren't easily defined. For example, a NAT could act as a symmetric NAT that preserves port numbers. When it runs out of resources, it could switch and act as a cone NAT.

In another example, a NAT could act as one type of NAT for the first client that connected to a server. It could act as a different type of NAT for the second client that tried to connect to the same server. In this case, a simple analysis can fail to predict whether a client can make a peer-to-peer connection.


**RTMFP连接检查**

RTMFP发明家马修·考夫曼主持一个名为RTMFP连通性检查程序的网站http://cc.rtmfp.net/。使用这个网站,尝试确定一个客户机在一个特定的网络可以创建一个点对点连接。


**为HTTP流配置端口**


###### 负载平衡

**部署服务器集群的工作流**

** **

**点对点网络应用的负载均衡**


###### 部署边缘服务器

**部署边缘服务器的工作流**

**设置边缘服务器的缓存**

**连接到一个边缘服务器**



###### 部署64位服务器



##### 第二章、配置服务器

###### 配置服务器虚拟映射

###### 使用配置文件

###### 配置性能特性

###### 配置安全特性

###### 执行常规配置任务

###### 配置内容存储

###### 配置Apache HTTP服务器

###### 为Adobe HTTP动态流和Apple HTTP 实时流配置Apache

###### 配置HTTP流失效备援

###### 使用第三方的web服务器

###### 配置差分服务(DiffServ)



##### 第三章、使用管理员控制台

###### 连接管理员控制台

###### 检查应用

###### 管理管理员

###### 管理服务器


##### 第四章、监控和管理日志文件

###### 使用日志文件

###### 访问日志

###### 应用日志

###### 诊断日志


##### 第五章、管理服务器

###### 开始和停止服务器

###### 检查服务器状态

###### 检查视频文件

###### 在Linux上管理服务器

######  Scramble tool


##### 第六章、使用管理员API

###### 使用管理员API工作 


##### 第七章、XML配置文件参考

###### 配置文件的版本从4.5到5.0.1发生的改变

###### 配置文件的版本从4.0到4.5发生的改变

###### Adaptor.xml文件

###### Application.xml文件

###### Logger.xml文件

###### Server.xml文件

###### Users.xml文件

###### VHost.xml文件


##### 第八章、诊断日志消息

###### 诊断日志的消息ID 


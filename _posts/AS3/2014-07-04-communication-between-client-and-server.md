---
layout: post
title: "communication between client and server"
description: ""
category: FMS
tags: [fms]
---
{% include JB/setup %}



#### 一、客户端呼叫服务器

**服务器main.asc代码：**

	Client.prototype.serverFun1 = function(value)
	{
		return "value=" +value;
    }

**客户端代码：**

<?xml version="1.0" encoding="utf-8"?>
<mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" 
    fontSize="12" creationComplete="init()">
    
    <mx:Script>
        <![CDATA[    
        import mx.controls.Alert;
    
        private var netConnection:NetConnection;
        private var responder:Responder;
        private var appServer:String="rtmp://127.0.0.1/TestCode1";
            
        private function init():void
        {
            netConnection = new NetConnection();
            netConnection.connect(appServer);
            netConnection.client=this;
        }
        
        private function onClick(evt:MouseEvent):void
        {
            responder = new Responder(OkFun,ErrorFun);
            netConnection.call("serverFun1",responder,"va");
        }
            
        private function OkFun(re:String):void
        {
            Alert.show(re);
        }
        
        private function ErrorFun(info:Object):void
        {
            Alert.show( "error: " + info.description );
            Alert.show( "error: " + info.code );
        }
        
        ]]>
    </mx:Script>
    <mx:Button x="43" y="65" label="调用服务器" id="btn" click="onClick(event)"/>
</mx:Application>

**代码说明：**

Responder 类提供了一个对象，该对象是NetConnection.call()中回调函数。

NetConnection.call的参数分别表示：服务器端方法名、处理服务器的返回值函数(可选对象)、传递给服务器的参数



#### 二、服务器端呼叫指定的客户端

**服务器main.asc代码：**

	var handlerObject = function() {};
  
	handlerObject.prototype.onResult = function( result )
    {
		trace( result );
    };
  
    handlerObject.prototype.onStatus = function( info )
    {
		trace( "error: " + info.description );
        trace( "error: " + info.code );
    };
  
    application.onConnect = function( client )
    {
    	this.acceptConnection( client );
    	var msg = "Hello client, your IP is: " + client.ip;
    	client.call( "asyncServerCall", new handlerObject, msg );
    };
  
  

**客户端代码：**

<?xml version="1.0" encoding="utf-8"?>
<mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" 
    fontSize="12" creationComplete="init()">

<mx:Script>
    <![CDATA[
        import mx.controls.Alert;
        
        private var netConnection:NetConnection;
        private var appServer:String="rtmp://192.168.0.249/TestCode1";
            
        private function init():void
        {
            netConnection = new NetConnection();
            netConnection.connect(appServer);
            netConnection.client=this;
        }
    
        public function asyncServerCall( msg:String ) : String 
           {
               Alert.show( msg );
               return "I got your message Thanks Server!";
           }

    ]]>
</mx:Script>
    
</mx:Application>

**代码说明：**

Client.call(methodName, [resultObj, [p1, ..., pN]]) 在Flash客户机上异步的执行一个方法，并把值从Flash客户机返回到服务器。

**参数：**

resultObj：客户端的方法名

[resultObj, [p1, ..., pN]]： 当发送者期待一个来自客户机的返回值时需要这个参数。如果参数被传递但没有返回值被期待的话，则传递值null。结果对象可以是你定义的任何对象，并且，为了有用起见，这个结果对象应该有两个方法-onResult和onStatus，这些方法会在结果到达时被调用。如果远端方法的调用是成功的，则resultObj.onResult会被调用；否则，resultObj.onStatus被触发。


#### 三、服务端呼叫所有客户端(广播)

**服务器main.asc代码：**

    application.onConnect = function(currentClient)
    {
        application.acceptConnection(currentClient);
        application.broadcastMsg("showServerMsg",application.clients.length );
    }

**客户端代码：**

<?xml version="1.0" encoding="utf-8"?>
<mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute"
 fontSize="12" creationComplete="init()">
    
    <mx:Script>
        <![CDATA[
            
        import mx.controls.Alert;
        
        private var netConnection:NetConnection;
        private var appServer:String="rtmp://192.168.0.249/TestCode1";
        
        private function init():void
        {
            netConnection = new NetConnection();
            netConnection.connect(appServer);
            netConnection.client=this;
        }
        
        public function showServerMsg( n:Number ) :void
           {
               var msg:String ="已经有"+n.toString()+"位用户连接";
               Alert.show( msg );
           }
                
        ]]>
    </mx:Script>
    
</mx:Application>

**代码说明：**

Application.broadcastMsg()：把一条消息广播到所有连接的客户机，给每个客户机广播。
这个方法相当于遍历Application.clients数组并在每一个独立的客户机上调用Client.call()，但这个方法的效率更高。唯一不同的是当你调用broadcastMsg()时你不能指定一个响应对象。

	 //遍历客户端列表，分别call他们
    for(var i=0;i<application.clients.length;i++) {
     application.clients[i].call("showServerMsg"，application.clients.length);
    }


#### 四、服务器端呼叫服务器端
NetConnection.call(methodName, [resultObj, p1, ..., pN])

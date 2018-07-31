---
layout: post
title: "load的缓存"
description: ""
category: ActionScript
tags: [actionscript]
---

有时候，在使用URLLoader装载资源的时候，会发现装载不到最新的资源。可以使用以下代码测试：

	call();
	
	private function call():void
	{
		if(urlLoader)
		{
			urlLoader.load(urlRequest); 
			return;
		}
		urlLoader = new URLLoader();                  
		urlRequest = new URLRequest(_url);  
		
		urlLoader.load(urlRequest);  
		
		urlLoader.addEventListener(Event.COMPLETE, urlLoaderCompleteHandler);
	}

	private function urlLoaderCompleteHandler(event:Event):void
	{
		setTimeout(call, 2000);
	}

用charles或相关工具监听请求，你会发现，只会发一次请求。这说明第二次就使用了缓存。

为了解决该问题，只需要在url后添加一个参数，使得URL的地址每次都是唯一的即可。

	urlRequest = new URLRequest(_url + "?t=" + (new Date()).time);  
	

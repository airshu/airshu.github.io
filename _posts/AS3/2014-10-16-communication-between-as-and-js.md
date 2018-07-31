---
layout: post
title: "ActionScript和JavaScript之间的通讯"
description: ""
category: ACTIONSCRIPT
tags: [actionscript]
---
{% include JB/setup %}


ActionScript和JavaScript间的通讯主要是对ExternalInterface的使用，在这个类中有两个关键的函数：

**addCallback**

将 ActionScript 方法注册为可从容器调用。成功调用 addCallBack() 后，容器中的 JavaScript 或 ActiveX 代码可以调用在 Flash Player 中注册的函数。 

**call**

调用由 Flash Player 容器公开的函数，不传递参数或传递多个参数。如果该函数不可用，调用将返回 null；否则，它返回由该函数提供的值。不允许在 Opera 或 Netscape 浏览器中使用递归；在这些浏览器上，递归调用将生成 null 响应。（Internet Explorer 和 Firefox 浏览器上支持递归。）。如果该容器是 HTML 页，则此方法在 script 元素中调用 JavaScript 函数。如果该容器是某个其它 ActiveX 容器，此方法将使用指定的名称调度 FlashCall ActiveX 事件，并且该容器将处理该事件。如果该容器承载 Netscape 插件，您可以写入对新 NPRuntime 接口的自定义支持或嵌入 HTML 控件以及在 HTML 控件内嵌入 Flash Player。如果嵌入 HTML 控件，则可以通过本机容器应用程序的 JavaScript 接口与 Flash Player 进行通信。


**参考例子**


	package {
		import flash.display.Sprite;
		import flash.events.*;
		import flash.external.ExternalInterface;
		import flash.text.TextField;
		import flash.utils.Timer;
		import flash.text.TextFieldType;
		import flash.text.TextFieldAutoSize;

		public class ExternalInterfaceExample extends Sprite {
			private var input:TextField;
			private var output:TextField;
			private var sendBtn:Sprite;

			public function ExternalInterfaceExample() {
				input = new TextField();
				input.type = TextFieldType.INPUT;
				input.background = true;
				input.border = true;
				input.width = 350;
				input.height = 18;
				addChild(input);

				sendBtn = new Sprite();
				sendBtn.mouseEnabled = true;
				sendBtn.x = input.width + 10;
				sendBtn.graphics.beginFill(0xCCCCCC);
				sendBtn.graphics.drawRoundRect(0, 0, 80, 18, 10, 10);
				sendBtn.graphics.endFill();
				sendBtn.addEventListener(MouseEvent.CLICK, clickHandler);
				addChild(sendBtn);

				output = new TextField();
				output.y = 25;
				output.width = 450;
				output.height = 325;
				output.multiline = true;
				output.wordWrap = true;
				output.border = true;
				output.text = "Initializing...\n";
				addChild(output);

				if (ExternalInterface.available) {
					try {
						output.appendText("Adding callback...\n");
						ExternalInterface.addCallback("sendToActionScript", receivedFromJavaScript);
						if (checkJavaScriptReady()) {
							output.appendText("JavaScript is ready.\n");
						} else {
							output.appendText("JavaScript is not ready, creating timer.\n");
							var readyTimer:Timer = new Timer(100, 0);
							readyTimer.addEventListener(TimerEvent.TIMER, timerHandler);
							readyTimer.start();
						}
					} catch (error:SecurityError) {
						output.appendText("A SecurityError occurred: " + error.message + "\n");
					} catch (error:Error) {
						output.appendText("An Error occurred: " + error.message + "\n");
					}
				} else {
					output.appendText("External interface is not available for this container.");
				}
			}
			private function receivedFromJavaScript(value:String):void {
				output.appendText("JavaScript says: " + value + "\n");
			}
			private function checkJavaScriptReady():Boolean {
				var isReady:Boolean = ExternalInterface.call("isReady");
				return isReady;
			}
			private function timerHandler(event:TimerEvent):void {
				output.appendText("Checking JavaScript status...\n");
				var isReady:Boolean = checkJavaScriptReady();
				if (isReady) {
					output.appendText("JavaScript is ready.\n");
					Timer(event.target).stop();
				}
			}
			private function clickHandler(event:MouseEvent):void {
				if (ExternalInterface.available) {
					ExternalInterface.call("sendToJavaScript", input.text);
				}
			}
		}
	}

	
html页面


	<!-- saved from url=(0014)about:internet -->
	<html lang="en">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>ExternalInterfaceExample</title>
	<script language="JavaScript">
	 var jsReady = false;
	 function isReady() {
		 return jsReady;
	 }
	 function pageInit() {
		 jsReady = true;
		 document.forms["form1"].output.value += "\n" + "JavaScript is ready.\n";
	 }
	 function thisMovie(movieName) {
		 if (navigator.appName.indexOf("Microsoft") != -1) {
			 return window[movieName];
		 } else {
			 return document[movieName];
		 }
	 }
	 function sendToActionScript(value) {
		 thisMovie("ExternalInterfaceExample").sendToActionScript(value);
	 }
	 function sendToJavaScript(value) {
		 document.forms["form1"].output.value += "ActionScript says: " + value + "\n";
	 }
	</script>
	</head>
	<body onload="pageInit();">

	 <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
			 id="ExternalInterfaceExample" width="500" height="375"
			 codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">
		 <param name="movie" value="ExternalInterfaceExample.swf" />
		 <param name="quality" value="high" />
		 <param name="bgcolor" value="#869ca7" />
		 <param name="allowScriptAccess" value="sameDomain" />
		 <embed src="ExternalInterfaceExample.swf" quality="high" bgcolor="#869ca7"
			 width="500" height="375" name="ExternalInterfaceExample" align="middle"
			 play="true" loop="false" quality="high" allowScriptAccess="sameDomain"
			 type="application/x-shockwave-flash"
			 pluginspage="http://www.macromedia.com/go/getflashplayer">
		 </embed>
	 </object>

	 <form name="form1" onsubmit="return false;">
		 <input type="text" name="input" value="" />
		 <input type="button" value="Send" onclick="sendToActionScript(this.form.input.value);" /><br />
		 <textarea cols="60" rows="20" name="output" readonly="true">Initializing...</textarea>
	 </form>

	</body>
	</html>


需要注意的地方：如果是本地测试，需要注意沙箱问题。应该将swf所在文件夹添加到可信任域中。然后在html页中，设置以下标签：

	<param name="allowScriptAccess" value="always" />
	
在swf文件中，添加以下代码：

	flash.system.Security.allowDomain(sourceDomain)

	




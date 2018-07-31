---
layout: post
title: "params on live"
description: ""
category: FMS
tags: [fms]
---

#### 直播过程中NetStream、Camera、Microphone的参数设置

在直播过程中，参数的设置非常重要，它关乎着使用了多少带宽，画面的流畅度等。自己在使用的过程中总结了一些经验，若有不对之处，望看官能指出。

###### 关于bufferTime

bufferTime是NetStream的属性，表示缓冲的时间，默认值为0.1秒。在直播中如果设置为0则会出现卡顿的现象，要是设置的值较大，则等待的时间较长。
有一个比较好的办法，在开始连接的时候设置一个较小的值(如0.1)，等到缓冲区填满时("NetStream.Buffer.Full")，再设置大点(3秒或4秒)。接收到
"NetStream.Buffer.Empty"时再设置回初始值。

	private function onNetStreamStatusHandler(event:NetStatusEvent):void
	{
		switch(event.info.code)
		{
			case "NetStream.Buffer.Full":
				_ns.bufferTime = 3;
				break;
			case "NetStream.Buffer.Empty":
				_ns.bufferTime = 0.1;
				break;
		}
	}	

##### 关于Camera.setQuality(bandwidth:int, quality:int)方法

帮助文档中说的很轻快，这个方法是用来设置每秒的最大带宽或当前输出视频输入信号所需的画面质量。

使用此方法可以指定输出视频输入信号的哪一方面对于您的应用程序更重要：是带宽使用率还是图片品质。

* 要表示带宽使用率更为重要，请将一个值传递给 bandwidth 并将 0 传递给 quality。运行时将在指定的带宽内以可能的最高质量传输视频。如有必要，运行时将降低画面质量以避免超出指定的带宽。通常，随着运动的增加，质量将降低。

* 要表示品质更为重要，请将 0 传递给 bandwidth 并将一个数值传递给 quality。运行时使用所需数量的带宽来保持指定的质量。如有必要，运行时将降低帧速率以保持画面质量。通常，随着运动的增加，带宽的使用率也将增加。

* 要指定带宽和品质同等重要，请为这两个参数都传递数值。运行时将传输达到指定质量并且不超过指定带宽的视频。如有必要，运行时将降低帧速率以保持画面质量，而不会超出指定的带宽。

这里对于带宽bandwidth要重点理解。这里以每秒字节数(bps)为单位。但我们日常生活中常用到的是Kb/s、Mb/s，表示每秒传输多少兆、多少千字节。它们的转换关系是：

	8 bit = 1 Byte = 1/1024 k = 1/1024/1024 M
	
因此，2Mb的带宽最多只有200多K的下载速度就是这样得来的。

在调试过程中，可以将bandwidth值设置为0，看看当前设置需要多少的带宽才能保持品质。


##### 关于Camera.setMode(width:int, height:int, fps:Number, favorArea:Boolean = true)

将摄像头的捕获模式设置为最符合指定要求的本机模式。如果摄像头没有与您传递的所有参数相匹配的本机模式，运行时将选择与所请求的模式最接近的合成捕获模式。此操作可能涉及裁切图像和删除帧。

默认情况下，运行时根据需要删除一些帧以保持图像大小。要将删除的帧数降至最低（即使这意味着减小图像大小），请为 favorArea 参数传递 false。

在选择本机模式时，运行时将设法尽量保持所请求的高宽比。例如，如果发出 myCam.setMode(400, 400, 30) 命令，并且摄像头上可用的最大宽度和高度值分别为 320 和 288，则运行时将宽度和高度都设置为 288；通过将这些属性设置为相同的值，运行时可以保持所请求的 1:1 高宽比。

要确定在运行时选择与所请求的值最匹配的模式后分配给这些属性的值，请使用 width、height 和 fps 属性。

网络上流传一些关于setMode的设置，说带宽的大致算法是：

	视频宽度 x 视频高度 x 播放速率 (fps) = 总的带宽( bits/sec)
	
然后给出了一组推荐的参数设置：

	1 : //如果使用的是1M以上的宽度的话，可以选用如下设置：
	2 : Camera.setMode(320,240,15);
	3 : Camera.setQuality(144,000,85 );
	4 : Microphone.setRate(22);
	5 : //总的消耗带宽：1,196 kbps = 144kbyte
	
	1 : //786 kbps宽带：
	2 : Camera.setMode(240,180,12);
	3 : Camera.setQuality(64,800,85 );
	4 : Microphone.setRate(22);
	5 : //总的消耗带宽：562 kbps = 70kbyte
	
	1 : //384 kbps宽带：
	2 : Camera.setMode(192,144,7);
	3 : Camera.setQuality(24,192,85 );
	4 : Microphone.setRate(11);
	5 : //总的消耗带宽：216 kbps = 27kbyte
	
	1 : //56 kbps 拨号：
	2 : Camera.setMode(80,60,8);
	3 : Camera.setQuality(4,800,85 );
	4 : Microphone.setRate(8);
	5 : //总的消耗带宽：54 kbps = 7kbyte



##### setLoopback(compress:Boolean=false)

指定在本地查看摄像头时是否使用压缩视频流。此方法仅在使用 Flash Media Server 传输视频时适用；如果将 compress 设置为 true，则可以更精确地看到在用户实时查看视频时向用户呈现视频的方式。

虽然压缩流在用于测试（如预览视频品质设置）时很有用，但对它进行处理要花很大的代价，因为对本地视图并不只是进行压缩处理；就像通过实时连接进行传输那样，需要对视频进行压缩和编辑以进行传输，然后要对其进行解压缩处理以供本地查看。

这个方法的作用感觉就是让用户感受最终传输的流的效果。应根据需求来决定是否需要设置。


##### setKeyFrameInterval(keyFrameInterval:int)

指定进行完整传输而不由视频压缩算法进行插值处理的视频帧（称为关键帧）。此方法仅在使用 Flash Media Server 传输视频时适用。

Flash 视频压缩算法通过只传输自视频的上一帧以来的更改内容来压缩视频；这些部分被视为插补帧。可以根据前一帧的内容插补视频帧。但是，关键帧是完整的视频帧；它并不是根据前面的帧插补的。

要确定如何设置 keyFrameInterval 参数的值，请考虑带宽使用率和视频播放辅助功能。例如，为 keyFrameInterval 指定较高的值（以较低的频率发送关键帧）可降低带宽使用率。但是，这可能会增加在视频某一特定点上定位播放头所需的时间量；可能需要插补更多以前的视频帧才能继续播放视频。

反之，为 keyFrameInterval 指定较低的值（以较高的频率发送关键帧）会提高带宽使用率（因为会更频繁地传输所有的视频帧），但可能会减少在已录制视频内搜索特定视频帧所需的时间量。

这个方法,如果不需要录播视频，那么可以把值设置的高一点来节省带宽。


##### setUseEchoSuppression(useEchoSuppression:Boolean)

指定是否使用音频编解码器的回音抑制功能。除非用户已经在 Flash Player 的“麦克风设置”面板中选择了“降低回音”，否则默认值为 false。

回音抑制是指降低音频回馈效果，当扬声器发出的声音由同一系统上的麦克风拾取时，将导致音频回馈。（这不同于回音消除，后者会完全移除反馈。在调用 getEnhancedMicrophone() 方法以使用回音消除功能时，将忽略 setUseEchoSuppression() 方法。）

通常情况下，当通过扬声器（而不是耳机）播放所捕获的声音时，建议使用回音抑制。如果您的 SWF 文件允许用户指定声音输出设备，则当他们指定使用扬声器并且还将使用麦克风时，您可能需要调用 Microphone.setUseEchoSuppression(true)。

用户也可以在 Flash Player 的“麦克风设置”面板中调整这些设置。

##### setLoopBack(state:Boolean=true)

将麦克风捕获的音频传送到本地扬声器。如果将本地麦克风的声音传递到本地扬声器，则会存在创建音频回馈循环的风险，这可能导致非常大的振鸣声，并且可能会损坏声音硬件。使用参数值true调用Microphone.setUseEchoSuppression()方法可降低发生音频回馈的风险，但不会完全消除该风险。建议始终在调用Mecrophone.setLoopback(true)之前调用Microphone.setUseEchoSuppression(true)，除非确信用户使用耳机来播放声音，或者使用除扬声器外的设备。在FMS直播中需设置false，不然会有吵杂声。

##### setSilenceLevel(silenceLevel:Number, timeout:int=-1)

设置可认定为有声的最低音量输入水平，以及实际静音前需经历的无声时间长度(可选)。此方法用于优化带宽。
     * 要完全禁止麦克风检测声音，请为selenceLevel传递值1000；这样就对不会调度activity事件了。
     * 要确定麦克风当前所检测的音量，请使用Microphone.activityLevel。
Speex具有语音活动检测功能(VAD)，在未检测到语音时将自动减少带宽。使用Speex编码器时，建议将静音级别设置为0.

第一个参数： 激活麦克风并调度activity事件所需的音量。可接收值的范围为0到100。
第二个参数： 在没有活动的情况下经历过的毫秒数，必须经历这么长的时间，Flash Player才会认为声音已停止并调度dispatch事件。


##### framesPerPacket

在一个包（消息）中传输的 Speex 语音帧的数目。每帧长 20 ms。默认值为每个包两帧。

消息中包含的 Speex 帧越多，需要的带宽就越小，但发送消息延迟的时间就越长。Speex 帧越少，需要的带宽就越大，而延迟的时间就会越短。

##### gain

麦克风放大信号的程度。有效值0到100。默认值为50。

##### codec

 用于压缩音频的编解码器。可用编解码器为 Nellymoser（默认值）和 Speex。枚举类 SoundCodec 包含各种对 codec 属性有效的值。

如果使用 Nellymoser 编解码器，可使用 Microphone.rate() 设置采样率。如果使用 Speex 编解码器，则采样率会设置为 16 kHz。

Speex 具有语音活动检测功能 (VAD)，在未检测到语音时将自动减小带宽。使用 Speex 编解码器时，Adobe 建议将静音级别设置为 0。要设置静音级别，请使用 Microphone.setSilenceLevel() 方法。

##### rate

麦克风捕获声音时使用的速率，单位是 kHz。可接受的值为 5、8、11、22 和 44。如果您的声音捕获设备支持 8 kHz，则默认值为 8 kHz。否则，默认值是您的声音捕获设备支持的高于 8 kHz 的下一个可用捕获级别，通常为 11 kHz。 

注意：实际速率与下表中注明的 rate 值稍有不同：

	rate 值	实际频率
	44	44,100 Hz
	22	22,050 Hz
	11	11,025 Hz
	8	8,000 Hz
	5	5,512 Hz

##### encodeQuality

使用 Speex 编解码器时的编码语音品质。可能值为从 0 到 10 的值。默认值为 6。数字越大，表示品质越高，但需要更多的带宽，如下表所示。列出的比特率值表示净比特率，并不包括信息分包开销。


<table>
	<tr>
		<td>品质值</td>
		<td>所需的比特率(KB/秒)</td>
	</tr>
	<tr>
		<td>0</td>
		<td>3.95</td>
	</tr>
	<tr>
		<td>1</td>
		<td>5.57</td>
	</tr>
	<tr>
		<td>2</td>
		<td>7.75</td>
	</tr>
	<tr>
		<td>3</td>
		<td>9.80</td>
	</tr>
	<tr>
		<td>4</td>
		<td>12.8</td>
	</tr>
	<tr>
		<td>5</td>
		<td>16.8</td>
	</tr>
	<tr>
		<td>6</td>
		<td>20.6</td>
	</tr>
	<tr>
		<td>7</td>
		<td>23.8</td>
	</tr>
	<tr>
		<td>8</td>
		<td>27.8</td>
	</tr>
	<tr>
		<td>9</td>
		<td>34.2</td>
	</tr>
	<tr>
		<td>10</td>
		<td>42.2</td>
	</tr>
</table>

##### noiseSuppressionLevel

Speex 编码器使用的最大噪音衰减分贝数（负数）。如果启用，则在从 Microphone 捕获的声音进行 Speex 压缩之前应用噪音抑制。设置为 0 以禁用噪音抑制。默认启用噪音抑制，最大衰减为 -30 dB。选择 Nellymoser 编解码器时被忽略。




参考：

http://www.adobe.com/cn/devnet/flashplayer/articles/acoustic-echo-cancellation.html


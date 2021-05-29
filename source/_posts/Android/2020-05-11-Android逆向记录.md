---
title: Android逆向记录
tags: Android
---

```Java
#反编译apk文件
apktool d app-release.apk

如果出现编译assets文件夹中的dex文件失败，则使用--only-main-classes参数。

#编译修改后的应用
apktool b app-release -o output.apk

#对编译好的apk进行签名
apksigner sign --ks keystore文件路径 output.apk

~/Android/sdk/build-tools/29.0.3/apksigner sign --ks ~/Android/tools/keys/test_keystore lizhi_output.apk

```

签名参考：https://developer.android.com/studio/command-line/apksigner?hl=zh-cn




META-INF文件夹的内容

MINFEST.MF：声明了资源，与CERT.SF文件相似。
CERT.RSA：公钥证书。keytool -printcert -file CERT.RSA 输出证书内容

```
所有者: CN=Bbcallen, OU=danmaku.tv, O=danmaku.tv, L=Zhuhai, ST=Guangdong, C=CN
发布者: CN=Bbcallen, OU=danmaku.tv, O=danmaku.tv, L=Zhuhai, ST=Guangdong, C=CN
序列号: 4f3bb0ec
有效期为 Wed Feb 15 21:19:40 CST 2012 至 Thu Nov 18 21:19:40 CST 2066
证书指纹:
	 MD5:  71:94:D5:31:CB:E7:96:0A:22:00:7B:9F:6B:DA:A3:8B
	 SHA1: 96:DC:60:5B:95:19:BA:B9:4E:DD:BE:AA:A0:59:A6:69:FB:A2:C2:11
	 SHA256: 93:BA:27:0F:55:21:13:9E:CA:FE:4B:B6:38:AC:5B:11:98:BC:54:8F:62:D9:FD:8F:85:80:A0:79:FA:F5:91:0E
签名算法名称: SHA1withRSA
主体公共密钥算法: 1024 位 RSA 密钥
版本: 3
```

CERT.SF：包含了app的所有资源文件，负责对app进行签名，



### Android Studio动态调试

```Java
反编译apk文件，添加debug属性，打包、签名新的可debug的apk。安装。

安装Android Studio插件smalidea
https://bitbucket.org/JesusFreke/smali/downloads/


使用baksmali反编译apk文件
java -jar baksmali -o myapp/src


先启动应用，查看主activity
adb shell "dumpsys activity top | grep ACTIVITY"

然后以debug模式启动app
adb shell am start -D -n androiddemo.han.com.myapplication/.MainActivity


查看进程
adb shell "ps | grep 包名"

端口转发
adb forward tcp:8787 jdwp:app_pid



adb shell am set-debug-app -w --persistent 包名  一直使用debug模式启动应用
adb shell am clear-debug-app	取消使用debug启动应用

```








---
title: 《图解TCP/IP》读书笔记
tags: [读书笔记]
---





OSI参考模型

![](./1.png)


名字|描述
---|---
网卡|使计算机联网的设备
中继器（Repeater）|从物理层上延长网络的设备
2 网桥（Bridge）|从数据链路层上延长网络的设备
3 路由器|通过网络层转发分组数据的设备
4~7 交换机|处理传输层以上各层网络传输的设备
网管（Gateway）|转换协议的设备


数据链路名|通信媒介|传输速率|主要用途
--- | ---|---|---
以太网|同轴电缆|10Mbps|LAN
_ |双绞线电缆|10Mbps~100Gbps|LAN
_|光纤电缆10Mbps~100Gbps|LAN
无线|电磁波|数个Mbps|LAN~WAN
ATM|双绞线电缆<br/>光纤电缆|25Mbps<br/>155Mbps<br/>622Mbps|LAN~WAN
FDDI|光纤电缆<br/>双绞线电缆|100Mbps|LAN~-WAN
帧中继|双绞线电缆<br/>光纤电缆|约64~1.5Mbps|WAN
ISDBN|双绞线电缆<br/>光纤电缆|64~1.5Mbps|WAN


在数据传输过程中，两个设备之间数据流动的物理速度称为传输速率，单位为bps（Bits Per Second），传输速率高指单位时间内传输的数据量有多少。传输速率又称为带宽（Bandwidth）


协议规范
https://www.rfc-editor.org/rfc



![](./2.png)
![](./3.png)






以太网协议
https://www.iana.org/assignments/ethernet-numbers/ethernet-numbers.xhtml


分类|通信距离|标准化组织|相关其他组织及技术
---|---|---|---
短距离无线|数米|个别组织|RF-ID
无线PAN|10米左右|IEEE802.15|蓝牙
无线LAN|100米左右|IEEE802.11|Wi-Fi
无线MAN|数千米~100千米|IEEE802.16<br/>IEEE802.20|WiMAX
无线RAN|200千米~700千米|IEEE802.22|无线WAN


GSM、CDMA2000、W-CDMA

3G、LTE、4G



http://grouper.ieee.org/groups/802/11/Reports/802.11_Timelines.htm



PPP：Point to Point Protocol
ATM：Asynchronous Transfer Mode



IP寻址
路由
IP分包和组包


IP是面向无连接的































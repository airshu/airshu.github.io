---
title: emoji表情处理
tags: PyQt
toc: true
---

在QLabel上显示emoji表情，win10和win7显示的效果不一样，win10能显示出彩色的，但win7只能显示黑白色，且有些表情甚至不能显示。 

不同系统的实现效果都是不一样的，所以要实现统一，最好的方式就是自己实现，通过其unicode值建立一套对应的图片，显示的时候，直接绘制本地的图片。而不走系统渲染。



## 参考

- [https://appuals.com/how-to-get-windows-10-emojis-on-windows-7-8/](https://appuals.com/how-to-get-windows-10-emojis-on-windows-7-8/)
	这篇文章说明win7是不支持的系统显示彩色emoji的

- [https://github.com/carpedm20/emoji](https://github.com/carpedm20/emoji)
	unicode值和对应表情的字符串之间的互相转换，有一些非标准的emoji表情，比如**:thumbs_up:**表示 👍

- [https://github.com/googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji)
	google 彩色字体库

- [https://github.com/DeeDeeG/noto-color-emoji-font](https://github.com/DeeDeeG/noto-color-emoji-font)



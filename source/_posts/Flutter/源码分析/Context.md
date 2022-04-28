---
title: Context
toc: true
tags: Flutter
---


### BuildContext

BuildContext就是Widget对应的Element。


WidgetsFlutterBinding，其在创建的时候绑定了WidgetsBinding（绑定组件树）、RendererBinding（绑定渲染树）、SemanticsBinding（绑定语义树）、PaintingBinding（绑定绘制操作）、SchedulerBinding（绑定帧绘制回调函数，以及widget生命周期相关事件）、ServicesBinding（绑定平台服务消息，注册Dart层和C++层的消息传输服务）、GestureBinding（绑定手势事件，用于检测应用的各种手势相关操作）等mixin。



如果Widget有更新，需要重新布局，Framework会将需要布局的RenderObject加入PipelineOwner的_nodesNeedingLayout中，然后当下一个VSync信号来临时，Framework会遍历_nodesNeedingLayout，对其中的每一个RenderObject重新进行布局，遍历_nodesNeedingLayout的函数。

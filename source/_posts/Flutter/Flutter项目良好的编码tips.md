---
title: Flutter项目良好的编码tips
toc: true
tags: Flutter
---


- [Flutter项目结构](./Flutter项目结构)
- [代码规范](./Flutter代码规范)
- [良好的编码tips](./Flutter项目良好的编码tips)


首先，代码编写需要满足一定的规范，统一团队内的代码风格。参考[Flutter代码规范](./Flutter代码规范)。除此之外，为了提升质量，还可以设置以下规范和技巧



- 如果明确视图不会发生变化，尽量使用StatelessWidget
- 如果变量明确不会改变，则使用final修饰
- 如果变量明确是常量，则使用const修饰
- 注意输入框类型，如果是数字或者邮箱则设置默认键盘类型
- 监听器的使用，注意不要在调用多次方法中使用（比如didChangeDependencies），记得不需要时移除监听
- 尽量不用print，使用封装的Log工具，设置合适的level。release版本统一去掉print
- catch(e, s)的异常，上报详细信息用于分析具体原因
- 异步使用setState前需要判断mounted

```dart

if(mounted) {
    setState((){});
}
```

- scrollcontroller要记得释放资源，一个controller只能对应一个list

```dart

void dispose() {
    controller?.dispose();
}
```

- 按钮请求接口注意添加防重复点击
- 建议使用bloc等方式进行精细化刷新UI；处理业务逻辑时尽量控制刷新的最小粒度
- 尽量复用代码，继承base class、mixin，复用通用组件
- 代码健壮性：是否可能出现异常的代码有catch？能否保障在异常情况下流程还能顺利完成
- 可空语法的一些写法

```dart

//对于获取List中的元素，为了安全建议使用
List list = [];
User? item = list?.elementAtSafe(1);  //elementAtSafew为扩展函数，如果index对应的元素不存在则返回null，保证空安全
User item = list?.elementAtSafe(1) ?? User(); 
//使用?语法，只有当其不为空时才执行后面的代码，elementAtSafe为扩展函数，如果index对应的元素不存在则返回null，保证空安全。第二个参数则设置在没有值的情况下返回一个默认值



//对于后端数据的解析
Map result = await getxxx();
double points = (resutl['name']? as num?)?.toDouble() ?? 2.1;

```

- 注意代码分层，不要把UI和业务逻辑全部堆叠在一个文件中，使用状态管理框架，将业务逻辑和UI分离

- dispose方法中注意会不会出现因为代码异常造成后面释放资源的代码不执行而造成内存泄漏
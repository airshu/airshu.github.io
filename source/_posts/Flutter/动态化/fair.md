---
title: fair
toc: true
tags: Flutter 动态化
---

58同城的开源动态化方案，目前市面上比较完善的开源方案。

将build方法内的代码使用dart2dsl转化成json，将非build方法里的代码使用dart2js转化成js。


## 环境配置

### FlatBuffers

将js转化成bin文件，好处是不用反序列化，大大提升Fair解析、加载资源的速度


### faircli

用来快捷创建动态化工程和载体工程

```shell

# 安装 Faircli 命令行工具
dart pub global activate faircli
#  创建动态化工程
faircli create -n dynamic_project_name
#  创建载体工程
faircli create -k carrier -n carrier_project_name
```

### 开发流程

1. pubspec.yaml中配置依赖

2. 入口添加FairApp

```dart
void main() {
  // runApp(MyApp());

  WidgetsFlutterBinding.ensureInitialized();

  FairApp.runApplication(
    _getApp(),
    plugins: {},
  );
}

dynamic _getApp() => FairApp(
  modules: {},
  delegate: {},
  child: MyApp(),
);

```

3. 使用 @FairPatch() 注解标记需要动态化的 Widget

4. 执行 build_runner 命令，编译生成下发产物

5. 使用 FairWidget 加载 bundle 资源



## 教程

### FairBinding的作用

在某个 Widget 中引用了另一个本地自定义的 Widget。对于这样的情况，我们需要使用 @FairBinding 注解，为本地 Widget 生成映射关系。


### FairWell注解和FairDelegate

问题

如何运行js代码的？


## 参考

- [https://fair.58.com/zh/](https://fair.58.com/zh/)
- [Flutter 热更新 Fair 真.体验](https://juejin.cn/post/7228967938473394213)
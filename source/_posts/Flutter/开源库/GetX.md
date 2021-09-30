---
title: GetX
toc: true
tags: Flutter
---


## 概述

高性能的状态管理、智能的依赖注入和便捷的路由管理。


## 状态管理

Get有两个不同的状态管理器：简单的状态管理器（GetBuilder）和响应式状态管理器（GetX）。

```dart

//使得变量变的可观察
var name = 'Jonatas Borges'.obs;
//绑定UI
Obx(() => Text("${controller.name}"));
```


### GetBuilder

```dart

//返回一个widget，通过泛型绑定一个GetxController
class Controller extends GetxController {
 // static Controller get to => Get.find(); // with no static get
[...]
}
// on stateful/stateless class
GetBuilder<Controller>(  
  init: Controller(), // 每个控制器只用一次
  builder: (_) => Text(
    '${Get.find<Controller>().counter}', //通过find方法使用
  ),
),

```


#### 唯一的ID

```dart
GetBuilder<Controller>(
  id: 'text', //这里
  init: Controller(), // 每个控制器只用一次
  builder: (_) => Text(
    '${Get.find<Controller>().counter}', //here
  ),
),


update(['text']);

update(['text'], counter < 10);
```

### 声明响应式变量的方式


```dart

//第一种是使用 Rx{Type}。
// 建议使用初始值，但不是强制性的
final name = RxString('');
final isLogged = RxBool(false);
final count = RxInt(0);
final balance = RxDouble(0.0);
final items = RxList<String>([]);
final myMap = RxMap<String, int>({});

//第二种是使用 Rx，规定泛型 Rx<Type>。
final name = Rx<String>('');
final isLogged = Rx<Bool>(false);
final count = Rx<Int>(0);
final balance = Rx<Double>(0.0);
final number = Rx<Num>(0)
final items = Rx<List<String>>([]);
final myMap = Rx<Map<String, int>>({});
//第三种更实用、更简单、更可取的方法，只需添加 .obs 作为value的属性。
final name = ''.obs;
final isLogged = false.obs;
final count = 0.obs;
final balance = 0.0.obs;
final number = 0.obs;
final items = <String>[].obs;
final myMap = <String, int>{}.obs;

// 自定义类 - 可以是任何类
final user = User().obs;

```


## 路由管理

```dart

//在你的MaterialApp前加上 "Get"，把它变成GetMaterialApp。

GetMaterialApp( // Before: MaterialApp(
  home: MyHome(),
)


//导航到新页面
Get.to(NextScreen());

//别名导航
Get.toNamed('/details');
//浏览并删除前一个页面。
Get.offNamed("/NextScreen");
//浏览并删除所有以前的页面。
Get.offAllNamed("/NextScreen");
//只要发送你想要的参数即可。Get在这里接受任何东西，无论是一个字符串，一个Map，一个List，甚至一个类的实例。
Get.toNamed("/NextScreen", arguments: 'Get is the best');


//Get提供高级动态URL，就像在Web上一样。Web开发者可能已经在Flutter上想要这个功能了，Get也解决了这个问题。
Get.offAllNamed("/NextScreen?device=phone&id=354&name=Enzo");
print(Get.parameters['id']);
// out: 354
print(Get.parameters['name']);
// out: Enzo

//要关闭snackbars, dialogs, bottomsheets或任何你通常会用Navigator.pop(context)关闭的东西。
Get.back();

//进入下一个页面，但没有返回上一个页面的选项（用于闪屏页，登录页面等）。
Get.off(NextScreen());

//进入下一个页面并取消之前的所有路由（在购物车、投票和测试中很有用）。
Get.offAll(NextScreen());

//要导航到下一条路由，并在返回后立即接收或更新数据。
var data = await Get.to(Payment());

//在另一个页面上，发送前一个路由的数据。
Get.back(result: 'success');
```

### 定义路由

```dart
void main() {
  runApp(
    GetMaterialApp(
      unknownRoute: GetPage(name: '/notfound', page: () => UnknownRoutePage()),//未定义路线的导航（404错误） 
      initialRoute: '/',
      getPages: [
        GetPage(name: '/', page: () => MyHomePage()),
        GetPage(name: '/second', page: () => Second()),
        GetPage(
          name: '/third',
          page: () => Third(),
          transition: Transition.zoom  
        ),
      ],
    )
  );
}
```

### 中间件

### 嵌套导航

```dart
class AppPages {
  static const INITIAL = Routes.HOME;

  static final routes = [
    GetPage(
        name: Routes.HOME,
        page: () => HomeView(),
        binding: HomeBinding(),
        children: [
          GetPage(
            name: Routes.COUNTRY,
            page: () => CountryView(),
            children: [
              GetPage(
                name: Routes.DETAILS,
                page: () => DetailsView(),
              ),
            ],
          ),
        ]),
  ];
}
```

访问导航的时候，可以使用/home/country/details等方式跳转。



## 依赖管理


### 添加依赖

#### Get.put

```dart

Get.put<S>(
  // 必备：你想得到保存的类，比如控制器或其他东西。
  // 注："S "意味着它可以是任何类型的类。
  S dependency

  // 可选：当你想要多个相同类型的类时，可以用这个方法。
  // 因为你通常使用Get.find<Controller>()来获取一个类。
  // 你需要使用标签来告诉你需要哪个实例。
  // 必须是唯一的字符串
  String tag,

  // 可选：默认情况下，get会在实例不再使用后进行销毁
  // （例如：一个已经销毁的视图的Controller)
  // 但你可能需要这个实例在整个应用生命周期中保留在那里，就像一个sharedPreferences的实例或其他东西。
  //所以你设置这个选项
  // 默认值为false
  bool permanent = false,

  // 可选：允许你在测试中使用一个抽象类后，用另一个抽象类代替它，然后再进行测试。
  // 默认为false
  bool overrideAbstract = false,

  // 可选：允许你使用函数而不是依赖（dependency）本身来创建依赖。
  // 这个不常用
  InstanceBuilderCallback<S> builder,
)


Get.put<SomeClass>(SomeClass());
Get.put<LoginController>(LoginController(), permanent: true);
Get.put<ListItemController>(ListItemController, tag: "some unique string");
```

#### Get.lazyPut

懒加载一个依赖，这样它只有在使用时才会被实例化。

```dart

Get.lazyPut<S>(
  // 强制性：当你的类第一次被调用时，将被执行的方法。
  InstanceBuilderCallback builder,
  
  // 可选：和Get.put()一样，当你想让同一个类有多个不同的实例时，就会用到它。
  // 必须是唯一的
  String tag,

  // 可选：类似于 "永久"，
  // 不同的是，当不使用时，实例会被丢弃，但当再次需要使用时，Get会重新创建实例，
  // 就像 bindings api 中的 "SmartManagement.keepFactory "一样。
  // 默认值为false
  bool fenix = false
  
)

///只有当第一次使用Get.find<ApiMock>时，ApiMock才会被调用。
Get.lazyPut<ApiMock>(() => ApiMock());

Get.lazyPut<FirebaseAuth>(
  () {
    // ... some logic if needed
    return FirebaseAuth();
  },
  tag: Math.random().toString(),
  fenix: true
)

Get.lazyPut<Controller>( () => Controller() )
```

#### Get.putAsync

```dart

Get.putAsync<S>(

  // 必备：一个将被执行的异步方法，用于实例化你的类。
  AsyncInstanceBuilderCallback<S> builder,

  // 可选：和Get.put()一样，当你想让同一个类有多个不同的实例时，就会用到它。
  // 必须是唯一的
  String tag,

  // 可选：与Get.put()相同，当你需要在整个应用程序中保持该实例的生命时使用。
  // 默认值为false
  bool permanent = false
)

Get.putAsync<SharedPreferences>(() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setInt('counter', 12345);
  return prefs;
});

Get.putAsync<YourAsyncClass>( () async => await YourAsyncClass() )
```

#### Get.create

```dart
Get.create<S>(
  // 需要：一个返回每次调用"Get.find() "都会被新建的类的函数。
  // 示例: Get.create<YourClass>(()=>YourClass())
  FcBuilderFunc<S> builder,

  // 可选：就像Get.put()一样，但当你需要多个同类的实例时，会用到它。
  // 当你有一个列表，每个项目都需要自己的控制器时，这很有用。
  // 需要是一个唯一的字符串。只要把标签改成名字
  String name,

  // 可选：就像 Get.put() 一样，
  // 它是为了当你需要在整个应用中保活实例的时候
  // 区别在于 Get.create 的 permanent默认为true
  bool permanent = true
)

Get.Create<SomeClass>(() => SomeClass());
Get.Create<LoginController>(() => LoginController());


```

### 使用

```dart

final controller = Get.find<Controller>();
// 或者
Controller controller = Get.find();


Get.delete<Controller>(); //通常你不需要这样做，因为GetX已经删除了未使用的控制器。

```


### Bindings

Bindings使得Get可以知道当使用某个控制器时，哪个页面正在显示，并知道在哪里以及如何销毁它。 此外，Binding类将允许你拥有SmartManager配置控制。你可以配置依赖关系，当从堆栈中删除一个路由时，或者当使用它的widget被布置时，或者两者都不布置。

```dart
//使用BindingsBuilder创建
getPages: [
  GetPage(
    name: '/',
    page: () => HomeView(),
    binding: BindingsBuilder(() {
      Get.lazyPut<ControllerX>(() => ControllerX());
      Get.put<Service>(()=> Api());
    }),
  ),
  GetPage(
    name: '/details',
    page: () => DetailsView(),
    binding: BindingsBuilder(() {
      Get.lazyPut<DetailsController>(() => DetailsController());
    }),
  ),
];


//自定义Bindings类
class HomeBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<HomeController>(() => HomeController());
    Get.put<Service>(()=> Api());
  }
}

class DetailsBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DetailsController>(() => DetailsController());
  }
}

getPages: [
  GetPage(
    name: '/',
    page: () => HomeView(),
    binding: HomeBinding(),
  ),
  GetPage(
    name: '/details',
    page: () => DetailsView(),
    binding: DetailsBinding(),
  ),
];

Get.to(Home(), binding: HomeBinding());
Get.to(DetailsView(), binding: DetailsBinding())

```

#### 智能管理

GetX 默认情况下会将未使用的控制器从内存中移除。 但是如果你想改变GetX控制类的销毁方式，你可以用SmartManagement类设置不同的行为。

```dart
void main () {
  runApp(
    GetMaterialApp(
      smartManagement: SmartManagement.onlyBuilders //这里
      home: Home(),
    )
  )
}
```

- SmartManagement.full

这是默认的。销毁那些没有被使用的、没有被设置为永久的类。在大多数情况下，你会希望保持这个配置不受影响。如果你是第一次使用GetX，那么不要改变这个配置。

- SmartManagement.onlyBuilders

使用该选项，只有在init:中启动的控制器或用Get.lazyPut()加载到Binding中的控制器才会被销毁。

如果你使用Get.put()或Get.putAsync()或任何其他方法，SmartManagement将没有权限移除这个依赖。

在默认行为下，即使是用 "Get.put "实例化的widget也会被移除，这与SmartManagement.onlyBuilders不同。

- SmartManagement.keepFactory

就像SmartManagement.full一样，当它不再被使用时，它将删除它的依赖关系，但它将保留它们的工厂，这意味着如果你再次需要该实例，它将重新创建该依赖关系。

## 国际化

### 翻译

翻译被保存为一个简单的键值字典映射。 要添加自定义翻译，请创建一个类并扩展翻译

```dart

import 'package:get/get.dart';

class Messages extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        'zh_CN': {
          'hello': '你好 世界',
        },
        'de_DE': {
          'hello': 'Hallo Welt',
        }
      };
}


```

### 使用翻译

```dart

//传递参数给GetMaterialApp来定义语言和翻译。
return GetMaterialApp(
    translations: Messages(), // 你的翻译
    locale: Locale('zh', 'CN'), // 将会按照此处指定的语言翻译，ui.window.locale表示系统设置的语言
    fallbackLocale: Locale('en', 'US'), // 添加一个回调语言选项，以备上面指定的语言翻译不存在
);


//使用翻译
//只要将.tr追加到指定的键上，就会使用Get.locale和Get.fallbackLocale的当前值进行翻译。
Text('title'.tr);


//调用Get.updateLocale(locale)来更新语言环境。然后翻译会自动使用新的locale。
var locale = Locale('en', 'US');
Get.updateLocale(locale);

```

## 改变主题

```dart

Get.changeTheme(ThemeData.light());

```


## 其他API

```dart

// 给出当前页面的args。
Get.arguments

//给出以前的路由名称
Get.previousRoute

// 给出要访问的原始路由，例如，rawRoute.isFirst()
Get.rawRoute

// 允许从GetObserver访问Rounting API。
Get.routing

// 检查 snackbar 是否打开
Get.isSnackbarOpen

// 检查 dialog 是否打开
Get.isDialogOpen

// 检查 bottomsheet 是否打开
Get.isBottomSheetOpen

// 删除一个路由。
Get.removeRoute()

//反复返回，直到表达式返回真。
Get.until()

// 转到下一条路由，并删除所有之前的路由，直到表达式返回true。
Get.offUntil()

// 转到下一个命名的路由，并删除所有之前的路由，直到表达式返回true。
Get.offNamedUntil()

//检查应用程序在哪个平台上运行。
GetPlatform.isAndroid
GetPlatform.isIOS
GetPlatform.isMacOS
GetPlatform.isWindows
GetPlatform.isLinux
GetPlatform.isFuchsia

//检查设备类型
GetPlatform.isMobile
GetPlatform.isDesktop
//所有平台都是独立支持web的!
//你可以知道你是否在浏览器内运行。
//在Windows、iOS、OSX、Android等系统上。
GetPlatform.isWeb


// 相当于.MediaQuery.of(context).size.height,
//但不可改变。
Get.height
Get.width

// 提供当前上下文。
Get.context

// 在你的代码中的任何地方，在前台提供 snackbar/dialog/bottomsheet 的上下文。
Get.contextOverlay

// 注意：以下方法是对上下文的扩展。
// 因为在你的UI的任何地方都可以访问上下文，你可以在UI代码的任何地方使用它。

// 如果你需要一个可改变的高度/宽度（如桌面或浏览器窗口可以缩放），你将需要使用上下文。
context.width
context.height

// 让您可以定义一半的页面、三分之一的页面等。
// 对响应式应用很有用。
// 参数： dividedBy (double) 可选 - 默认值：1
// 参数： reducedBy (double) 可选 - 默认值：0。
context.heightTransformer()
context.widthTransformer()

/// 类似于 MediaQuery.of(context).size。
context.mediaQuerySize()

/// 类似于 MediaQuery.of(context).padding。
context.mediaQueryPadding()

/// 类似于 MediaQuery.of(context).viewPadding。
context.mediaQueryViewPadding()

/// 类似于 MediaQuery.of(context).viewInsets。
context.mediaQueryViewInsets()

/// 类似于 MediaQuery.of(context).orientation;
context.orientation()

///检查设备是否处于横向模式
context.isLandscape()

///检查设备是否处于纵向模式。
context.isPortrait()

///类似于MediaQuery.of(context).devicePixelRatio。
context.devicePixelRatio()

///类似于MediaQuery.of(context).textScaleFactor。
context.textScaleFactor()

///查询设备最短边。
context.mediaQueryShortestSide()

///如果宽度大于800，则为真。
context.showNavbar()

///如果最短边小于600p，则为真。
context.isPhone()

///如果最短边大于600p，则为真。
context.isSmallTablet()

///如果最短边大于720p，则为真。
context.isLargeTablet()

///如果当前设备是平板电脑，则为真
context.isTablet()

///根据页面大小返回一个值<T>。
///可以给值为：
///watch：如果最短边小于300
///mobile：如果最短边小于600
///tablet：如果最短边（shortestSide）小于1200
///desktop：如果宽度大于1200
context.responsiveValue<T>()

```


## 局部状态组件

### GetView

它是一个对已注册的Controller有一个名为controller的getter的const Stateless的Widget

```dart
class AwesomeController extends GetxController {
   final String title = 'My Awesome View';
 }

  // 一定要记住传递你用来注册控制器的`Type`!
 class AwesomeView extends GetView<AwesomeController> {
   @override
   Widget build(BuildContext context) {
     return Container(
       padding: EdgeInsets.all(20),
       child: Text( controller.title ), // 只需调用 "controller.something"。
     );
   }
 }
```

### GetWidget



### GetxService

整个生命周期都存在


```dart
Future<void> main() async {
  await initServices(); /// 等待服务初始化.
  runApp(SomeApp());
}

/// 在你运行Flutter应用之前，让你的服务初始化是一个明智之举。
////因为你可以控制执行流程（也许你需要加载一些主题配置，apiKey，由用户自定义的语言等，所以在运行ApiService之前加载SettingService。
///所以GetMaterialApp()不需要重建，可以直接取值。
void initServices() async {
  print('starting services ...');
  ///这里是你放get_storage、hive、shared_pref初始化的地方。
  ///或者moor连接，或者其他什么异步的东西。
  await Get.putAsync(() => DbService().init());
  await Get.putAsync(SettingsService()).init();
  print('All services started...');
}

class DbService extends GetxService {
  Future<DbService> init() async {
    print('$runtimeType delays 2 sec');
    await 2.delay();
    print('$runtimeType ready!');
    return this;
  }
}

class SettingsService extends GetxService {
  void init() async {
    print('$runtimeType delays 1 sec');
    await 1.delay();
    print('$runtimeType ready!');
  }
}

```

## 参考

- [中文官方文档](https://github.com/jonataslaw/getx/blob/master/README.zh-cn.md)



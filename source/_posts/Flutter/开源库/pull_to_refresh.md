---
title: pull_to_refresh
toc: true
tags: Flutter
---


上拉加载和下拉刷新的组件

## pull_to_refresh

**特性**

- 提供上拉加载和下拉刷新
- 几乎适合所有部件
- 提供全局设置默认指示器和属性
- 提供多种比较常用的指示器
- 支持Android和iOS默认滑动引擎,可限制越界距离,打造自定义弹性动画,速度,阻尼等。
- 支持水平和垂直刷新,同时支持翻转列表(四个方向)
- 提供多种刷新指示器风格:跟随,不跟随,位于背部,位于前部, 提供多种加载更多风格
- 提供二楼刷新,可实现类似淘宝二楼,微信二楼,携程二楼
- 允许关联指示器存放在Viewport外部,即朋友圈刷新效果

通过自定义scroll_physics，监听滚动事件，下拉的过程中进行状态的切换。当完成数据请求后需要手动更新组件的状态。

### 基本使用

```dart
List<String> items = ["1", "2", "3", "4", "5", "6", "7", "8"];
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  void _onRefresh() async{
    // monitor network fetch
    await Future.delayed(Duration(milliseconds: 1000));
    // if failed,use refreshFailed()
    _refreshController.refreshCompleted();
  }

  void _onLoading() async{
    // monitor network fetch
    await Future.delayed(Duration(milliseconds: 1000));
    // if failed,use loadFailed(),if no data return,use LoadNodata()
    items.add((items.length+1).toString());
    if(mounted)
    setState(() {

    });
    _refreshController.loadComplete();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SmartRefresher(
        enablePullDown: true,
        enablePullUp: true,
        header: WaterDropHeader(),
        footer: CustomFooter(
          builder: (BuildContext context,LoadStatus mode){
            Widget body ;
            if(mode==LoadStatus.idle){
              body =  Text("pull up load");
            }
            else if(mode==LoadStatus.loading){
              body =  CupertinoActivityIndicator();
            }
            else if(mode == LoadStatus.failed){
              body = Text("Load Failed!Click retry!");
            }
            else if(mode == LoadStatus.canLoading){
                body = Text("release to load more");
            }
            else{
              body = Text("No more Data");
            }
            return Container(
              height: 55.0,
              child: Center(child:body),
            );
          },
        ),
        controller: _refreshController,
        onRefresh: _onRefresh,
        onLoading: _onLoading,
        child: ListView.builder(
          itemBuilder: (c, i) => Card(child: Center(child: Text(items[i]))),
          itemExtent: 100.0,
          itemCount: items.length,
        ),
      ),
    );
  }


// 全局配置子树下的SmartRefresher,下面列举几个特别重要的属性
RefreshConfiguration(
 headerBuilder: () => WaterDropHeader(),        // 配置默认头部指示器,假如你每个页面的头部指示器都一样的话,你需要设置这个
 footerBuilder:  () => ClassicFooter(),        // 配置默认底部指示器
 headerTriggerDistance: 80.0,        // 头部触发刷新的越界距离
 springDescription:SpringDescription(stiffness: 170, damping: 16, mass: 1.9),         // 自定义回弹动画,三个属性值意义请查询flutter api
 maxOverScrollExtent :100, //头部最大可以拖动的范围,如果发生冲出视图范围区域,请设置这个属性
 maxUnderScrollExtent:0, // 底部最大可以拖动的范围
 enableScrollWhenRefreshCompleted: true, //这个属性不兼容PageView和TabBarView,如果你特别需要TabBarView左右滑动,你需要把它设置为true
 enableLoadingWhenFailed : true, //在加载失败的状态下,用户仍然可以通过手势上拉来触发加载更多
 hideFooterWhenNotFull: false, // Viewport不满一屏时,禁用上拉加载更多功能
 enableBallisticLoad: true, // 可以通过惯性滑动触发加载更多
 child: MaterialApp(
    ........
 )
);
```

## easy_refresh

由于pull_to_refresh已经很久不更新了，新的Flutter SDK使用easy_refresh替代，支持Flutter SDK 3.x

**特性**

- 支持所有的滚动组件
- 滚动物理作用域，精确匹配滚动组件
- 集成多个炫酷的 Header 和 Footer
- 支持自定义样式，实现各种动画效果
- 支持下拉刷新、上拉加载(可使用控制器触发和结束)
- 支持指示器位置设定，结合监听器也放置在任何位置
- 支持页面启动时刷新，并自定义视图
- 支持安全区域，不再有遮挡
- 自定义滚动参数，让列表具有不同的滚动反馈和惯性


### 基本使用

```dart
  EasyRefresh(
    //顶部指示器
    header: Header(
      position: IndicatorPosition.locator,
    ),
    footer: Footer(
      position: IndicatorPosition.locator,
    ),
    //刷新
    onRefresh: () async {
      ....
    },
    //翻页
    onLoad: () async {
      ....
      return IndicatorResult.noMore;
    },
    child: CustomScrollView(
      slivers: [
        SliverAppBar(),
        const HeaderLocator.sliver(),
        ...
        const FooterLocator.sliver(),
        ],
      ),
  )
```

## 参考

- [https://github.com/peng8350/flutter_pulltorefresh](https://github.com/peng8350/flutter_pulltorefresh)
- [https://pub.dev/packages/easy_refresh](https://pub.dev/packages/easy_refresh)

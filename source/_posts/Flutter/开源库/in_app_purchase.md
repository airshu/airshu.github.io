---
title: in_app_purchase苹果内购
toc: true
tags: Flutter
---


使用[in_app_purchase](https://pub.dev/packages/in_app_purchase)这个库

## 流程

### 1. 修改XCode配置文件，支持内购

![](./in_app_purchase.png)

### 2. 项目中添加in_app_purchase配置

```yaml

dependencies:
  flutter:
    sdk: flutter
  in_app_purchase:
  in_app_purchase_storekit:

```

### 3. 编写内购代码

```dart

class ShopPayUtil {
  static ShopPayUtil? _instance;

  static ShopPayUtil getInstance() {
    _instance ??= ShopPayUtil._internal();
    return _instance!;
  }

  ShopPayUtil._internal();

  factory ShopPayUtil() => getInstance();

///购买商品
  void buy(GoodsModel item) async {
    try {
      EasyLoading.show();
      // 根据商品信息创建订单
      var res = await rechargeCreate(item.code!);
      if(res != null) {
        // 调用苹果内购
        await applePay(res);
      }
    } catch (e, s) {
      Logger.error('$e  $s');
    } finally {
      EasyLoading.dismiss();
    }
  }

  /// 创建充值订单
  Future<dynamic> rechargeCreate(String goodsCode) async {
    // todo 调用服务器接口
  }

  /// 验单
  static Future paymentIpa(String orderNo, String payload, String transactionId) async {
   // todo 检查订单准确性 
  }

  /// 消耗虚拟币
  Future reviewModeConsume(String outlay) async {
    // todo 调用后台接口
  }

  static StreamSubscription<List<PurchaseDetails>>? _subscription;

  /// 苹果内购 (购买)
  static Future<void> applePay(Map dataMap) async {
    final Stream<List<PurchaseDetails>> purchaseUpdated = InAppPurchase.instance.purchaseStream;
    _subscription?.cancel();
    // 添加监听器
    _subscription = purchaseUpdated.listen((List<PurchaseDetails> purchaseDetailsList) {
      _listenToPurchaseUpdated(purchaseDetailsList, dataMap);
    }, onDone: () {
      _subscription?.cancel();
      Logger.debug('=applePay=====onDone');
    }, onError: (Object error) {
      Logger.error(error);
      ToastUtil.show(error.toString());
    });


    final bool isAvailable = await InAppPurchase.instance.isAvailable();
    // 判断是否可用
    if (!isAvailable) {
      ToastUtil.show('The store cannot be reached, check your network connection please.');
      return;
    }

    if (Platform.isIOS) {
      final InAppPurchaseStoreKitPlatformAddition iosPlatformAddition =
          InAppPurchase.instance.getPlatformAddition<InAppPurchaseStoreKitPlatformAddition>();
      await iosPlatformAddition.setDelegate(PaymentQueueDelegate());
    }

    Set<String> ids = {dataMap['goodsCode']};
    // 查询商品的信息（需要先在苹果后台配置）
    final ProductDetailsResponse productDetailResponse = await InAppPurchase.instance.queryProductDetails(ids);

    if (productDetailResponse.error != null) {
      WSToastUtil.show('Failed to obtain product information.');
      return;
    }

    if (productDetailResponse.productDetails.isEmpty) {
      ToastUtil.show('No product');
      return;
    }
    List<ProductDetails> _products = productDetailResponse.productDetails;
    // 查询成功
    ProductDetails productDetails = _products[0];
    PurchaseParam purchaseParam = PurchaseParam(
      productDetails: productDetails,
      applicationUserName: '${dataMap['orderNo']}',
    );
    //向苹果服务器发起支付请求
    var res = await InAppPurchase.instance.buyConsumable(purchaseParam: purchaseParam);
    Logger.debug('buyConsumable result:  $res');
  }

  static Future<void> _listenToPurchaseUpdated(List<PurchaseDetails> purchaseDetailsList, Map dataMap) async {
    Logger.debug('===>>>_listenToPurchaseUpdated  callback');
    for (final PurchaseDetails purchaseDetails in purchaseDetailsList) {
      Logger.debug(
          '===>>>_listenToPurchaseUpdated  status=${purchaseDetails.status}  productID=${purchaseDetails.productID}  '
          'transactionDate=${purchaseDetails.transactionDate}'
          'purchaseID=${purchaseDetails.purchaseID}  transactionDate=${purchaseDetails.transactionDate}'
          'verificationData.localVerificationData=${purchaseDetails.verificationData.localVerificationData}'
          'verificationData.serverVerificationData=${purchaseDetails.verificationData.serverVerificationData}'
          'verificationData.source=${purchaseDetails.verificationData.source}');
      if (purchaseDetails.status == PurchaseStatus.pending) {
        /// 等待购买中
      } else if (purchaseDetails.status == PurchaseStatus.canceled) {
        /// 取消订单
        InAppPurchase.instance.completePurchase(purchaseDetails);
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          /// 购买出错
          WSToastUtil.show('Purchase error');
          InAppPurchase.instance.completePurchase(purchaseDetails);
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
            purchaseDetails.status == PurchaseStatus.restored) {
          if (purchaseDetails.pendingCompletePurchase) {
            await InAppPurchase.instance.completePurchase(purchaseDetails);
          }
          if (purchaseDetails.productID == dataMap['goodsCode']) {
            // 支付成功，发放商品
            await deliverProduct(purchaseDetails, dataMap);
          }
        }
      }
    }
  }

  /// 调用后台接口,发放商品
  static Future<void> deliverProduct(PurchaseDetails purchaseDetails, Map dataMap) async {
    String code = dataMap['goodsCode'];
    String payload = purchaseDetails.verificationData.serverVerificationData;
    String transactionId = purchaseDetails.purchaseID!;
    var res = await paymentIpa(dataMap['orderNo'], payload, transactionId);
    // todo 调用后台接口
  }
}

class PaymentQueueDelegate implements SKPaymentQueueDelegateWrapper {
  @override
  bool shouldContinueTransaction(SKPaymentTransactionWrapper transaction, SKStorefrontWrapper storefront) {
    return true;
  }

  @override
  bool shouldShowPriceConsent() {
    return false;
  }
}


```


## 参考

- [https://pub.dev/packages/in_app_purchase](https://pub.dev/packages/in_app_purchase)
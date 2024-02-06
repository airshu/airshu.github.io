---
title: Flutter与Android通信
toc: true
tags: Flutter
---

## PlatformChannel

Flutter可以通过PlatformChannel与原生侧互发消息，有三种类型：

- MethodChannel：用于传递方法调用
- EventChannel：用于传递事件（单向）
- BasicMessageChannel：用于传递数据，比如可以获取native层的图片数据进行展示

### 一些概念

- **BinaryMessenger**

BinaryMessenger 是 PlatformChannel 与 Flutter 端的通信的工具，其通信使用的消息格式为二进制格式数据，BinaryMessenger 在 Android 中是一个接口，它的实现类为 FlutterNativeView

- **Codec**

Codec 是消息编解码器，主要用于将二进制格式的数据转化为 Handler 能够识别的数据，Flutter 定义了两种 Codec：MessageCodec 和 MethodCodec。MessageCodec 用于二进制格式数据与基础数据之间的编解码，BasicMessageChannel 所使用的编解码器是 MessageCodec。MethodChannel 和 EventChannel 所使用的编解码均为 MethodCodec

- **Handler**

Flutter 定义了三种类型的 Handler，它们与 PlatformChannel 类型一一对应，分别是 MessageHandler、MethodHandler、StreamHandler。在使用 PlatformChannel 时，会为它注册一个 Handler，PlatformChannel 会将该二进制数据通过 Codec 解码为转化为 Handler 能够识别的数据，并交给 Handler 处理。当 Handler 处理完消息之后，会通过回调函数返回 result，将 result 通过编解码器编码为二进制格式数据，通过 BinaryMessenger 发送回 Flutter 端

## MethodChannel

### Flutter侧写法

```dart
// 构造一个MethodChannel 参数定义一个唯一的通道名
static const platform = MethodChannel('methodChannelDemo');
// 调用native的方法，第一个参数为方法名，第二个为参数
// 可以设置返回类型
// result为native的方法的返回值 
final result = await platform.invokeMethod<int>('increment', {'count': 1});

// 监听底层来的方法回调
platform.setMethodCallHandler((MethodCall call){

if(call.method == 'callDart') {

}
});

```

### native侧写法

```java

override fun configureFlutterEngine(flutterEngine: FlutterEngine) {

    val channel = MethodChannel(flutterEngine.dartExecutor, "methodChannelDemo")
    channel.setMethodCallHandler { call, result ->
                    val count: Int? = call.argument<Int>("count")

                    if (count == null) {
                        result.error("INVALID ARGUMENT", "Value of count cannot be null", null)
                    } else {
                        when (call.method) {
                            "increment" -> result.success(count + 1)
                            "decrement" -> result.success(count - 1)
                            else -> result.notImplemented()
                        }
                    }
                }

    //调用dart侧的方法 参数分别为方法、参数、回调，需要在主线程中调用
    channel.invokeMethod("callDart", "Hello",  object: MethodChannel.Result {
            override fun success(result: Any?) {
                
            }

            override fun error(errorCode: String, errorMessage: String?, errorDetails: Any?) {
                
            }

            override fun notImplemented() {
                
            }

        })

}


```

## EventChannel

### Flutter侧写法

```dart

/// 监听stream
StreamBuilder<AccelerometerReadings>(
          stream: Accelerometer.readings,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Text((snapshot.error as PlatformException).message!);
            } else if (snapshot.hasData) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'x axis: ${snapshot.data!.x.toStringAsFixed(3)}',
                    style: textStyle,
                  ),
                  Text(
                    'y axis: ${snapshot.data!.y.toStringAsFixed(3)}',
                    style: textStyle,
                  ),
                  Text(
                    'z axis: ${snapshot.data!.z.toStringAsFixed(3)}',
                    style: textStyle,
                  )
                ],
              );
            }

            return Text(
              'No Data Available',
              style: textStyle,
            );
          },
        )

class Accelerometer {
  static const _eventChannel = EventChannel('eventChannelDemo');

  /// Method responsible for providing a stream of [AccelerometerReadings] to listen
  /// to value changes from the Accelerometer sensor.
  static Stream<AccelerometerReadings> get readings {
    return _eventChannel.receiveBroadcastStream().map(
          (dynamic event) => AccelerometerReadings(
            event[0] as double,
            event[1] as double,
            event[2] as double,
          ),
        );
  }
}

class AccelerometerReadings {
  /// Acceleration force along the x-axis.
  final double x;

  /// Acceleration force along the y-axis.
  final double y;

  /// Acceleration force along the z-axis.
  final double z;

  AccelerometerReadings(this.x, this.y, this.z);
}

```

### Native侧写法

```java


val sensorManger: SensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
val accelerometerSensor: Sensor = sensorManger.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
// 构造EventChannel 定义唯一标志
EventChannel(flutterEngine.dartExecutor, "eventChannelDemo")
        .setStreamHandler(AccelerometerStreamHandler(sensorManger, accelerometerSensor))



// 继承EventChannel.StreamHandler
class AccelerometerStreamHandler(sManager: SensorManager, s: Sensor) : EventChannel.StreamHandler, SensorEventListener {
    private val sensorManager: SensorManager = sManager
    private val accelerometerSensor: Sensor = s
    private lateinit var eventSink: EventChannel.EventSink

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        if (events != null) {
            eventSink = events
            sensorManager.registerListener(this, accelerometerSensor, SensorManager.SENSOR_DELAY_UI)
        }
    }

    override fun onCancel(arguments: Any?) {
        sensorManager.unregisterListener(this)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onSensorChanged(sensorEvent: SensorEvent?) {
        if (sensorEvent != null) {
            val axisValues = listOf(sensorEvent.values[0], sensorEvent.values[1], sensorEvent.values[2])
            eventSink.success(axisValues)//向flutter发送数据
        } else {
            eventSink.error("DATA_UNAVAILABLE", "Cannot get accelerometer data", null)
        }
    }
}

```

## BasicMessageChannel

可以用来传递如图片等数据，有以下编码格式：

- StandardMessageCodec
- BinaryCodec
- JSONMessageCodec
- StringCodec

### Flutter侧写法

```dart

class PlatformImageFetcher {
    //有
  static const _basicMessageChannel =
      BasicMessageChannel<dynamic>('platformImageDemo', StandardMessageCodec());

  /// Method responsible for providing the platform image.
  static Future<Uint8List> getImage() async {
    //请求数据
    final reply = await _basicMessageChannel.send('getImage') as Uint8List?;
    if (reply == null) {
      throw PlatformException(
        code: 'Error',
        message: 'Failed to load Platform Image',
        details: null,
      );
    }
    return reply;
  }
}


```

### Native侧

```java

// Registers a MessageHandler for BasicMessageChannel to receive a message from Dart and send
// image data in reply.
BasicMessageChannel(flutterEngine.dartExecutor, "platformImageDemo", StandardMessageCodec())
    .setMessageHandler { message, reply ->
        if (message == "getImage") {
            val inputStream: InputStream = assets.open("eat_new_orleans.jpg")
            reply.reply(inputStream.readBytes())//回传数据
        }
    }


```

## 参考

- [Flutter与原生通信总结](https://www.jianshu.com/p/5b731e539db7)
- [Flutter 安卓 Platform 与 Dart 端消息通信方式 Channel 源码解析](https://blog.csdn.net/yanbober/article/details/119521158?spm=1001.2014.3001.5501)
- [flutter通信机制-EventChannel](https://juejin.cn/post/6844904159951618061)

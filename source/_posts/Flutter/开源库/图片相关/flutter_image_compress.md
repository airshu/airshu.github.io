---
title: flutter_image_compress
tags: Flutter
---

- [https://pub.dev/packages/flutter_image_compress](https://pub.dev/packages/flutter_image_compress)
- [https://github.com/fluttercandies/flutter_image_compress](https://github.com/fluttercandies/flutter_image_compress)

图片压缩工具


```dart

  // 1. compress file and get Uint8List
  // 根据配置压缩图片
  Future<Uint8List> testCompressFile(File file) async {
    var result = await FlutterImageCompress.compressWithFile(
      file.absolute.path,
      minWidth: 2300,
      minHeight: 1500,
      quality: 94,
      rotate: 90,
    );
    print(file.lengthSync());
    print(result.length);
    return result;
  }

  // 2. compress file and get file.
  // 将图片压缩成新的图片
  Future<File> testCompressAndGetFile(File file, String targetPath) async {
    var result = await FlutterImageCompress.compressAndGetFile(
        file.absolute.path, targetPath,
        quality: 88,
        rotate: 180,
      );

    print(file.lengthSync());
    print(result.lengthSync());

    return result;
  }

  // 3. compress asset and get Uint8List.
  // 压缩asset的图片，返回Uint8List类型
  Future<Uint8List> testCompressAsset(String assetName) async {
    var list = await FlutterImageCompress.compressAssetImage(
      assetName,
      minHeight: 1920,
      minWidth: 1080,
      quality: 96,
      rotate: 180,
    );

    return list;
  }

  // 4. compress Uint8List and get another Uint8List.
  // 对Uint8List图片数据进行压缩
  Future<Uint8List> testComporessList(Uint8List list) async {
    var result = await FlutterImageCompress.compressWithList(
      list,
      minHeight: 1920,
      minWidth: 1080,
      quality: 96,
      rotate: 135,
    );
    print(list.length);
    print(result.length);
    return result;
  }


```

## 常用参数

- rotate

需要旋转，可使用此参数


- quality

图片质量，如果是png格式，在iOS端会被忽略

- format

支持jpeg、png，默认是jpeg

---
title: Map
toc: true
tags: Dart
---


## 遍历

```dart
// 使用 forEach 进行遍历
president.forEach( (key, value){
    print("forEach 遍历 : $key : $value");
} );

// 2 . 通过 for 循环遍历 Map 集合
// 调用 Map 对象的 keys 成员 , 返回一个由 键 Key 组成的数组
for (var key in president.keys){
    print("for 循环遍历 : Key : $key , Value : ${president[key]}");
}

// 3 . 使用 map 方法进行遍历
// 遍历过程中生成新的 Map 集合
// 遍历后 , 会返回一个新的 Map 集合
// 传入一个回调函数 , 参数是 key value , 返回值是新的 Map 集合
Map president2 = president.map(
        (key, value){
        // 这里将 Map 集合中的 Key 和 Value 进行颠倒 , 生成一个新的 Map 集合
        return MapEntry(value, key);
    }
);

// 打印新的 Map 集合
print(president2);


```
---
title: Android中的集合
tags: Android
toc: true
---



## SparseArray

SparseArray由两个数组mKeys和mValues存放数据;其中key的类型为int型，这就显得SparseArray比HashMap`更省内存`一些。SparseArray存储的元素都是按元素的key
值从小到大排列好的。使用二分查找来判断元素的位置，数据量较小时比HashMap更快。


- SparseIntArray：当map的结构为Map<Integer,Integer>的时候使用，效率较高。
- SparseBooleanArray: 当map的结构为Map<Integer,Boolean>的时候使用，效率较高。
- SparseLongArray: 当map的结构为Map<Integer,Long>的时候使用，效率较高。
- LongSparseArray: 当map的结构为Map<Long,Value>的时候使用，效率较高。

```java
SparseArray<String> sparseArray = new SparseArray<>();
sparseArray.put(1,"A");
sparseArray.put(2,"B");
Log.i(TAG, "init: "+sparseArray.toString());
```


## ArrayMap

ArrayMap是一个键值对映射的数据结构，它设计上更多的是考虑内存的优化，内部是使用两个数组进行数据存储，一个数组记录key的hash值，另外一个数组记录Value值，
它和SparseArray一样，也会对key使用二分法进行从小到大排序，区别是ArrayMap的key是hash值。


```java
ArrayMap<String ,String> arrayMap = new ArrayMap<>();
arrayMap.put("a","A");
arrayMap.put("b","B");
Log.i(TAG, "init: "+arrayMap.toString());
```



## 参考

- [http://gityuan.com/2019/01/13/arraymap/](http://gityuan.com/2019/01/13/arraymap/) 



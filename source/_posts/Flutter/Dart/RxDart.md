---
title: RxDart
toc: true
tags: Dart
---


ReactX的dart实现，React X的原理可参考[](./技术开发/杂项/ReactiveX)

## Stream相关API

### CombineLatestStream（combine2，combine3...combine9）/Rx.combineLatest2...Rx.combineLatest9

![](./combineLatest.png)

将多个流进行结合，可以定义自己的合并规则。

### ConcatStream/Rx.concat

![](./concat.png)

按顺序一个个拼接起来

### ConcatEagerStream/Rx.concatEager

**与concat的区别**

1. 流订阅的顺序：

- concat：按照提供的顺序依次订阅流。它会等待每个流完成后再订阅下一个流。
- concatEager：立即订阅所有的流，而不等待任何流完成。事件的发射顺序基于流的顺序。

2. 流的完成：

- concat：等待每个流完成后再进行下一个流的订阅。只有当前流完成后，才会订阅下一个流。
- concatEager：不等待任何流完成。它立即订阅所有的流，并在每个流的事件到达时进行发射。

3. 事件的发射：

- concat：从第一个流开始发射事件，直到它完成，然后发射第二个流的事件，依此类推。
- concatEager：无论任何流是否完成，都会发射所有流的事件。

总结起来，concat是一个顺序连接的操作符，在移动到下一个流之前等待每个流完成。而concatEager是一个急切连接的操作符，立即订阅所有的流，并在事件到达时发射它们，而不等待任何流完成。

以上是GPT的回答，并给出的具体例子，但结果却跟描述的不一样，不知道是不是dart的实现有问题，😳

```dart
Rx.concat([
    Stream.fromFuture(Future.delayed(Duration(seconds: 2), () => 'Stream 1')),
    Stream.fromFuture(Future.delayed(Duration(seconds: 1), () => 'Stream 2')),
  ]).listen(print); // 预期输出：Stream 1，Stream 2


  Rx.concatEager([
    Stream.fromFuture(Future.delayed(Duration(seconds: 2), () => 'Stream 1')),
    Stream.fromFuture(Future.delayed(Duration(seconds: 1), () => 'Stream 2')),
  ]).listen(print); // 预期输出：Stream 2，Stream 1
```


### DeferStream/Rx.defer

在被订阅时才创建和发射源流

```dart
  final deferStream = DeferStream(() => Stream.fromIterable([1, 2, 3]));
  // 在这个时候，流还没有被创建
  print('Before subscription');
  deferStream.listen(print);  // 输出：1, 2, 3
  // 当我们订阅流的时候，流才被创建并发射事件
  print('After subscription');
```

### ForkJoinStream(join2,join3...join9)/Rx.forkJoin2...Rx.forkJoin9

等待所有的输入流发射完毕，然后将每个输入流的最后一个元素组合成一个列表并发射出去。如果任何一个输入流没有发射元素，那么结果流也不会发射元素。如果任何一个输入流发生错误，那么结果流也会发生错误。

```dart
  final streamA = Stream.fromIterable([1, 2, 3]).delay(Duration(seconds: 2));
  final streamB = Stream.fromIterable([4, 5, 6]).delay(Duration(seconds: 1));

  ForkJoinStream.list([streamA, streamB]).listen(print);  // 输出：[3, 6]
```

### FromCallableStream/Rx.fromCallable

可以从一个可以调用的函数创建一个流。这个函数在流被订阅的时候调用，并且它的返回值会被发射出去。如果函数抛出一个错误，那么这个错误会被流捕获并发射出去。

```dart
  final callable = () {
    return 'Hello, World!';
  };
  final stream = FromCallableStream(callable);
  stream.listen(print);  // 输出：Hello, World!
```

### MergeStream/Rx.merge

![](./merge.png)

同时订阅所有的输入流，并将所有流的事件按照它们到达的顺序发射出去

```dart
  final streamA = Stream.fromIterable([1, 2, 3]).delay(Duration(seconds: 2));
  final streamB = Stream.fromIterable([4, 5, 6]).delay(Duration(seconds: 1));

  MergeStream([streamA, streamB]).listen(print);  // 输出：4, 5, 6, 1, 2, 3

```

### NeverStream/Rx.never

不会发射数据事件、错误事件或完成事件。它可以用于需要一个永远不会完成的流的场景。

### RaceStream/Rx.race

![](./race.png)

会同时订阅所有的输入流，但只会发射第一个发射事件的流的事件。一旦有一个流发射了事件，其他的流就会被忽略

```dart
  final streamA = Stream.fromIterable([1, 2, 3]).delay(Duration(seconds: 2));
  final streamB = Stream.fromIterable([4, 5, 6]).delay(Duration(seconds: 1));
  RaceStream([streamA, streamB]).listen(print);  // 输出：4, 5, 6
```

### RangeStream/Rx.range

RangeStream接受两个参数：范围的开始值和结束值。它会创建一个流，这个流会从开始值开始，一直到结束值结束，每次发射下一个整数。

```dart
  RangeStream(1, 3).listen(print);  // 输出：1, 2, 3
```

### RepeatStream/Rx.repeat

RepeatStream接受两个参数：一个返回流的函数和一个重复次数。它会创建一个新的流，这个流会重复发射源流的事件指定的次数。

```dart
  final stream = Stream.fromIterable([1, 2, 3]);
  RepeatStream(() => stream, 2).listen(print);  // 输出：1, 2, 3, 1, 2, 3
```


### RetryStream/Rx.retry

RetryStream接受两个参数：一个返回流的函数和一个重试次数。如果源流发射了一个错误事件，RetryStream会重新订阅源流，直到达到指定的重试次数。

### RetryWhenStream/Rx.retryWhen

RetryStream接受两个参数：一个返回流的函数和一个重试次数。如果源流发射了一个错误事件，RetryStream会重新订阅源流，直到达到指定的重试次数

```dart
  int attempt = 0;
  final retryStream = RetryStream(() {
    attempt++;
    print('==>>$attempt');
    if (attempt < 3) {
      return Stream<int>.error(Exception('Error'));
    } else {
      return Stream.fromIterable([1, 2, 3]);
    }
  }, 3);
  retryStream.listen(print, onError: (e) => print('###'+e.toString()));  // 输出：1, 2, 3
```

在这个示例中，我们创建了一个RetryStream，它会在源流发射错误事件时重新订阅源流。源流在前两次都会发射一个错误事件，但在第三次时会发射1, 2, 3。因此，当我们订阅RetryStream时，它会依次发射1, 2, 3。

### SequenceEqualStream/Rx.sequenceEqual

![](./sequenceEqual.png)

SequenceEqualStream会同时订阅两个输入流，并比较它们发射的事件是否相同。如果两个流的事件完全相同（包括事件的顺序），那么结果流会发射一个true事件。否则，结果流会发射一个false事件

```dart
  final streamA = Stream.fromIterable([1, 2, 3]);
  final streamB = Stream.fromIterable([1, 2, 3]);

  SequenceEqualStream(streamA, streamB).listen(print);  // 输出：true

```


### SwitchLatestStream/Rx.switchLatest

SwitchLatestStream接受一个发射流的流作为输入，它会始终只订阅最新的流，并发射这个流的事件。当新的流到来时，它会取消订阅旧的流，并开始订阅新的流。

```dart
  final switchLatestStream = SwitchLatestStream<String>(
    Stream.fromIterable(<Stream<String>>[
      Stream.value('C'),
      Stream.value('D'),
      Stream.value('E'),
      Rx.timer('A', Duration(seconds: 1)),
      Stream.value('F'),
      Rx.timer('B', Duration(seconds: 2)),
    ]),
  );
  switchLatestStream.listen(print);
  //Stream.value('F'), Rx.timer('B', Duration(seconds: 2)),交换位置后的输出内容是什么呢？为什么？
```

### TimerStream/Rx.timer

TimerStream接受两个参数：一个是要发射的值，另一个是延迟的时间。它会创建一个流，这个流会在指定的延迟后发射指定的值。

### UsingStream/Rx.using

### ZipStream(zip2,zip3...zip9)/Rx.zip...Rx.zip9

![](./zip.png)

ZipStream接受一个流的列表和一个函数作为参数。这个函数接受一个包含每个流最新事件的列表，并返回一个值。当任何一个流发射一个新的事件时，ZipStream都会调用这个函数，并发射函数返回的值。



## 操作符


### buffer、bufferTime、bufferTest、bufferCount


![](./buffer.png)


```dart
  Stream.periodic(Duration(milliseconds: 100), (i) => i)
      .buffer(Stream.periodic(Duration(milliseconds: 160), (i) => i))
      .listen(print); // prints [0, 1] [2, 3] [4, 5] ...

  RangeStream(1, 4).bufferCount(2).listen(print); // prints [1, 2], [3, 4] done!

  //startBufferEvery 表示跳过几个元素开始新的buffer
  RangeStream(1, 5).bufferCount(3, 2).listen(print); // prints [1, 2, 3], [3, 4, 5], [5] done!

  Stream.periodic(Duration(milliseconds: 100), (int i) => i)
      .bufferTest((i) => i % 2 == 0)
      .listen(print); // prints [0], [1, 2] [3, 4] [5, 6] ...

  Stream.periodic(Duration(milliseconds: 100), (int i) => i)
      .bufferTime(Duration(milliseconds: 220))
      .listen(print); // prints [0, 1] [2, 3] [4, 5] ...

```


### concatWith

接受一个流的列表作为参数。当原始流完成时，concatWith会开始监听列表中的下一个流。这个过程会一直持续，直到所有的流都完成。

```dart

  TimerStream(1, Duration(seconds: 10))
      .concatWith([Stream.fromIterable([2])])
      .listen(print); // prints 1, 2

  Stream.fromIterable([1, 2, 3])
    .concatWith([Stream.fromIterable([4, 5, 6])])
    .listen(print); // prints 1, 2, 3, 4, 5, 6 

```

### debounce、debounceTime

![](./debounce.png)


### delay、delayWhen

![](./delay.png)

延迟一段时间再发射


### flatMap、flatMapIterable

接受一个返回流的函数作为参数。这个函数接受源流的事件作为参数，并返回一个流。flatMap会将这个返回的流的所有事件合并到一个新的流中。flatMapIterable的转换函数返回一个可迭代对象（例如列表或集合），flatMapIterable会将这个**返回的可迭代对象**的所有元素合并到一个新的流中

```dart
  Stream.fromIterable([1, 2, 3])
      .flatMap((i) => Stream.fromIterable([i, i * 2]))
      .listen(print); // prints 1, 2, 2, 4, 3, 6

  Stream.fromIterable([1, 2, 3])
    .flatMapIterable((value) => [value, value * 2])
    .listen(print); // prints 1, 2, 2, 4, 3, 6

```

### mapTo

转换成常量

```dart
Stream.fromIterable([1, 2, 3, 4])
  .mapTo(true)
  .listen(print); // prints true, true, true, true
```

### mergeWith

将多个流按顺序按顺序按顺序合并成一个

```dart
TimerStream(1, Duration(seconds: 10))
    .mergeWith([Stream.fromIterable([2])])
    .listen(print); // prints 2, 1
```

### skipLast

跳过最后n个元素

```dart
Stream.fromIterable([1, 2, 3, 4, 5])
  .skipLast(3)
  .listen(print); // prints 1, 2
```

### takeLast、takeUntil、takeWhileInclusive

取最后n个元素

```dart
Stream.fromIterable([1, 2, 3, 4, 5])
  .takeLast(3)
  .listen(print); // prints 3, 4, 5
```

### window、windowTime、windowTest、windowCount

- window：它接受一个返回流的函数作为参数。每当这个函数返回的流发射事件时，window就会开始一个新的窗口，也就是一个新的流。源流的事件会被添加到当前的窗口中
- windowTime：它接受一个Duration作为参数。每隔指定的时间，windowTime就会开始一个新的窗口。源流的事件会被添加到当前的窗口中
- windowTest：它接受一个返回布尔值的函数作为参数。每当这个函数返回true时，windowTest就会开始一个新的窗口。源流的事件会被添加到当前的窗口中
- windowCount：它接受一个整数作为参数。每当源流发射指定数量的事件时，windowCount就会开始一个新的窗口

```dart

Stream.periodic(Duration(seconds: 1), (i) => i)
  .window(Stream.periodic(Duration(seconds: 5)))
  .asyncMap((stream) => stream.toList())
  .listen(print); // prints [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], ...

Stream.periodic(Duration(seconds: 1), (i) => i)
  .windowTime(Duration(seconds: 5))
  .asyncMap((stream) => stream.toList())
  .listen(print); // prints [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], ...

Stream.periodic(Duration(seconds: 1), (i) => i)
  .windowTest((i) => i % 5 == 0)
  .asyncMap((stream) => stream.toList())
  .listen(print); // prints [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], ...

Stream.periodic(Duration(seconds: 1), (i) => i)
  .windowCount(5)
  .asyncMap((stream) => stream.toList())
  .listen(print); // prints [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], ...

```


### zipWith

zipWith接受两个参数：一个流和一个函数。这个函数接受两个参数：源流的事件和另一个流的事件，并返回一个新的事件。zipWith会将这个函数返回的新的事件发射出去

```dart



```


### scan

对 Stream 序列应用累加器函数并返回每个中间结果。  种子值用作初始累加器值。

```dart
Stream.fromIterable([1, 2, 3])
   .scan((acc, curr, i) => acc + curr, 0)
   .listen(print); // prints 1, 3, 6
```




## 参考

- [https://colinzuo.github.io/dddtdd-docs/docs/frontend/flutter/reference/packages/rxdart/](https://colinzuo.github.io/dddtdd-docs/docs/frontend/flutter/reference/packages/rxdart/)
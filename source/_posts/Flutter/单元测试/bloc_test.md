---
title: bloc_test
toc: true
tags: Flutter 单元测试
---


## 创建Mock

```dart
import 'package:bloc_test/bloc_test.dart';

class MockCounterBloc extends MockBloc<CounterEvent, int> implements CounterBloc {}
class MockCounterCubit extends MockCubit<int> implements CounterCubit {}
```

## blocTest

```dart
void blocTest<B extends BlocBase<State>, State>(
  String description, { //测试的描述
  required B Function() build, //创建bloc
  FutureOr<void> Function()? setUp, //在每个测试用例执行前执行
  State Function()? seed,
  dynamic Function(B bloc)? act, //执行的动作
  Duration? wait,
  int skip = 0,
  dynamic Function()? expect, //期望的结果
  dynamic Function(B bloc)? verify,
  dynamic Function()? errors,
  FutureOr<void> Function()? tearDown, //在每个测试用例执行后执行
  dynamic tags,
})
```

### 参数

- setUp：前置设置
- tearDown：用例结束后的动作，可用于释放资源
- build（必需）：一个回调函数，用于创建BLoC的实例。在这个回调函数中，我们可以创建并返回要测试的BLoC实例
- seed：提供一个初始状态（state），该状态将在执行act之前用于初始化bloc。它是一个可选的回调函数，返回一个状态对象
- act（可选）：一个回调函数，用于执行BLoC的操作。在这个回调函数中，我们可以调用BLoC的方法或发送事件，以触发BLoC的状态变化
- expect（可选）：一个回调函数，用于定义预期的状态流或结果。在这个回调函数中，我们可以使用expect函数来定义预期的状态流或结果，以便与实际的状态流或结果进行比较         
- skip：用于指定是否跳过此测试。如果设置为true，则跳过此测试；如果设置为false或不提供该参数，则执行此测试。
- error：用于指定在执行act后预期bloc会抛出的错误。它接受一个返回Matcher的函数，该Matcher用于验证bloc抛出的错误是否符合预期。如果act执行后没有抛出错误，或者抛出的错误与预期不符，则测试将失败。
- verify：执行完expect后被调用，用于进行额外的验证和断言操作。该函数接受一个bloc对象作为参数，可以在函数体内对该对象进行操作和断言。
- tags：可添加测试标签，可以通过运行flutter test --tags=xxx来只运行带有"xxx"标签的测试


### 参数示例

#### build、act、expect

```dart
group('CounterBloc', () {
  blocTest(
    'emits [] when nothing is added',
    build: () => CounterBloc(),
    expect: () => [],
  );

  blocTest(
    'emits [1] when CounterIncrementPressed is added',
    build: () => CounterBloc(),
    act: (bloc) => bloc.add(CounterIncrementPressed()),
    expect: () => [1],
  );
});
```

#### seed

```dart
import 'package:bloc_test/bloc_test.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:xdragon/services/interceptors/verify_permission.dart';

class CounterEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class CounterIncrementEvent extends CounterEvent {}

class CounterDecrementEvent extends CounterEvent {}

class CounterState extends Equatable {
  final int count;

  CounterState(this.count);

  @override
  List<Object?> get props => [count];
}

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState(0)) {
    on<CounterIncrementEvent>(onCounterIncrementEvent);
    on<CounterDecrementEvent>(onCounterDecrementEvent);
  }

  void onCounterIncrementEvent(CounterEvent event, Emitter<CounterState> emit) {
    emit(CounterState(state.count + 1));
  }

  void onCounterDecrementEvent(CounterEvent event, Emitter<CounterState> emit) {
    emit(CounterState(state.count - 1));
  }
}

void main() {
  test('test event', () {
    expect(CounterEvent(), CounterEvent());
  });

  test('test state', () {
    expect(CounterState(10), CounterState(10));
  });

  blocTest<CounterBloc, CounterState>(
    'CounterBloc test ',
    build: () => CounterBloc(),
    seed: () => CounterState(10),
    act: (bloc) => bloc.add(CounterIncrementEvent()),
    expect: () => [CounterState(11)],
    verify: (bloc) {
      // 校验
      expect(bloc.state.count , 11);
    },
  );
}
```

#### errors

```dart
blocTest(
  'CounterBloc throws Exception when decrement is added',
  build: () => CounterBloc(),
  act: (bloc) => bloc.add(CounterEvent.decrement),
  errors: () => throwsA(isA<Exception>()),
);
```

#### verify

```dart
blocTest(
  'CounterBloc emits [1] when increment is added',
  build: () => CounterBloc(),
  act: (bloc) => bloc.add(CounterEvent.increment),
  expect: () => [1],
  verify: (bloc) {
    // 验证某个方法被调用了一次
    verify(() => repository.someMethod(any())).called(1);
    
    // 验证某个属性的值
    expect(bloc.someProperty, equals(42));
    
    // 进行其他的验证操作
    // ...
  },
);
```

## 测试event

```dart
//注意如果不继承Equatable，则会比较地址，前后两个event会不相等
sealed class PostEvent extends Equatable {
  @override
  List<Object> get props => [];
}

final class PostFetched extends PostEvent {}


void main() {
  group('PostEvent', () {
    group('PostFetched', () {
      test('supports value comparison', () {
        expect(PostFetched(), PostFetched());
      });
    });
  });
}
```

## 测试state

```dart
final class PostState extends Equatable {
const PostState({
  this.status = PostStatus.initial,
  this.hasReachedMax = false,
});

final PostStatus status;
final bool hasReachedMax;

PostState copyWith({
  PostStatus? status,
  bool? hasReachedMax,
}) {
  return PostState(
    status: status ?? this.status,
    hasReachedMax: hasReachedMax ?? this.hasReachedMax,
  );
}

@override
String toString() {
  return '''PostState { status: $status, hasReachedMax: $hasReachedMax }''';
}

@override
List<Object> get props => [status, hasReachedMax];

}


/// 同理，state也需要继承Equatable
void main() {
  group('PostState', () {
    test('supports value comparison', () {
      expect(PostState(), PostState());
      expect(
        PostState().toString(),
        PostState().toString(),
      );
    });
  });
}
```
- 

## 参考

- [https://pub.dev/packages/bloc_test](https://pub.dev/packages/bloc_test)
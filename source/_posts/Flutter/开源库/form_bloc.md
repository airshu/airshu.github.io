---
title: form_bloc
toc: true
tags: Flutter
---


form_bloc是结合bloc的表单库，运用bloc的特性实现UI和逻辑的分离，使得表单的逻辑更加清晰，代码更加简洁。


## 基本用法

```dart
import 'package:flutter/material.dart';
import 'package:flutter_form_bloc/flutter_form_bloc.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginForm(),
    );
  }
}

class LoginFormBloc extends FormBloc<String, String> {
  // 不同的表单项对应不同的FieldBloc
  final email = TextFieldBloc(
    validators: [
      FieldBlocValidators.required,
      FieldBlocValidators.email,
    ],
  );

  final password = TextFieldBloc(
    validators: [
      FieldBlocValidators.required,
    ],
  );

  final showSuccessResponse = BooleanFieldBloc();

  LoginFormBloc() {
    //添加表单项
    addFieldBlocs(
      fieldBlocs: [
        email,
        password,
        showSuccessResponse,
      ],
    );
  }

  /// 表单提交方法
  @override
  void onSubmitting() async {
    debugPrint(email.value);
    debugPrint(password.value);
    debugPrint(showSuccessResponse.value.toString());

    await Future<void>.delayed(const Duration(seconds: 1));

    // 提交进度变化
    emitSubmitting(progress: 0.2);
    await Future<void>.delayed(Duration(milliseconds: 400));    
    emitSubmitting(progress: 0.6);
    await Future<void>.delayed(Duration(milliseconds: 400));  
    emitSubmitting(progress: 1.0);
    //取消提交
    //emitSubmissionCancelled();

    if (showSuccessResponse.value) {
      emitSuccess(); //提交成功，发送成功消息，触发UI更新
    } else {
      emitFailure(failureResponse: 'This is an awesome error!'); //提交失败，发送失败消息，触发UI更新
    }
  }

  @override
  Future<void> close() {
    // 释放所有表单项
    email.close();
    password.close();
    showSuccessResponse.close();
    return super.close();
  }

}

class LoginForm extends StatelessWidget {
  const LoginForm({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LoginFormBloc(),
      child: Builder(
        builder: (context) {
          final loginFormBloc = context.read<LoginFormBloc>();

          return Scaffold(
            resizeToAvoidBottomInset: false,
            appBar: AppBar(title: const Text('Login')),
            body: FormBlocListener<LoginFormBloc, String, String>(
              onSubmitting: (context, state) {
                LoadingDialog.show(context);
              },
              onSubmissionFailed: (context, state) {
                LoadingDialog.hide(context);
              },
              onSuccess: (context, state) {
                LoadingDialog.hide(context);

                Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const SuccessScreen()));
              },
              onFailure: (context, state) {
                LoadingDialog.hide(context);

                ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(state.failureResponse!)));
              },
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                child: AutofillGroup(
                  child: Column(
                    children: <Widget>[
                      TextFieldBlocBuilder(
                        textFieldBloc: loginFormBloc.email,
                        keyboardType: TextInputType.emailAddress,
                        autofillHints: const [
                          AutofillHints.username,
                        ],
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          prefixIcon: Icon(Icons.email),
                        ),
                      ),
                      TextFieldBlocBuilder(
                        textFieldBloc: loginFormBloc.password,
                        suffixButton: SuffixButton.obscureText,
                        autofillHints: const [AutofillHints.password],
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock),
                        ),
                      ),
                      SizedBox(
                        width: 250,
                        child: CheckboxFieldBlocBuilder(
                          booleanFieldBloc: loginFormBloc.showSuccessResponse,
                          body: Container(
                            alignment: Alignment.centerLeft,
                            child: const Text('Show success response'),
                          ),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: loginFormBloc.submit,
                        child: const Text('LOGIN'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class LoadingDialog extends StatelessWidget {
  static void show(BuildContext context, {Key? key}) => showDialog<void>(
        context: context,
        useRootNavigator: false,
        barrierDismissible: false,
        builder: (_) => LoadingDialog(key: key),
      ).then((_) => FocusScope.of(context).requestFocus(FocusNode()));

  static void hide(BuildContext context) => Navigator.pop(context);

  const LoadingDialog({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => false,
      child: Center(
        child: Card(
          child: Container(
            width: 80,
            height: 80,
            padding: const EdgeInsets.all(12.0),
            child: const CircularProgressIndicator(),
          ),
        ),
      ),
    );
  }
}

class SuccessScreen extends StatelessWidget {
  const SuccessScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Icon(Icons.tag_faces, size: 100),
            const SizedBox(height: 10),
            const Text(
              'Success',
              style: TextStyle(fontSize: 54, color: Colors.black),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () => Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginForm())),
              icon: const Icon(Icons.replay),
              label: const Text('AGAIN'),
            ),
          ],
        ),
      ),
    );
  }
}


```


### 表单项类型

- SingleFieldBloc
- TextFieldBloc
- SelectFieldBloc
- InputFieldBloc
- MultiFieldBloc
- BooleanFieldBloc
- MultiSelectFieldBloc
- GroupFieldBloc：一组表单项
- ListFieldBloc

```dart

/// 更新数据
void updateValue(Value value) {}

/// 监听数据变化
StreamSubscription<dynamic> onValueChanges<R>({
    Duration debounceTime = const Duration(),
    void Function(State previous, State current)? onStart,
    required Stream<R> Function(State previous, State current) onData,
    void Function(State previous, State current, R result)? onFinish,
  }){}

/// 手动校验表单项
Future<bool> validate() {}
```

### FieldBloc的用法

表单的属性都通过FieldBloc来管理，比如是否必填、默认选项、校验规则等。


### FormBlocListener

FormBlocListener监听一个FormBloc的状态，并根据状态的变化来执行一些操作。它接受三个参数：一个FormBloc，一个在表单提交成功时执行的回调函数，和一个在表单提交失败时执行的回调函数。


```dart

FormBlocListener<MyFormBloc, String, String>(
  onSubmitting: (context, state) {
    // Show a loading indicator
  },
  onSuccess: (context, state) {
    // Navigate to another screen
  },
  onFailure: (context, state) {
    // Show an error message
  },
  child: ...,
)

```

### BlocBuilder

用于连接FieldBloc和任何Widget，有以下类型：

- TextFieldBlocBuilder
- DropdownFieldBlocBuilder
- RadioButtonGroupFieldBlocBuilder
- CheckboxFieldBlocBuilder
- SwitchFieldBlocBuilder
- CheckboxGroupFieldBlocBuilder
- DateTimeFieldBlocBuilder
- TimeFieldBlocBuilder

```dart
TextFieldBlocBuilder(
  textFieldBloc: loginFormBloc.email,//关联bloc
  autofillHints: [AutofillHints.username,AutofillHints.email],
  keyboardType: TextInputType.emailAddress,
  decoration: InputDecoration(
    labelText: 'Email',
    prefixIcon: Icon(Icons.email),
  ),
),
```


### 展示表单项的错误提示

```dart

xxx.addFieldError('That username is taken. Try another.');

```

## 加载初始数据

### 1. FormBloc构造函数的isLoading设置为true


### 2. 实现onLoading方法，使用updateInitialValue（updateItems）方法更新数据。完成数据赋值后，发送emitLoaded消息

```dart
  var _throwException = true;

  @override
  void onLoading() async {
    try {
      await Future<void>.delayed(Duration(milliseconds: 1500));

      if (_throwException) {
        // Simulate network error
        throw Exception('Network request failed. Please try again later.');
      }

      text.updateInitialValue('I am prefilled');

      select
        ..updateItems(['Option A', 'Option B', 'Option C'])
        ..updateInitialValue('Option B');

      emitLoaded();
    } catch (e) {
      _throwException = false;

      emitLoadFailed();
    }
  }


```

### 3. UI层处理

```dart
child: BlocBuilder<LoadingFormBloc, FormBlocState>(
  condition: (previous, current) {
    //优化刷新频率
    return previous.runtimeType != current.runtimeType;
  },
  builder: (context, state) {
    //根据不同状态显示不同的UI
    if (state is FormBlocLoading) {
      return LoadingWidget();
    } else if (state is FormBlocLoadFailed) {
      return LoadFailedWidget();
    } else {
      return LoadedWidget();
    }
  },
),

```

## 表单项关联校验

```dart

class MyFormBloc extends FormBloc<String, String> {
  final password = TextFieldBloc(
    validators: [FieldBlocValidators.required],
  );
  final confirmPassword = TextFieldBloc(
    validators: [FieldBlocValidators.required],
  );


  Validator<String> _confirmPassword(
    TextFieldBloc passwordTextFieldBloc,
  ) {
    return (String confirmPassword) {
      if (confirmPassword == passwordTextFieldBloc.value) {
        return null;
      }
      return 'Must be equal to password';
    };
  }

  MyFormBloc() {
    addFieldBlocs(
      fieldBlocs: [password, confirmPassword],
    );

    confirmPassword
      ..addValidators([_confirmPassword(password)])
      ..subscribeToFieldBlocs([password]);

    // Or you can use built-in confirm password validator
    // confirmPassword
    //   ..addValidators([FieldBlocValidators.confirmPassword(password)])
    //   ..subscribeToFieldBlocs([password]);
  }

}  


```


## 动态添加或删除表单项

使用addFieldBlocs和removeFieldBlocs方法


## 自定义表单项

### 1. 自定义FieldBloc

```dart

class CustomFieldBloc extends SingleFieldBloc<String, String, CustomState<T>, T?> {
  CustomFieldBloc({
    String? initialValue,
    required String Function(String value) validator,
  }) : super(
          initialValue: initialValue, //初始值
          validator: validator, //校验器
          asyncValidators: [], //异步校验器
          asyncValidatorDebounceTime: Duration.zero, //异步校验器的防抖时间
          initialState: CustomState(),
        );

  @override
  String toString() {
    return 'CustomFieldBloc';
  }
}
```

### 2. 自定义Widget，关联FieldBloc

```dart

class CustomFieldBlocBuilder extends StatelessWidget {
  final CustomFieldBloc fieldBloc;

  const CustomFieldBlocBuilder({
    Key? key,
    required this.fieldBloc,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CustomFieldBloc, CustomState>(
      bloc: fieldBloc,
      builder: (context, state) {
        return TextField(
          onChanged: (value) {
            fieldBloc.updateValue(value);
          },
          decoration: InputDecoration(
            labelText: 'Custom',
            errorText: state.error,
          ),
        );
      },
    );
  }
}

```


## 参考

- [https://pub.dev/packages/form_bloc](https://pub.dev/packages/form_bloc)
- [https://giancarlocode.github.io/form_bloc/#/](https://giancarlocode.github.io/form_bloc/#/)
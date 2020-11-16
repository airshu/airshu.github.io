---
layout: post
title: Python扩展
category: Python
tags: Python 
keywords: Python
description: 
---

官方文档：[https://docs.python.org/zh-cn/3/extending/extending.html](https://docs.python.org/zh-cn/3/extending/extending.html)

** 什么时候要用扩展

- **性能瓶颈**：比如某些计算在Python中很慢，比如GIL导致CPU只能使用单核。
- **代码保护**：将核心代码放到更低层，增加反编译难度。

** Hello World

**步骤**

1. 编写C文件
2. 编写包装文件
3. 编写setup文件
4. 编译、测试

### 1. 编写C文件

```C
//fib.c文件

long long _fib(long long n){
    if(n < 2)
        return n;
    else
        return _fib(n-1) + _fib(n-2);
};


```

### 2. 编写包装文件

```C
//speedup_fib.c



#include <Python.h> //导入基础的头文件


//封装函数
static PyObject *fib(PyObject *self, PyObject *args) {

    // Arguments
   long long n;

   long long res;

   if (!PyArg_ParseTuple(args, "l", &n)) //转换输入参数类型给C
       return NULL;

   res = _fib(n);//调用函数

   return Py_BuildValue("l", res);//结果转换成Python类型
};

//模块方法表
static PyMethodDef SpeedupFibMethods[] = {
    {"speedup_fib", (PyCFunction) fib, METH_VARARGS, "fast fib"},
    {NULL, NULL, 0, NULL}
};


static struct PyModuleDef speedup_fib_module = {
    PyModuleDef_HEAD_INIT,
    "speedup_fib",//模块名字
    "A module containing methods with faster fib.",
    -1,
    SpeedupFibMethods
};


//创建模块
PyMODINIT_FUNC PyInit_speedup_fib() {
  return PyModule_Create(&speedup_fib_module);
}
```

### 3. 编写setup.py文件

```Python


from distutils.core import setup, Extension
speedup_fib_module = Extension('speedup_fib', sources=['speedup_fib.c'])
setup(
    name='SpeedupFoo',
    description='A package containing modules for speeding up fib.',
    ext_modules=[speedup_fib_module],
)

```

### 4. 编译、测试

> python setup.py build

编译成功后会在build文件夹生成动态库，windows下为pyd，linux下为so

**编写测试脚本**

```Python
import time


def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)


start_ts = time.time()
print(fib_recursive(35))
print(time.time() - start_ts)

from speedup_fib import speedup_fib
start_ts = time.time()
print(speedup_fib(35))
print(time.time() - start_ts)

```

## 基本概念




## 实例代码
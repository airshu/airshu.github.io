---
title: Python虚拟环境配置
tags: Python 
toc: true
---

### 虚拟环境的用途

不需要完整的安装一遍依赖库，类似gradle的版本管理。比如你需要同时使用Rx1.6和Rx3.1，要么整两份Python环境，要么使用Virtualenv。

### PyCharm中使用

1. 选择File->New Project
2. 选择Pure Python，点击Project Interpreter：New Virtualenv environment
3. 选择依赖的解释器，勾选Inherit global site-packages，这样会继承原来的第三方库，勾选Make available to all projects，所有的项目都可用。

### 使用Python命令

```Python

安装virtualenv
pip install virtualenv

安装虚拟环境，同时将原有依赖添加到虚拟环境中
virtualenv --system-site-packages venv

安装虚拟环境，不添加任务依赖，默认值
virtualenv --no-site-packages venv

在Scripts目录中
activate命令可进行交互模式
deactivate退出交互模式
```

### 参考

- [https://www.jianshu.com/p/dcb281ee564e](https://www.jianshu.com/p/dcb281ee564e)
- [https://virtualenv.pypa.io/en/latest/](https://virtualenv.pypa.io/en/latest/)

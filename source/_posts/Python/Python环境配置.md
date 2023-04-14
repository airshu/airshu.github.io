---
title: Python环境配置管理
tags: Python 
toc: true
---


类似Java中的jenv、Flutter的fvm工具，Python也有多版本管理工具，这里推荐使用pyenv。

先记录下Mac m1的默认python环境

Mac OS 12.3之后系统去掉了Python2，Mac上的默认Python环境可能有：

|python版本|Python路径|支持的架构｜备注
|---|---|---|----|
Python3.x|/usr/bin/python3|x86_64 arm64|Xcode自带的Python环境,/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions目录两种可能有多个版本
Python3.x｜​​/usr/local/bin/python3.8​​｜​​x86_64​​｜Rosetta2转译版brew安装的Python
​​Python3.10.9​​｜​​/opt/homebrew/bin/python3​​｜​​arm64​​｜本地编译brew安装的Python (原生支持m1)
​​Python3.9.15​​｜​​/opt/homebrew/Caskroom/​​​​miniforge/base/bin/python​​|通过本地编译brew安装的mini-forge中base环境的Python

在做版本管理的时候建议使用pyenv，使用brew安装后的目录查找起来很麻烦


## pyenv使用

```
#安装pyenv
brew install pyenv

#配置环境变量 
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

#安装某个python版本
pyenv install 3.10.4
# 查看所有版本
pyenv versions
#切换python版本
pyenv global 3.10.4
#当前shell切换python版本
pyenv shell 3.10.4 
#卸载
pyenv uninstall 3.10.4
```

### 同一个python版本不同环境

```
#安装pyenv-virtualenv
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
pyenv virtualenv 3.10.4 frida16
# 查看工作环境列表
pyenv virtualenvs 

#对应的工作环境目录为~/.pyenv/versions/3.10.4/envs/frida16

# 激活环境
pyenv activate frida16

#退出环境
pyenv deactivate

# 删除工作环境
pyenv virtualenv-delete frida16
```


### 参考

- [https://www.jianshu.com/p/dcb281ee564e](https://www.jianshu.com/p/dcb281ee564e)
- [https://virtualenv.pypa.io/en/latest/](https://virtualenv.pypa.io/en/latest/)
- [谈谈MacOS下的Python版本管理问题 原创](https://blog.51cto.com/u_15366127/6006974)

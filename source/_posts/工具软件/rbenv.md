---
title: Ruby版本管理工具rbenv
category: 工具软件
tags:
toc: true
---


类似Java、Python、Flutter，Ruby也进行版本管理，主流有rvm、rbenv两种方案，这里因为Java选择jenv，看名字选的rbenv。其实大家的原理都是一样的，通过修改Path来指定对应版本

## 安装和使用

```

brew install rbenv ruby-build

# 添加以下内容到zshrc文件中
eval "$(rbenv init - zsh)"

# 查看最新稳定版本号
rbenv install -l

# 列出本地所有版本
rbenv install -L

# 安装具体版本
rbenv install 3.1.2

# 指定全局版本
rbenv global 3.1.2

# 指定当前目录使用的版本
rbenv local 3.1.2

# 卸载具体某个版本
rbenv uninstall 3.1.2

# 展示安装的版本 
rbenv versions

# 展示当前使用的版本
rbenv version

# 卸载rbenv
rm -rf "$(rbenv root)"
brew uninstall rbenv

```

## 参考

- [https://github.com/rbenv/rbenv](https://github.com/rbenv/rbenv)
---
title: dart_eval和flutter_eval
toc: true
tags: Flutter 动态化
---


dart_eval 是一种基于 Dart AOT 动态执行 Dart 代码的技术，能够实现动态化（CodePush），支持 Flutter。它包含编译器和解释器，均使用 Dart 语言编写，并支持可扩展（如扩展 Flutter 支持）。

dart_eval 由两个 Repo 构成：

- dart_eval：提供 dart 代码动态执行能力。https://github.com/ethanblake4/dart_eval
- flutter_eval：基于 dart_eval，扩展 Flutter 代码动态化执行能力。https://github.com/ethanblake4/flutter_eval




1. 预埋位置
2. 安装命令：dart pub global activate dart_eval，命令安装在$HOME/.pub-cache/bin/目录
3. 动态生成evc文件，dart_eval compile -o version_xxx.evc，上传服务器



## 参考

[《Dart eval：Compiler 类》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ACompiler%20%E7%B1%BB.html)、
[《Dart Analyzer：Declaration 实体》](https://www.maxieewong.com/Dart%20Analyzer%EF%BC%9ADeclaration%20%E5%AE%9E%E4%BD%93.html)
[《Dart eval：BridgeDeclaration 实体类》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ABridgeDeclaration%20%E5%AE%9E%E4%BD%93%E7%B1%BB.html)
[《Dart eval：DeclarationOrBridge 实体类》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ADeclarationOrBridge%20%E5%AE%9E%E4%BD%93%E7%B1%BB.html)
[《Dart eval：DartCompilationUnit 实体类》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ADartCompilationUnit%20%E5%AE%9E%E4%BD%93%E7%B1%BB.html)
[《Dart eval：Library 实体类》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ALibrary%20%E5%AE%9E%E4%BD%93%E7%B1%BB.html)
[《Dart import 语法》](https://www.maxieewong.com/Dart%20import%20%E8%AF%AD%E6%B3%95.html)
[《Dart Analyzer：ImportDirective 实体》](https://www.maxieewong.com/Dart%20Analyzer%EF%BC%9AImportDirective%20%E5%AE%9E%E4%BD%93.html)
[《Dart eval：exportGraph 概念》](https://www.maxieewong.com/Dart%20eval%EF%BC%9AexportGraph%20%E6%A6%82%E5%BF%B5.html)
[《Dart eval：Program 类》](https://www.maxieewong.com/Dart%20eval%EF%BC%9AProgram%20%E7%B1%BB.html)
[《Dart eval：compile 系列方法的调用链》](https://www.maxieewong.com/Dart%20eval%EF%BC%9Acompile%20%E7%B3%BB%E5%88%97%E6%96%B9%E6%B3%95%E7%9A%84%E8%B0%83%E7%94%A8%E9%93%BE.html)
[《Dart eval：Compiler populateLookupTablesForDeclaration》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ACompiler%20populateLookupTablesForDeclaration.html)
[《Dart Analyzer：TopLevelVariableDeclaration》](https://www.maxieewong.com/Dart%20Analyzer%EF%BC%9ATopLevelVariableDeclaration.html)
[《Dart eval：compileIdentifierAsReference》](https://www.maxieewong.com/Dart%20eval%EF%BC%9AcompileIdentifierAsReference.html)
[《Dart eval：CompilerContext 编译器上下文》](https://www.maxieewong.com/Dart%20eval%EF%BC%9ACompilerContext%20%E7%BC%96%E8%AF%91%E5%99%A8%E4%B8%8A%E4%B8%8B%E6%96%87.html)
[《Dart eval：compileIdentifier》](https://www.maxieewong.com/Dart%20eval%EF%BC%9AcompileIdentifier.html)
[《Dart Analyzer：Identifier》](https://www.maxieewong.com/Dart%20Analyzer%EF%BC%9AIdentifier.html)



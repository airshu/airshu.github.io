---
title: toggle_buttons
toc: true
tags: Flutter
---



```dart

const ToggleButtons({
    Key key,
    @required this.children,
    @required this.isSelected,
    this.onPressed,             // 点击状态
    this.mouseCursor,
    this.textStyle,             // 文本样式
    this.constraints,           // 宽高最大最小限制
    this.color,                 // 未选中颜色
    this.selectedColor,         // 选中颜色
    this.disabledColor,         // 不可选中颜色
    this.fillColor,             // 填充颜色
    this.focusColor,            // 有输入焦点时颜色
    this.highlightColor,        // 选中时高亮颜色
    this.hoverColor,            // 初始水波纹颜色
    this.splashColor,           // 选中时水波纹颜色
    this.focusNodes,            // 接受对应于每个切换按钮焦点列表
    this.renderBorder = true,   // 是否绘制边框
    this.borderColor,           // 未选中边框颜色
    this.selectedBorderColor,   // 选中边框颜色
    this.disabledBorderColor,   // 不可选中边框颜色
    this.borderRadius,          // 边框圆角弧度
    this.borderWidth,           // 边框宽度
})
```
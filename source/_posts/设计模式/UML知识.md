---
title: UML知识
date: 2018-06-01 10:01:01
toc: true
---


## 继承关系

使用带空心箭头带实线

![](./uml_generalization.jpg)

## 实现关系

使用带空心箭头带虚线

![](./uml_realize.jpg)

## 聚合关系

使用带空心菱形箭头的直线

![](./uml_aggregation.jpg)

聚合关系表示实体对象之间的关系，表示整体有部分构成。与组合关系有所不同，整体和部分不是强依赖的。比如：部门撤销了，人员还在。



## 组合关系

使用带实心菱形箭头直线

![](./uml_composition.jpg)

组合关系是强依赖的，比如：公司不存在了，部门也就不存在了。

## 关联关系

使用带箭头带实线

![](./uml_association.jpg)

关联关系是一种静态关系，通常与运行状态无关。关联对象通常是以成员变量的形式实现的

## 依赖关系

使用带箭头带虚线

![](./uml_dependency.jpg)

描述一个对象在运行期间会用到另一个对象的关系。在代码中，依赖关系体现为类构造方法及类方法的传入参数，箭头的指向为调用关系；依赖关系除了临时知道对方外，还是使用对方的方法和属性


## 参考

- [https://test-design-patterns.readthedocs.io/zh/latest/read_uml.html](https://test-design-patterns.readthedocs.io/zh/latest/read_uml.html)

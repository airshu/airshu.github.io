---
layout: post
title: "Essential Actionscript3.0 读书笔记(一、核心概念)"
description: ""
category: AS3
tags: [actionscript, essential actionscript3.0]
---

#### 第一章：核心概念

什么是程序？程序是由一组可被计算机编译并执行的指令。大家能够看懂的程序中的文本叫做源代码。写这个代码的人叫程序猿，高级一点的叫法叫软件工程师。不同的程序由不同的语言实现，就像有人讲英语有人讲法语。

**写ActionScript代码的工具**

你可以使用任何一种文本编辑器来写，也可以使用Flash Builder或Flash Professional等IDE来写，甚至可以使用VIM编辑器来写，看个人喜好啦！但个人建议刚开始学时可以用纯文本的形式+命令行编译，这样能够更深刻的了解运行原理，后面开始做项目了推荐使用Flash Builder等大型IDE，里面集成的工具方便你调试和更快的开发。

**Flash客户端运行时环境**

ActionScript代码可以被三种不同的应用软件执行：Flash Player、Adobe AIR、Flash Lite。

**编译**

为了能让Flash运行时环境能够执行ActionScript代码，需要对其进行编译，将其转换成ActionScript字节码，并包装到swf文件中。

**实时编译**

一种利用在运行时将字节码(Bytecode)翻译为机器码(Machine code)，并保存在内存中, 在后续的运行中直接调用机器码, 从而改善字节码编译语言性能的技术。这个技术比较高深，特别是在研究指令集的时候会碰到。需要深入学习的话，请查阅相关资料。

**类和对象**

试想一下，如果让你造一架飞机，你会怎么做？嗯，应该先画一张图纸，然后制造图纸上不同的零件然后组装起来。在程序世界中，也是这样，先有不同的类，类可以表示有形或无形的东西，比如可以表示数字，可以表示可点击的按钮，可以表示图片模糊的效果。类的实例的集合就构成一个应用程序啦！

在ActionScript中定义了以下基本类型：

<table>
	<tr>
		<td>类</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>String</td>
		<td>字符串，表示文本数据</td>
	</tr>
	<tr>
		<td>Boolean</td>
		<td>布尔值，表示逻辑状态真或假</td>
	</tr>
	<tr>
		<td>Number</td>
		<td>浮点型数字</td>
	</tr>
	<tr>
		<td>int</td>
		<td>整型数字</td>
	</tr>
	<tr>
		<td>uint</td>
		<td>正数整型数字</td>
	</tr>
	<tr>
		<td>Array</td>
		<td>数组，有序集合</td>
	</tr>
	<tr>
		<td>Error</td>
		<td>程序错误的类</td>
	</tr>
	<tr>
		<td>Date</td>
		<td>时间类</td>
	</tr>
	<tr>
		<td>Math</td>
		<td>数学运算类</td>
	</tr>
	<tr>
		<td>RegExp</td>
		<td>正则表达式</td>
	</tr>
	<tr>
		<td>Function</td>
		<td>可执行、可重用的指令集和</td>
	</tr>
	<tr>
		<td>Object</td>
		<td>所有ActionScript类的基类</td>
	</tr>
</table>

**创建一个程序**

一个应用程序由多个类文件构成，类文件包含类名、多个Function，由一个主类文件作为整个程序的入口。ActionScript类文件都是以扩展名为.as结尾的文本文件。这里我们新建一个名叫virtualzoo的程序，目录结构如下：
	
	virtualzoo
		|- src
			|- VirtualZoo.as

**包**

为什么要有包的概念？可以想像，如果所有的类文件都放到同一个目录下，那同名了肿么办？因此，你可以创建复杂的包结构，将不同类型的类放在不同的包中。基本的写法如下：

	package packageName {
		public ClassA(){}
	}

这里的packageName表示包的权限定名，就是说，如果你的类文件在A文件夹的B文件夹中，则packageName为A.B。(文件夹之间以.号隔开)package是ActionScript的关键字。什么叫关键字呢，最简单的理解就是有关键作用的字，哈哈！现在你要记住的就是它是关键字，关键字不能作为类名、方法名来用。package告诉ActionScript要创建一个叫packageName的包，包后面的花括号里定义了很多语句块。

下面我们将VirtualZoo文件放到包zoo中，目录结构为下：

	virtualzoo
		|- src
			|- zoo
				|- VirtualZoo.as	

**定义类**

为了定义类，我们要使用class关键字：

	class Identifier {
	}
	
类定义以class关键字开始，后面跟着类名(是不是跟包的定义很类似)。类的名字也有要求，不能以数字开头，只能包含下划线、字母、数字、美元符号$。

**类访问控制修饰符**

默认情况下，一个类只能被同一个包下的其他类访问。但可以通过访问修饰符来改变访问权限。在ActionScript中，类有以下访问权限：

	public:全局可以访问
	internal(或不写)：当前包下访问
	
**构造函数**

构造函数是类初始化的入口，写法如下：

	class SomeClass{
		function SomeClass(){
		}
	}

构造函数的名字和类名是一样的！funciton关键字表示函数，函数名后面的小括号包含了传递进来的参数。花括号里为函数体。如果类没有定义构造函数，则ActionScript会提供一个默认的不带参数的构造函数。
从ActionScript3.0开始，构造函数的默认访问修饰符都是public，所以上面的写法跟下面的写法效果是一样的：

	class SomeClass{
		public function SomeClass(){
		}
	}
	
**创建对象**

为了创建一个类的对象(实例化)，我们使用new关键字。例如，我们要创建一个VirtualPet实例：

	new VirtualPet
	
同一个类可以创建多个实例。例如：

	new VirtualPet
	new VirtualPet
	
**Literal语法**

对于ActionScript内建类型，有一些类型有更简便的实例化方法。比如，我们创建一个Number值为25.4的变量，可以直接用：

	25.4

定义一个字符串使用：

	"hello"
	
定义布尔值：

	true

Literal 语法也可以用在Object、Function、RegExp和XML类上。

**对象创建实例：向动物园添加一个动物**

现在我们知道如何创建对象，我们可以向动物园添加一个动物了：

	package zoo {
		public class VirtualZoo {
			public function VirtualZoo() {
				new VirtualPet
			}
		}
	}

这里要注意访问权限的问题，在zoo包下的类默认情况下只能访问该包内的其他类，如果要访问外部包的公共类，需要用import关键字引用该类，如：

	package zoo {
	
		import flash.media.Sound;
		
		public class VirtualZoo {
			public function VirtualZoo() {
				new Sound
			}
		}
	}
	
**变量和值**

变量和值是一种对应关系，每个变量都会有一个值，但在ActionScript中还有两种特殊情况，null和undefined，分别表示没有值和未定义。变量是关联到一个值的标识符。比如，一个变量可能是标识符submitBtn，它关联到一个设置按钮。

变量可以分为不同的种类：局部变量、实例变量、动态实例变量和静态变量。

**局部变量**

在函数内定义的变量叫布局变量。定义变量用关键字var，以;结束，";"表示语句的结束。

	class SomeClass {
		public function SomeClass ( ) {
			var identifier = value;
		}
	}

identifier表示变量的名字，value表示变量的值。

**实例变量**

实例变量直接在类定义的里面定义：

	class SomeClass {
		var identifier = value;
	}
	
可以通过类的实例加"."来访问某个非私有实例变量，如：

	someClass.identifier

实例变量与布局变量的区别在于它们的生命周期不同。

变量的访问修饰符有：public、internal、protected、private。public修饰的实例变量可以被包内和包外所有的类访问，internal修饰的实例变量只能被包内的类访问。protected修饰的实例变量只能被类本身或其子类访问。private修饰的实例变量只能在类内部访问。

**构造函数参数**

构造函数参数是一个特殊的局部变量，但又不像局部变量那样需要用var关键字来定义。定义格式如下：

	class SomeClass {
		funciton SomeClass(identifier = value){
		}
	}
	
实例化SomeClass的方法：

	new SomeClass(value)
	
如果构造函数参数有默认值，则表示该参数是可选的。

**表达式**

	new Date()
	2.5
	4 * 2.5
	
	var quality = 100;
	var price = 50;
	var total = quality*price;
	
以上都为表达式，通过不同操作符连接起来。

**实例方法**

实例方法定义了对象可以做的事情。比如Sound类定义了实例方法play来播放声音。

	class SomeClass {
		function identifier ( ) {
		}
	}










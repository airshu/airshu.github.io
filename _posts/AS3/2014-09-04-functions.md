---
layout: post
title: "Essential Actionscript3.0 读书笔记(四、函数)"
description: ""
category: AS3
tags: [actionscript, essential actionscript3.0]
---

#### 第四章、函数

ActionScript3.0种有两类函数：方法和函数闭包。将函数成为方法还是函数闭包取决于函数的上下文。如果在类定义的一部分或将它附加到对象的实例，则称方法。如果以其他方式定义函数(方法内部、包定义内部、包定义外部)，则称函数闭包。函数的定义：

	function funName(param1, param2,...):void
	{
	}

使用关键字function定义，funName为函数的名字，后面接参数，函数可以有返回值，如果没有返回值则使用void。函数的调用：

	funName(param1Value, parame2Value, ....);

**包级别函数**

下面的例子定义了一个包级别函数isMac()，编译时会把这个函数单独编译成一个.as文件，名字为isMac.as：

	package utilities {
		import flash.system.*;
		
		internal function isMac ( ) {
			return Capabilities.os == "MacOS";
		}
	}

如果需要全局使用，则用public修饰该函数。

调用这个函数的时候需要导入该函数：

	package setup {
		// Import isMac( ) so it can be used within this package body
		import utilities.isMac;
			public class Welcome {
			public function Welcome ( ) {
				// Use isMac( )
				if (isMac( )) {
					// Do something Macintosh-specific
				}
			}
		}
	}

**嵌套函数**

在函数内部声明的函数叫嵌套函数。

	// Define method a( )
		public function a ( ) {
			// Invoke nested function b( )
			b( );
		// Define nested function b( )
		function b ( ) {
			// Function body would be inserted here
		}
	}
	
嵌套函数的定义的可以写在函数内部的任意位置，可以在最前面调用该函数，这种方式被称为向前引用。嵌套函数不能使用修饰符。函数的定义有两种方式：函数语句和函数表达式。上面的例子中就是函数表达式，函数语句的写法如下：

	class Example
	{
		var methodExpression = function() {}
		function methodStatement() {}
	}

**源文件级别函数**

当函数定义在包定义的外部时，被称作源文件级别函数。

	package {
		// Ok to use f( ) here
		class A {
		// Ok to use f( ) here
			public function A ( ) {
			// Ok to use f( ) here
			}
		}
	}
	
	// Ok to use f( ) here
	function f ( ) {
	}
	
函数还能作为函数的参数来传递，如setInterval(fun, intervalTime)函数：

	package {
		import flash.utils.setInterval;
		public class Clock {
			public function Clock ( ) {
				// Execute the function literal once per second
				setInterval(function ( ) {
					trace("Tick!");
				}, 1000);
			}
		}
	}
	
或者：

	package {
		import flash.utils.setInterval;
		public class Clock {
			public function Clock ( ) {
			// Execute tick( ) once per second
				setInterval(tick, 1000);
				function tick ( ):void {
					trace("Tick!");
				}
			}
		}
	}

**递归函数**

	function trouble ( ) {
		trouble( );
	}	
	
递归函数在解决某些问题的时候非常有用，详细的用法请google之。
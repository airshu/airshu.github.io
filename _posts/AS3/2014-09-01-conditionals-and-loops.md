---
layout: post
title: "Essential Actionscript3.0 读书笔记(二、条件语句和循环)"
description: ""
category: ACTIONSCRIPT
tags: [actionscript, essential actionscript3.0]
---

#### 第二章：条件语句和循环

**条件语句**

ActionScript提供两种类型的条件语句：if语句和switch语句。还提供了条件操作符 " ? :"。

if语句的写法：

	if (testExpression) {
		codeBlock1
	} else {
		codeBlock2
	}

如果testExpression的值为真，则执行codeBlock1语句块，如果为假则执行codeBlock2语句块。

switch语句的写法：

	switch (testExpression) {
		case expression1:
			codeBlock1
			break;
		case expression2:
			codeBlock2
			break;
		default:
			codeBlock3
	}

如果testExpression的值等于expression1，则执行codeBlock1，依此类推。如果break表示跳出该层逻辑，如果没有break;则会一直按顺序执行下去。如果表达式不等于case中的值，则会执行default后面的语句块。


**循环**

ActionScript提供了5种循环：while、do-while、for、for-in、for-each-in。

while语句的写法：

	while(testExpression) {
		codeBlock
	}
	
除了表达式为false来结束循环外，可以使用break来结束。例如：

	var i = 0;
	while(i<10){
		trace(i++);
		if(i == 5)
			break;
	}
	
do-while语句的写法：

	do {
		codeBlock
	} while (testExpression);

语句块codeBlock会先执行一次，然后在判断testExpression表达式的值是否为真。

for语句的写法：

	for (initialization; testExpression; update) {
		codeBlock
	}

initialization语句进行初始化操作，如果表达式testExpression为真，则执行codeBlock语句块，然后执行update语句，再判断testExpression表达式是否为真，为真继续执行codeBlock语句块...。例如：

	var total = 2;
	for(var i = 0; i<2; i++){
		total = total*2;
	}

**布尔逻辑**

通常使用：||(逻辑或)和&&(逻辑与)，逻辑非(!)

逻辑或(||)的用法：

	expression1 || expression2
	
如果表达式expression1或expression2两个中有一个是真的，则表达式的结果为真。这里需要注意的是，如果expression1已经为真了，则表达式expression2就不会进行计算了。

逻辑与(&&)的用法：

	expression1 && expression2

如果表达式expression1和expression2的值都为真，结果才为真。

逻辑非(!)的用法：

	！expression

取表达式expression的反，如果表达式为真，则结果为假。

**可变长参数**

如果参数的个数是未知的话，可以使用... 来表示：

	function methodName(... argumentsArray){
	}
	
methodName表示方法的名字，argumentsArray是一个长度可变的数组。可以通过argumentsArray[index]来获取index位置的值。这个跟java中的main方法的参数是一样的。可以联系起来思考。有时候，可能某些参数是固定的，某些不是固定的，可以使用以下的方式：

	public function initializeUser (name, ...hobbies) {
	}
	
可变长参数在实际编程中用的并不多，用的多的是带默认值的参数，比如：

	function setCircle(width:int=100, height:int=100)
	{
	}
	
	setCircle();
	setCircle(200,200);
	setCircle(200)

以上三种调用方式都是正确的，没有复制的参数会使用默认值。




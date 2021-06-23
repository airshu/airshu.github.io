---
title: 《Kotlin实战》读书笔记
tags: [读书笔记]
---


##### 基本规则

- 不需要分号

##### 函数

- fun声明函数
- 函数可以定义在文件的最外层

```Kotlin
fun max(a: Int, b: Int): Int {
    return if(a>b) a else b
}
```

**表达式函数体**

    fun max(a: Int, b: Int): Int = if(a>b) a else b


表达式函数体可以省略返回类型，Kotlin会进行类型推导

    fun max(a: Int, b: Int)= if(a>b) a else b

数组就是类



##### 变量

- var表示可写属性
- val表示只读属性

```Kotlin
val answer = 42 //这个变量永不为null
var answer1:Int? = 40 // 这个变量可以为null
val answer:Int = 42
val表示不可变引用，使用val声明的变量不能在初始化之后再次赋值。
var可变引用，可以改变值，但不能改变类型。
var answer = 13
answer = "no " 这样是错误的
```

**字符串模板**

    $name
    ${name}

**类**

    class Person(val name:String)

    class Person(val name:String, var isMarried:Boolean)



**自定义访问器**

    class Rectangle(val height:Int, val width:Int) {
        val isSquare:Boolean
            get() {
                return height == width
            }
        //或者
        get() = height == width
    }

包层级结构不需要遵守目录层级结构

**枚举**

    enum class Color(val r:Int, val g:Int, val b:Int) {
    RED(255,0,0),GREEN(0,255,0);

    fun rgb() = (r*256 + g)*256 + b
    }
    println(Color.GREEN.rgb())


    fun getMnumonic(color: Color) = 
        when(color) {
            Color.RED -> "Richard"
            Color.GREEN -> "Gave"
        }



@JvmOverloads， 会生成Java重载函数

顶层属性和函数

扩展函数不能被重写

#### 扩展属性

vararg 修饰符  可变参数

#### 中缀调用

局部函数

kotlin类声明默认是final和public，要想声明不是final的，将其标记为open

open、final、abstract

lateinit

**object**

定义一个类并同事创建一个实例，使用场景：

- 对象声明是定义单例的一种方式
- 伴生对象可以持有工厂方法和其他与整个类相关，但在调用时并不依赖类实例的方法。
- 对象表达式用来替代Java的匿名内部类


```Java
object DataProviderManager {
    fun registarDataProvider(provider: DataProvider) {
        ...
    }
}

DataProviderManager.registarDataProvider(...)
```

**伴生对象companion**

```Java
class MyClaa {
    companion object Factory{
        fun create():MyClass = MyClass()
    }
}
//该伴生对象的成员可通过只使用类名作为限定符来调用
val instance = MyClass.create()

//可以省略伴生对象的名称，在这种情况下将使用名称 Companion
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```

在 JVM 平台，如果使用 @JvmStatic 注解，你可以将伴生对象的成员生成为真正的静态方法和字段

直接通过容器类名来访问整个对象的方法和属性的能力

匿名对象可以实现多个接口或者不实现接口


lamdba表达式始终用花括号包围

    val sum = {x: Int, y: Int -> x+y}
    println(sum(1,2))


允许lamdba内部访问非final变量甚至修改它们

成员引用

    val getAge = Person::age


all any  count  find  对集合应用判断式

with函数
apply



类型系统

可空性

    fun strLen(s:String) = s.length
    fun strLen(s:String?) = s.length

安全调用运算符 ?.，只要链式中一个值为null，则整个表达式都返回null

    s?.toUpperCase()

    val testStr : String? = null
    val result = testStr?.length?.plus(5)?.minus(10)
    println(result)

?:

当一个函数有返回值时，如果方法中的代码使用?.去返回一个值，那么方法的返回值的类型后面也要加上?符号

    fun funNullMethod() : Int? {
        val str : String? = "123456"
        return str?.length
    }


as?
 
非空断言  "!!"    显示地抛出异常

##### let函数

作用：使用符号?.验证的时候忽略掉null

用法：变量?.let{...}

    val arrTest : Array<Int?> = arrayOf(1,2,null,3,null,5,6,null)

    // 传统写法
    for (index in arrTest) {
        if (index == null){
            continue
        }
        println("index => $index")
    }

    // let写法
    for (index in arrTest) {
        index?.let { println("index => $it") }
    }

##### Evils操作符

**?:**

判断一个可空类型时，会返回一个我们自己设定好的默认值

    val testStr : String? = null
    var length = 0
    // ?: 写法
    length = testStr?.length ?: -1
    println(length)

**!!**

判断一个可空类型时，会显示的抛出空引用异常

    val testStr : String? = null
    println(testStr!!.length)

**as?**

安全的类型转换

    val num2 : Int? = "Koltin" as? Int
    println("nun2 = $num2)



基本类型、包装类型的转换需要通过API

Any  kotlin基类
Unit  kotlin中的void
Nothing    这个函数永不返回

List    listOf    mutableListOf、arrayListOf
Set    setOf    mutableSetOf、hashSetOf、linkedSetOf、sortedSetOf
Map    mapOf    mutableMapOf、hashMapOf、linkedMapOf、sortedMapOf


重载二元算术运算
operator

委托属性  by lazy()

kotlin允许使用对应名称的函数来重载一些标准的数学运算，但不能定义自己的运算符。


函数类型


内联函数

注解
@JvmName
@JvmStatic
@JvmOverloads
@JvmField


注解类：用来定义关联到声明和表达式的元数据的结构，它们不能包含任何代码

元注解
@Retention    说明你声明的注解是否会存储到.class文件，以及在运行时是否可以通过反射来访问它。

kotlin反射API

invoke

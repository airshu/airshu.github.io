---
title: C语言学习笔记
tags: C++
toc: true
---

## Hello World

```C
//文件名hello.c
//预处理指令
#include <stdio.h>

//入口函数
int main() {
    printf("hello world");
    return 0;
}


gcc hello.c
./a.out  //输出hello world

```

## C语言数据类型

- 字符型（char）：描述单个字符（一个字节），用半角的单引号包含起来，如'a'、'A'、'1'、'$'等，键盘能输入的英文和半角的符号都是字符。中文的汉字和标点符号是两个字节（GBK编码），不能算一个字符。
- 整型（int）：描述整数。
- 浮点型（float）：描述实数。
- 字符串：描述多个字符，用半角的双引号包含起来，可以是英文、数字、中文、标点符号，半角全角的都可以。
- 结构体（struct）：由基本类型通过一定的构造方法构造出来的类型，包括数组和结构体。
- 指针类型：指针可以存放内存变量和常量地址。
- 其他类型：如复数类型（\_Complex）、虚数类型（\_Imaginary）、布尔型（\_bool）等。


## 变量

### 变量的命名

变量名属于标识符，需要符合标识符的命名规范，具体如下：

1. 变量名的第一个字符必须是字母或下划线，不能是数字和其它字符。
2. 变量名中的字母是区分大小写的。比如a和A是不同的变量名，num和Num也是不同的变量名。
3. 变量名绝对不可以是C语言的关键字。

### 变量的定义和初始化

变量在定义后，操作系统为它分配了一块内存，但并不会把这块内存打扫干静，也就是说内存中可能有垃圾数据，建议在使用之间对其初始化（打扫干静）。

```C
int   ii;   // 定义整数型变量，用于存放整数。
char  cc;  // 定义字符型变量，用于存放字符。
double money;   // 定义浮点型变量，用于存放浮点数。
char name[21];   // 定义一个可以存放20字符的字符串。


//对整数型、字符型、浮点型变量来说，初始化就是给它们赋0值。
int   ii=0;   // 定义整数型变量并初始化
char  cc=0;  // 定义字符型变量并初始化
double money=0;   // 定义浮点型变量并初始化	

//也可以先定义，然后再初始化。
int   ii;  // 定义整数型变量
char  cc;  // 定义字符型变量
double money;   // 定义浮点型变量
ii=0;  // 初始化ii为0
cc=0;  // 初始化cc为0
money=0;  // 初始化money为0

//对字符串变量来说，初始化就是把内容清空，本质上也是赋0值。
char name[21];  // 定义一个可以存放20字符的字符串
memset(name,0,sizeof(name));   // 清空字符串name中的内容

//声明常量
const  double  pi = 3.1415926;

```

### C语言中的关键字

```C
auto：声明自动变量
break：跳出当前循环
case：开关语句分支
char：声明字符型变量或函数返回值类型
const：声明只读变量
continue：结束当前循环，开始下一轮循环
default：开关语句中的“默认”分支
do：循环语句的循环体
double：声明双精度浮点型变量或函数返回值类型
else：条件语句否定分支（与if连用）
enum：声明枚举类型
extern：声明变量或函数是在其它文件或本文件的其他位置定义
float：声明浮点型变量或函数返回值类型
for：一种循环语句
goto：无条件跳转语句
if：条件语句
int：声明整型变量或函数
long：声明长整型变量或函数返回值类型
register：声明寄存器变量
return：子程序返回语句（可以带参数，也可不带参数）
short：声明短整型变量或函数
signed：声明有符号类型变量或函数
sizeof：计算数据类型或变量长度（即所占字节数）
static：声明静态变量
struct：声明结构体类型
switch：用于开关语句
typedef：用以给数据类型取别名
unsigned：声明无符号类型变量或函数
union：声明共用体类型
void：声明函数无返回值或无参数，声明无类型指针
volatile：说明变量在程序执行中可被隐含地改变
while：循环语句的循环条件
```


## 输入和输出

```C
getchar：输入单个字符，保存到字符变量中。
gets：输入一行数据，保存到字符串变量中。
scanf：格式化输入函数，一次可以输入多个数据，保存到多个变量中。

putchar：输出单个字符。
puts：输出字符串。
printf：格式化输出函数，可输出常量、变量等。


int age=18;
char xb='x';
double weight=62.5;
char name[21];
memset(name,0,sizeof(name));
strcpy(name, "西施");
printf("我的姓名是：%s，姓别：%c，年龄：%d岁，体重%lf公斤。\n",name,xb,age,weight);


int age=0;
char xb=0;
double weight=0;

char name[21];
memset(name,0,sizeof(name));

printf("请输入您的姓名、姓别（x-男；y-女），年龄和体重，中间用空格分隔：");
scanf("%s %c %d %lf",name,&xb,&age,&weight); 

printf("您的姓名是：%s，姓别：%c，年龄：%d岁，体重%lf公斤。\n",name,xb,age,weight);
 

```


## 运算符

1. 算术运算符；
2. 赋值运算符；
3. sizeof运算符；
4. 关系运算符；
5. 逻辑运算符；
6. 位运算符。

### 算术运算符

| 运算符 | 描述 | 实例|
|----|----|----|
|+|两个数相加|A+B 将得到 23|
|-|一个数减另一个数|A-B 将得到 13|
|*|两个数相乘|A*B 将得到 90|
|/|分子除以分母|A/B 将得到 3.6|
|%|余数运算符，整除后的余数|B%A 将得到 3|
|++|自增运算符，整数值增加 1|A++ 将得到 19|
|--|自减运算符，整数值减少 1|A-- 将得到 17|

### 赋值运算符

| 运算符 | 描述 | 实例|
|----|----|----|
|=|简单的赋值运算符，把右边操作数的值赋给左边操作数|C = A + B 将把 A + B 的值赋给 C|
|+=|加且赋值运算符，把右边操作数加上左边操作数的结果赋值给左边操作数|C += A 相当于 C = C + A|
|-=|减且赋值运算符，把左边操作数减去右边操作数的结果赋值给左边操作数|C -= A 相当于 C = C - A|
|\*=|乘且赋值运算符，把右边操作数乘以左边操作数的结果赋值给左边操作数|C \*= A 相当于 C = C * A|
|/=|除且赋值运算符，把左边操作数除以右边操作数的结果赋值给左边操作数|C /= A 相当于 C = C / A|
|%=|求余数且赋值运算符，求两个操作数的模赋值给左边操作数，浮点数不适用取余数。|C %= A 相当于 C = C % A|


### sizeof运算符

用来计算变量（或数据类型）在当前系统中占用内存的字节数。sizeof不是函数，产生这样的疑问是因为sizeof的书写确实有点像函数，sizeof有两种写法：

```C
//用于数据类型，数据类型必须用括号括住。
sizeof(数据类型);

printf("字符型变量占用的内存是=%d\n",sizeof(char));   // 输出：字符型变量占用的内存是=1
printf("整型变量占用的内存是=%d\n",sizeof(int));   // 输出：整型变量占用的内存是=4

//用于变量
sizeof(变量名);
sizeof 变量名;

int ii;
printf("ii占用的内存是=%d\n",sizeof(ii));   // 输出：ii占用的内存是=4
printf("ii占用的内存是=%d\n",sizeof ii);   // 输出：ii占用的内存是=4

```

### 关系运算符


| 关系 | 数学中的表示 | C语言的表示|
|----|----|----|
|小于|<|<| 
|小于等于|≤|<=|
|大于|>|>| 
|大于等于|≥|>=|
|等于|=|==|
|不等于|≠|!=|

### 逻辑运算符

|运算符|描述|实例|
|----|----|----|
|&&|逻辑与|true && false 等于false|
|\|\||逻辑或|true && false 等于true|
|!|逻辑非|true的逻辑非为真|


### 三目运算符

> 表达式1?表达式2:表达式3;

先执行表达式1，如果表达式1的结果如果为真，那么执行表达式2，并且这个整体的运算式的结果是表达式2的结果；如果表达式1的结果如果为假，执行表达式3，运算式的结果是表达式3的结果。

```C
int year;
year=(year%100==0)?(year%400==0?1:0):(year%4==0?1:0);
```


## if、switch语句

```C
if(表达式){

} else {

}

switch (表达式)
{
case 整型数值1: 语句1;
case 整型数值2: 语句2;
......
case 整型数值n: 语句n;
default: 语句n+1;
}
//注意
//1. case后面必须是整数和字符，或者是结果为整数和字符的表达式，但不能包含任何变量
//2. default不是必须的。当没有 default时，如果所有case都匹配失败，那么就什么都不执行。
```

## 程序结构


### while循环

```C

while (表达式)
{
    if(表达式)语句块;
    if(表达式)break;//跳出当前循环
    if(表达式)continue; //跳转到循环的首部
}


do
{
    语句块
}  while (表达式)


int times=0;   // 记录用户输入数据的次数
int value=0;   // 用户每次从键盘输入的数据
int sum=0;     // 记录用户输入数据的和

while (sum<5000)  // 如果sum的值小于5000，进入循环
{
printf("请输入数字：");    // 提示用户输入
scanf("%d",&value);  // 接受用户从键盘输入的数据

times++;  // 用户输入数据的次数自增1
sum=sum+value;             // 记录用户输入数据的和
}

printf("您一共输入了%d个数据，和为%d。\n",times,sum);

```

### for循环

```C
for (语句1;表达式;语句2)
  {
    语句块
  }

```

1. for循环开始时，会先执行语句1，而且在整个循环过程中只执行一次语句1。
2. 接着判断表达式的条件，如果条件成立，就执行一次循环体中的语句块。
3. 语句块执行完后，接下来会执行语句2。
4. 重复第2）步和第3），直到表达式的条件不成立才结束for循环。

**注意：**

1. 在for循环中，语句1、表达式和语句2都可以为空，for (;;)等同于while (1)。
2. continue和break两个关键字也可以用在for循环体中。

```C
int ii=1;      // 用于for循环的计数器
  int sum=0;     // 记录1到100的累积值
 
  for (ii=1;ii<=100;ii++)
  {
    sum=sum+ii;
  }
 
  printf("1到100的累积值为%d。\n",sum);
```

## 数组

数组（array）是一组数据类型相同的变量，可以存放一组数据，它定义的语法是：

> 数据类型 数组名[数组长度];

定义数组的时候，数组的长度必须是整数，可以是常量，也可以是变量。数据的下标也必须是整数，可以是常量，也可以是变量。


```C
int ii[10];    // 定义一个整型数组变量
printf("sizeof(ii)=%d\n",sizeof(ii));     // 输出结果：sizeof(ii)=40

//数组初始化
int no[10];
memset(no,0,sizeof(no)); //第一个参数是数组名，第二个参数填0，第三个参数是数组占用的内存总空间，用sizeof(变量名)获取。

```

**二维数组**

> 数据类型 数组名[第一维的长度][第二维的长度];

```C
int    ii=0;          // 用于组别循环的计数器
int    jj=0;          // 用于超女人数循环的计数器
int    class=3;       // 小组总数，初始化为3
int    total=5;       // 每个组超女的总人数，初始化为5
double weight[class][total];  // 定义二维数组，存放超女的体重
double sum[class];    // 定义一维数组存放超女体重的和

memset(weight,0,sizeof(weight));   // 初始化数组为0
memset(sum,0,sizeof(sum));          // 初始化数组为0

// 采用两个循环，第一级循环为小组数，第二级循环为超女人数
for (ii=0;ii<class;ii++)
{
for (jj=0;jj<total;jj++)
{
  printf("请输入第%d组第%d名超女的体重：",ii+1,jj+1);
  scanf("%lf",&weight[ii][jj]);    // 接受从键盘输入的体重
  sum[ii]=sum[ii]+weight[ii][jj];  // 计算小组超女体重的和
}
}
```

### 字符串

字符串就是一个以空字符'\0'结束的字符数组，是一个特别的字符数组，这是约定，是规则。空字符'\0'也可以直接写成0。

![](./c_1.png)

```C
//初始化， 因为字符串需要用0结束，所以在定义字符串的时候，要预留多一个字节来存放0。
char name[21];  // 定义一个最多存放20个字符或10个汉字的字符串

//字符串是数组，当然可以用初始化数组的方法来初始化字符串。
memset(strname,0,sizeof(strname));

//字符串的赋值
strcpy(strword,"hello");
// 或者用以下代码
char strword[21];
memset(strword,0,sizeof(strword));
strword[0]='h';
strword[1]='e';
strword[2]='l';
strword[3]='l';
strword[4]='o';
strword[5]='\0';      // 或者 name[5]=0;
```


## 函数

### 函数声明

> return_type function_name( parameter list );

1. 返回值的数据类型return_type：函数执行完任务后的返回值，可以是int、char、double或其它自定义的数据类型。如果函数只执行任务而不返回值，return_type用关键字 void表示，如下：

```
void function_name( parameter list );
```

2. 函数名function_name：函数名是标识符，命名规则与变量相同。

3. 参数列表parameter list：当函数被调用时，调用者需要向函数传递参数。参数列表包括参数的数据类型和书写顺序。参数列表是可选的，也就是说，函数可以没有参数，如下：

```
return_type function_name();
```

### 函数定义

```C
//函数定义的return_type、function_name和parameter list必须与函数声明一致。
return_type function_name( parameter list )       // 注意，不要在函数定义的最后加分号。
  {
    // 实现函数功能的代码
  }
```

**注意：**

- #include <> 用于包含系统提供的头文件，编译的时候，gcc在系统的头文件目录中寻找头文件。
- #include "" 用于包含程序员自定义的头文件，编译的时候，gcc先在当前目录中寻找头文件，如果找不到，再到系统的头文件目录中寻找。


### 库函数

C语言标准库函数的声明的头文件存放在/usr/include目录中，如下：

```
<asset.h>  <ctype.h>  <errno.h>  <float.h>  <limits.h>
<locale.h>  <math.h>  <setjmp.h>  <signal.h>  <stdarg.h>
<stddef.h>  <stdlib.h>  <stdio.h>  <string.h>  <time.h>
```

## 变量的作用域

作用域是程序中定义的变量存在（或生效）的区域，超过该区域变量就不能被访问。C 语言中有四种地方可以定义变量。

1. 在所有函数外部定义的是全局变量。
2. 在头文件中定义的是全局变量。
3. 在函数或语句块内部定义的是局部变量。它们只能在该函数或语句块内部的语句使用。
4. 函数的参数是该函数的局部变量。

**注意**

- 局部变量和全局变量的名称可以相同，在某函数或语句块内部，如果局部变量名与全局变量名相同，就会屏蔽全局变量而使用局部变量。


## 指针

**变量**

内存变量简称变量，在C语言中，每定义一个变量，系统就会给变量分配一块内存，而内存是有地址的。如果把计算机的内存区域比喻成一个大宾馆，每块内存的地址就像宾馆房间的编号。

```C

  int    ii=10;
  char   cc='A';
  double dd=100.56;
 //在printf函数中，输出内存地址的格式控制符是%p，地址采用十六进制的数字显示。
  printf("变量ii的地址是：%p\n",&ii);
  printf("变量cc的地址是：%p\n",&cc);
  printf("变量dd的地址是：%p\n",&dd);
```

**指针**

指针是一种特别变量，全称是指针变量，专用于存放其它变量在内存中的地址编号，指针在使用之前要先声明，语法是：

```C
datatype *varname;

datatype 是指针的基类型，它必须是一个有效的C数据类型（int、char、double或其它自定义的数据类型），varname 是指针的名称。用来声明指针的星号 * 与乘法中使用的星号是相同的。

int  *ip;  // 一个整型的指针
char  *cp;  // 一个字符型的指针
double  *dp;  // 一个 double 型的指针

int ii = 10;
int *pii = 0;  // 定义整数型指针并初始化
pii = &ii;  // 数型指针指向变量ii
// 通过指针操作内存变量，改变内存变量的值
*pii = 20;    // 同ii=20;
printf("pii的值是：%p\n", pii);
printf("*pii的值是：%d\n", *pii);
printf("ii的值是：%d\n", ii);


//空指针
int *pi=0;  // 定义一个指针
*pi=10;  // 试图对空指针进行赋值操作，必将引起程序的崩溃

//地址的运算
char   cc[4];   // 字符数组
int    ii[4];   // 整数数组
double dd[4];   // 浮点数组
// 用地址相加的方式显示数组全部元素的的址
printf("%p %p %p %p\n",cc,cc+1,cc+2,cc+3);
printf("%p %p %p %p\n",ii,ii+1,ii+2,ii+3);
printf("%p %p %p %p\n",dd,dd+1,dd+2,dd+3);

//指针也是一种内存变量，是内存变量就要占用内存空间，在C语言中，任何类型的指针占用8字节的内存（32位操作系统4字节）。
printf("sizeof(int *) is %d.\n",sizeof(int *));        // 输出：sizeof(int *) is 8
printf("sizeof(char *) is %d.\n",sizeof(char *));      // 输出：sizeof(char *) is 8
printf("sizeof(double *) is %d.\n",sizeof(double *));  // 输出：sizeof(double *) is 8

```

## 整数

在定义整型变量的时候，可以在int关键字之前加signed、unsigned、short和long四种修饰符。

- signed：有符号的，可以表示正数和负数。
- unsigned：无符号的，只能表示正数，例如数组的下标、人的身高等。
- short：短的，现在主流的64位操作系统下，整数占用内存4个字节。
- long：长的，更长的整数。

### 整数的取值范围

整数的取值范围与计算机操作系统和C语言编译器有关，没有一个固定的数值，我们可以根据它占用的内存大小来推断它的取值范围。

```C
一个字节有8个位，表示的数据的取值范围是28-1，即255。
如果占用的内存是两个字节，无符号型取值范围是2**8ⅹ2**8-1。
如果占用的内存是四个字节，无符号型取值范围是2**8ⅹ2**8ⅹ2**8ⅹ2**8-1。
如果占用的内存是八个字节，无符号型取值范围是2**8ⅹ2**8ⅹ2**8ⅹ2**8ⅹ2**8ⅹ2**8ⅹ2**8ⅹ2**8-1。
如果是有符号，取值范围减半，因为符号占一个位。

short si;   // 短整数
int   ii;   // 整数
long  li;   // 长整数

printf("sizeof short is %d\n",sizeof(short));
printf("sizeof int is %d\n",sizeof(int));
printf("sizeof long is %d\n",sizeof(long));
```

|类型简写|类型全称|长度|取值范围|
|----|----|----|----|
|short|[signed] short [int]|2字节|-32768~32767|
|unsigned short|unsigned short [int]|2字节|0~65535|
|int|[signed] int|4字节|-2147483648~2147483647|
|unsigned int|unsigned [int]|4字节|0~4294967295|
|long|[signed] long [int]|8字节|-9223372036854775808~9223372036854775807|
|unsigned long|unsigned long [int]|8字节|0~18446744073709551615|

**注意：**

1. 计算机用最高位1位来表达符号（0-正数，1-负数），unsigned修饰过的正整数不需要符号位，在表达正整数的时候比signed修饰的正整数取值大一倍。
2. 在写程序的时候，上表中括号[]的单词可以省略不书写。
3. 在写程序的时候，给整数变量赋值不能超出变量的取值范围，编译的时候会出现类似以下的错误，程序运行也可能产生不可预后的后果。

**常用的库函数**

```C
int  atoi(const char *nptr);   // 把字符串nptr转换为int整数
long atol(const char *nptr);     // 把字符串nptr转换为long整数
int  abs(const int j);            // 求int整数的绝对值
long labs(const long int j);     // 求long整数的绝对值
```

**数据类型的别名**

```C
typedef unsigned int size_t;
size_t ii; 等同于 unsigned int ii;
```

## 类型转换


### 自动类型转换

整型类型级别从低到高依次为：

signed char->unsigned char->short->unsigned short->int->unsigned int->long->unsigned long

浮点型级别从低到高依次为：

float->double

1. 操作数中没有浮点型数据时

当 char、unsigned char、short 或 unsigned short 出现在表达式中参与运算时，一般将其自动转换为 int 类型。
int 与 unsigned int混合运算时，int自动转换为unsigned int型。
int、unsigned int 与 long 混合运算时，均转换为 long 类型。

2. 操作数中有浮点型数据时

当操作数中含有浮点型数据时，所有操作数都将转换为 double 型。

3. 赋值运算符两侧的类型不一致时

当赋值运算符的右值（可能为常量、变量或表达式）类型与左值类型不一致时，将右值类型提升/降低为左值类型。

4. 右值超出左值类型范围时

赋值运算符右值的范围超出了左值类型的表示范围，将把该右值截断后，赋给左值。所得结果可能毫无意义。


### 强制类型转换

> (目标类型) 表达式;


## 结构体


结构体（struct）来存放一组不同类型的数据。语法如下：

```C
struct 结构体名
{
  结构体成员变量一的声明;
  结构体成员变量二的声明;
  结构体成员变量三的声明;
  ......
  结构体成员变量四的声明;
};

struct st_girl
{
  char name[51];   // 姓名
  int  age;        // 年龄
  int  height;     // 身高，单位：cm
  int  weight;     // 体重，单位：kg
  char sc[31];     // 身材，火辣；普通；飞机场
  char yz[31];     // 颜值，漂亮；一般；歪瓜裂枣
};

//结构体是一种程序员自定义的数据类型，是模板，可以用它来定义变量
struct st_girl queen, princess, waiting, workers;

struct st_girl queen;
printf("sizeof(struct st_girl) %d\n",sizeof(struct st_girl));
printf("sizeof(queen) %d\n",sizeof(queen));	

//C语言提供了结构体成员内存对齐的方法，在定义结构体之前，增加以下代码可以使结构体成员变量之间的内存没有空隙。
#pragma pack(1)


//和数组不一样，结构体变量名不是结构体变量的地址，结构体变量名就是变量名，就象int ii一样，只是不能直接输出，直接输出没有意义。取地址要用&
struct st_girl stgirl;
printf("%d\n",stgirl);   // 没有意义。
printf("%p\n",stgirl);   // 没有意义，结构体变量名不是结构体变量的地址。
printf("%p\n",&stgirl);  // 这才是结构体的地址。

//结构体的初始化
memset(&queen,0,sizeof(struct st_girl));
//或
memset(&queen,0,sizeof(queen));

//注意事项，如果把一个结构体的地址传给子函数，子函数用一个结构体指针（如struct st_girl *pst）来存放传入的结构体的地址，那么，在子函数中只能用以下方法来初始化结构体
memset(pst,0,sizeof(struct st_girl));

//结构体指针
struct st_girl queen;
struct st_girl *pst=&queen;	
//结构体指针使用成员变量
(*pointer).memberName
pointer->memberName

//结构体复制
struct st_girl girl1,girl2;
strcpy(girl1.name,"西施");  // 对girl1的成员赋值
girl1.age=18;
memcpy(&girl2,&girl1,sizeof(struct st_girl));

//结构体是多个变量集合，作为函数参数时就可以传递整个集合，也就是所有成员。如果结构体成员较多，函数参数的初始化和赋值的内存开销会很大，影响程序的运行效率。所以最好的办法就是传递结构体变量的地址。
// 对结构体赋值的函数
void setvalue(struct st_girl *pst);
struct st_girl queen;  // 定义结构体变量 
// 初始化结构体变量
memset(&queen,0,sizeof(struct st_girl));
```

## 格式化输出

```C

int printf(const char *format, ...);
int sprintf(char *str, const char *format, ...);
int snprintf(char *str, size_t size, const char *format, ...);

//printf是把结果输出到屏幕，sprintf把格式化输出的内容保存到字符串str中，snprintf的n类似于strncpy中的n，意思是只获取输出结果的前n-1个字符，不是n个字符。

```

格式说明符

> %[flags][width][.prec]type

**类型符type**：表示输出数据的类型

- %hd、%d、%ld 以十进制、有符号的形式输出 short、int、long 类型的整数。
- %hu、%u、%lu 以十进制、无符号的形式输出 short、int、long 类型的整数
- %c 输出字符。
- %lf 以普通方式输出double（float弃用，long doube无用）。
- %e 以科学计数法输出double。
- %s 输出字符串。
- %p 输出内存的地址。

**宽度width**：用于控制输出内容的宽度

```C
printf("=%12s=\n","abc");     // 输出=         abc=
printf("=%12d=\n",123);       // 输出=         123=
printf("=%12lf=\n",123.5);    // 输出=  123.500000=
```

**对其标志flags**：用于控制输出内容的对齐方式

- 不填或+：输出的内容右对齐，这是缺省的方式
- -：输出的内容左对齐。

```C
printf("=%-12s=\n","abc");    // 输出=abc         =
printf("=%-12d=\n",123);     // 输出=123         =
printf("=%-12f=\n",123.5);    // 输出=123.500000  =
printf("=%012s=\n","abc");  // 输出=         abc=
printf("=%012d=\n",123);   // 输出=000000000123=
printf("=%012f=\n",123.5);  // 输出=00123.500000=	


```

**精度prec**：如果输出的内容是浮点数，它用于控制输出内容的精度，也就是说小数点后面保留多少位，后面的数四舍五入。

```C
printf("=%12.2lf=\n",123.5);   // 输出=      123.50=
printf("=%.2lf=\n",123.5);     // 输出=123.50=
printf("=%12.2e=\n",123500000000.0);  // 输出=    1.24e+11=
printf("=%.2e=\n",123500000000.0);    // 输出=1.24e+11=
```

## main函数

```C
int main(int argc,char *argv[],char *envp[])

//int argc，存放了命令行参数的个数。

//char *argv[]，是个字符串的数组，每个元素都是一个字符指针，指向一个字符串，即命令行中的每一个参数。

//char *envp[]，也是一个字符串的数组，这个数组的每一个元素是指向一个环境变量的字符指针。

//envp存放了当前程序运行环境的参数。

```

## 动态内存管理

```C
void *malloc(unsigned int size)；
//malloc的作用是向系统申请一块大小为size的连续内存空间，如果申请失败，函数返回0，如果申请成功，返回成功分配内存块的起始地址。
malloc(100)； // 申请 100 个字节的临时分配域，返回值为其第一个字节的地址

void free(void *p);
//free的作用是释放指针p指向的动态内存空间，p是调用malloc函数时返回的地址，free函数无返回值。

```

### 野指针

1. 内存指针变量未初始化
2. 内存释放后之后指针未置空

```C
int *pi=0;

int i;
int *pi=&i;

free(pi);
pi=0;
```


## 文件操作

```C
//操作文件的时候，C语言为文件分配一个信息区，该信息区包含文件描述信息、缓冲区位置、缓冲区大小、文件读写到的位置等基本信息，这些信息用一个结构体来存放（struct _IO_FILE），这个结构体有一个别名FILE（typedef struct _IO_FILE FILE），FILE结构体和对文件操作的库函数在 stdio.h 头文件中声明的。

//打开文件的时候，fopen函数中会动态分配一个FILE结构体大小的内存空间，并把FILE结构体内存的地址作为函数的返回值，程序中用FILE结构体指针存放这个地址。

//关闭文件的时候，fclose函数除了关闭文件，还会释放FILE结构体占用的内存空间。

//FILE结构体指针习惯称为文件指针。

FILE *fopen( const char * filename, const char * mode );
//参数filename 是字符串，表示需要打开的文件名，可以包含目录名，如果不包含路径就表示程序运行的当前目录。实际开发中，采用文件的全路径。
//参数mode也是字符串，表示打开文件的方式（模式），打开方式可以是下列值中的一个。
//r  只读   文件必须存在，否则打开失败
//w  只写  如果文件存在，则清除原文件内容；如果文件不存在，则新建文件。
//a  追加只写   	如果文件存在，则打开文件，如果文件不存在，则新建文件。
//r+ 读写	文件必须存在。在只读 r 的基础上加 '+' 表示增加可写的功能。
//w+    在只写w的方式上增加可读的功能。
//a+ 	在追加只写a的方式上增加可读的功能。

/*
注意了，不同教材中对文件打开的方式有不同的说法。
有的说打开文本文件的方式要用"rt"、"wt"、"at"、"rt+"、"wt+"、"at+"，"t"是text的简写，"t"可以省略不写。
有的说打开二进制文件的方式要用"rb"、"wb"、"ab"、"rb+"、"wb+"、"ab+"，"b"是binary的简写。
准确的说，在Linux平台下，打开文本文件和二进制文件的方式没有区别。
在windows平台下，如果以“文本”方式打开文件，当读取文件的时候，系统会将所有的"\r\n"转换成"\n"；当写入文件的时候，系统会将"\n"转换成"\r\n"写入， 如果以"二进制"方式打开文件，则读和写都不会进行这样的转换，真是罗嗦。
*/

int fclose(FILE *fp);


int fprintf(FILE *fp, const char *format, ...);

char *fgets(char *buf, int size, FILE *fp);
/*
fgets的功能是从文件中读取一行。

参数buf是一个字符串，用于保存从文件中读到的数据。

参数size是打算读取内容的长度。

参数fp是待读取文件的文件指针。

如果文件中将要读取的这一行的内容的长度小于size，fgets函数就读取一行，如果这一行的内容大于等于size，fgets函数就读取size-1字节的内容。

调用fgets函数如果成功的读取到内容，函数返回buf，如果读取错误或文件已结束，返回空，即0。如果fgets返回空，可以认为是文件结束而不是发生了错误，因为发生错误的情况极少出现。
*/


```


**二进制文件处理**

```C

size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);
//ptr：为内存区块的指针，存放了要写入的数据的地址，它可以是数组、变量、结构体等。
//size：固定填1。
//nmemb：表示打算写入数据的字节数。
//fp：表示文件指针。
//函数的返回值是本次成功写入数据的字节数


size_t fread(void *ptr, size_t size, size_t nmemb, FILE *fp);
//ptr：用于存放从文件中读取数据的变量地址，它可以是数组、变量、结构体等。
//size：固定填1。
//nmemb：表示打算读取的数据的字节数。
//fp：表示文件指针。
//调用fread函数如果成功的读取到内容，函数返回读取到的内容的字节数，如果读取错误或文件已结束，返回空，即0。如果fread返回空，可以认为是文件结束而不是发生了错误，因为发生错误的情况极少出现。

```

### 文件定位

```C
//ftell函数用来返回当前文件位置指针的值，这个值是当前位置相对于文件开始位置的字节数。
long ftell(FILE *fp);

//rewind函数用来将位置指针移动到文件开头
void rewind ( FILE *fp );

//fseek() 用来将位置指针移动到任意位置
int fseek ( FILE *fp, long offset, int origin );
//fp 为文件指针，也就是被移动的文件。
//offset 为偏移量，也就是要移动的字节数。之所以为 long 类型，是希望移动的范围更大，能处理的文件更大。offset 为正时，向后移动；offset 为负时，向前移动。
//origin 为起始位置，也就是从何处开始计算偏移量。C语言规定的起始位置有三种，分别为：0-文件开头；1-当前位置；2-文件末尾。

fseek(fp,100,0);     // 从文件的开始位置计算，向后移动100字节。
fseek(fp,100,1);     // 从文件的当前位置计算，向后移动100字节。
fseek(fp,-100,2);    // 从文件的尾部位置计算，向前移动100字节。

/**
当offset是向文件尾方向偏移的时候，无论偏移量是否超出文件尾，fseek都是返回0，当偏移量没有超出文件尾的时候，文件指针式指向正常的偏移地址的，当偏移量超出文件尾的时候，文件指针是指向文件尾的，不会返回偏移出错-1值。

当offset是向文件头方向偏移的时候，如果offset没有超出文件头，是正常偏移，文件指针指向正确的偏移地址，fseek返回值为0，当offset超出文件头时，fseek返回出错-1值，文件指针还是处于原来的位置。
**/

```

### 文件缓冲区

在操作系统中，存在一个内存缓冲区，当调用fprintf、fwrite等函数往文件写入数据的时候，数据并不会立即写入磁盘文件，而是先写入缓冲区，等缓冲区的数据满了之后才写入文件。还有一种情况就是程序调用了fclose时也会把缓冲区的数据写入文件。

```C
int fflush(FILE *fp);
```

### 标准输入、标准输出、标准错误

Linux操作系统为每个程序默认打开三个文件，即标准输入stdin、标准输出stdout和标准错误输出stderr，其中0就是stdin，表示输入流，指从键盘输入，1代表stdout，2代表stderr，1,2默认是显示器。


## 目录操作

```C
//获取当前目录
char strpwd[301];
memset(strpwd,0,sizeof(strpwd));
getcwd(strpwd,300);
printf("当前目录是：%s\n",strpwd);


//切换工作目录
int chdir(const char *path);

//目录的创建和删除
int mkdir(const char *pathname, mode_t mode);
int rmdir(const char *pathname);

//获取目录中的文件列表
#include <dirent.h>
//打开目录
DIR *opendir(const char *pathname);
//读取目录
struct dirent *readdir(DIR *dirp);
//关闭目录
int closedir(DIR *dirp);

//目录指针
DIR *目录指针名;

//每调用一次readdir函数会返回一个struct dirent的地址，存放了本次读取到的内容，它的原理与fgets函数读取文件相同。
struct dirent
{
   long d_ino;                    // inode number 索引节点号
   off_t d_off;                   // offset to this dirent 在目录文件中的偏移
   unsigned short d_reclen;     // length of this d_name 文件名长
   unsigned char d_type;         // the type of d_name 文件类型
   char d_name [NAME_MAX+1];    // file name文件名，最长255字符
};



```


## 时间操作

```C
typedef long time_t;
time_t tnow;
tnow =time(0);     // 将空地址传递给time函数，并将time返回值赋给变量tnow
time(&tnow);       // 将变量tnow的地址作为参数传递给time函数

struct tm
{
  int tm_sec;     // 秒：取值区间为[0,59]
  int tm_min;     // 分：取值区间为[0,59]
  int tm_hour;    // 时：取值区间为[0,23]
  int tm_mday;    // 日期：一个月中的日期：取值区间为[1,31]
  int tm_mon;     // 月份：（从一月开始，0代表一月），取值区间为[0,11]
  int tm_year;    // 年份：其值等于实际年份减去1900
  int tm_wday;    // 星期：取值区间为[0,6]，其中0代表星期天，1代表星期一，以此类推
  int tm_yday;    // 从每年的1月1日开始的天数：取值区间为[0,365]，其中0代表1月1日，1代表1月2日，以此类推
  int tm_isdst;   // 夏令时标识符，该字段意义不大，我们不用夏令时。
};

struct tm * localtime(const time_t *);

//函数用于把struct tm表示的时间转换为time_t表示的时间
time_t mktime(struct tm *tm);

//
unsigned int sleep(unsigned int seconds);
int usleep(useconds_t usec);


struct timeval
{
  long  tv_sec;  // 1970年1月1日到现在的秒。
  long  tv_usec; // 当前秒的微妙，即百万分之一秒。
};

struct timezone
{
  int tz_minuteswest;  // 和UTC（格林威治时间）差了多少分钟。
  int tz_dsttime;      // type of DST correction，修正参数据，忽略
};

//gettimeofday是获得当前的秒和微秒的时间，其中的秒是指1970年1月1日到现在的秒，微秒是指当前秒已逝去的微秒数
int gettimeofday(struct  timeval *tv, struct  timezone *tz )



```

## 编译预处理


> C源程序－>编译预处理－>编译－>优化程序－>汇编程序－>链接程序－>可执行文件


### 预处理指令

- 包含文件：将源文件中以#include格式包含的文件复制到编译的源文件中，可以是头文件，也可以是其它的程序文件。
- 宏定义指令：#define指令定义一个宏，#undef指令删除一个宏定义。
- 条件编译：根据#ifdef和#ifndef后面的条件决定需要编译的代码。

```C
//如果使用尖括号<>括起文件名，则编译程序将到C语言开发环境中设置好的 include文件中去找指定的文件（/usr/include）
//#include包含文件，可以是 “.h”,表示C语言程序的头文件，也可以是“.c”,表示包含普通C语言源程序。
#include <文件名>
#include "文件名"

//宏定义
#define 宏名  字符串
/*
define 关键字“define”为宏定义命令。

宏名 是一个标示符，必须符合C语言标示符的规定，一般以大写字母标识宏名。

字符串 可以是常数，表达式，格式串等。在前面使用的符号常量的定义就是一个无参数宏定义。
*/
#define PI 3.141592

/*
宏定义是宏名来表示一个字符串，在宏展开时又以该字符串取代宏名。这只是一种简单的代换，字符串中可以含任何字符，可以是常数，也可以是表达式，编译预处理时不会对它进行语法检查，如有错误，只能在编译已被宏展开后的源程序时发现。

 宏定义允许嵌套，在宏定义的字符串中可以使用已经定义的宏名。在宏展开时由预处理程序层层替换。建议不要这么做，会把程序复杂化。

 习惯上宏名用大写字母表示，以方便与变量区别。但也可以用小写字母。
*/

//带参数的宏
#define 宏名(形参表) 字符串
#define MAX(x,y)  ((x)>(y) ? (x) : (y))

```

### 条件编译


```C
#ifdef 标识符
  程序段 1
#else
  程序段 2
#endif


#ifndef 标识符
  程序段 1
#else
  程序段 2 
#endif

//取消已定义的标志符
#undef
```

## 系统错误

我们在写程序的时候需要调用C语言提供的库函数，并通过函数的返回值判断调用是否成功。其实在C语言中，还有一个全局变量errno，存放了函数调用过程中产生的错误码。

为防止和正常的返回值混淆，库函数的调用一般并不直接返回错误码，而是将错误码（是一个整数值，不同的值代表不同的含义）存入一个名为 errno 的全局变量中，errno 不同数值所代表的错误消息定义在 <errno.h> 文件中。如果库函数调用失败，可以通过读出 errno 的值来确定问题所在，推测程序出错的原因，这也是调试程序的一个重要方法。

配合 strerror和perror两个库函数，可以很方便地查看出错的详细信息。

strerror 在 <string.h> 中声明，用于获取错误码对应的消息描述。

perror 在 <stdio.h> 中声明，用于在屏幕上最近一次系统错误码消息描述，在实际开发中，我们写的程序运行于后台，在屏幕上显示错误信息没有意义。

```C
char *strerror(int errno);
//strerror()用来依参数errno 的错误代码来查询其错误原因的描述字符串，然后将该字符串指针返回。


```





## 参考

- [https://freecplus.net/3e27bfb1a810493d9a0550131e2a1633.html](https://freecplus.net/3e27bfb1a810493d9a0550131e2a1633.html)
---
title: pandas
tags: Python 
toc: true
---

数据分析清洗使用pandas，numpy。 [http://pandas.pydata.org/](http://pandas.pydata.org/)

[https://www.pypandas.cn/](https://www.pypandas.cn/)




Series 是带标签的一维数组，可存储整数、浮点数、字符串、Python 对象等类型的数据。轴标签统称为索引。调用 pd.Series 函数即可创建 Series

```
s = pd.Series(data, index=index)
```

上述代码中，data 支持以下数据类型：

- Python 字典
- 多维数组
- 标量值（如，5）

index 是轴标签列表。不同数据可分为以下几种情况：

**多维数组**

data 是多维数组时，index 长度必须与 data 长度一致。没有指定 index 参数时，创建数值型索引，即 [0, ..., len(data) - 1]。

```
In [3]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [4]: s
Out[4]: 
a    0.469112
b   -0.282863
c   -1.509059
d   -1.135632
e    1.212112
dtype: float64

In [5]: s.index
Out[5]: Index(['a', 'b', 'c', 'd', 'e'], dtype='object')

In [6]: pd.Series(np.random.randn(5))
Out[6]: 
0   -0.173215
1    0.119209
2   -1.044236
3   -0.861849
4   -2.104569
dtype: float64
```

**字典**

```
In [7]: d = {'b': 1, 'a': 0, 'c': 2}

In [8]: pd.Series(d)
Out[8]: 
b    1
a    0
c    2
dtype: int64
```

**标量值**

data 是标量值时，必须提供索引。Series 按索引长度重复该标量值。

```
In [12]: pd.Series(5., index=['a', 'b', 'c', 'd', 'e'])
Out[12]: 
a    5.0
b    5.0
c    5.0
d    5.0
e    5.0
dtype: float64
```

**Series类似多维数组**

```
In [13]: s[0]
Out[13]: 0.4691122999071863

In [14]: s[:3]
Out[14]: 
a    0.469112
b   -0.282863
c   -1.509059
dtype: float64

In [15]: s[s > s.median()]
Out[15]: 
a    0.469112
e    1.212112
dtype: float64

In [16]: s[[4, 3, 1]]
Out[16]: 
e    1.212112
d   -1.135632
b   -0.282863
dtype: float64

In [17]: np.exp(s)
Out[17]: 
a    1.598575
b    0.753623
c    0.221118
d    0.321219
e    3.360575
dtype: float64

```

**矢量操作与对齐 Series 标签**

**名称属性**

```
In [32]: s = pd.Series(np.random.randn(5), name='something')

In [33]: s
Out[33]: 
0   -0.494929
1    1.071804
2    0.721555
3   -0.706771
4   -1.039575
Name: something, dtype: float64

In [34]: s.name
Out[34]: 'something'
```



DataFrame 是由多种类型的列构成的二维标签数据结构，类似于 Excel 、SQL 表，或 Series 对象构成的字典。DataFrame 是最常用的 Pandas 对象，与 Series 一样，DataFrame 支持多种类型的输入数据：

    一维 ndarray、列表、字典、Series 字典
    二维 numpy.ndarray
    结构多维数组或记录多维数组

    Series
    DataFrame

除了数据，还可以有选择地传递 index（行标签）和 columns（列标签）参数。传递了索引或列，就可以确保生成的 DataFrame 里包含索引或列。Series 字典加上指定索引时，会丢弃与传递的索引不匹配的所有数据。

没有传递轴标签时，按常规依据输入数据进行构建。

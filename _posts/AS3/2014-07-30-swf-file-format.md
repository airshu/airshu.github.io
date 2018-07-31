---
layout: post
title: "swf文件格式"
description: ""
category: AS3
tags: [swf, crack, actionscript]
---

关于swf的文件格式，除了官方的文档，也有许多的资料可以参考。在这里只是做一个总结，具体内容请参阅最后给出的链接。

学习swf的格式，首先你要了解swf的组成，它是有许多的标签按照一定的规则构成。它有自己定义的单位，就像int、number一样。可以查阅官方的文档或http://www.the-labs.com/MacromediaFlash/SWF-Spec/SWFfilereference.html来了解基本的数据类型和标签类型。

到最新的版本，已有的标签如下：

	Tag-value     Tag-name
	0            End
	1         ShowFrame
	2         DefineShape
	4         PlaceObject
	5         RemoveObject
	6         DefineBits
	7         DefineButton
	8         JPEGTables
	9         SetBackgroundColor
	10     DefineFont
	11     DefineText
	12     DoAction
	13     DefineFontInfo
	14     DefineSound
	15     StartSound
	17     DefineButtonSound
	18     SoundStreamHead
	19     SoundStreamBlock
	20     DefineBitsLossless
	21     DefineBitsJPEG2
	22     DefineShape2
	23     DefineButtonCxform
	24     Protect
	26     PlaceObject2
	28     RemoveObject2
	32     DefineShape3
	33     DefineText2
	34     DefineButton2
	35     DefineBitsJPEG3
	36     DefineBitsLossless2
	37     DefineEditText
	39     DefineSprite
	43     FrameLabel
	45     SoundStreamHead2
	46     DefineMorphShape
	48     DefineFont2
	56     ExportAssets
	57     ImportAssets
	58     EnableDebugger
	59     DoInitAction
	60     DefineVideoStream
	61     VideoFrame
	62     DefineFontInfo2
	64     EnableDebugger2
	65     ScriptLimits
	66     SetTabIndex
	69     FileAttributes
	70     PlaceObject3
	71     ImportAssets2
	73     DefineFontAlignZones
	74     CSMTextSettings
	75     DefineFont3
	76     SymbolClass
	77     Metadata
	78     DefineScalingGrid
	82     DoABC
	83     DefineShape4
	84     DefineMorphShape2
	86     DefineSceneAndFrameLabelData
	87     DefineBinaryData
	88     DefineFontName
	89     StartSound2
	90     DefineBitsJPEG4
	91     DefineFont4

然后，你需要弄明白这个规则。swf是由头和身体两部分组成。

参考(A simple .swf file and it’s below the line representation)[http://blog.csdn.net/qdlgx/article/details/2868504]，你将明白头是怎么构成的，标签又是按照什么顺序排列的。

再然后，就是指令集了。AVM虚拟机有自己的指令集。详情参考http://www.adobe.com/content/dam/Adobe/en/devnet/actionscript/articles/avm2overview.pdf

下面总结出的ABC文件结构：

	abcFile
	{
	+ minor_version: u16    最低swf版本
	+ major_version: u16    最高swf版本
	+ method_count: u30     方法数量
	+ metadata_count: u30   元数据数量
	+ class_count: u30          类数量
	+ script_count: u30         脚本数量
	+ method_body_count: u30      方法体数量
	+ constant_pool: cpool_info      常量池
	+ method: method_info (Array)      方法集合
	+ metadata: metadata_info (Array)      元数据集合
	+ instance: instance_info (Array)      实例集合
	+ class: class_info (Array)      类集合
	+ script: script_info (Array)      脚本集合
	+ method_body: method_body_info (Array)      方法体集合
	}



	cpool_info
	{
	+ int_count: u30      整形数量
	+ uint_count: u30      无符号整形数量
	+ double_count: u30      双精度型数量     
	+ string_count: u30      字符串数量
	+ namespace_count: u30      命名空间数量
	+ ns_set_count: u30      命名空间集合数量
	+ multiname_count: u30      复合名字数量
	+ string: string_info (Array)      字符串集合
	+ namespace: namespace_info (Array)      命名空间集合
	+ ns_set: ns_set_info (Array)      命名空间的集合关系
	+ multiname: multiname_info (Array)      复合名字集合
	}

	namespace_info
	{
	+ CONSTANT_Namespace: u8 = 0x08
	+ CONSTANT_PackageNamespace: u8 = 0x16
	+ CONSTANT_PackageInternalNs: u8 = 0x17
	+ CONSTANT_ProtectedNamespace: u8 = 0x18
	+ CONSTANT_ExplicitNamespace: u8 = 0x19
	+ CONSTANT_StaticProtectedNs: u8 = 0x1A
	+ CONSTANT_PrivateNs: u8 = 0x05
	+ kind: u8      类型，有6种常量类型
	+ name：u30      string集合的下标，为0的话则是空字符串
	}

	ns_set_info
	{
	+ count: u30      数量
	+ ns: u30 (Array)      each ns is an integer that indexes into the namespace array of the constant pool
	}

	multiname_info
	{
	+ kind: u8      类型
	+ CONSTANT_QName: u8 = 0x07
	+ CONSTANT_QNameA: u8 = 0x0D
	+ CONSTANT_RTQName: u8 = 0x0F
	+ CONSTANT_RTQNameA: u8 = 0x10
	+ CONSTANT_RTQNameL: u8 = 0x11
	+ CONSTANT_RTQNameLA: u8 = 0x12
	+ CONSTANT_Multiname: u8 = 0x09
	+ CONSTANT_MultinameA: u8 = 0x0E
	+ CONSTANT_MultinameL: u8 = 0x1B
	+ CONSTANT_MultinameLA: u8 = 0x1C
	+ data: u8 (Array)      可变长数据(根据不同类型得到不同的数据)
	}

	multiname_kind_QName
	{
	+ ns: u30      namespace集合的索引
	+ name: u30      string集合的索引
	}

	multiname_kind_RTQName
	{
	+ name: u30      string集合的索引
	}

	multiname_kind_RTQNameL
	{
	}

	multiname_kind_Multiname
	{
	+ u30 name      string集合的索引
	+ u30 ns_set      ns_set集合的索引
	}

	multiname_kind_MultinameL
	{
	+ u30 ns_set      ns_set集合的索引
	}


	method_info
	{
	+ u30 param_count      参数的数量
	+ u30 return_type      指向multiname索引
	+ u30 param_type[param_count]      每一个条目指向multiname集合的索引
	+ u30 name      string集合的索引
	+ u8 flags      为以下常量类型，提供关于方法的额外信息
	+ option_info options      只有在flag为HAS_OPTIONAL时才会出现
	+ param_info param_names      只有在flag为HAS_PARAM_NAMES才会出现
	+ NEED_ARGUMENTS: u8 = 0x01      Suggests to the run-time that an “arguments” object (as specified by the ActionScript 3.0 Language Reference) be created. Must not be used together with NEED_REST
	+ NEED_ACTIVATION: u8 = 0x02      Must be set if this method uses the newactivation opcode
	+ NEED_REST: u8 = 0x04      This flag creates an ActionScript 3.0 rest arguments array. Must not be used with NEED_ARGUMENTS
	+ HAS_OPTIONAL: u8 = 0x08      Must be set if this method has optional parameters and the options field is present in this method_info structure
	+ SET_DXNS: u8 = 0x40      Must be set if this method has optional parameters and the options field is present in this method_info structure
	+ HAS_PARAM_NAMES: u8 = 0x80      Must be set when the param_names field is present in this method_info structure
	}

	option_info
	{
	+ u30 option_count
	+ option_detail option[option_count]
	}

	option_detail
	{
	+ u30 val      有kind类型来指向常量池中不同类型集合的索引，如0x03表示整形集合的索引
	+ u8 kind      类型，对应kind_constants
	}

	kind_constants
	{
	+ CONSTANT_Int: u8 = 0x03
	+ CONSTANT_UInt: u8 = 0x04
	+ CONSTANT_Double: u8 = 0x06
	+ CONSTANT_Utf8: u8 = 0x01
	+ CONSTANT_True: u8 = 0x0B
	+ CONSTANT_False: u8 = 0x0A
	+ CONSTANT_Null: u8 = 0x0C
	+ CONSTANT_Undefined: u8 = 0x00
	+ CONSTANT_Namespace: u8 = 0x08
	+ CONSTANT_PackageNamespace: u8 = 0x16
	+ CONSTANT_PackageInternalNs: u8 = 0x17
	+ CONSTANT_ProtectedNamespace: u8 = 0x18
	+ CONSTANT_ExplicitNamespace: u8 = 0x19
	+ CONSTANT_StaticProtectedNs: u8 = 0x1A
	+ CONSTANT_PrivateNs: u8 = 0x05
	}


	metadata_info
	{
	+ u30 name      string集合的索引
	+ u30 item_count      items条目的数量
	+ item_info items[item_count]      
	}

	item_info
	{
	+ u30 key
	+ u30 value
	}
	The item_info entry consists of item_count elements that are interpreted as key/value pairs of indices into the string table of the constant pool


	instance_info
	{
	+ CONSTANT_ClassSealed: u8 = 0x01      The class is sealed: properties can not be dynamically added to instances of the class
	+ CONSTANT_ClassFinal: u8 = 0x02      The class is final: it cannot be a base class for any other class
	+ CONSTANT_ClassInterface: u8 = 0x04      The class is an interface
	+ CONSTANT_ClassProtectedNs: u8 = 0x08      The class uses its protected namespace and the protectedNs field is present in the interface_info structure
	+ u30 name      multiname索引，类名
	+ u30 super_name      基类的名字，multiname索引
	+ u8 flags      常量类型
	+ u30 protectedNs      flags为CONSTANT_ClassProtectedNs时才出现， namespace索引
	+ u30 intrf_count      interface长度
	+ u30 interface[intrf_count]      interface的条目包含multiname索引
	+ u30 iinit      abcFile中method的索引
	+ u30 trait_count      trait长度
	+ traits_info trait[trait_count]      
	}

	traits_info
	{
	+ Trait_Slot: u8 = 0
	+ Trait_Method: u8 = 1
	+ Trait_Getter: u8 = 2
	+ Trait_Setter: u8 = 3
	+ Trait_Class: u8 = 4
	+ Trait_Function: u8 = 5
	+ Trait_Const: u8 = 6
	+ ATTR_Final: u8 = 0x1
	+ ATTR_Override: u8 = 0x2
	+ ATTR_Metadata: u8 = 0x4
	+ name: u30      multiname索引，不能为0
	+ kind: u8      两个四位字段，低四位决定trait的类型，高四位构成trait的属性(有点不明白)
	+ data: u8 (Array)      有trait的类型决定
	+ metadata_count: u30      metadata长度
	+ metadata: u30 (Array)      
	}

	trait_slot
	{
	+ u30 slot_id
	+ u30 type_name      multiname索引
	+ u30 vindex      
	+ u8 vkind      kind_constant索引，当vindex不为0时存在
	}
	Trait_Slot或Trait_Const类型为trait_slot


	trait_class
	{
	+ u30 slot_id      确定trait的位置
	+ u30 classi      abcFile的class集合索引
	}
	Trait_Class类型为trait_class

	trait_function
	{
	+ u30 slot_id
	+ u30 function      abcFile中method索引
	}
	Trait_Function类型为trait_function

	trait_method
	{
	+ u30 disp_id
	+ u30 method      abcFile中method索引
	}
	Trait_Method、Trait_Getter、Trait_Setter类型为trai_method


	class_info
	{
	+ u30 cinit      method索引
	+ u30 trait_count
	+ traits_info traits[trait_count]
	}

	script_info
	{
	+ u30 init      method索引
	+ u30 trait_count
	+ traits_info trait[trait_count]
	}


	method_body_info
	{
	+ method: u30      abcFile中method索引
	+ max_stack: u30
	+ local_count: u30      最大本地寄存器索引+1
	+ init_scope_depth: u30
	+ max_scope_depth: u30
	+ code_length: u30
	+ code: u8      保存AVM2指令
	+ exception_count: u30
	+ exception: exception_info (Array)
	+ trait_count: u30
	+ trait: traits_info (Array)
	}

	exception_info
	{
	+ u30 from      代码范围
	+ u30 to
	+ u30 target      跳转目标
	+ u30 exc_type      错误类型, 常量表中 string 索引, 0=所有错误
	+ u30 var_name      异常的变量名, 常量表中 string 索引
	}


授之以鱼不如授之以渔，由于自己的水平有限，也没有完成弄懂里面的所有东西。在此，只是记录自己的学习过程。除了下面参考的资料，个人觉得最好的学习方法还是找到一个比较好的解析swf开源项目，通过阅读源码来理解(可参考swfinvestigator、as3crypto、JPEXS等)。有任何问题，欢迎跟我探讨。


参考：

[SWF File Reference](http://www.the-labs.com/MacromediaFlash/SWF-Spec/SWFfilereference.html)

[SWF File Format Specification](http://www.the-labs.com/MacromediaFlash/SWF-Spec/SWFfileformat.html)

[AVM指令集概要](http://www.adobe.com/content/dam/Adobe/en/devnet/actionscript/articles/avm2overview.pdf)

[一个例子分析swf格式](http://blog.csdn.net/qdlgx/article/details/2868504)


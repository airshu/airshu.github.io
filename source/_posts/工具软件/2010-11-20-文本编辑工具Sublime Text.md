---

title: 文本编辑工具Sublime Text
category: 工具软件
tags: 效率
keywords:
description:
---


####  Markdown环境搭建

##### 安装扩展MarkdownEditing

	下载地址：
	https://github.com/SublimeText-Markdown/MarkdownEditing

##### 快捷键

| Windows/Linux | 描述 |
|---------------|-------------|
| <kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>V</kbd> | Creates or pastes the contents of the clipboard as an inline link on selected text.
| <kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>R</kbd> | Creates or pastes the contents of the clipboard as a reference link.
| <kbd>Shift</kbd><kbd>Win</kbd><kbd>K</kbd> | Creates or pastes the contents of the clipboard as an inline image on selected text.
| <kbd>Alt</kbd><kbd>B</kbd> <kbd>Alt</kbd><kbd>I</kbd> | These are bound to bold and italic. They work both with and without selections. If there is no selection, they will just transform the word under the cursor. These keybindings will unbold/unitalicize selection if it is already bold/italic.
| <kbd>Ctrl</kbd><kbd>1...6</kbd> | These will add the corresponding number of hashmarks for headlines. Works on blank lines and selected text in tandem with the above headline tools. If you select an entire existing headline, the current hashmarks will be removed and replaced with the header level you requested. This command respects the `mde.match_header_hashes` preference setting.
| <kbd>Alt</kbd><kbd>Shift</kbd><kbd>6</kbd> | Inserts a footnote.
| <kbd>Shift</kbd><kbd>Tab</kbd> | Fold/Unfold current section.
| <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>Tab</kbd> | Fold all sections under headings of a certain level.
| <kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>Shift</kbd><kbd>PageUp</kbd> <kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>Shift</kbd><kbd>PageDown</kbd> | Go to the previous/next heading of the same or higher level
| <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>PageUp</kbd> <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>PageDown</kbd> |  Go to the previous/next heading
| <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>H</kbd> | Open home page
| <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>D</kbd> | Open wiki page under the cursor
| <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>J</kbd> | Open journal page for today
| <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>B</kbd> | List back links

##### 表格编辑插件

	下载地址：
	https://packagecontrol.io/packages/Table%20Editor



#### PHP环境搭建



#### Python环境搭建

##### 安装Anaconda插件(代码提示、自动补全、格式化)

	//快捷键配置
	[
	    {
	    	"command": "anaconda_goto", "keys": ["ctrl+alt+g"], "context": [
	            {"key": "selector", "operator": "equal", "operand": "source.python"}
	        ]},
	    {
	    	"command": "anaconda_find_usages", "keys": ["ctrl+alt+f"], "context": [
	            {"key": "selector", "operator": "equal", "operand": "source.python"}
	        ]},
	    {
	    	"command": "anaconda_doc", "keys": ["ctrl+alt+d"], "context": [
	            {"key": "selector", "operator": "equal", "operand": "source.python"}
	        ]},
	    //格式化
	    {
	    	"command": "anaconda_auto_format", "keys": ["ctrl+alt+r"], "context": [
	            {"key": "selector", "operator": "equal", "operand": "source.python"}
	        ]},
	    {
	        "command": "anaconda_fill_funcargs", "keys": ["tab"], "context": [
	            {"key": "selector", "operator": "equal", "operand": "source.python"},
	            {"key": "anaconda_insert_funcargs"}
	        ]},
	    {
	        "command": "anaconda_fill_funcargs", "keys": ["ctrl+tab"], "args": {"all": true}, "context": [
	            {"key": "selector", "operator": "equal", "operand": "source.python"},
	            {"key": "anaconda_insert_funcargs"}
	        ]}
	]


##### 配置Python解释器

	打开Preferences-->Package Settings-->Anaconda-->Settings-User

	{
	//设置python解释器路径
	"python_interpreter": "D:\\Python\\Python364-64\\python.exe",
	"suppress_word_completions": true,
    "suppress_explicit_completions": true,
    "complete_parameters": true,
    "anaconda_linting": false
	}



##### Sublime中console交互，安装SublimeREPL

##### 配置SUblimeREPL快捷键

	1. Preferences-->Browse Packages-->SublimeREPL文件夹-->config文件夹-->Python文件夹-->Default.sublime-commands
	2. 找到对应的command，添加到Preferences-->Key Bindings User中。

    {
    "keys": ["f5"],
    "command": "run_existing_window_command",
    "args":
    {
        "id": "repl_python",
        "file": "config/Python/Main.sublime-menu"
    }
    },



**如何设置快捷键**

	打开Preferences-->Key Bindings，对于向要定义自己喜好的快捷键的操作，复制左边默认的配置到用户栏，进行修改。

**如何修改默认配置**

	打开Preferences-->Settings，重写默认配置即可。


**Sublime 插件**

	Anaconda:Python插件
	CodeFormatter：代码提示插件
	ConvertToUTF8
	SublimeCodeIntel
	Markdown Preview：Markdown预览插件
	Emmet：HTML/CSS代码快速编写插件
	SublimeLinter：代码检测插件
	SideBarEnhancements：侧边栏扩展
	PackageResourceViewer：Sublime配置管理插件,选择Open Resource,选择对应的配置进行修改
	Boxy Theme:样式插件
	Terminal：在Sublime中打开终端
	CTags：[代码跳转](https://my.oschina.net/u/1024767/blog/495282)
		http://ctags.sourceforge.net/

	Sublime PHP Companion
	All Autocomplete
	DocBlockr
	SublimeAStyleFormatter：C, C++, C#, 和 Java文件格式化



**如何备份插件**

备份Preferences-->Browse Packages的内容




**属性配置**

	{
	//默认字体大小
	"font_size": 10,
	"ignored_packages":
	[
		"Vintage"
	],
	//是否检查更新
	"update_check": "false",
	//显示空格符号
	// "draw_white_space": "all",
	}


**常用快捷键配置**

	[
		//跳转到定义
	    { "keys": ["f3"], "command": "goto_definition" },
	    //删除当前行
		{ "keys": ["ctrl+d"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} },
	    //back
		{ "keys": ["alt+left"], "command": "jump_back" },
	    //forward
	    { "keys": ["alt+right"], "command": "jump_forward" },
	    //移动当前行到上一行
	    { "keys": ["alt+up"], "command": "swap_line_up" },
	    //移动当前行到下一行
	    { "keys": ["alt+down"], "command": "swap_line_down" },
		{ "keys": ["ctrl+alt+f"], "command": "reindent" },
		// 自动提示、补全
	    { "keys": ["alt+/"], "command": "auto_complete"},
	    //代码提示
	    {
	        "keys": ["alt+/"],
	        "command": "replace_completion_with_auto_complete",
	        "context": [{
	            "key": "last_command",
	            "operator": "equal",
	            "operand": "insert_best_completion"
	        }, {
	            "key": "auto_complete_visible",
	            "operator": "equal",
	            "operand": false
	        }, {
	            "key": "setting.tab_completion",
	            "operator": "equal",
	            "operand": true
	        }]
	    },
	    //Ctrl+l 选中当前行
	    //编译当前脚本
	    { "keys": ["ctrl+b"], "command": "build" },
	    //隐藏Side Bar开关
	    { "keys": ["ctrl+k"], "command": "toggle_side_bar" },
		//向左缩进
	    { "keys": ["ctrl+]"], "command": "indent" },
	    //向右缩进
		{ "keys": ["ctrl+["], "command": "unindent" },

		//列出当前打开的文件
		{ "keys": ["ctrl+p"], "command": "show_overlay", "args": {"overlay": "goto", "show_files": true} },
		{ "keys": ["ctrl+shift+p"], "command": "show_overlay", "args": {"overlay": "command_palette"} },
		//跳转到符号
		{ "keys": ["ctrl+r"], "command": "show_overlay", "args": {"overlay": "goto", "text": "@"} },
		//跳转到行
		{ "keys": ["ctrl+g"], "command": "show_overlay", "args": {"overlay": "goto", "text": ":"} },

		{ "keys": ["ctrl+;"], "command": "show_overlay", "args": {"overlay": "goto", "text": "#"} },
		//快速在起始括号和结尾括号间切换
		{ "keys": ["ctrl+m"], "command": "move_to", "args": {"to": "brackets"} },
		//选择括号间的内容
		{ "keys": ["ctrl+shift+m"], "command": "expand_selection", "args": {"to": "brackets"} },
		//当前行下面新增一行并跳至该行
		{ "keys": ["ctrl+enter"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Add Line.sublime-macro"} },
		//当前行上面新增一行并调至该行
		{ "keys": ["ctrl+shift+enter"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Add Line Before.sublime-macro"} },
		//进行逐词移动
		{ "keys": ["ctrl+left"], "command": "move", "args": {"by": "words", "forward": false} },
		{ "keys": ["ctrl+right"], "command": "move", "args": {"by": "word_ends", "forward": true} },
		//逐词选择
		{ "keys": ["ctrl+shift+left"], "command": "move", "args": {"by": "words", "forward": false, "extend": true} },
		{ "keys": ["ctrl+shift+right"], "command": "move", "args": {"by": "word_ends", "forward": true, "extend": true} },
		//上下移动当前显示区域
		{ "keys": ["ctrl+up"], "command": "scroll_lines", "args": {"amount": 1.0 } },
		{ "keys": ["ctrl+down"], "command": "scroll_lines", "args": {"amount": -1.0 } },
		//移动当前行
		{ "keys": ["ctrl+shift+up"], "command": "swap_line_up" },
		{ "keys": ["ctrl+shift+down"], "command": "swap_line_down" },
		//删除当前
		{ "keys": ["ctrl+shift+k"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} },

		//Ctrl + D选择当前光标所在的词并高亮该词所有出现的位置，再次Ctrl + D选择该词出现的下一个位置，在多重选词的过程中，使用Ctrl + K进行跳过，使用Ctrl + U进行回退，使用Esc退出多重编辑。
		{ "keys": ["ctrl+d"], "command": "find_under_expand" },
		{ "keys": ["ctrl+k", "ctrl+d"], "command": "find_under_expand_skip" },

		//打散所选区域
		{ "keys": ["ctrl+shift+l"], "command": "split_selection_into_lines" },
		//将选中区域合并为一行
		{ "keys": ["ctrl+j"], "command": "join_<l></l>ines" },
		//选择行
		{ "keys": ["ctrl+l"], "command": "expand_selection", "args": {"to": "line"} },
		//把选区分割
		{ "keys": ["ctrl+shift+l"], "command": "split_selection_into_lines" },
	]


如何自定义插件

如何自定义代码块

如何自定义语法



**参考**

[官方文档](http://docs.sublimetext.info/en/latest)

[Sublime Text非官方文档](https://sublime-undocs-zh.readthedocs.io/en/latest/command_line/command_line.html)

[Sublime Text3文档](http://feliving.github.io/Sublime-Text-3-Documentation/index.html)
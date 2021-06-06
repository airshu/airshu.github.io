---
title: PHP中opcodes的原理
tags: PHP
toc: true
---

## PHP代码的生命周期

**不启用OPcache的流程**

![](./php_1.png)

**启用OPcache的流程**

![](./php_2.png)

1. Scanning：将PHP代码转换为语言片段（Tokens）
2. Parsingg：将Tokens转换成简单而有意义的表达式
3. Compilation：将表达式编译成opcodes
4. Execution:执行opcodes，每次一条，从而实现PHP脚本的功能


## opcodes 

当一个 PHP 文件被解释执行的时候，首先是被编译成名为 opcode （CPU专用的机器语言指令）的中间代码，然后才被底层的虚拟机执行。 如果PHP文件没有被修改过，opcode 始终是一样的。这就意味着编译步骤白白浪费了 CPU 的资源。
此时 opcode 缓存就派上用场了。通过将 opcode 缓存在内存中，它能防止冗余的编译步骤，并且在下次调用执行时得到重用。一般执行过程是先检查文件的签名（signature）或者修改时间，以防文件有改动。

PHP 5.5 以后的所有版本都内置了一个 opcode 缓存工具，叫做 Zend OPcache。 根据你所使用的 PHP 安装包/发行版的不同，一般情况下是默认开启的，请查看 OPcache.enable phpinfo() 和 phpinfo() 输出的信息确认是否已经开启。

Operate Code：当解释器完成对脚本代码的分析后，便将它们生成可以直接运行的中间代码，也称为操作码。




## OPcache

opcode cache的目地是避免重复编译，减少CPU和内存开销。

### PHP配置

PHP5.5以上默认有OPcache，如果需要安装，则使用以下脚本：

```shell
wget http://pecl.php.net/get/zendOPcache-7.0.3.tgz
tar zxvf zendOPcache-7.0.3.tgz && cd zendOPcache-7.0.3
/usr/local/php/bin/phpize
./configure --with-php-config=/usr/local/php/bin/php-config
make && make install

```

**php.ini配置说明**

```ini
[Zend Opcache]
zend_extension = OPcache.so
#比较常用的配置
OPcache.enable=1                    #是否启用操作码缓存
OPcache.enable_cli=1                #仅针对CLI环境启用操作码缓存
OPcache.revalidate_freq=60          #检查文件的修改的时间周期, 定位为秒，即缓存后60秒去检查代码文件是否被修改过
OPcache.fast_shutdown=1             #打开快速关闭, 一次释放全部请求变量的内存，打开这个在PHP Request Shutdown的时候回收内存的速度会提高
;OPcache.error_log=""               #OPcache模块的错误日志文件
;OPcache.log_verbosity_level=1      #将错误信息写入到服务器的日志级别。致命（0）错误（1) 警告（2）信息（3）调试（4）

#其它不常用的配置
OPcache.memory_consumption=128      #共享内存大小，单位MB
OPcache.interned_strings_buffer=8   #存储临时字符串的内存大小，单位MB
OPcache.max_accelerated_files=4000  #哈希表中可存储的脚本文件数量上限
;OPcache.max_wasted_percentage=5    #浪费内存的上限，以百分比计
;OPcache.use_cwd=1                  #附加改脚本的工作目录,避免同名脚本冲突
OPcache.validate_timestamps=1       #每隔revalidate_freq 设定的秒数 检查脚本是否更新
;OPcache.revalidate_path=0          #如果禁用此选项，在同一个 include_path 已存在的缓存文件会被重用
;OPcache.save_comments=1            #禁用后将也不会加载注释内容
OPcache.enable_file_override=0      #如果启用，则在调用函数file_exists()， is_file() 以及 is_readable() 的时候， 都会检查操作码缓存
;OPcache.optimization_level=0xffffffff  #控制优化级别的二进制位掩码。
;OPcache.inherited_hack=1           #PHP 5.3之前做的优化
;OPcache.dups_fix=0                 #仅作为针对 “不可重定义类”错误的一种解决方案。
;OPcache.blacklist_filename=""      #黑名单文件为文本文件，包含了不进行预编译优化的文件名
;OPcache.max_file_size=0            #以字节为单位的缓存的文件大小上限
;OPcache.consistency_checks=0       #如果是非 0 值，OPcache 将会每隔 N 次请求检查缓存校验和
OPcache.force_restart_timeout=180   #如果缓存处于非激活状态，等待多少秒之后计划重启。
;OPcache.preferred_memory_model=""  #OPcache 首选的内存模块。可选值包括： mmap，shm, posix 以及 win32。
;OPcache.protect_memory=0           #保护共享内存，以避免执行脚本时发生非预期的写入。 仅用于内部调试。
;OPcache.mmap_base=null             #在Windows 平台上共享内存段的基地址
```

### 监测OPcache


- **可视化显示**：[https://github.com/PeeHaa/OpCacheGUI](https://github.com/PeeHaa/OpCacheGUI)
- **简易的显示缓存信息(PHP7+)**：[https://github.com/rlerdorf/opcache-status](https://github.com/rlerdorf/opcache-status)

### 相关PHP的API使用

```
opcache_is_script_cached(string $filename):bool    是否缓存
opcache_get_configuration(): array 获取缓存的配置信息
opcache_invalidate(string $script , boolean $force = false):boolean 废除脚本缓存
opcache_reset():boolean   重置字节码缓存的内容

```

## 参考

- [Understanding OPCode]()
- [OPcache运行时配置](https://www.php.net/manual/zh/OPcache.configuration.php)
- [PHP Opcache工作原理](https://www.awaimai.com/2684.html)
- [PHP内核探索：操作码OpCode](http://www.nowamagic.net/librarys/veda/detail/1324)
- [OPcache安装配置及链接生效配置](https://blog.51cto.com/ckl893/1786964)
- [OPcache 函数](https://www.php.net/manual/zh/ref.opcache.php)
- [Opcode是啥以及如何使用好Opcache](https://www.zybuluo.com/phper/note/1016714)

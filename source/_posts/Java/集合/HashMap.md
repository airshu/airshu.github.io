---
title: HashMap
tags: Java
toc: true
---


## 概要


在JDK1.6，JDK1.7中，HashMap采用位桶+链表实现，即使用链表处理冲突,同一hash值的键值对会被放在同一个位桶里，
当桶中元素较多时，通过key值查找的效率较低。

在极端情况下可能会存在某个链表很长，整个时候整个查找效率就变低了，于是有了1.8的改进方式。使用红黑树，提升查询效率。

而JDK1.8中，HashMap采用位桶+链表+红黑树实现，如果哈希表单向链表中元素超过8个，那么单向链表这种数据结构会变成红黑树数据结构。
当红黑树上的节点数量小于6个，会重新把红黑树变成单向链表数据结构。



### 数组

存储区间是连续，且占用内存严重，空间复杂也很大，时间复杂为O（1）。

- 优点：是随机读取效率很高，原因数组是连续（随机访问性强，查找速度快）。
- 缺点：插入和删除数据效率低，因插入数据，这个位置后面的数据在内存中要往后移的，且大小固定不易动态扩展。

## 链表

区间离散，占用内存宽松，空间复杂度小，时间复杂度O(N)。

- 优点：插入删除速度快，内存利用率高，没有大小固定，扩展灵活。
- 缺点：不能随机查找，每次都是从第一个开始遍历（查询效率低）。


## 源码分析

```java
//基于jdk1.8.0.121
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {

    //默认初始容量为16，0000 0001 右移4位 0001 0000为16，主干数组的初始容量为16，而且这个数组
    //必须是2的倍数
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
     
    //最大容量为int的最大值除2
    static final int MAXIMUM_CAPACITY = 1 << 30;
     
    //默认加载因子为0.75
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
     
    //阈值，如果主干数组上的链表的长度大于8，链表转化为红黑树
     static final int TREEIFY_THRESHOLD = 8;
     
    //hash表扩容后，如果发现某一个红黑树的长度小于6，则会重新退化为链表
     static final int UNTREEIFY_THRESHOLD = 6;
     
    //当hashmap容量大于64时，链表才能转成红黑树
     static final int MIN_TREEIFY_CAPACITY = 64;
     
    //临界值=主干数组容量*负载因子
    int threshold;


    public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }
    
    //initialCapacity为初始容量，loadFactor为负载因子
    public HashMap(int initialCapacity, float loadFactor) {
        //初始容量小于0，抛出非法数据异常
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
       //初始容量最大为MAXIMUM_CAPACITY
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        //负载因子必须大于0，并且是合法数字
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }
    
    //如果传入A，当A大于0，小于定义的最大容量时，
    //如果A是2次幂则返回A，否则将A转化为一个比A大且差距最小的2次幂。  
    //例如传入7返回8，传入8返回8，传入9返回16
    static final int tableSizeFor(int cap) {
        int n = cap - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
    }
    
    //默认构造方法，负载因子为0.75，初始容量为DEFAULT_INITIAL_CAPACITY=16，初始容量在第一次put时才会初始化
    public HashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
    }

    //传入map的构造方法
    public HashMap(Map<? extends K, ? extends V> m) {
        this.loadFactor = DEFAULT_LOAD_FACTOR;
        putMapEntries(m, false);
    }


    final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
        int s = m.size();
        if (s > 0) {
            if (table == null) { // pre-size
                float ft = ((float)s / loadFactor) + 1.0F;
                int t = ((ft < (float)MAXIMUM_CAPACITY) ?
                         (int)ft : MAXIMUM_CAPACITY);
                 //设置临界值
                if (t > threshold)
                    threshold = tableSizeFor(t);
            }
            else if (s > threshold)
                resize();//初始化或扩充table
            //遍历map，添加每个元素
            for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
                K key = e.getKey();
                V value = e.getValue();
                putVal(hash(key), key, value, false, evict);
            }
        }
    }

    //添加键值对
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }
    
    //integer类型的hashcode都是他自身的值，即h=key；h >>> 16为无符号右移16位，低位挤走，高位补0；
    //^ 为按位异或，即转成二进制后，相异为1，相同为0，由此可发现，当传入的值小于  2的16次方-1 时，调用这个方法返回的值，都是自身的值。
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }

    //onlyIfAbsent是true的话，不要改变现有的值
    //evict为true的话，表处于创建模式 
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        //如果主干上的table为空，长度为0，调用resize方法，调整table的长度
        //如果是通过传入map的方式创建的HashMap，则在相应构造函数中就会调用resize
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        //将数组长度与计算得到的hash值比较
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);//位置为空，将i位置上赋值一个node对象
        else {
            Node<K,V> e; K k;
            //如果这个位置的old节点与new节点的key完全相同
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)  // 如果p已经是树节点的一个实例，既这里已经是树了
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                //p与新节点既不完全相同，p也不是treenode的实例
                for (int binCount = 0; ; ++binCount) {
                    //e=p.next,如果p的next指向为null
                    if ((e = p.next) == null) {
                        //指向一个新的节点
                        p.next = newNode(hash, key, value, null);
                        // 如果链表长度大于等于8
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash); //将链表转为红黑树
                        break;
                    }
                    //如果遍历过程中链表中的元素与新添加的元素完全相同，则跳出循环
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;//将p中的next赋值给p,即将链表中的下一个node赋值给p，继续循环遍历链表中的元素
                }
            }
            //如果添加的元素产生了hash冲突，那么调用                
            //put方法时，会将他在链表中他的上一个元素的值返回
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                //判断条件成立的话，将oldvalue替换        
                //为newvalue，返回oldvalue；不成立则不替换，然后返回oldvalue
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);//用于LinkedHashMap回调
                return oldValue;
            }
        }
        ++modCount;//记录修改次数
        if (++size > threshold)//如果元素数量大于临界值，则进行扩容
            resize();
        afterNodeInsertion(evict);
        return null;
    }

    // 扩容
    final Node<K,V>[] resize() {
        Node<K,V>[] oldTab = table;
        int oldCap = (oldTab == null) ? 0 : oldTab.length;
        int oldThr = threshold;
        int newCap, newThr = 0;
        if (oldCap > 0) {
            //最大容量
            if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                     oldCap >= DEFAULT_INITIAL_CAPACITY)
                 //扩容两倍
                newThr = oldThr << 1; // double threshold
        }
        else if (oldThr > 0) // initial capacity was placed in threshold
            newCap = oldThr;
        else {               // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        if (newThr == 0) {
            float ft = (float)newCap * loadFactor;
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                      (int)ft : Integer.MAX_VALUE);
        }
        threshold = newThr;//新的临界点
        @SuppressWarnings({"rawtypes","unchecked"})
            Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        table = newTab;//新的数组
        if (oldTab != null) {
            //通过原容量遍历原数组
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                if ((e = oldTab[j]) != null) {
                    oldTab[j] = null;
                    if (e.next == null)
                        newTab[e.hash & (newCap - 1)] = e;
                    else if (e instanceof TreeNode)
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            next = e.next;
                            if ((e.hash & oldCap) == 0) {
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }
                            else {
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }








}


```


## 参考


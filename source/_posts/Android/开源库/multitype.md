---
title: multitype
tags: Android
toc: true
---


## 概述

有些业务场景，比如IM聊天、直播房间的消息面板。可能会出现有好几十个ViewHolder的场景。这个时候，如果按照Adapter的标准写法，所有的类型都堆叠
在一个文件中，文件会变得臃肿，到后期维护成本变化。也违反了开闭原则，新增一个类型的时候又要改这个Adapter。MultiTypeAdapter就是帮我们处理了
复杂场景下Adapter的工作。


MultiTypeAdapter在渲染多类型布局的时候，根据Adapter的数据集合拿到第i个数据的JavaBean Class,然后根据这个Classs, 拿到ViewType。
之后onCreateViewHolder方法和 onBindViewHolder方法根据这个View Type 拿到对应的Binder，然后让相应的Binder来进行绑定布局和绑定数据。


## 用法

支持一对多、支持修改item中多子view。

```java

// 自己实现ItemViewBinder
class PostViewBinder : ItemViewBinder<Post, PostViewBinder.ViewHolder>() {

  override fun onCreateViewHolder(inflater: LayoutInflater, parent: ViewGroup): ViewHolder {
    return ViewHolder(inflater.inflate(R.layout.item_post, parent, false))
  }

  override fun onBindViewHolder(holder: ViewHolder, item: Post) {
    holder.setData(item)
  }

  class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

    private val cover: ImageView = itemView.findViewById(R.id.cover)
    private val title: TextView = itemView.findViewById(R.id.title)

    fun setData(post: Post) {
      cover.setImageResource(post.coverResId)
      title.text = post.title
    }
  }
}

// 也可以实现ViewDelegate
// 其内部自己实现ViewHolder，通过工厂方法模式暴露onCreateView、onBindView让子类实现
class RichViewDelegate : ViewDelegate<RichItem, RichView>() {

  override fun onCreateView(context: Context): RichView {
    return RichView(context).apply { layoutParams = LayoutParams(MATCH_PARENT, WRAP_CONTENT) }
  }

  @SuppressLint("SetTextI18n")
  override fun onBindView(view: RichView, item: RichItem) {
    view.imageView.setImageResource(item.imageResId)
    view.textView.text = """
      |${item.text}
      |layoutPosition: ${view.layoutPosition} 
      |absoluteAdapterPosition: ${view.absoluteAdapterPosition} 
      |bindingAdapterPosition: ${view.bindingAdapterPosition} 
    """.trimMargin()
  }
}

MultiTypeAdapter adapter = new MultiTypeAdapter()
//注册后，会自动匹配Post类型的数据设置成对应的视图
adapter.register(PostViewBinder())
adapter.register(RichViewDelegate())

//一对多关系
adapter.register(Weibo::class).to(
      SimpleTextViewBinder(),
      SimpleImageViewBinder()
    ).withLinker { _, weibo ->
    // 判断使用那种类型
      when (weibo.content) {
        is SimpleText -> 0
        is SimpleImage -> 1
        else -> 0
      }
    }
//有content对应的类型SimpleTextViewBinder、SimpleImageViewBinder
val simpleText = SimpleText("A simple text Weibo: Hello World.")
val simpleImage = SimpleImage(R.drawable.img_10)
for (i in 0..19) {
  items.add(Weibo(user, simpleText))
  items.add(Weibo(user, simpleImage))
}

```

## 源码分析



## 参考

- [https://github.com/drakeet/MultiType](https://github.com/drakeet/MultiType)

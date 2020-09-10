---
layout: post
title: Github Page添加评论
category: 技术
tags: Jekyll
keywords:
description:
---

选择leancloud


### 注册账号

[https://leancloud.cn/dashboard/login.html#/signup](https://leancloud.cn/dashboard/login.html#/signup)

### 注册应用

[https://leancloud.cn/dashboard/applist.html#/newapp](https://leancloud.cn/dashboard/applist.html#/newapp)


### 配置

- _config.yml配置相应变量

```
# Comment
comment:
    valine: true
    # app_id leancloud的应用-->设置-->应用Keys
    leancloud_appid: oHebxNy7EUKpUp7DNX4YoYcp-gzGzoHsz
    # app_key
    leancloud_appkey: iSoFxGq6O5Ee9F0xh2GeORyU
    # placeholde
    placeholder: 留下一个脚印吧~

```

- _include文件夹下添加评论文件comments.html

```
<section class="post-comments">

  {% if site.comment.uyan %}
    <div id="uyan_frame"></div>

    <script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid="+'{{ site.comment.uyan }}'></script>

  {% elsif site.comment.disqus %}
    <div id="disqus_thread"></div>
    <script>
    
    var disqus_config = function () {
        this.page.url = "{{ page.url | prepend: site.baseurl | prepend: site.url }}";
        this.page.identifier = "{{ page.url }}";
    };
    var disqus_shortname = '{{ site.comment.disqus }}';
    
    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    </script>
    <noscript>要查看<a href="http://disqus.com/?ref_noscript"> Disqus </a>评论，请启用 JavaScript</noscript>
    

  {% elsif site.comment.gitment %}
    <div id="gitmentContainer"></div>
    <link rel="stylesheet" href="https://billts.site/extra_css/gitment.css">
    <script src="https://billts.site/js/gitment.js"></script>
    <script>
    var gitment = new Gitment({
        owner: 'zhanglinhahaha',
        repo: 'zhanglinhahaha.github.io',
        oauth: {
            client_id:'{{ site.comments.gitalk_clientID }}',
            client_secret: '{{ site.comments.gitalk_Secret }}',
        },
    });
    gitment.render('gitmentContainer');
    </script>

  {% elsif site.comment.gitalk %}
    <!-- Link Gitalk 的支持文件  -->
    <div id="gitalk-container"></div>
    <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
    <script src="https://unpkg.com/gitalk@latest/dist/gitalk.min.js"></script> 
        <script>
        var gitalk = new Gitalk({
              clientID: '{{ site.comments.gitalk_clientID }}',
              clientSecret: '{{ site.comments.gitalk_Secret }}',
              repo: '{{ site.comments.gitalk_repo }}',
              owner: '{{ site.comments.gitalk_owner }}',
              admin: '{{ site.comments.gitalk_admin }}',
              id: location.pathname,      // Ensure uniqueness and length less than 50{{ page.title }}
              distractionFreeMode: '{{ site.comments.distractionFreeMode }}'  // Facebook-like distraction free mode
            })
        gitalk.render('gitalk-container');
    </script>

  {% elsif site.comment.valine %}
    <div id="valine-comments"></div>
    <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
    <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
    <script>
        new Valine({
            el: '#valine-comments',
            app_id: '{{ site.comment.leancloud_appid }}',   
            app_key: '{{ site.comment.leancloud_appkey }}', 
            placeholder: '{{ site.comment.placeholder }}',
        })
    </script>

  {% endif %}

</section>

```

- 相应界面添加评论文件

post.html和about.md分别添加 {% include comments.html %}


### 添加访问次数

- 设置访问次数开关

```
new Valine({
    el:'#vcomments',
    ...
    visitor: true // 阅读量统计
})

```

- 显示配置

```
    <span id="{{ page.url }}" class="leancloud_visitors" data-flag-title="Your Article Title">
    <em class="post-meta-item-text">阅读量 </em>
    <i class="leancloud-visitors-count">0</i>
    </span>
```


### 参考：

- [https://valine.js.org/visitor.html](https://valine.js.org/visitor.html)
- [https://www.shuzhiduo.com/A/MyJxY4Be5n/](https://www.shuzhiduo.com/A/MyJxY4Be5n/)




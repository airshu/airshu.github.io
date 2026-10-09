(function($){
    var toTop = ($('#sidebar').height() - $(window).height()) + 60;
    // Caption
    $('.article-entry').each(function(i) {
        $(this).find('img').each(function() {
            this.loading = 'lazy';
            if (this.alt && !(!!$.prototype.justifiedGallery && $(this).parent('.justified-gallery').length)) {
                $(this).after('<span class="caption">' + this.alt + '</span>');
            }

            // 对于已经包含在链接内的图片不适用lightGallery
            if ($(this).parent().prop("tagName") !== 'A') {
                $(this).wrap('<a href="' + this.src + '" title="' + this.alt + '" class="gallery-item"></a>');
            }
        });
    });
    if (typeof lightGallery !== 'undefined') {
        var options = {
            selector: '.gallery-item',
        };
        $('.article-entry').each(function(i, entry) {
            lightGallery(entry, options);
        });
        if ($('.article-gallery').length) {
            lightGallery($('.article-gallery')[0], options);
        }
    }
    if (!!$.prototype.justifiedGallery) {  // if justifiedGallery method is defined
        var options = {
            rowHeight: 140,
            margins: 4,
            lastRow: 'justify'
        };
        $('.justified-gallery').justifiedGallery(options);
    }

    // Profile card
    $(document).on('click', function () {
        $('#profile').removeClass('card');
    }).on('click', '#profile-anchor', function (e) {
        e.stopPropagation();
        $('#profile').toggleClass('card');
    }).on('click', '.profile-inner', function (e) {
        e.stopPropagation();
    });

    // TOC scrollspy: highlight the heading currently in view
    var $tocLinks = $('#toc a');
    var $headings = $('.article-entry h1, .article-entry h2, .article-entry h3').filter(function() {
        return this.id;
    });
    if ($tocLinks.length && $headings.length) {
        // toc hrefs are percent-encoded, heading ids are not — normalize both
        var linkById = {};
        $tocLinks.each(function() {
            var href = this.getAttribute('href').slice(1);
            try { href = decodeURIComponent(href); } catch (e) {}
            linkById[href] = this;
        });
        var tocScrollspy = function() {
            var scrollPos = $(window).scrollTop() + 100;
            var currentId = null;
            $headings.each(function() {
                if (this.offsetTop <= scrollPos) currentId = this.id;
            });
            $tocLinks.removeClass('active');
            if (currentId && linkById[currentId]) {
                $(linkById[currentId]).addClass('active');
            }
        };
        $(window).on('scroll', tocScrollspy);
        tocScrollspy();
    }

    // To Top
    if ($('#sidebar').length) {
        $(document).on('scroll', function () {
            if ($(document).width() >= 800) {
                if(($(this).scrollTop() > toTop) && ($(this).scrollTop() > 0)) {
                    $('#toTop').fadeIn();
                    $('#toTop').css('left', $('#sidebar').offset().left);
                } else {
                    $('#toTop').fadeOut();
                }
            } else {
                $('#toTop').fadeOut();
            }
        }).on('click', '#toTop', function () {
            $('body, html').animate({ scrollTop: 0 }, 600);
        });
    }
    
    // Task lists in markdown
    $('ul > li').each(function() {
        var taskList = {
            field: this.textContent.substring(0, 2),
            check: function(str) {
                var re = new RegExp(str);
                return this.field.match(re);
            }
        }
        var string = ["[ ]", ["[x]", "checked"]];
        var checked = taskList.check(string[1][0]);
        var unchecked = taskList.check(string[0]);
        var $current = $(this);
        function update(str, check) {
            var click = ["disabled", ""];
            $current.html($current.html().replace(
              str, "<input type='checkbox' " + check + " " + click[1] + " >")
            )
        }
        if (checked || unchecked) {
            this.classList.add("task-list");
            if (checked) {
                update(string[1][0], string[1][1]);
                this.classList.add("check");
            } else {
                update(string[0], "");
            }
        }
    })
    $(document).on('click', 'input[type="checkbox"]', function (event) {
        event.preventDefault();
    });

    // Theme toggle: light <-> dark, follow system until user chooses
    var $html = $(document.documentElement);
    function applyTheme(dark) {
        $html.toggleClass('dark', dark);
        $html.css('background-color', dark ? '#1e2229' : '');
        $('#theme-toggle .fa')
            .toggleClass('fa-sun-o', dark)
            .toggleClass('fa-moon-o', !dark);
    }
    applyTheme($html.hasClass('dark'));
    $(document).on('click', '#theme-toggle', function () {
        var dark = !$html.hasClass('dark');
        try { localStorage.setItem('theme-mode', dark ? 'dark' : 'light'); } catch (e) {}
        applyTheme(dark);
    });
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            var saved = null;
            try { saved = localStorage.getItem('theme-mode'); } catch (err) {}
            if (!saved) applyTheme(e.matches);
        });
    }

    // Sidebar collapse: hide sidebar for wider reading, persist choice.
    // Toggle lives in the sidebar widget title; when collapsed the same
    // button floats at the content top edge (moved, not duplicated) to re-open.
    function applySidebar(collapsed) {
        $html.toggleClass('sidebar-collapsed', collapsed);
        var $btn = $('#sidebar-toggle');
        $btn.find('.fa')
            .toggleClass('fa-angle-double-left', !collapsed)
            .toggleClass('fa-angle-double-right', collapsed);
        $btn.attr('title', collapsed ? '展开侧栏' : '收起侧栏');
        var wasFloating = $btn.hasClass('sidebar-toggle-float') || collapsed;
        $btn.toggleClass('sidebar-toggle-float', collapsed);
        if (collapsed) {
            $btn.appendTo('body');
        } else if (wasFloating && $('#categories').length) {
            $btn.insertBefore('#allExpand');
        }
        // card box changed → TOC must re-anchor (see inline script in article.ejs)
        if (window.__alignToc) window.__alignToc();
    }
    var sidebarCollapsed = false;
    try { sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === '1'; } catch (e) {}
    applySidebar(sidebarCollapsed);
    $(document).on('click', '#sidebar-toggle', function () {
        sidebarCollapsed = !sidebarCollapsed;
        try { localStorage.setItem('sidebar-collapsed', sidebarCollapsed ? '1' : '0'); } catch (e) {}
        applySidebar(sidebarCollapsed);
    });

    // Code copy button: one per code block, top-right
    $('.article-entry figure.highlight, .article-entry > pre').each(function() {
        $(this).append('<span class="code-copy-btn" title="copy">copy</span>');
    });
    $(document).on('click', '.code-copy-btn', function() {
        var code = $(this).siblings('table').length
            ? $(this).siblings('table').find('td.code pre').text()
            : $(this).siblings('code').text() || $(this).parent().clone().children('.code-copy-btn').remove().end().text();
        var btn = this;
        function done() {
            btn.textContent = 'copied';
            setTimeout(function() { btn.textContent = 'copy'; }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code.trim()).then(done);
        } else {
            var ta = document.createElement('textarea');
            ta.value = code.trim();
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            done();
        }
    });
})(jQuery);

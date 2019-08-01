(function ($) {
    'use strict';
    //  $('.dropdown').on('click', '.dropdown-toggle',function(){
    //      $(this).parent(0).find('.dropdown-menu').toggleClass('show');
    //  });
    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 150) {
            $('header').addClass('nav-fixed');
        } else {
            $('header').removeClass('nav-fixed');
        }
    });
    $(function(){
        var current = location.pathname;
        var act_stat=0;
        $('.nav-menu li a').each(function(){
            var $this = $(this);
            // if the current path is like this link, make it active
            if($this.attr('href').indexOf(current) !== -1 && act_stat == 0 ){
                $this.parent(0).addClass('active');
                act_stat =1;
            }
        })
    })
})(jQuery);
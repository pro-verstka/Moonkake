/*!
 * Moonkake 6.0.1
 *
 * https://github.com/detectiveshelby/moonkake
 */

$(function () {

  /* SCROLL
  -------------------------------------------------- */

  $('[data-scroll-to]').on('click', function (event) {
    event.preventDefault();

    var to = $(this).data('scroll-to-target');
    var offset = $(this).data('scroll-to-offset') || 0;

    $utils.scrollTo($(to), offset);
  });

  /* CAROUSEL
  -------------------------------------------------- */

  $('.owl-carousel').owlCarousel({
    items: 3,
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000
  });

  // $('.carousel').slick({
  //   accessibility: false,
  //   autoplay: true,
  //   autoplaySpeed: 5000,
  //   arrows: true,
  //   dots: true,
  //   infinite: true
  // });

  /* INPUTMASK
  -------------------------------------------------- */

  $('input[type="tel"]').inputmask({
    mask: '+7 (999) 999-99-99'
  });

  // $('input[type="email"]').inputmask({
  //   alias: 'email'
  // });

  $('input[data-mask-date]').inputmask({
    inputFormat: 'dd.mm.yyyy',
    alias: 'datetime',
    placeholder: 'дд.мм.гггг'
  });

  $('input[data-mask-number]').inputmask({
    rightAlign: false,
    alias: 'integer',
    allowMinus: false
  });

  /* TABLES
  -------------------------------------------------- */

  $('article table').wrap('<div class="table"></div>');

});

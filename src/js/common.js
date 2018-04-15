/*!
 * Moonkake 6.0.0
 *
 * https://github.com/detectiveshelby/moonkake
 */

/* VAR
-------------------------------------------------- */

var $d = $(document);
var $w = $(window);
var $h = $('html');
var $b = $('body');

$(function () {

  /* SCROLL
  -------------------------------------------------- */

  $('.js-scroll').on('click', function (event) {
    event.preventDefault();

    var to = $(this).data('to');
    var offset = $(this).data('offset') || 0;

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

  /* INPUTMASK
  -------------------------------------------------- */

  $('input[type="tel"]').inputmask({
    mask: '+7 (999) 999-99-99'
  });

  $('input[type="email"]').inputmask({
    alias: 'email'
  });

  $('input[data-mask-date]').inputmask({
    alias: 'dd.mm.yyyy',
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

  /* STICKY
  -------------------------------------------------- */

  // $('.js-sticky').hcSticky();

});

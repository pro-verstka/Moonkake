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

    var target = $(this).data('target');
    var offset = $(this).data('offset') || 0;

    $utils.scrollTo($(target), offset);
  });

  /* POPUP
  -------------------------------------------------- */

  // $('.js-popup').magnificPopup({
  //   type: 'inline',
  //   midClick: true,
  //   closeBtnInside: true,
  //   removalDelay: 300,
  //   mainClass: 'mfp-fade',
  //   fixedContentPos: false
  // });

  // $('.js-image').magnificPopup({
  //   type: 'image',
  //   closeOnContentClick: true,
  //   removalDelay: 300,
  //   mainClass: 'mfp-fade mfp-img-mobile',
  //   image: {
  //     verticalFit: true
  //   }
  // });

  // $('.js-gallery').each(function() {
  //   $(this).magnificPopup({
  //     delegate: 'a',
  //     type: 'image',
  //     tLoading: 'Загрузка изображения #%curr%...',
  //     mainClass: 'mfp-fade mfp-img-mobile',
  //     removalDelay: 300,
  //     gallery: {
  //       enabled: true,
  //       navigateByImgClick: true,
  //       preload: [0, 1],
  //       tCounter: '<span class="mfp-counter">%curr% из %total%</span>'
  //     },
  //     image: {
  //       tError: '<a href="%url%">Изображение #%curr%</a> не может быть загружено.'
  //     }
  //   });
  // });

  $('.js-popup').fancybox({
    defaultType: 'inline',
    animationEffect: 'fade',
    baseClass: 'fancybox-popup-custom',
    touch: false
  });

  $('.js-image').fancybox({
    defaultType: 'image',
    animationEffect: 'fade',
    baseClass: 'fancybox-image-custom'
  });

  $('.js-gallery').each(function() {
    var $collection = $(this).find('a');

    $collection.on('click', function() {

      $.fancybox.open($collection, {
        defaultType: 'image',
        loop: true,
        protect: true,
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'download', 'zoom', 'close'],
        animationEffect: 'fade',
        baseClass: 'fancybox-gallery-custom'
      },
        $collection.index(this)
      );

      return false;
    });
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

  /* COUNT
  -------------------------------------------------- */

  $('.count').on('click', '.count-plus, .count-minus', function (event) {
    var _ = $(this),
      $input = _.closest('.count').find('input'),
      value = parseInt($input.val()),
      min = $input.attr('min') || '',
      max = $input.attr('max') || '';

    if (event.currentTarget.className === 'count-minus') {
      value -= 1;
      if (value <= 1) value = 1;
    }

    if (event.currentTarget.className === 'count-plus') {
      value += 1;
    }

    $input.val(value);

    $d.trigger('inputCountChanged', {
      input: $input,
      value: value
    });

    return false;
  });

  $('.count').on('focusout', 'input', function (event) {
    var _ = $(this);

    if (_.val() === '' || _.val() === '0') {
      _.val(1);
    }
  });

  /* FILE
  -------------------------------------------------- */

  $d.on('change', '.file input[type="file"]', function () {
    var value = $(this).val();
    var $label = $(this).closest('.file').find('label span');
    var label = $label.data();

    if (value) {
      value = value.split(/(\\|\/)/g).pop();
      $label.text(value);
    } else {
      $label.text(label.label);
    }
  });

  /* INPUTMASK
  -------------------------------------------------- */

  $('input[type="tel"]').inputmask({
    mask: '+7 (999) 999-99-99'
  });

  /* TABLES
  -------------------------------------------------- */

  $('article table').wrap('<div class="table"></div>');

});

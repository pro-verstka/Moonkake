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

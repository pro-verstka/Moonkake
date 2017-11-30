/*!
 * Moonkake v5.0.1
 *
 * https://github.com/detectiveshelby/moonkake
 */

/* VAR
-------------------------------------------------- */

var $d = $(document);
var $w = $(window);
var $h = $('html');
var $b = $('body');

/* UTILS
-------------------------------------------------- */

var $mk = {
  work: function() {
    console.log('Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на devbrains.ru');
  },

  getPageQuery: function(key) {
    var query = {};

    if (window.location.search) {
      var q = window.location.search;
      q = q.slice(1);
      q = q.split('&');
      var tmp;

      for (var i = 0; i < q.length; i++) {
        tmp = q[i].split('=');
        query[tmp[0]] = tmp[1];
      };

      if (key !== '') {
        return query[key];
      } else {
        return query;
      };
    };
  },

  scrollTo: function ($object, offset, callback) {
    $('html, body').stop().animate({
      scrollTop: $object.offset().top - ((typeof (offset) == 'number') ? offset : 0)
    }, 500, function () {
      if ($(this)[0].nodeName == 'HTML') {
        if (typeof (callback) == 'function') {
          callback();
        }
      }
    });
  },

  getScreenIndex: function ($object, offset) {
    var index = 0;

    $object.each(function () {
      var $self = $(this);

      if ($d.scrollTop() >= $self.offset().top - offset) {
        index = $self.index();
      }
    });

    return index;
  },

  numberFormat: function (number, decimals, dec_point, thousands_sep) {
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfix by: Michael White (http://crestidg.com)
    var i, j, kw, kd, km;

    if (isNaN(decimals = Math.abs(decimals))) {
      decimals = 2;
    }
    if (dec_point == undefined) {
      dec_point = ',';
    }
    if (thousands_sep == undefined) {
      thousands_sep = '.';
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + '';

    if ((j = i.length) > 3) {
      j = j % 3;
    } else {
      j = 0;
    }

    km = j ?
        i.substr(0, j) + thousands_sep :
        '';
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals ?
        dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, '0').slice(2) :
        '');

    return km + kw + kd;
  },
};

/* TABS
  -------------------------------------------------- */

var $tabs = {
  opts: {
    root: '.tabs:not(.tabs-nojs)',
    title: '.tabs-title',
    content: '.tabs-content',
    item: '.tabs-item',
    active: '-active'
  },

  changeTab: function ($root, index) {
    var opt = this.opts;

    $root.find(opt.title + ' ' + opt.item).eq(index).addClass(opt.active).siblings(opt.item).removeClass(opt.active);
    $root.find(opt.content + ' ' + opt.item).eq(index).addClass(opt.active).siblings(opt.item).removeClass(opt.active);

    $d.trigger('tabChanged', {
      root: $root,
      index: index
    });
  },

  init: function () {
    var $this = this;
    var opt = $this.opts;

    $(opt.title).on('click', opt.item, function () {
      var _ = $(this);
      var $root = _.closest(opt.root);
      var index = _.index();

      $this.changeTab($root, index);
    });
  }
};

/* NAVIGATION
-------------------------------------------------- */

var $toggler = {
  options: {
    toggler: 'data-toggler',
    target: 'data-target',
    active: '-active'
  },

  init: function ($options) {
    var $this = this;

    if (typeof $options === 'object') {
      $this.options = $options;
    }

    $('[' + $this.options.toggler + ']').on('click', function () {
      var _ = $(this);
      var target = _.attr($this.options.target);

      $('[' + $this.options.target + ']').each(function () {
        var _ = $(this);
        var currentTarget = _.attr($this.options.target);

        if (currentTarget !== target) {
          _.removeClass($this.options.active);
          $('#' + currentTarget).removeClass($this.options.active);
        }
      });

      _.toggleClass($this.options.active);

      $('#' + target).toggleClass($this.options.active);

      return false;
    });

    $d.on('click', function () {
      $('[' + $this.options.toggler + ']').removeClass($this.options.active);

      $('[' + $this.options.toggler + ']').each(function () {
        var _ = $(this);
        var target = _.attr($this.options.target);

        _.removeClass($this.options.active);
        $('#' + target).removeClass($this.options.active);
      });
    });

    $('[' + $this.options.toggler + ']').on('click', function (event) {
      event.stopPropagation();
    });

    $('[' + $this.options.toggler + ']').each(function() {
      var _ = $(this);
      var target = _.attr($this.options.target);

      $('#' + target).each(function() {
        $(this).on('click', function (event) {
          event.stopPropagation();
        });
      });
    });

  }
};

/* OK, WE ARE READY
-------------------------------------------------- */

$(function () {

  /* SCROLL
  -------------------------------------------------- */

  $('.js-scroll').on('click', function () {
    var href = $(this).attr('href');

    $mk.scrollTo($(href), 0);

    return false;
  });

  /* POPUP
  -------------------------------------------------- */

  $('.js-popup').magnificPopup({
    type: 'inline',
    midClick: true,
    closeBtnInside: true,
    removalDelay: 300,
    mainClass: 'mfp-fade',
    fixedContentPos: false,
    callbacks: {
      beforeOpen: function() {
        $d.trigger('mfpPopupBeforeOpen', {
          instance: this
        });
      },
      open: function() {
        $d.trigger('mfpPopupOpen', {
          instance: this
        });
      },
      beforeClose: function() {
        $d.trigger('mfpPopupBeforeClose', {
          instance: this
        });
      },
      close: function() {
        $d.trigger('mfpPopupClose', {
          instance: this
        });
      },
      afterClose: function() {
        $d.trigger('mfpPopupAfterClose', {
          instance: this
        });
      }
    }
  });

  $('.js-image').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    removalDelay: 300,
    mainClass: 'mfp-fade mfp-img-mobile',
    image: {
      verticalFit: true
    },
    callbacks: {
      beforeOpen: function() {
        $d.trigger('mfpImageBeforeOpen', {
          instance: this
        });
      },
      open: function() {
        $d.trigger('mfpImageOpen', {
          instance: this
        });
      },
      beforeClose: function() {
        $d.trigger('mfpImageBeforeClose', {
          instance: this
        });
      },
      close: function() {
        $d.trigger('mfpImageClose', {
          instance: this
        });
      },
      afterClose: function() {
        $d.trigger('mfpImageAfterClose', {
          instance: this
        });
      }
    }
  });

  $('.js-gallery').each(function() {
    $(this).magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: 'Загрузка изображения #%curr%...',
      mainClass: 'mfp-fade mfp-img-mobile',
      removalDelay: 300,
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1],
        tCounter: '<span class="mfp-counter">%curr% из %total%</span>'
      },
      image: {
        tError: '<a href="%url%">Изображение #%curr%</a> не может быть загружено.'
      },
      callbacks: {
        beforeOpen: function() {
          $d.trigger('mfpGalleryBeforeOpen', {
            instance: this
          });
        },
        open: function() {
          $d.trigger('mfpGalleryOpen', {
            instance: this
          });
        },
        beforeClose: function() {
          $d.trigger('mfpGalleryBeforeClose', {
            instance: this
          });
        },
        close: function() {
          $d.trigger('mfpGalleryClose', {
            instance: this
          });
        },
        afterClose: function() {
          $d.trigger('mfpGalleryAfterClose', {
            instance: this
          });
        }
      }
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

  /* INPUTMASK
  -------------------------------------------------- */

  $('input[type="tel"]').inputmask({
    mask: '+7 (999) 999-99-99'
  });

  /* INITIALIZATION
  -------------------------------------------------- */

  $tabs.init();
  $toggler.init();

  $mk.work();

});

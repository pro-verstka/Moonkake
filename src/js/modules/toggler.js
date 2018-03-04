/* TOGGLER
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

    $(document).on('click', '[' + $this.options.toggler + ']', function () {
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

    $(document).on('click', function () {
      $('[' + $this.options.toggler + ']').removeClass($this.options.active);

      $('[' + $this.options.toggler + ']').each(function () {
        var _ = $(this);
        var target = _.attr($this.options.target);

        _.removeClass($this.options.active);
        $('#' + target).removeClass($this.options.active);
      });
    });

    $(document).on('click', '[' + $this.options.toggler + ']', function (event) {
      event.stopPropagation();
    });

    $('[' + $this.options.toggler + ']').each(function () {
      var _ = $(this);
      var target = _.attr($this.options.target);

      $('#' + target).each(function () {
        $(this).on('click', function (event) {
          if (!$(event.originalEvent.target).is('a')) {
            event.stopPropagation();
          }
        });
      });
    });

  }
};

$toggler.init();

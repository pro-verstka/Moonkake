/* TABS
  -------------------------------------------------- */

var $tabs = {
  options: {
    root: '.tabs:not(.tabs-nojs)',
    title: '.tabs-title',
    content: '.tabs-content',
    item: '.tabs-item',
    active: '-active'
  },

  changeTab: function ($root, index) {
    var $this = this;

    $root
      .find($this.options.title + ' ' + $this.options.item)
      .eq(index)
      .addClass($this.options.active)
      .siblings($this.options.item)
      .removeClass($this.options.active);

    $root
      .find($this.options.content + ' ' + $this.options.item)
      .eq(index)
      .addClass($this.options.active)
      .siblings($this.options.item)
      .removeClass($this.options.active);

    $(document).trigger('tabAfterChange', {
      root: $root,
      index: index
    });
  },

  init: function ($options) {
    var $this = this;

    if (typeof $options === 'object') {
      $this.options = $options;
    }

    $($this.options.title).on('click', $this.options.item, function () {
      var _ = $(this);
      var $root = _.closest($this.options.root);
      var index = _.index();

      $(document).trigger('tabBeforeChange', {
        root: $root,
        index: index
      });

      $this.changeTab($root, index);
    });
  }
};

$tabs.init();

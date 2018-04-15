/* ANIMATION
-------------------------------------------------- */

$('[data-fx]').viewportChecker({
  offset: '40%',
  callbackFunction: function (elem, action) {
    var $collection = $(elem).find('[data-fx-item]');

    $.each($collection, function (index, item) {
      var $this = $(item);
      var data = $this.data();
      var fx;
      var delay = parseInt(data.fxDelay) || 300;

      if (window.innerWidth > 600) {
        fx = data.fxAnimation;
      } else {
        fx = data.fxAnimationMobile || data.fxAnimation;
      }

      var isAnimated = false;

      if (!$this.hasClass('animated') && !isAnimated) {
        setTimeout(function () {
          isAnimated = true;

          $this.addClass('animated ' + fx);
        }, index * delay);
      }
    });
  }
});

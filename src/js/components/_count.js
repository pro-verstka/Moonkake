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

  $(document).trigger('inputCountChanged', {
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

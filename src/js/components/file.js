/* FILE
-------------------------------------------------- */

$(document).on('change', '.file input[type="file"]', function () {
	var value = $(this).val();
	var $label = $(this).closest('.file').find('label span');
	var label = $label.data() || 'Выберите файл';

	if (value) {
		value = value.split(/(\\|\/)/g).pop();
		$label.text(value);
	} else {
		$label.text(label.label);
	}
});

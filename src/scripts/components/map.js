const initMap = () => {
	ymaps.ready(() => {
		const map = new ymaps.Map(
			'map',
			{
				center: [51.507351, -0.12766],
				zoom: 17,
				controls: [],
			},
			{
				suppressMapOpenBlock: true,
			},
		)

		map.behaviors.disable('scrollZoom')
		// map.behaviors.disable('drag')

		map.controls.add(
			new ymaps.control.ZoomControl({
				options: {
					size: 'small',
					position: {
						right: 10,
						bottom: 30,
					},
				},
			}),
		)

		const placeMark = new ymaps.Placemark(
			map.getCenter(),
			{
				balloonContent: 'Адрес',
				iconCaption: 'Заголовок',
			},
			{
				preset: 'islands#redIcon',
				iconCaptionMaxWidth: '200',
				// iconLayout: 'default#image',
				// iconImageHref: 'assets/img/marker.png',
				// iconImageSize: [54, 70],
				// iconImageOffset: [-27, -70]
			},
		)

		map.geoObjects.add(placeMark)

		// map.panes.get('ground').getElement().style.filter = 'grayscale(1) brightness(0.4) contrast(1.5)'
	})
}

MK.addMethods({ initMap })

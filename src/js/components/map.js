window.initMap = () => {

	ymaps.ready(function() {
		var myMap = new ymaps.Map('map', {
			center: [51.507351, -0.127660],
			zoom: 17,
			controls: []
		});

		myMap.behaviors.disable('scrollZoom')

		myMap.controls.add(new ymaps.control.ZoomControl({
			options: {
				position: {
					right: 10,
					bottom: 30
				}
			}
		}))

		var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
			balloonContent: 'Адрес',
			iconCaption: 'Заголовок'
		},{
			preset: 'islands#redIcon',
			iconCaptionMaxWidth: '200'
			// iconLayout: 'default#image',
			// iconImageHref: 'assets/img/marker.png',
			// iconImageSize: [54, 70],
			// iconImageOffset: [-27, -70]
		});

		myMap.geoObjects.add(myPlacemark)
	})

}
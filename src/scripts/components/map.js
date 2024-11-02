const MAP_ID = 'map'

const initMap = () => {
	ymaps.ready(() => {
		const map = new ymaps.Map(
			MAP_ID,
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

let isMapLoaded = false

const loadMap = () => {
	if (isMapLoaded) {
		return
	}

	if (
		window.scrollY + window.innerHeight * 1.5 >=
		document.getElementById(MAP_ID).getBoundingClientRect().top - document.body.getBoundingClientRect().top
	) {
		isMapLoaded = true

		const script = document.createElement('script')
		script.src = '//api-maps.yandex.ru/2.1/?lang=ru_RU&onload=MK.methods.initMap'
		script.defer = true
		document.body.appendChild(script)
	}
}

window.addEventListener('load', loadMap)
window.addEventListener('scroll', loadMap)

# Moonkake

A starter template for layout using Vite, Scss, Pug, JS.

## Setup

```sh
npx degit pro-verstka/moonkake
npm install
npm run dev
```

## Available commands

```sh
// Default task for project development
npm run dev

// Build the project
npm run build
```

# Markup

### Image

```pug
+image({
	default: {
		src: "path/to/image",
		srcset: "path/to/image@1x.jpg 1x, path/to/image@2x.jpg 2x",
		width: 500,
		heigt: 500,
		alt: ""
	},
	sources: [
		{
			srcset: "path/to/image@1x.jpg 1x, path/to/image@2x.jpg 2x",
			media: "(max-width: 600px)"
		},
		{
			srcset: "path/to/image@1x.webp 1x, path/to/image@2x.webp 2x",
			media: "(min-width: 601px)",
			type: "image/webp"
		}
	]
})
```

### Checkbox

```pug
label.checkbox
	input(type="checkbox", name="checkbox_name")
	span Text
```

### Radio

```pug
label.radio
	input(type="radio", name="radio_name")
	span Text
```

### File

```pug
div.file
	input(type="file", id="file", name="file_name")
	label(for="file"): span(data-label="Select file") Select file
```

### Select

```pug
select.select(name="select_name")
	option(value="") text

div.select
	select(data-placeholder="Select...")
		option(value="")
		option(value="") All
		option(value="One") One
		option(value="Two") Two
```

### Form

```pug
form.form(action="", mathod="", id="form")
	div.form__fieldset
		div.form__group
			div.form__item
				input(type="text", name="", placeholder="Text", value="")

		div.form__group.form__group_row
			div.form__item
				input(type="text", name="", placeholder="Text", value="")
			div.form__item
				input(type="text", name="", placeholder="Text", value="")

	div.form__fieldset
		div.form__group
			div.form__item
				button.button(type="submit") Submit
```

### Tabs

```pug
div.tabs
	div.tabs__title
		div.tabs__item.tabs__item_active(data-hash="tab1") Tab 1
		div.tabs__item(data-hash="tab2") Tab 2
		div.tabs__item(data-hash="tab3") Tab 3

	div.tabs__content
		div.tabs__item.tabs__item_active Tab 1
		div.tabs__item Tab 2
		div.tabs__item Tab 3
```

### Accordion

```pug
div.accordion
	div.accordion__item
		div.accordion__header accordion title 1
		div.accordion__body accordion content 1
	div.accordion__item
		div.accordion__header accordion title 2
		div.accordion__body accordion content 2
```

### Counter

```pug
div.counter
	button.counter__minus -
	input(type="text" value="before 5 after" data-prefix="before " data-postfix=" after" data-min="2" data-max="10")
	button.counter__plus +
```

### Breadcrumbs

```pug
ul.breadcrumbs
	li.breadcrumbs__item: a.breadcrumbs__link(href="#") Home
	li.breadcrumbs__item: a.breadcrumbs__link(href="#") Section
	li.breadcrumbs__item: span.breadcrumbs__current Page
```

### Pagination

```pug
ul.pagination
	li.pagination__item: a.pagination__link(href="#") 1
	li.pagination__item: a.pagination__link(href="#") 2
	li.pagination__item: a.pagination__link(href="#") 3
```

### Modal

```pug
a(href="#modal_example" data-modal) Open a modal window

div.modal#modal_example
	div.modal__container
		button.modal__close(data-modal-close) &times;
		h2 Header

a(href="https://www.youtube.com/embed/G_hKGYD8gOg" data-modal-video) Open YouTube video
a(href="https://vimeo.com/191947042" data-modal-video) Open Vimeo video
a(href="https://images.unsplash.com/photo-1561444533-fa0a9266bf67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80" data-modal-image, title="Image Caption") Open Image
```

### Calendar

```pug
input(type="text", name="", data-calendar, placeholder="dd.mm.yyyyyy")
```

### Scroll to element

```pug
a(href="#" data-scroll-to="div_id") Scroll to ID
```

### Spoiler

```pug
div(data-spoiler)
	div(data-spoiler-body)
		p Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto nisi, pariatur nostrum est est iste sint recusandae? Consequuntur libero ratione cupiditate numquam saepe, odio delectus aliquam voluptatibus. Dolor quis vel ipsa!
```

### Tooltip

```pug
a(href="#", data-tippy, data-tippy-content="Tippy!") Text
```

### Drawer

```pug
button(data-drawer-toggle) Open

div.drawer(data-drawer)
```

### SyncScroll

```pug
div(data-sync-scroll)
	div(data-sync-scroll-item)
	div(data-sync-scroll-item)
```

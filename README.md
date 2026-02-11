# Moonkake

A starter template for layout using Vite, Scss, Pug/Twig, JS.

## Setup

```sh
pnpx degit pro-verstka/moonkake
pnpm install
pnpm run dev
```

## Available commands

1. `pnpm run dev` - Default task for project development
2. `pnpm run build` - Build the project
3. `pnpm run tools:generate` - Generate components
4. `pnpm run tools:lint` - Run linter
5. `pnpm run tools:format` - Run formatter

# Markup

### Image

**Pug:**

```pug
+image({
	default: {
		src: "path/to/image",
		srcset: "path/to/image@1x.jpg 1x, path/to/image@2x.jpg 2x",
		width: 500,
		height: 500,
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

**Twig:**

```twig
{{ image({
	default: {
		src: "path/to/image",
		srcset: "path/to/image@1x.jpg 1x, path/to/image@2x.jpg 2x",
		width: 500,
		height: 500,
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
}) }}
```

### Checkbox

**Pug:**

```pug
label.checkbox
	input(type="checkbox", name="checkbox_name")
	span Text
```

**Twig:**

```twig
<label class="checkbox">
	<input type="checkbox" name="checkbox_name">
	<span>Text</span>
</label>
```

### Radio

**Pug:**

```pug
label.radio
	input(type="radio", name="radio_name")
	span Text
```

**Twig:**

```twig
<label class="radio">
	<input type="radio" name="radio_name">
	<span>Text</span>
</label>
```

### File

**Pug:**

```pug
div.file
	input(type="file", id="file", name="file_name")
	label(for="file"): span(data-label="Select file") Select file
```

**Twig:**

```twig
<div class="file">
	<input type="file" id="file" name="file_name">
	<label for="file"><span data-label="Select file">Select file</span></label>
</div>
```

### Select

**Pug:**

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

**Twig:**

```twig
<select class="select" name="select_name">
	<option value="">text</option>
</select>

<div class="select">
	<select data-placeholder="Select...">
		<option value=""></option>
		<option value="">All</option>
		<option value="One">One</option>
		<option value="Two">Two</option>
	</select>
</div>
```

### Form

**Pug:**

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

**Twig:**

```twig
<form class="form" action="" method="" id="form">
	<div class="form__fieldset">
		<div class="form__group">
			<div class="form__item">
				<input type="text" name="" placeholder="Text" value="">
			</div>
		</div>

		<div class="form__group form__group_row">
			<div class="form__item">
				<input type="text" name="" placeholder="Text" value="">
			</div>
			<div class="form__item">
				<input type="text" name="" placeholder="Text" value="">
			</div>
		</div>
	</div>

	<div class="form__fieldset">
		<div class="form__group">
			<div class="form__item">
				<button class="button" type="submit">Submit</button>
			</div>
		</div>
	</div>
</form>
```

### Tabs

**Pug:**

```pug
div(data-tabs)
	div(data-tabs-header)
		div(data-tabs-item)
			button(type="button" data-tabs-handler data-hash="tab1") Tab 1
		div(data-tabs-item)
			button(type="button" data-tabs-handler data-hash="tab2") Tab 2
		div(data-tabs-item)
			button(type="button" data-tabs-handler data-hash="tab3") Tab 3

	div(data-tabs-body)
		div(data-tabs-item) Tab 1
		div(data-tabs-item) Tab 2
		div(data-tabs-item) Tab 3
```

**Twig:**

```twig
<div data-tabs>
	<div data-tabs-header>
		<div data-tabs-item data-state="opened">
			<button type="button" data-tabs-handler data-hash="tab1">Tab 1</button>
		</div>
		<div data-tabs-item data-state="closed">
			<button type="button" data-tabs-handler data-hash="tab2">Tab 2</button>
		</div>
		<div data-tabs-item data-state="closed">
			<button type="button" data-tabs-handler data-hash="tab3">Tab 3</button>
		</div>
	</div>

	<div data-tabs-body>
		<div data-tabs-item data-state="opened">Tab 1</div>
		<div data-tabs-item data-state="closed">Tab 2</div>
		<div data-tabs-item data-state="closed">Tab 3</div>
	</div>
</div>
```

### Accordion

**Pug:**

```pug
div(data-accordion)
	div(data-accordion-item)
		button(type="button" data-accordion-handler) accordion title 1
		div(data-accordion-body) accordion content 1
	div(data-accordion-item)
		button(type="button" data-accordion-handler) accordion title 2
		div(data-accordion-body) accordion content 2
```

**Twig:**

```twig
<div data-accordion>
	<div data-accordion-item>
		<button type="button" data-accordion-handler>accordion title 1</button>
		<div data-accordion-body>accordion content 1</div>
	</div>
	<div data-accordion-item>
		<button type="button" data-accordion-handler>accordion title 2</button>
		<div data-accordion-body>accordion content 2</div>
	</div>
</div>
```

### Cursor

**Pug:**

```pug
div(data-cursor)
	div(data-cursor-pointer)
	div(data-cursor-follower)

a(href="#") Hover target
```

**Twig:**

```twig
<div data-cursor>
	<div data-cursor-pointer></div>
	<div data-cursor-follower></div>
</div>

<a href="#">Hover target</a>
```

### Counter

**Pug:**

```pug
div.counter
	button.counter__minus -
	input(type="text" value="before 5 after" data-prefix="before " data-postfix=" after" data-min="2" data-max="10")
	button.counter__plus +
```

**Twig:**

```twig
<div class="counter">
	<button class="counter__minus">-</button>
	<input type="text" value="before 5 after" data-prefix="before " data-postfix=" after" data-min="2" data-max="10">
	<button class="counter__plus">+</button>
</div>
```

### Breadcrumbs

**Pug:**

```pug
ul.breadcrumbs
	li.breadcrumbs__item: a.breadcrumbs__link(href="#") Home
	li.breadcrumbs__item: a.breadcrumbs__link(href="#") Section
	li.breadcrumbs__item: span.breadcrumbs__current Page
```

**Twig:**

```twig
<ul class="breadcrumbs">
	<li class="breadcrumbs__item"><a class="breadcrumbs__link" href="#">Home</a></li>
	<li class="breadcrumbs__item"><a class="breadcrumbs__link" href="#">Section</a></li>
	<li class="breadcrumbs__item"><span class="breadcrumbs__current">Page</span></li>
</ul>
```

### Pagination

**Pug:**

```pug
ul.pagination
	li.pagination__item: a.pagination__link(href="#") 1
	li.pagination__item: a.pagination__link(href="#") 2
	li.pagination__item: a.pagination__link(href="#") 3
```

**Twig:**

```twig
<ul class="pagination">
	<li class="pagination__item"><a class="pagination__link" href="#">1</a></li>
	<li class="pagination__item"><a class="pagination__link" href="#">2</a></li>
	<li class="pagination__item"><a class="pagination__link" href="#">3</a></li>
</ul>
```

### Modal

**Pug:**

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

**Twig:**

```twig
<a href="#modal_example" data-modal>Open a modal window</a>

<div class="modal" id="modal_example">
	<div class="modal__container">
		<button class="modal__close" data-modal-close>&times;</button>
		<h2>Header</h2>
	</div>
</div>

<a href="https://www.youtube.com/embed/G_hKGYD8gOg" data-modal-video>Open YouTube video</a>
<a href="https://vimeo.com/191947042" data-modal-video>Open Vimeo video</a>
<a href="https://images.unsplash.com/photo-1561444533-fa0a9266bf67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80" data-modal-image title="Image Caption">Open Image</a>
```

### Calendar

**Pug:**

```pug
input(type="text", name="", data-calendar, placeholder="dd.mm.yyyy")
```

**Twig:**

```twig
<input type="text" name="" data-calendar placeholder="dd.mm.yyyy">
```

### Scroll to element

**Pug:**

```pug
a(href="#" data-scroll-to="div_id") Scroll to ID
```

**Twig:**

```twig
<a href="#" data-scroll-to="div_id">Scroll to ID</a>
```

### Spoiler

**Pug:**

```pug
div(data-spoiler)
	div(data-spoiler-body)
		p Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto nisi, pariatur nostrum est est iste sint recusandae? Consequuntur libero ratione cupiditate numquam saepe, odio delectus aliquam voluptatibus. Dolor quis vel ipsa!
```

**Twig:**

```twig
<div data-spoiler>
	<div data-spoiler-body>
		<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto nisi, pariatur nostrum est est iste sint recusandae? Consequuntur libero ratione cupiditate numquam saepe, odio delectus aliquam voluptatibus. Dolor quis vel ipsa!</p>
	</div>
</div>
```

### Tooltip

**Pug:**

```pug
a(href="#", data-tippy, data-tippy-content="Tippy!") Text
```

**Twig:**

```twig
<a href="#" data-tippy data-tippy-content="Tippy!">Text</a>
```

### Drawer

**Pug:**

```pug
button(data-drawer-toggle) Open

div.drawer(data-drawer)
```

**Twig:**

```twig
<button data-drawer-toggle>Open</button>

<div class="drawer" data-drawer></div>
```

### SyncScroll

**Pug:**

```pug
div(data-sync-scroll)
	div(data-sync-scroll-item)
	div(data-sync-scroll-item)
```

**Twig:**

```twig
<div data-sync-scroll>
	<div data-sync-scroll-item></div>
	<div data-sync-scroll-item></div>
</div>
```

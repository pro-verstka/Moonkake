# Moonkake

Стартовый шаблон для верстки с использованием BEM, Gulp, Sass, Pug, JS/ES6.

## Установка

**Шаг 1.** Установить NodeJS - https://nodejs.org/

**Шаг 2.** Установить Gulp

```sh
npm i gulp -g
```

**Шаг 3.** Установить пакеты из package.json

```sh
npm i
```

## Запуск

```sh
npm run dev
```

## Доступные команды

```sh
// Задача по-умолчанию для разработки проекта
npm run dev

// Сборка проекта
npm run build
```

## Доступные настройки gulpfile.js

```js
{
  // файлы css из папки src/css/pages будут подключаться отдельно в head
  separateCssToPages: true,

  // файлы js из папки src/js/pages будут подключаться отдельно после app.js
  separateJsToPages: true,

  // файлы шрифтов из папки src/fonts будут подключаться в head
  appendFontsToHead: true
}
```

# Разметка

### Сheckbox

```pug
label.checkbox
  input(type="checkbox", name="checkbox_name")
  span Текст
```

### Radio

```pug
label.radio
  input(type="radio", name="radio_name")
  span Текст
```

### File

```pug
div.file
  input(type="file", id="file", name="file_name")
  label(for="file"): span(data-label="Выберите файл") Выберите файл
```

### Select

```pug
select.select(name="select_name")
  option(value="") текст
```

### Form

```pug
form.form(action="", mathod="", id="form")
  div.form__fieldset
    div.form__group
      div.form__item
        input(type="text", name="", placeholder="Текст", value="")

    div.form__group.form__group_row
      div.form__item
        input(type="text", name="", placeholder="Текст", value="")
      div.form__item
        input(type="text", name="", placeholder="Текст", value="")

  div.form__fieldset
    div.form__group
      div.form__item
        button.button(type="submit") Отправить
```

### Tabs

```pug
div.tabs
  div.tabs__title
    div.tabs__item.tabs__item_active(data-hash="tab1") Таб 1
    div.tabs__item(data-hash="tab2") Таб 2
    div.tabs__item(data-hash="tab3") Таб 3

  div.tabs__content
    div.tabs__item.tabs__item_active Таб 1
    div.tabs__item Таб 2
    div.tabs__item Таб 3
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
  input(type="text" value="до 5 после" data-prefix="до " data-postfix=" после" data-min="2" data-max="10")
  button.counter__plus +
```

### Breadcrumbs

```pug
ul.list.breadcrumbs
  li.list__item: a.list__link(href="#") Главная
  li.list__item: a.list__link(href="#") Раздел
  li.list__item: span.list__current Страница
```

### Pagination

```pug
ul.list.pagination
  li.list__item: a.list__link(href="#") 1
  li.list__item: a.list__link(href="#") 2
  li.list__item: a.list__link(href="#") 3
```

### Modal

```pug
a(href="#modal_example" data-modal) Открыть модальное окно

div.modal#modal_example
  div.modal__container
    button.modal__close(data-modal-close) &times;
    h2 Заголовок

a(href="https://www.youtube.com/embed/G_hKGYD8gOg" data-modal-video) Открыть видео YouTube
a(href="https://vimeo.com/191947042" data-modal-video) Открыть видео Vimeo
a(href="https://images.unsplash.com/photo-1561444533-fa0a9266bf67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80" data-modal-image, title="Image Caption") Открыть изображение
```

### Calendar

```pug
input(type="text", name="", data-calendar, placeholder="дд.мм.гггг")
```

### Scroll to element

```pug
a(href="#" data-scroll-to="div_id") Прокрутка к ID
```

### Spoiler

```pug
div(data-spoiler)
  div(data-spoiler-body)
    p Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto nisi, pariatur nostrum est iste sint recusandae? Consequuntur libero ratione cupiditate numquam saepe, odio delectus aliquam voluptatibus. Dolor quis vel ipsa!
```

### Tooltip

```pug
a(href="#", data-tippy, data-tippy-content="Tippy!") Text
```

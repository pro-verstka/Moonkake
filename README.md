# Moonkake
Стартовый шаблон для верстки с использованием Sass, Pug, ES6.

## Установка
**Шаг 1.** Установить NodeJS - https://nodejs.org/

**Шаг 2.** Установить Ruby - https://www.ruby-lang.org/

**Шаг 3.** Установить Gulp
```sh
npm i gulp -g
```
**Шаг 4.** Установить пакеты из package.json
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

# Разметка

### Сheckbox
```pug
label.checkbox
  input(type="checkbox", name="checkbox_name")
  div Текст
```

### Radio
```pug
label.radio
  input(type="radio", name="radio_name")
  div Текст
```

### File
```pug
div.file
  input(type="file", id="file", name="file_name")
  label(for="file"): span(data-label="Выберите файл") Выберите файл
```

### Select
```pug
div.select
  select(name="select_name")
    option(value="") текст
```

### Form
```pug
form.form(action="", mathod="", id="form")
  div.form-group
    div.form-item
      input.form-field(type="text", name="", placeholder="Текст", value="")

  div.form-group.form-row
    div.form-item
      input.form-field(type="text", name="", placeholder="Текст", value="")
    div.form-item
      input.form-field(type="text", name="", placeholder="Текст", value="")

  div.form-group
    div.form-item
      button.button.button-default(type="submit") Отправить
```

### Tabs
```pug
div.tabs
  div.tabs-title
    div.tabs-item.-active Таб 1
    div.tabs-item Таб 2
    div.tabs-item Таб 3

  div.tabs-content
    div.tabs-item.-active Таб 1
    div.tabs-item Таб 2
    div.tabs-item Таб 3
```

### Accordion
```pug
div.accordion
  div.accordion-item
    div.accordion-header accordion title 1
    div.accordion-body accordion content 1
  div.accordion-item
    div.accordion-header accordion title 2
    div.accordion-body accordion content 2
```

### Counter
```pug
div.counter
  button.counter-minus -
  input(type="text" value="до 5 после" data-prefix="до " data-postfix=" после" data-min="2" data-max="10")
  button.counter-plus +
```

### Breadcrumbs
```pug
ul.list.list-flex.breadcrumbs
  li.list-item: a.list-link(href="#") Главная
  li.list-item: a.list-link(href="#") Раздел
  li.list-item: span.list-current Страница
```

### Pagination
```pug
ul.list.list-flex.pagination
  li.list-item: a.list-link(href="#") 1
  li.list-item: a.list-link(href="#") 2
  li.list-item: a.list-link(href="#") 3
```

### Modal
```pug
a(href="#modal_example" data-modal) Open

div.modal#modal_example
  div.modal-container
    button.modal-close(data-modal-close) &times;
    h1 Modal title
    
a(href="https://www.youtube.com/embed/G_hKGYD8gOg" data-modal-video) Open YouTube
a(href="https://vimeo.com/191947042" data-modal-video) Open Vimeo
```
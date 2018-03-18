# Moonkake
Стартовый шаблон для верстки с использованием Sass, Pug.

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
gulp
```

## Доступные команды
```sh
// Задача по-умолчанию для разработки проекта
gulp

// Создать zip-архив с проектом
gulp backup

// Сборка проекта
gulp build
```

# Разметка

### Сheckbox
```pug
div.checkbox
  input(type="checkbox", id="checkbox", name="checkbox_name")
  label(for="checkbox") Текст
```

### Radio
```pug
div.radio
  input(type="radio", id="radio", name="radio_name")
  label(for="radio") Текст
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

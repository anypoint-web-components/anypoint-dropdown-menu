[![Published on NPM](https://img.shields.io/npm/v/@anypoint-web-components/anypoint-dropdown-menu.svg)](https://www.npmjs.com/package/@anypoint-web-components/anypoint-dropdown-menu)

[![Build Status](https://travis-ci.org/anypoint-web-components/anypoint-dropdown-menu.svg?branch=stage)](https://travis-ci.org/anypoint-web-components/anypoint-dropdown-menu)

# anypoint-dropdown-menu

A form element to select value from the list of options, styled for Anypoint platform.

## Accessibility

The element works perfectly with `anypoint-listbox` which together creates an accessible list of options. The listbox can be replaced by any other element  that support similar functionality but make sure it has an appropriate aria support.

## Usage

### Installation

```
npm install --save @anypoint-web-components/anypoint-dropdown
```

### In an HTML file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/anypoint-dropdown/anypoint-dropdown.js';
      import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
      import '@anypoint-web-components/anypoint-item/anypoint-item.js';
    </script>
  </head>
  <body>
    <anypoint-dropdown-menu aria-label="Select dinosaur from the list of available options">
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <anypoint-item>item 1</anypoint-item>
        <anypoint-item>item 2</anypoint-item>
        <anypoint-item>item 3</anypoint-item>
      </anypoint-listbox>
    </anypoint-dropdown-menu>
  </body>
</html>
```

### Replacement for the `anypoint-listbox` element

It is possible to use different element than `anypoint-listbox`. The replacement should use [AnypointMenuMixin](https://github.com/anypoint-web-components/anypoint-menu-mixin) which provides API for the dropdown element to work.

### Value selection

When the user selects one of the options in the dropdown menu the list is closed and the rendered label is one of the following (in order):

-   `label` property of the selected item
-   `label` attribute if the selected item
-   `innerText` of the selected item

The same value is set as `value` property.

The selection can be controlled by setting `selected` attribute/property on the `anypoint-listbox` or the element implementing `AnypointMenuMixin`.

```html
<anypoint-dropdown-menu aria-label="Select dinosaur from the list of available options">
  <label slot="label">Selected dinosaur</label>
  <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="0">
    <anypoint-item label="My item 1">item 1</anypoint-item>
    <anypoint-item label="My item 2">item 2</anypoint-item>
    <anypoint-item>item 3</anypoint-item>
  </anypoint-listbox>
</anypoint-dropdown-menu>
```

By default the selected value is set to `My item 1`. When selecting option 3 then the label value becomes `item 3`.

### Form-associated custom elements

The [form-associated custom elements](https://docs.google.com/document/d/1JO8puctCSpW-ZYGU8lF-h4FWRIDQNDVexzHoOQ2iQmY/edit?pli=1#) allows to associate a custom element with a `<form>` element. Original custom elements spec does not allow this.
The form-associated custom elements may not be supported in some browsers so custom form elements may be required to be used (for example [iron-form](https://www.webcomponents.org/element/@polymer/iron-form)).

The element supports this API in browser that has this API implemented. This means that the element behaves like a `<select>` element when inserted into the form element. See demo page for an example.

### Validation

The element support `required` and `autoValidate` properties. When the element is `required` then it renders invalid state when `validate()` or `checkValidity()` function is called.
The `validate()` function is provided by [ValidatableMixin](https://github.com/anypoint-web-components/validatable-mixin) for custom elements. `checkValidity()` function calls `validate()` function, and, if available, internal `checkValidity()` function provided by form-associated custom elements API.

The `autoValidate` option allows to automatically call validate function when value change. It can be used with custom validators implementing [ValidatorMixin](https://github.com/anypoint-web-components/validator-mixin).

```html
<anypoint-dropdown-menu required autovalidate>
  <label slot="label">Selected dinosaur</label>
  <anypoint-listbox slot="dropdown-content">
    <anypoint-item>item 1</anypoint-item>
    <anypoint-item>item 2</anypoint-item>
    <anypoint-item>item 3</anypoint-item>
  </anypoint-listbox>
</anypoint-dropdown-menu>
```

## Development

```sh
git clone https://github.com/anypoint-web-components/anypoint-dropdown-menu
cd anypoint-dropdown-menu
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

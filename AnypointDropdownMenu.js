import { html, css, LitElement } from 'lit-element';
import { ControlStateMixin } from '@anypoint-web-components/anypoint-control-mixins/control-state-mixin.js';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin/validatable-mixin.js';
import '@anypoint-web-components/anypoint-dropdown/anypoint-dropdown.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import './anypoint-dropdown-menu-icons.js';
/**
 * Accessible dropdown menu for Anypoint platform.
 *
 * The element works perfectly with `anypoint-listbox` which together creates an
 * accessible list of options. The listbox can be replaced by any other element
 * that support similar functionalit but make sure it has an appropiate aria
 * support.
 *
 * See README.md file for detailed documentation.
 */
export class AnypointDropdownMenu extends ValidatableMixin(ControlStateMixin(LitElement)) {
  static get styles() {
    return css`
    :host {
      /* Default size of an <input> */
      width: 200px;
      display: inline-block;
      position: relative;
      text-align: left;
      cursor: default;
      border: 1px var(--anypoint-dropdown-menu-border-color, #E0E0E0) solid;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      -webkit-tap-highlight-color: transparent;
      background-color: var(--anypoint-dropdown-menu-background-color, #F5F5F5);
      border-radius: 3px;
      box-sizing: border-box;
      margin: 12px 8px;
      outline: none;
    }

    :host([disabled]) anypoint-icon-button {
      pointer-events: none;
      opacity: var(--anypoint-dropdown-menu-disabled-opacity, 0.33);
    }

    :host([disabled]) .input {
      opacity: var(--anypoint-dropdown-menu-disabled-opacity, 0.33);
      border-bottom: 1px dashed var(--paper-dropdown-menu-color, var(--secondary-text-color));
    }

    :host([disabled]) .label.without-value {
      opacity: var(--anypoint-dropdown-menu-disabled-opacity, 0.33);
    }
    :host([invalid]) .input,
    :host(:invalid) .input {
      border-bottom: 2px solid var(--anypoint-dropdown-error-color, var(--error-color));
    }

    :host([opened]),
    :host([focused]),
    :host(:focus) {
      background-color: var(--anypoint-dropdown-menu-focus-background-color, #fff);
      border-color: var(--anypoint-dropdown-menu-hover-border-color, var(--anypoint-color-coreBlue3));
    }

    .input-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .input {
      flex: 1;
      margin: 0px 0px 0px 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: calc(100% - 40px);
      overflow: auto;
    }

    :host(:dir(rtl)) .input {
      text-align: right;
      margin: 0px 8px 0px 0px;
    }

    :host([dir="rtl"]) .input {
      text-align: right;
      margin: 0px 8px 0px 0px;
    }

    .input-spacer {
      visibility: hidden;
      margin-left: -12px;
    }

    anypoint-dropdown {
      width: inherit;
    }

    .label {
      position: absolute;
      font-size: 13px;
      transition: top 0.12s ease-in-out;
      will-change: top;
      border-radius: 3px;
      margin: 0;
      padding: 0;
      left: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: calc(100% - 40px);
    }

    :host(:dir(rtl)) .label {
      text-align: right;
      right: 8px;
      left: auto;
    }
    /* Not every browser support syntax above and for those who doesn't
      this style has to be repeated or it won't be applied. */
    :host([dir="rtl"]) .label {
      text-align: right;
      right: 8px;
      left: auto;
    }

    .label.without-value {
      top: calc(100% / 2 - 8px);
      font-size: 14px;
    }

    .label.with-value {
      background-color: var(--anypoint-dropdown-menu-label-background-color, white);
      top: -8px;
    }

    .trigger-icon {
      transform: rotate(0);
      transition: transform 0.12s ease-in-out;
      will-change: transform;
    }

    .trigger-icon.opened {
      transform: rotate(-180deg);
    }

    anypoint-dropdown {
      border-bottom: 2px var(--anypoint-dropdown-menu-border-color, #E0E0E0) solid;
      border-top: 2px var(--anypoint-dropdown-menu-border-color, #E0E0E0) solid;
      margin-top: 41px;
    }

    :host([verticalalign="bottom"]) anypoint-dropdown {
      margin-bottom: 41px;
      margin-top: auto;
    }
    `;
  }
  /**
   * For form-associated custom elements. Marks this custom element
   * as form enabled element.
   */
  static get formAssociated() {
    return true;
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * returns `<form>` element associated with this constol.
   */
  get form() {
    return this._internals && this._internals.form || null;
  }

  static get properties() {
    return {
      /**
       * An animation config. If provided, this will be used to animate the
       * opening of the dropdown. Pass an Array for multiple animations.
       * See `neon-animation` documentation for more animation configuration
       * details.
       */
      openAnimationConfig: { type: Object },

      /**
       * An animation config. If provided, this will be used to animate the
       * closing of the dropdown. Pass an Array for multiple animations.
       * See `neon-animation` documentation for more animation configuration
       * details.
       */
      closeAnimationConfig: { type: Object },
      /**
       * Set to true to disable animations when opening and closing the
       * dropdown.
       */
      noAnimations: { type: Boolean, reflect: true },
      /**
       * By default, the dropdown will constrain scrolling on the page
       * to itself when opened.
       * Set to true in order to prevent scroll from being constrained
       * to the dropdown when it opens.
       * This property is a shortcut to set `scrollAction` to lock or refit.
       * Prefer directly setting the `scrollAction` property.
       */
      allowOutsideScroll: { type: Boolean, reflect: true },
      /**
       * The orientation against which to align the element vertically
       * relative to the `positionTarget`. Possible values are "top", "bottom",
       * "middle", "auto".
       */
      verticalAlign: { type: String },
      /**
       * The orientation against which to align the element horizontally
       * relative to the `positionTarget`. Possible values are "left", "right",
       * "center", "auto".
       */
      horizontalAlign: { type: String },
      /**
       * A pixel value that will be added to the position calculated for the
       * given `verticalAlign`, in the direction of alignment. You can think
       * of it as increasing or decreasing the distance to the side of the
       * screen given by `verticalAlign`.
       *
       * If `verticalAlign` is "top" or "middle", this offset will increase or
       * decrease the distance to the top side of the screen: a negative offset
       * will move the dropdown upwards; a positive one, downwards.
       *
       * Conversely if `verticalAlign` is "bottom", this offset will increase
       * or decrease the distance to the bottom side of the screen: a negative
       * offset will move the dropdown downwards; a positive one, upwards.
       */
      verticalOffset: { type: Number },
      /**
       * A pixel value that will be added to the position calculated for the
       * given `horizontalAlign`, in the direction of alignment. You can think
       * of it as increasing or decreasing the distance to the side of the
       * screen given by `horizontalAlign`.
       *
       * If `horizontalAlign` is "left" or "center", this offset will increase or
       * decrease the distance to the left side of the screen: a negative offset
       * will move the dropdown to the left; a positive one, to the right.
       *
       * Conversely if `horizontalAlign` is "right", this offset will increase
       * or decrease the distance to the right side of the screen: a negative
       * offset will move the dropdown to the right; a positive one, to the left.
       */
      horizontalOffset: { type: Number },
      /**
       * If true, it will use `horizontalAlign` and `verticalAlign` values as
       * preferred alignment and if there's not enough space, it will pick the
       * values which minimize the cropping.
       */
      dynamicAlign: { type: Boolean, reflect: true },
      /**
       * True if the list is currently displayed.
       */
      opened: { type: Boolean, reflect: true },
      /**
       * Selected item value calculated as it's (in order) label property, label
       * attribute, and `innerText` value.
       */
      value: { type: String },
      /**
       * Name of the form control.
       * Note, form-associated custom elements may not be supported as first
       * implementation was released in Chrome M77 in July 2019. It may require
       * using custom form element to gather form data.
       */
      name: { type: String },
      /**
       * When set it marks the element as required. Calling the `validate`
       * function will mark this control as invalid when no value is selected.
       */
      required: { type: Boolean, reflect: true },
      /**
       * Automatically calls `validate()` function when dropdown closes.
       */
      autoValidate: { type: Boolean, reflect: true },
      /**
       * Will position the list around the button without overlapping
       * it.
       */
      noOverlap: { type: Boolean }
    };
  }

  get selectedItem() {
    return this._selectedItem;
  }

  get _selectedItem() {
    return this.__selectedItem;
  }

  set _selectedItem(value) {
    const old = this.__selectedItem;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.__selectedItem = value;
    this._selectedItemChanged(value);
  }

  get opened() {
    return this._opened;
  }

  set opened(value) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
    this._openedChanged(value);
  }
  /**
   * @return {?Element} The content element that is contained by the dropdown menu, if any.
   */
  get contentElement() {
    const slot = this.shadowRoot.querySelector('slot[name="dropdown-content"]');
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedNodes();
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return nodes[i];
      }
    }
    return null;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const old = this._value;
    if (old === value) {
      return;
    }
    this._value = value;
    this.requestUpdate('value', old);
    /* istanbul ignore else */
    if (this._internals) {
      this._internals.setFormValue(value);
    }
  }

  constructor() {
    super();
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.noAnimations = false;
    this.allowOutsideScroll = false;
    this.opened = false;
    this.dynamicAlign = false;
    this.noOverlap = false;
    this.horizontalOffset = 0;
    this.verticalOffset = 0;
    this.restoreFocusOnClose = false;

    this._clickHandler = this._clickHandler.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._focusHandler = this._focusHandler.bind(this);
    /* istanbul ignore else */
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'listbox');
    }
    // aria-expanded is set with `opened` flag which is initialzed in the cosntructor.
    this.addEventListener('click', this._clickHandler);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('focus', this._focusHandler);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('click', this._clickHandler);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('focus', this._focusHandler);
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param {Boolean} disabled Form disabled state
   */
  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback() {
    this.value = '';
    const node = this.contentElement;
    /* istanbul ignore else */
    if (node) {
      node.selected = undefined;
    }
    this._internals.setFormValue('');
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param {String} state Restored value
   */
  formStateRestoreCallback(state) {
    this._internals.setFormValue(state);
  }

  firstUpdated() {
    const contentElement = this.contentElement;
    const item = contentElement && contentElement.selectedItem;
    if (item) {
      this._selectedItem = item;
    }
  }
  /**
   * Handler for `click` event.
   * Opens the list of the click originated from the shadow DOM.
   * @param {MouseEvent} e
   */
  _clickHandler(e) {
    const path = e.path || e.composedPath && e.composedPath();
    /* istanbul ignore if */
    if (!path) {
      return;
    }
    /* istanbul ignore else */
    if (path.indexOf(this) !== -1 && !this.opened) {
      this.opened = true;
      e.preventDefault();
      e.stopPropagation();
    }
  }
  /**
   * Focuses on the listbox, if available.
   */
  _focusContent() {
    const node = this.contentElement;
    if (node) {
      node.focus();
    }
  }
  /**
   * Handler for the `focus` event.
   * Focuses on the listbox when opened.
   */
  _focusHandler() {
    if (this.opened) {
      this._focusContent();
    }
  }
  /**
   * Handler for the keydown event.
   * @param {KeyboardEvent} e
   */
  _onKeydown(e) {
    if (e.key === 'ArrowDown') {
      this._onDownKey(e);
    } else if (e.key === 'ArrowUp') {
      this._onUpKey(e);
    } else if (e.key === 'Escape') {
      this._onEscKey(e);
    }
  }
  /**
   * Handler for ArrowDown button press.
   * Opens the list if it's not open and focuses on the list otherwise.
   *
   * The event should be cancelled or it may cause unwanted behavior.
   *
   * @param {KeyboardEvent} e
   */
  _onDownKey(e) {
    if (!this.opened) {
      this.opened = true;
    } else {
      this._focusContent();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  /**
   * Handler for ArrowUp button press.
   * Opens the list if it's not open and focuses on the list otherwise.
   *
   * The event should be cancelled or it may cause unwanted behavior.
   *
   * @param {KeyboardEvent} e
   */
  _onUpKey(e) {
    if (!this.opened) {
      this.opened = true;
    } else {
      this._focusContent();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  /**
   * Handler for Escape button press.
   * Closes the list if it's open.
   */
  _onEscKey() {
    if (this.opened) {
      this.opened = false;
    }
  }
  /**
   * Compute the label for the dropdown given a selected item.
   *
   * @param {Element} selectedItem A selected Element item, with an
   * optional `label` property.
   */
  _selectedItemChanged(selectedItem) {
    let value = '';
    if (selectedItem) {
      value = selectedItem.label || selectedItem.getAttribute('label') ||
        selectedItem.textContent.trim();
    }
    this.value = value;
  }
  /**
   * Toggles `opened` state.
   *
   * @param {?MouseEvent} e When set it cancels the event
   */
  toggle(e) {
    this.opened = !this.opened;
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Show the dropdown content.
   */
  open() {
    this.opened = true;
  }
  /**
   * Hide the dropdown content.
   */
  close() {
    this.opened = false;
  }

  _dropdownClosed() {
    this.opened = false;
    if (this.autoValidate) {
      this.validate();
      this._updateNativeValidationState();
    }
    this.focus();
  }

  _updateNativeValidationState() {
    if (!this._internals) {
      return;
    }
    if (this.invalid) {
      this._internals.setValidity({
        customError: true
      }, 'Please select a value.');
    } else {
      this._internals.setValidity({});
    }
  }

  _dropdownOpened() {
    this._focusContent();
  }

  _selectHandler(e) {
    this.opened = false;
    this._selectedItem = e.detail.item;
  }

  _deselectHandler() {
    this._selectedItem = null;
  }
  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   *
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity() {
    return this.disabled || !this.required || (this.required && !!this.value);
  }

  _openedChanged(opened) {
    const openState = opened ? 'true' : 'false';
    this.setAttribute('aria-expanded', openState);
    const e = this.contentElement;
    if (e) {
      e.setAttribute('aria-expanded', openState);
    }
  }

  checkValidity() {
    return this._getValidity() && ((this._internals && this._internals.checkValidity()) || true);
  }

  render() {
    const {
      opened,
      horizontalAlign,
      verticalAlign,
      dynamicAlign,
      horizontalOffset,
      verticalOffset,
      noOverlap,
      openAnimationConfig,
      closeAnimationConfig,
      noAnimations,
      allowOutsideScroll,
      restoreFocusOnClose,
      value
    } = this;

    const renderValue = opened ? '' : value || '';
    return html`
    <div class="label ${value && !opened ? 'with-value' : 'without-value'}">
      <slot name="label"></slot>
    </div>

    <div class="input-wrapper">
      <div class="input">
        ${renderValue}
        <span class="input-spacer">&nbsp;</span>
      </div>
      <anypoint-icon-button @click="${this.toggle}" aria-label="Toggles dropdown menu">
        <button tabindex="-1" aria-label="Toggles dropdown menu">
          <iron-icon
            class="trigger-icon ${opened ? 'opened' : ''}"
            icon="paper-dropdown-menu:arrow-drop-down"></iron-icon>
        </button>
      </anypoint-icon-button>
    </div>

    <anypoint-dropdown
      .opened="${opened}"
      .horizontalAlign="${horizontalAlign}"
      .verticalAlign="${verticalAlign}"
      .dynamicAlign="${dynamicAlign}"
      .horizontalOffset="${horizontalOffset}"
      .verticalOffset="${verticalOffset}"
      .noOverlap="${noOverlap}"
      .openAnimationConfig="${openAnimationConfig}"
      .closeAnimationConfig="${closeAnimationConfig}"
      .noAnimations="${noAnimations}"
      .allowOutsideScroll="${allowOutsideScroll}"
      .restoreFocusOnClose="${restoreFocusOnClose}"
      @overlay-closed="${this._dropdownClosed}"
      @overlay-opened="${this._dropdownOpened}"
      @select="${this._selectHandler}"
      @deselect="${this._deselectHandler}">
      <div slot="dropdown-content" class="dropdown-content">
        <slot id="content" name="dropdown-content"></slot>
      </div>
    </anypoint-dropdown>
    `;
  }
}

import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@polymer/iron-image/iron-image.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
import '../anypoint-dropdown-menu.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoOutlined',
      'demoCompatibility',
      'demoInfo',
      'demoError',
      'demoNoLabelFloat',
      'demoRtl',
      'formFieldsDisabled',
      'formMenuDisabled',
      'fitPositionTarget',
    ]);
    this._componentName = 'anypoint-dropdown-menu';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this.fitPositionTarget = false;
    this.items = [
      'Allosaurus',
      'Brontosaurus',
      'Carcharodontosaurus',
      'Diplodocus',
      'Ekrixinatosaurus',
      'Fukuiraptor',
      'Gallimimus',
      'Hadrosaurus',
      'Iguanodon',
      'Jainosaurus',
      'Kritosaurus',
      'liaoceratops',
      'megalosaurus',
      'nemegtosaurus',
      'ornithomimus',
      'protoceratops',
      'quetecsaurus',
      'rajasaurus',
      'stegosaurus',
      'triceratops',
      'utahraptor',
      'vulcanodon',
      'wannanosaurus',
      'xenoceratops',
      'yandusaurus',
      'zephyrosaurus'
    ];
    this.minItems = [
      'Allosaurus',
      'Brontosaurus',
      'Carcharodontosaurus'
    ];

    this._formSubmit = this._formSubmit.bind(this);
    this._mainDemoStateHandler = this._mainDemoStateHandler.bind(this);
    this._mainDemoAssistiveHandler = this._mainDemoAssistiveHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
  }

  get formData() {
    return this._formData;
  }

  set formData(value) {
    this._setObservableProperty('formData', value);
  }

  _mdHandler(e) {
    if (e.target.checked) {
      document.body.classList.add('material');
    } else {
      document.body.classList.remove('material');
    }
  }

  _formSubmit(e) {
    e.preventDefault();
    const result = {};
    const { elements } = e.target;
    let ignore = [];
    for (let i = 0; i < elements.length; i++) {
      const node = elements[i];
      if (node.localName === 'fieldset' && node.disabled) {
        ignore = [...ignore, ...elements[0].elements];
      }
      if (!node.name || node.disabled || ignore.indexOf(node) !== -1) {
        // eslint-disable-next-line no-continue
        continue;
      }
      result[node.name] = node.value;
    }
    this.formData = JSON.stringify(result, null, 2);
  }

  _mainDemoStateHandler(e) {
    const state = e.detail.value;
    this.demoOutlined = state === 1;
    this.demoCompatibility = state === 2;
  }

  _mainDemoAssistiveHandler(e) {
    const { name, checked } = e.target;
    if (!checked) {
      return;
    }
    if (name === 'info') {
      this.demoError = false;
      this.demoInfo = true;
    } else if (name === 'error') {
      this.demoError = true;
      this.demoInfo = false;
    } else {
      this.demoError = false;
      this.demoInfo = false;
    }
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      demoOutlined,
      demoCompatibility,
      demoInfo,
      demoError,
      demoRtl,
      demoNoLabelFloat,
      fitPositionTarget,
    } = this;
    const infoMessage = demoInfo ? 'Assistive text label' : undefined;
    return html`<section class="documentation-section">
    <h3>Interactive demo</h3>
    <p>
      This demo lets you preview the dropdown menu element with various
      configuration options.
    </p>
    <arc-interactive-demo
      .states="${demoStates}"
      @state-chanegd="${this._mainDemoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <anypoint-dropdown-menu
        slot="content"
        name="mainDemo"
        title="Dropdown menu"
        ?outlined="${demoOutlined}"
        ?compatibility="${demoCompatibility}"
        .infoMessage="${infoMessage}"
        invalidMessage="This value is invalid"
        ?invalid="${demoError}"
        dir="${demoRtl ? 'rtl' : 'ltr'}"
        ?noLabelFloat="${demoNoLabelFloat}"
        ?fitPositionTarget="${fitPositionTarget}"
      >
        <label slot="label">Select a dinosaur</label>
        <anypoint-listbox slot="dropdown-content" tabindex="-1" ?compatibility="${demoCompatibility}">
        ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
        </anypoint-listbox>
      </anypoint-dropdown-menu>

      <label slot="options" id="mainOptionsLabel">Options</label>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="demoNoLabelFloat"
        @change="${this._toggleMainOption}"
      >No label float</anypoint-checkbox>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="demoRtl"
        @change="${this._toggleMainOption}"
      >Right-to-left</anypoint-checkbox>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="fitPositionTarget"
        @change="${this._toggleMainOption}"
      >Fit target</anypoint-checkbox>

      <label slot="options" id="mainAssistiveLabel">Assistive text</label>
      <anypoint-radio-group
        slot="options"
        selectable="anypoint-radio-button"
        aria-labelledby="mainAssistiveLabel"
      >
        <anypoint-radio-button
          @change="${this._mainDemoAssistiveHandler}"
          checked
          name="none"
          >None</anypoint-radio-button
        >
        <anypoint-radio-button
          @change="${this._mainDemoAssistiveHandler}"
          name="info"
          >Info message</anypoint-radio-button
        >
        <anypoint-radio-button
          @change="${this._mainDemoAssistiveHandler}"
          name="error"
          >Error text</anypoint-radio-button
        >
      </anypoint-radio-group>
    </arc-interactive-demo>
    </section>`;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design menu and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          Exposed dropdown menus display the currently selected menu item above the menu.<br/>
          They can be used only when a single menu item can be chosen at a time.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint dropdown menu comes with 3 predefined styles:</p>
        <ul>
          <li><b>Filled</b> (normal) - For low emphasis inputs</li>
          <li><b>Outlined</b> - For high emphasis inputs</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/design/components/menus.html#exposed-dropdown-menu"
            >Exposed dropdown menu</a
          >
          documentation in Material Design documentation for principles and
          anatomy of dropdown menus.
        </p>

        <h3>Selection</h3>
        <p>
          The element does not provide an interface for list item selection.
          <code>anypoint-listbox</code>, which is suggested component to render a list of options,
          has <code>selected</code> attribute which should be used to preselect an item.
        </p>

        <anypoint-dropdown-menu aria-owns="preSelectedList">
          <label slot="label" id="preSelectedLabel">Pre-selected dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1" id="preSelectedList">
          ${this.minItems.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu&gt;
                &lt;label slot="label"&gt;Pre-selected dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content" selected="1"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <p>
          The <code>anypoint-listbox</code> component also allows to select an item by it's attribute
          by setting <code>attrforselected</code> attribute.
        </p>
        <anypoint-dropdown-menu>
          <label slot="label">Attribute as selection value</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1" attrforselected="label" selected="Brontosaurus">
          ${this.minItems.map((item) => html`<anypoint-item label="${item}">${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu&gt;
                &lt;label slot="label"&gt;Attribute as selection value&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content" attrforselected="label" selected="Brontosaurus"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <h3>Right-to-left languages</h3>
        <p>
          Use <code>dir</code> attribute to render the component in a right-to-left type language.
        </p>
        <anypoint-dropdown-menu dir="rtl">
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.minItems.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu dir="rtl"&gt;
                &lt;label slot="label"&gt;Select a dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <h3>List direction</h3>
        <p>
          The list can be opened to the bottom (default) or to the top.
        </p>
        <p>
          Use the <code>dynamicAlign</code> property if the position cannot be determined
          beforehand.
        </p>

        <h4>Vertical align: bottom</h4>
        <anypoint-dropdown-menu verticalalign="bottom">
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.minItems.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu verticalalign="bottom"&gt;
                &lt;label slot="label"&gt;Select a dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <h4>Dynamic align</h4>
        <anypoint-dropdown-menu dynamicAlign>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.minItems.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu dynamicAlign&gt;
                &lt;label slot="label"&gt;Select a dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>
      </section>`;
  }

  _formsTemplate() {
    const {
      darkThemeActive,
      formFieldsDisabled,
      formMenuDisabled
    } = this;
    return html`
      <section class="documentation-section">
        <h2>Working with forms</h2>
        <p>
          Anypoint dropdown menu support basic form states like <code>disabled</code> or <code>invalid</code>.
        </p>

        <h3>Disabled menu</h3>
        <p>
          When disabled, the user cannot interact with the control. Form associated with the
          component will ignore it's value when generating form values.
        </p>

        <anypoint-dropdown-menu disabled>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu disabled&gt;
                &lt;label slot="label"&gt;Select a dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <h3>Invalid selection</h3>
        <p>
          When invalid the component renders error colors and, if defiend, an error message.
        </p>

        <anypoint-dropdown-menu invalid>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu invalid&gt;
                &lt;label slot="label"&gt;Select a dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content" selected="1"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <h3>Auto validation</h3>
        <p>
          Set <code>autovalidate</code> and, for example, <code>required</code> proeprty to
          automatically validate the input when selection change.
        </p>

        <p>
          Anypoint web components offers <code>ValidatorMixin</code> that allows to define
          a custom element that validates an input field. This allows to reuse validation
          logic accross different parts of the application.
        </p>

        <anypoint-dropdown-menu autovalidate required>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-dropdown-menu autovalidate required&gt;
                &lt;label slot="label"&gt;Select a dinosaur&lt;/label&gt;
                &lt;anypoint-listbox slot="dropdown-content"&gt;
                  &lt;anypoint-item label="Allosaurus"&gt;Allosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Brontosaurus"&gt;Brontosaurus&lt;/anypoint-item&gt;
                  &lt;anypoint-item label="Carcharodontosaurus"&gt;Carcharodontosaurus&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              &lt;/anypoint-dropdown-menu&gt;
              </pre>
            </code>
        </details>

        <h3>Form-associated custom elements</h3>
        <p>
          Form-associated custom elements enable web authors to define and create
          custom elements which participate in form submission.

          Learn more: <a href="https://www.chromestatus.com/feature/4708990554472448" target="_blank">Chrome status</a>
        </p>

        <arc-interactive-demo
          states='["Native form"]'
          ?dark="${darkThemeActive}"
        >
          <form enctype="application/json" @submit="${this._formSubmit}" slot="content">
            <fieldset ?disabled="${formFieldsDisabled}">
              <legend>Form fields group</legend>
              <anypoint-dropdown-menu required name="dino" ?disabled="${formMenuDisabled}">
                <label slot="label">Select a dinosaur</label>
                <anypoint-listbox slot="dropdown-content" tabindex="-1">
                ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
                </anypoint-listbox>
              </anypoint-dropdown-menu>
              <br/>
              <label for="fieldsetInput">Input inside fieldset</label><br/>
              <input type="text" name="textInput" id="fieldsetInput" />
            </fieldset>
            <label for="outsideInput">Input outside fieldset</label><br/>
            <input type="text" name="textInput2" id="outsideInput" /><br/>
            <input type="reset" value="Reset">
            <input type="submit" value="Submit">
          </form>

          <label slot="options" id="formOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="formOptionsLabel"
            slot="options"
            name="formFieldsDisabled"
            @change="${this._toggleMainOption}"
            >Disable fieldset</anypoint-checkbox
          >
          <anypoint-checkbox
            aria-describedby="formOptionsLabel"
            slot="options"
            name="formMenuDisabled"
            @change="${this._toggleMainOption}"
            >Disable dropdown</anypoint-checkbox
          >

        </arc-interactive-demo>

        ${this.formData ? html`<b>Form values</b><output>${this.formData}</output>`:undefined}

      </section>
    `;
  }

  _assistiveTemplate() {
    return html`<section class="documentation-section">
      <h2>Assistive text</h2>
      <p>
        Assistive text allows the user to better understand what kind of selection is
        required. It can be an info message or invalid message when invalid
        input has been detected.
      </p>

      <h3>Info message</h3>
      <p>
        Info message provides the user with additional description for the
        field. It should be used when the label can be confusing or to ensure
        the user about the reason of collecting the input.
      </p>

      <anypoint-dropdown-menu infomessage="Will be added to your order.">
        <label slot="label">Select a dinosaur</label>
        <anypoint-listbox slot="dropdown-content" tabindex="-1">
        ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
        </anypoint-listbox>
      </anypoint-dropdown-menu>

      <p>
        Do not try to put too detailed information. The user should be able to
        scan the message in a fraction of a second. Treat it as an additional
        text for the label.
      </p>

      <h3>Invalid message</h3>
      <p>
        Error message should help the user recover from the error state. Use
        clear message with simple instructions of how to fix the problem, for
        example <code>Selection is required</code>.
      </p>

      <anypoint-dropdown-menu invalidmessage="Dino is required with the order" invalid required>
        <label slot="label">Select a dinosaur</label>
        <anypoint-listbox slot="dropdown-content" tabindex="-1">
        ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
        </anypoint-listbox>
      </anypoint-dropdown-menu>

      <h3>Invalid and info message</h3>
      <p>
        Error message has higher priority and info message is hidden when error is rendered.
      </p>

      <anypoint-dropdown-menu
        invalidmessage="Dino is required with the order"
        infomessage="Will be added to your order."
        invalid required>
        <label slot="label">Select a dinosaur</label>
        <anypoint-listbox slot="dropdown-content" tabindex="-1">
        ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
        </anypoint-listbox>
      </anypoint-dropdown-menu>
    </section>`;
  }

  _valuesTemplate() {
    return html`<section class="documentation-section">
      <h2>Value setting</h2>
      <p>
        You can set the value of the dropdown menu by setting the following on the list items:
      </p>

      <ul>
        <li>The <code>label</code> or <code>data-label</code> attribute</li>
        <li>The <code>label</code> property</li>
        <li>The text content of the selected item</li>
      </ul>

      <anypoint-dropdown-menu infoMessage="Will be added to your order.">
        <label slot="label">Select a dinosaur</label>
        <anypoint-listbox slot="dropdown-content" tabindex="-1">
          <anypoint-item label="Value 1">Value 1 from the label</anypoint-item>
          <anypoint-item data-label="Value 2">Value 2 from the data-label</anypoint-item>
          <anypoint-item>The inner text</anypoint-item>
          <anypoint-item data-label="from data-label">
            <anypoint-item-body twoLine>
              <div>First line</div>
              <div data-secondary>Second line</div>
            </anypoint-item-body>
          </anypoint-item>
        </anypoint-listbox>
      </anypoint-dropdown-menu>
    </section>`;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint dropdown menu</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
      ${this._formsTemplate()}
      ${this._assistiveTemplate()}
      ${this._valuesTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();

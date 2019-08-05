import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@polymer/iron-image/iron-image.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '../anypoint-dropdown-menu.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this._componentName = 'anypoint-dropdown-menu';
    this.items = [
      'allosaurus',
      'brontosaurus',
      'carcharodontosaurus',
      'diplodocus',
      'ekrixinatosaurus',
      'fukuiraptor',
      'gallimimus',
      'hadrosaurus',
      'iguanodon',
      'jainosaurus',
      'kritosaurus',
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
  }

  _mdHandler(e) {
    if (e.target.checked) {
      document.body.classList.add('material');
    } else {
      document.body.classList.remove('material');
    }
  }


  _headerControlsTemplate() {
    return html`<div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._darkThemeHandler}">Toggle dark theme</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._mdHandler}">Toggle material design</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._narrowHandler}">Toggle narrow attribute</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button checked @checked-changed="${this._stylesHandler}">Toggle styles</paper-toggle-button>
    </div>`;
  }

  contentTemplate() {
    return html`
      <div class="card">
        <h3>Basic</h3>
        <anypoint-dropdown-menu>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-dropdown-menu>
          <label slot="label">Pre-selected dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-dropdown-menu>
          <label slot="label">Attribute as selection value</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1" attrforselected="label" selected="vulcanodon">
          ${this.items.map((item) => html`<anypoint-item label="${item}">${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>


      <div class="card">
        <h3>Empty form fields</h3>
        <anypoint-dropdown-menu>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-dropdown-menu>
          <label slot="label">Select anoter dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-dropdown-menu>
          <label slot="label">Almost done</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item label="${item}">${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>

        <anypoint-dropdown-menu>
          <label slot="label">Last dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item label="${item}">${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>

      <div class="card">
        <h3>You can change the direction in which the menu opens</h3>
        <anypoint-dropdown-menu verticalalign="bottom" horizontalalign="right">
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>

      <div class="card">
        <h3>Dropdown can be disabled</h3>
        <anypoint-dropdown-menu disabled>
          <label slot="label">Disabled dinosaurs</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>

      <div class="card">
        <h3>Right-to-left language</h3>
        <anypoint-dropdown-menu dir="rtl">
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>

      <div class="card">
        <h3>Required with auto validation</h3>
        <anypoint-dropdown-menu required autovalidate>
          <label slot="label">Select a dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;

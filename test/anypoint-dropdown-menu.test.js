import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import sinon from 'sinon';
import '../anypoint-dropdown-menu.js';

/** @typedef {import('../').AnypointDropdownMenu} AnypointDropdownMenu */

describe('<anypoint-dropdown-menu>', () => {
  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function basicFixture() {
    return fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Dinosaur</label>
      <div slot="dropdown-content">
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    </anypoint-dropdown-menu>
    `);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function selectedFixture() {
    return fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function labeledFixture() {
    return fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
        <div data-label="item4-label">item 5</div>
      </div>
    </anypoint-listbox>
    `);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function requiredFixture() {
    return fixture(`<anypoint-dropdown-menu aria-label="Test" required>
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function autoValidateFixture() {
    return fixture(`<anypoint-dropdown-menu aria-label="Test" required autoValidate>
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function invalidMessageFixture() {
    return fixture(
      `<anypoint-dropdown-menu invalidMessage="test"></anypoint-dropdown-menu>`
    );
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function disabledFixture() {
    return fixture(`<anypoint-dropdown-menu disabled>
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function formFixture() {
    return fixture(`
    <form>
      <fieldset name="form-fields">
        <anypoint-dropdown-menu name="formItem">
          <label slot="label">Selected dinosaur</label>
          <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
            <div>item 1</div>
            <div>item 2</div>
            <div>item 3</div>
          </div>
        </anypoint-listbox>
      </fieldset>
      <input type="reset" value="Reset">
      <input type="submit" value="Submit">
    </form>`);
  }

  /**
   * @returns {Promise<AnypointDropdownMenu>}
   */
  async function unfitFixture() {
    return fixture(`<anypoint-dropdown-menu fitPositionTarget>
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <div label="item1-label">item 1</div>
      </div>
    </anypoint-listbox>
    `);
  }

  function elementIsVisible(element) {
    const contentRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    return (
      computedStyle.display !== 'none' &&
      contentRect.width > 0 &&
      contentRect.height > 0
    );
  }

  async function untilOpened(element) {
    return new Promise((resolve) => {
      element.addEventListener('overlay-opened', function f() {
        element.removeEventListener('overlay-opened', f);
        resolve();
      });
      element.open();
    });
  }

  async function untilClosed(element) {
    return new Promise((resolve) => {
      element.addEventListener('overlay-closed', function f() {
        element.removeEventListener('overlay-closed', f);
        resolve();
      });
      element.close();
    });
  }

  describe('Basics', () => {
    it('can be initialized with createElement', () => {
      const element = document.createElement('anypoint-dropdown-menu');
      assert.ok(element);
    });

    it('has opened state set', async () => {
      const element = await basicFixture();
      assert.isFalse(element.opened);
    });

    it('dispatches opened-changed event', async () => {
      const element = await basicFixture();
      const spy = sinon.spy();
      element.addEventListener('opened-changed', spy);
      element.opened = true;
      assert.isTrue(spy.called);
    });
  });

  describe('Menu rendering', () => {
    it('initially hides the content', async () => {
      const element = await basicFixture();
      const node = element.querySelector('[slot="dropdown-content"]');
      assert.isFalse(elementIsVisible(node));
    });

    it('renders content when opened', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      const node = element.querySelector('[slot="dropdown-content"]');
      assert.isTrue(elementIsVisible(node));
    });

    it('hides the content on outside click', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      MockInteractions.tap(document.body);
    });

    it('renders the label', async () => {
      const element = await basicFixture();
      const node = element.querySelector('label');
      assert.isTrue(elementIsVisible(node));
    });

    it('label does not overlap selected value', async () => {
      const element = await selectedFixture();
      // chrome needs this time to finish animation. Otherwise calculated
      // position is were the animation started.
      await aTimeout(121);
      const label = element.querySelector('label');
      const input = element.shadowRoot.querySelector('.input-spacer');
      const labelRect = label.getClientRects()[0];
      const inputRect = input.getClientRects()[0];
      assert.isBelow(labelRect.bottom, inputRect.top);
    });

    it('icon button is rotated when opened', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      const node = element.shadowRoot.querySelector('.trigger-icon');
      // So the result of calling getComputedStyle(node).transform
      // is not what exactly is defined in the css class but rather UA's
      // computation of transformation. This just tests whether opened class
      // is applied.
      assert.isTrue(node.classList.contains('opened'));
    });

    it('calls _focusContent() when opening', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, '_focusContent');
      await untilOpened(element);
      assert.isTrue(spy.called);
    });

    it('calls _focusContent() focusing after opening', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      document.body.focus();
      await nextFrame();
      const spy = sinon.spy(element, '_focusContent');
      element.focus();
      assert.isTrue(spy.called);
    });

    it('closes the list when Escape is pressed', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      MockInteractions.keyDownOn(element, 27, [], 'Escape');
      assert.isFalse(element.opened);
    });

    it('does nothing when Escape and is already closed', async () => {
      const element = await basicFixture();
      MockInteractions.keyDownOn(element, 27, [], 'Escape');
      assert.isFalse(element.opened);
    });

    it('opens the list when ArrowUp is pressed', async () => {
      const element = await basicFixture();
      MockInteractions.keyDownOn(element, 38, [], 'ArrowUp');
      assert.isTrue(element.opened);
    });

    it('opens the list when ArrowDown is pressed', async () => {
      const element = await basicFixture();
      MockInteractions.keyDownOn(element, 40, [], 'ArrowDown');
      assert.isTrue(element.opened);
    });

    it('focuses on the list when ArrowUp is pressed and opened', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      const spy = sinon.spy(element, '_focusContent');
      MockInteractions.keyDownOn(element, 38, [], 'ArrowUp');
      assert.isTrue(spy.called);
    });

    it('focuses on the list when ArrowDown is pressed and opened', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      const spy = sinon.spy(element, '_focusContent');
      MockInteractions.keyDownOn(element, 40, [], 'ArrowDown');
      assert.isTrue(spy.called);
    });

    it('opens the element on click', async () => {
      const element = await basicFixture();
      MockInteractions.tap(element);
      assert.isTrue(element.opened);
    });

    it('sets value when selecting an item', async () => {
      const element = await selectedFixture();
      await untilOpened(element);
      const node = element.querySelector('div');
      MockInteractions.tap(node);
      assert.equal(element.value, 'item 1');
    });

    it('sets value from label attribute', async () => {
      const element = await labeledFixture();
      await untilOpened(element);
      const node = element.querySelector('div[label="item2-label"]');
      MockInteractions.tap(node);
      assert.equal(element.value, 'item2-label');
    });

    it('sets the value from the data-label attribute', async () => {
      const element = await labeledFixture();
      await untilOpened(element);
      const node = element.querySelector('div[data-label="item4-label"]');
      MockInteractions.tap(node);
      assert.equal(element.value, 'item4-label');
    });

    it('deactivates item when list has no selection', async () => {
      const element = await selectedFixture();
      // @ts-ignore
      element.contentElement.selected = -1;
      assert.equal(element.selectedItem, null);
    });
  });

  describe('validationStates', () => {
    const states = [
      {
        valid: false,
        message: 'test',
      },
    ];

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets validationStates on element', () => {
      element.validationStates = states;
      assert.deepEqual(element.validationStates, states);
    });

    it('value change dispatches value-change event', async () => {
      const spy = sinon.spy();
      element.addEventListener('validationstates-changed', spy);
      element.validationStates = states;
      assert.deepEqual(spy.args[0][0].detail.value, states);
    });

    it('setting the same value ignores setter', async () => {
      element.validationStates = states;
      const spy = sinon.spy();
      element.addEventListener('validationstates-changed', spy);
      element.validationStates = states;
      assert.isFalse(spy.called);
    });

    it('calls _validationStatesChanged()', async () => {
      const spy = sinon.spy(element, '_validationStatesChanged');
      element.validationStates = states;
      assert.deepEqual(spy.args[0][0], states);
    });

    it('sets hasValidationMessage when validationStates changes', () => {
      element.invalid = true;
      element.validationStates = states;
      assert.isTrue(element.hasValidationMessage);
    });
  });

  describe('autoValidate', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls validate() when autovalidate is on', async () => {
      const spy = sinon.spy(element, 'validate');
      element.autoValidate = true;
      assert.isTrue(spy.called);
    });
  });

  describe('_infoAddonClass getter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default class', () => {
      assert.equal(element._infoAddonClass, 'info');
    });

    it('returns default class when not invalid', () => {
      element.invalidMessage = 'test';
      assert.equal(element._infoAddonClass, 'info');
    });

    it('returns label-hidden class when invalid', () => {
      element.invalidMessage = 'test';
      element.invalid = true;
      assert.equal(element._infoAddonClass, 'info label-hidden');
    });
  });

  describe('_errorAddonClass getter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default class', () => {
      assert.equal(element._errorAddonClass, 'invalid label-hidden');
    });

    it('returns info-offset class when with info message', () => {
      element.infoMessage = 'test';
      assert.equal(
        element._errorAddonClass,
        'invalid label-hidden info-offset'
      );
    });

    it('returns visible class when invalid', () => {
      element.infoMessage = 'test';
      element.invalid = true;
      assert.equal(element._errorAddonClass, 'invalid info-offset');
    });
  });

  describe('firstUpdated()', () => {
    it('sets selectedItem when initalizing', async () => {
      const element = await selectedFixture();
      assert.ok(element.selectedItem);
    });

    it('selectedItem is not set when no selction', async () => {
      const element = await basicFixture();
      assert.notOk(element.selectedItem);
    });
  });

  describe('_selectedItemChanged()', () => {
    it('sets value from passed item label property', async () => {
      const element = await basicFixture();
      const item = document.createElement('div');
      item.setAttribute('label', 'test');
      element._selectedItemChanged(item);
      assert.equal(element.value, 'test');
    });

    it('sets value from passed item label attribute', async () => {
      const element = await basicFixture();
      const node = element.querySelector('div');
      node.setAttribute('label', 'label-attribute');
      element._selectedItemChanged(node);
      assert.equal(element.value, 'label-attribute');
    });

    it('sets value from passed item text value', async () => {
      const element = await labeledFixture();
      const node = element.querySelector('div');
      element._selectedItemChanged(node);
      assert.equal(element.value, 'item1-label');
    });
  });

  describe('toggle()', () => {
    it('opens the list', async () => {
      const element = await basicFixture();
      element.toggle();
      assert.isTrue(element.opened);
    });

    it('closes the list', async () => {
      const element = await basicFixture();
      element.opened = true;
      element.toggle();
      assert.isFalse(element.opened);
    });

    it('cancels passed event', async () => {
      const element = await basicFixture();
      const e = new CustomEvent('test', {
        cancelable: true,
      });
      // @ts-ignore
      element.toggle(e);
      assert.isTrue(e.defaultPrevented);
    });
  });

  describe('open()', () => {
    it('opens the list', async () => {
      const element = await basicFixture();
      element.open();
      assert.isTrue(element.opened);
    });
  });

  describe('close()', () => {
    it('opens the list', async () => {
      const element = await basicFixture();
      element.opened = true;
      element.close();
      assert.isFalse(element.opened);
    });
  });

  describe('validation', () => {
    it('sets invalid flag when required', async () => {
      const element = await requiredFixture();
      const result = element.validate();
      assert.isTrue(element.invalid, 'invalid is set');
      assert.isFalse(result, 'call result is false');
    });

    it('auto validates when closing the list', async () => {
      const element = await autoValidateFixture();
      await untilOpened(element);
      await untilClosed(element);
      assert.isTrue(element.invalid);
    });
  });

  describe('_invalidChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets invalid state', () => {
      element._invalidChanged(true);
      // This is done in parent class.
      assert.equal(element.getAttribute('aria-invalid'), 'true');
    });

    it('sets _hasValidationMessage when invalidMessage', () => {
      element.invalidMessage = 'test';
      element._invalidChanged(true);
      assert.isTrue(element.hasValidationMessage);
    });

    it('sets _hasValidationMessage when no invalidMessage', () => {
      element._invalidChanged(true);
      assert.isFalse(element.hasValidationMessage);
    });

    it('calls _ensureInvalidAlertSate()', () => {
      const spy = sinon.spy(element, '_ensureInvalidAlertSate');
      element._invalidChanged(true);
      assert.isTrue(spy.args[0][0]);
    });
  });

  describe('_ensureInvalidAlertSate()', () => {
    let element;
    beforeEach(async () => {
      element = await invalidMessageFixture();
    });

    it('sets role attribute on invalid label', () => {
      element._ensureInvalidAlertSate(true);
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.equal(node.getAttribute('role'), 'alert');
    });

    it('removes role attribute from invalid label', () => {
      const node = element.shadowRoot.querySelector('p.invalid');
      node.setAttribute('role', 'alert');
      element._ensureInvalidAlertSate(false);
      assert.isFalse(node.hasAttribute('role'));
    });

    it('removes role attribute from invalid label after timeout', async () => {
      element._ensureInvalidAlertSate(true);
      await aTimeout(1001);
      const node = element.shadowRoot.querySelector('p.invalid');
      assert.isFalse(node.hasAttribute('role'));
    });
  });

  describe('disabled state', () => {
    describe('disabled attribute', () => {
      it('disabled cannot be opened via open()', async () => {
        const element = await disabledFixture();
        element.open();
        assert.isFalse(element.opened);
      });

      it('disabled cannot be opened via opened property', async () => {
        const element = await disabledFixture();
        element.opened = true;
        assert.isFalse(element.opened);
      });

      it('disabled cannot be opened via click', async () => {
        const element = await disabledFixture();
        MockInteractions.tap(element);
        assert.isFalse(element.opened);
      });

      it('restores state when disabled set to false', async () => {
        const element = await disabledFixture();
        element.disabled = false;
        await nextFrame();
        element.open();
        assert.isTrue(element.opened);
      });

      it('closes overlay when disabling', async () => {
        const element = await basicFixture();
        await untilOpened(element);
        element.disabled = true;
        assert.isFalse(element.opened);
      });
    });
  });

  describe('a11y', () => {
    it('sets aria-expanded when opened', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      assert.equal(element.getAttribute('aria-expanded'), 'true');
    });

    it('sets aria-expanded when closed', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      element.opened = false;
      assert.equal(element.getAttribute('aria-expanded'), 'false');
    });

    it('sets aria-expanded on content element when opened', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      assert.equal(
        element.contentElement.getAttribute('aria-expanded'),
        'true'
      );
    });

    it('sets aria-expanded on content element when closed', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      element.opened = false;
      assert.equal(
        element.contentElement.getAttribute('aria-expanded'),
        'false'
      );
    });

    it('sets tabindex on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects existing tabindex on the element', async () => {
      const element = await fixture(
        `<anypoint-dropdown-menu tabindex="1"></anypoint-listbox>`
      );
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('sets aria-haspopup on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('aria-haspopup'), 'listbox');
    });

    it('respects existing aria-haspopup on the element', async () => {
      const element = await fixture(
        `<anypoint-dropdown-menu aria-haspopup="true"></anypoint-listbox>`
      );
      assert.equal(element.getAttribute('aria-haspopup'), 'true');
    });

    it('sets aria-expanded on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('aria-expanded'), 'false');
    });

    it('is accessible with chidren', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when opened', async () => {
      const element = await basicFixture();
      element.opened = true;
      // await untilOpened(element);
      await assert.isAccessible(element);
    });

    it('is accessible for outlined style', async () => {
      const element = await basicFixture();
      element.outlined = true;
      await assert.isAccessible(element);
    });

    it('is accessible for compatibility style', async () => {
      const element = await basicFixture();
      element.compatibility = true;
      await assert.isAccessible(element);
    });
  });

  describe('compatibility mode', () => {
    it('sets compatibility on item when setting legacy', async () => {
      const element = await basicFixture();
      element.legacy = true;
      assert.isTrue(element.legacy, 'legacy is set');
      assert.isTrue(element.compatibility, 'compatibility is set');
    });

    it('returns compatibility value from item when getting legacy', async () => {
      const element = await basicFixture();
      element.compatibility = true;
      assert.isTrue(element.legacy, 'legacy is set');
    });
  });

  describe('fitPositionTarget mode', () => {
    it('sets fitPositionTarget to true by default', async () => {
      const element = await basicFixture();
      assert.isFalse(element.fitPositionTarget, 'fitPositionTarget is set');
    });

    it('sets fitPositionTarget to false', async () => {
      const element = await unfitFixture();
      assert.isTrue(element.fitPositionTarget, 'fitPositionTarget is set');
    });
  });
});

import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../anypoint-dropdown-menu.js';

const hasFormAssociatedElements = 'attachInternals' in document.createElement('span');

describe('<anypoint-dropdown-menu>', () => {
  async function basicFixture() {
    return await fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Dinosaur</label>
      <div slot="dropdown-content">
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    </anypoint-dropdown-menu>
    `);
  }

  async function selectedFixture() {
    return await fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  async function labeledFixture() {
    return await fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1" selected="1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  async function requiredFixture() {
    return await fixture(`<anypoint-dropdown-menu aria-label="Test" required>
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  async function autoValidateFixture() {
    return await fixture(`<anypoint-dropdown-menu aria-label="Test" required autovalidate>
      <label slot="label">Selected dinosaur</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <div label="item1-label">item 1</div>
        <div label="item2-label">item 2</div>
        <div label="item3-label">item 3</div>
      </div>
    </anypoint-listbox>
    `);
  }

  function elementIsVisible(element) {
    const contentRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.display !== 'none' && contentRect.width > 0 &&
        contentRect.height > 0;
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

    it('hiddes the content on outside click', async () => {
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

    it('deactivates item when list has no selection', async () => {
      const element = await selectedFixture();
      element.contentElement.selected = -1;
      assert.equal(element.selectedItem, null);
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
      element._selectedItemChanged({
        label: 'test'
      });
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
        cancelable: true
      });
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

  (hasFormAssociatedElements ? describe : describe.skip)('form-associated custom elements', () => {
    async function formFixtrue() {
      return await fixture(`
      <form>
        <fieldset name="form-fiels">
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

    describe('Internal basics', () => {
      let element;
      let form;
      beforeEach(async () => {
        form = await formFixtrue();
        element = form.querySelector('anypoint-dropdown-menu');
      });

      it('initializes ElementInternals interface', () => {
        assert.ok(element._internals);
      });

      it('has associated form', () => {
        assert.equal(element.form, form);
      });

      it('the element is in the list of form elements', () => {
        const elements = Array.from(form.elements);
        assert.notEqual(elements.indexOf(element), -1);
      });
    });

    describe('Submitting the form', () => {
      let element;
      let form;
      beforeEach(async () => {
        form = await formFixtrue();
        element = form.querySelector('anypoint-dropdown-menu');
      });

      it('set value in forms submission value', () => {
        const spy = sinon.spy(element._internals, 'setFormValue');
        element.value = 'test';
        assert.isTrue(spy.called);
      });
    });

    describe('Resseting the form', () => {
      let element;
      let form;
      beforeEach(async () => {
        form = await formFixtrue();
        element = form.querySelector('anypoint-dropdown-menu');
      });

      it('resets input value', () => {
        form.reset();
        assert.equal(element.value, '');
      });
    });

    describe('Disables the input when fieldset is disabled', () => {
      let element;
      let form;
      let fieldset;
      beforeEach(async () => {
        form = await formFixtrue();
        element = form.querySelector('anypoint-dropdown-menu');
        fieldset = form.querySelector('fieldset');
      });

      it('resets input value', () => {
        fieldset.disabled = true;
        assert.isTrue(element.disabled);
      });
    });

    describe('checkValidity()', () => {
      let element;
      let form;
      beforeEach(async () => {
        form = await formFixtrue();
        element = form.querySelector('anypoint-dropdown-menu');
      });

      it('calls internall checkValidity()', () => {
        const spy = sinon.spy(element._internals, 'checkValidity');
        element.checkValidity();
        assert.isTrue(spy.called);
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
      assert.equal(element.contentElement.getAttribute('aria-expanded'), 'true');
    });

    it('sets aria-expanded on content element when closed', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      element.opened = false;
      assert.equal(element.contentElement.getAttribute('aria-expanded'), 'false');
    });

    it('sets tabindex on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects existing tabindex on the element', async () => {
      const element = await fixture(`<anypoint-dropdown-menu tabindex="1"></anypoint-listbox>`);
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('sets aria-haspopup on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('aria-haspopup'), 'listbox');
    });

    it('respects existing aria-haspopup on the element', async () => {
      const element = await fixture(`<anypoint-dropdown-menu aria-haspopup="true"></anypoint-listbox>`);
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
  });
});

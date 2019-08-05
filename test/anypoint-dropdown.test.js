import { fixture, assert, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../anypoint-dropdown.js';

describe('<anypoint-dropdown>', () => {
  async function basicFixture() {
    return await fixture(`<anypoint-dropdown>
        <div slot="dropdown-content">
          <div>item 1</div>
          <div>item 2</div>
          <div>item 3</div>
        </div>
      </anypoint-dropdown>`);
  }

  async function noContentFixture() {
    return await fixture(`<anypoint-dropdown></anypoint-dropdown>`);
  }

  async function disabledFixture() {
    return await fixture(`<anypoint-dropdown disabled>
      <div slot="dropdown-content">
        <div>item 1</div>
      </div>
      </anypoint-dropdown>`);
  }

  async function noAnimationsFixture() {
    return await fixture(`<anypoint-dropdown noanimations>
        <div slot="dropdown-content">
          <div>item 1</div>
          <div>item 2</div>
          <div>item 3</div>
        </div>
      </anypoint-dropdown>`);
  }

  async function focusableFixture() {
    return await fixture(`<anypoint-dropdown>
        <div slot="dropdown-content" tabindex="0">
          <div tabindex="0">item 1</div>
          <div tabindex="0">item 2</div>
          <div tabindex="0">item 3</div>
        </div>
      </anypoint-dropdown>`);
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

  describe('basics', () => {
    it('initially hides the content', async () => {
      const element = await basicFixture();
      const node = element.querySelector('[slot="dropdown-content"]');
      assert.isFalse(elementIsVisible(node));
    });

    it('renders content when opened', async () => {
      const element = await noAnimationsFixture();
      await untilOpened(element);
      const node = element.querySelector('[slot="dropdown-content"]');
      assert.isTrue(elementIsVisible(node));
    });

    it('hiddes the content on outside click', async () => {
      const element = await noAnimationsFixture();
      await untilOpened(element);
      MockInteractions.tap(document.body);
    });

    it('sets sizingTarget to the content', async () => {
      const element = await basicFixture();
      const content = element.querySelector('[slot="dropdown-content"]');
      assert.equal(element.sizingTarget, content);
    });

    it('sets sizingTarget to self when no content', async () => {
      const element = await noContentFixture();
      assert.equal(element.sizingTarget, element);
    });

    it('ignores open action when disabled', async () => {
      const element = await disabledFixture();
      element.opened = true;
      assert.isFalse(element.opened);
    });

    it('sets "lock" scroll action', async () => {
      const element = await basicFixture();
      element.allowOutsideScroll = true;
      element.allowOutsideScroll = false;
      assert.equal(element.scrollAction, 'lock');
    });

    it('sets "refit" scroll action', async () => {
      const element = await basicFixture();
      element.scrollAction = 'lock';
      element.allowOutsideScroll = true;
      assert.equal(element.scrollAction, 'refit');
    });

    it('keeps existing scroll action', async () => {
      const element = await basicFixture();
      element.scrollAction = 'other';
      element.allowOutsideScroll = true;
      assert.equal(element.scrollAction, 'other');
    });
  });

  describe('handling focus', () => {
    let element;
    let content;

    it('sets focus when opened', async () => {
      element = await focusableFixture();
      await untilOpened(element);
      content = element.querySelector('[slot="dropdown-content"]');
      assert.equal(document.activeElement, content);
    });

    it('sets focus to focusTarget', async () => {
      element = await focusableFixture();
      content = element.querySelector('[slot="dropdown-content"]');
      const node = content.querySelector('div[tabindex]');
      element.focusTarget = node;
      await untilOpened(element);
      assert.equal(document.activeElement, node);
    });
  });

  describe('_setPrefixedProperty()', () => {
    it('sets transformOrigin when opening', async () => {
      const element = await basicFixture();
      await untilOpened(element);
      const content = element.querySelector('[slot="dropdown-content"]');
      assert.notEmpty(content.style.transformOrigin.trim());
    });

    it('transformOrigin is not set when noAnimations', async () => {
      const element = await noAnimationsFixture();
      await untilOpened(element);
      const content = element.querySelector('[slot="dropdown-content"]');
      assert.isEmpty(content.style.transformOrigin.trim());
    });
  });

  describe('_configureStartAnimation()', () => {
    let element;
    let node;
    beforeEach(async () => {
      element = await basicFixture();
      node = element.querySelector('[slot="dropdown-content"]');
    });

    it('uses default config', () => {
      const spy = sinon.spy(element, '_runEffects');
      element._configureStartAnimation(node);
      assert.typeOf(spy.args[0][1], 'array', 'config is an array');
      assert.typeOf(spy.args[0][1][0].keyframes, 'array', 'keyframes is an array');
      assert.typeOf(spy.args[0][1][0].timing, 'object', 'timing is an object');
    });

    it('uses configured value', () => {
      const spy = sinon.spy(element, '_runEffects');
      const config = [{
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        timing: { delay: 0, duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
      }];
      element._configureStartAnimation(node, config);
      assert.deepEqual(spy.args[0][1], config);
    });

    it('returns running animations', () => {
      const result = element._configureStartAnimation(node);
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 1);
    });

    it('returns null when no animations API', () => {
      const orig = window.KeyframeEffect;
      window.KeyframeEffect = undefined;
      const result = element._configureStartAnimation(node);
      window.KeyframeEffect = orig;
      assert.equal(result, null);
    });
  });

  describe('_configureEndAnimation()', () => {
    let element;
    let node;
    beforeEach(async () => {
      element = await basicFixture();
      node = element.querySelector('[slot="dropdown-content"]');
    });

    it('uses default config', () => {
      const spy = sinon.spy(element, '_runEffects');
      element._configureEndAnimation(node);
      assert.typeOf(spy.args[0][1], 'array', 'config is an array');
      assert.typeOf(spy.args[0][1][0].keyframes, 'array', 'keyframes is an array');
      assert.typeOf(spy.args[0][1][0].timing, 'object', 'timing is an object');
    });

    it('uses configured value', () => {
      const spy = sinon.spy(element, '_runEffects');
      const config = [{
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        timing: { delay: 0, duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
      }];
      element._configureEndAnimation(node, config);
      assert.deepEqual(spy.args[0][1], config);
    });

    it('returns running animations', () => {
      const result = element._configureEndAnimation(node);
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 1);
    });

    it('returns null when no animations API', () => {
      const orig = window.KeyframeEffect;
      window.KeyframeEffect = undefined;
      const result = element._configureEndAnimation(node);
      window.KeyframeEffect = orig;
      assert.equal(result, null);
    });
  });

  describe('animations', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('runs animations when opening', async () => {
      element.opened = true;
      await nextFrame();
      assert.typeOf(element._activeAnimations, 'array');
      assert.lengthOf(element._activeAnimations, 1);
      await untilOpened(element);
    });

    it('adds "animating" class to the content wrapper when opening', async () => {
      element.opened = true;
      await nextFrame();
      assert.isTrue(element.contentWrapper.classList.contains('animating'));
      await untilOpened(element);
    });

    it('removes "animating" class after finish when opening', async () => {
      element.opened = true;
      await untilOpened(element);
      assert.isFalse(element.contentWrapper.classList.contains('animating'));
    });

    it('runs animations when closing', async () => {
      element.opened = true;
      await untilOpened(element);
      element.opened = false;
      await nextFrame();
      assert.typeOf(element._activeAnimations, 'array');
      assert.lengthOf(element._activeAnimations, 1);
    });

    it('adds "animating" class to the content wrapper when closing', async () => {
      element.opened = true;
      await untilOpened(element);
      element.opened = false;
      await nextFrame();
      assert.isTrue(element.contentWrapper.classList.contains('animating'));
    });

    it('removes "animating" class after finish when closing', async () => {
      element.opened = true;
      await untilOpened(element);
      element.opened = false;
      assert.isFalse(element.contentWrapper.classList.contains('animating'));
    });

    it('cancels running animations when changin opened', async () => {
      const spy = sinon.spy(element, 'cancelAnimation');
      element.opened = true;
      await nextFrame();
      element.opened = false;
      assert.isTrue(spy.called);
    });

    it('sets transformOrigin when verticalAlign is bottom', async () => {
      element.verticalAlign = 'bottom';
      element.opened = true;
      await untilOpened(element);
      assert.include(element.containedElement.style.transformOrigin, '0% 100%');
    });

    it('sets transformOrigin when verticalAlign is middle', async () => {
      element.verticalAlign = 'middle';
      element.opened = true;
      await untilOpened(element);
      assert.include(element.containedElement.style.transformOrigin, '0% 50%');
    });

    it('sets transformOrigin when verticalAlign is top', async () => {
      element.verticalAlign = 'top';
      element.opened = true;
      await untilOpened(element);
      assert.include(element.containedElement.style.transformOrigin, '0% 0%');
    });
  });

  describe('_runEffects()', () => {
    let element;
    let node;
    let config;
    beforeEach(async () => {
      element = await basicFixture();
      node = element.querySelector('[slot="dropdown-content"]');
      config = [{
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        timing: { delay: 0, duration: 5 }
      }, {
        keyframes: [{ transform: 'scale(1, 0)' }, { transform: 'scale(1, 1)' }],
        timing: { delay: 1, duration: 5 }
      }];
    });

    async function untilFinish(results) {
      return new Promise((resolve) => {
        let left = results.length;
        results.map((animation) => {
          animation.addEventListener('finish', () => {
            left--;
            if (!left) {
              resolve();
            }
          });
        });
      });
    }

    it('returns a list of results', async () => {
      const result = element._runEffects(node, config);
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 2);
      await untilFinish(result);
    });

    it('calls _onAnimationFinish() when all animations finish', async () => {
      const spy = sinon.spy(element, '_onAnimationFinish');
      const result = element._runEffects(node, config);
      await untilFinish(result);
      assert.isTrue(spy.called);
    });

    it('quietly ignores errors', async () => {
      delete config[0].keyframes[1];
      const result = element._runEffects(node, config);
      assert.lengthOf(result, 1);
      await untilFinish(result);
    });

    it('clears running animations after finish', async () => {
      const result = element._runEffects(node, config);
      await untilFinish(result);
      assert.isUndefined(element._activeAnimations);
    });
  });

  describe('a11y', () => {
    it('is accessible with chidren', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when opened', async () => {
      const element = await basicFixture();
      element.opened = true;
      await untilOpened(element);
      await assert.isAccessible(element);
    });
  });
});

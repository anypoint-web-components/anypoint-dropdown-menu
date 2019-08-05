import { fixture, assert } from '@open-wc/testing';
// import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
// import sinon from 'sinon/pkg/sinon-esm.js';
import '../anypoint-dropdown-menu.js';

describe('<anypoint-dropdown-menu>', () => {
  async function basicFixture() {
    return await fixture(`<anypoint-dropdown-menu aria-label="Test">
      <label slot="label">Pre-selected dinosaur</label>
      <div slot="dropdown-content">
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    </anypoint-dropdown-menu>
    `);
  }

  // describe('basics', () => {
  //   it('initially hides the content', async () => {
  //     const element = await basicFixture();
  //     const node = element.querySelector('[slot="dropdown-content"]');
  //     assert.isFalse(elementIsVisible(node));
  //   });
  //
  //   it('renders content when opened', async () => {
  //     const element = await noAnimationsFixture();
  //     await untilOpened(element);
  //     const node = element.querySelector('[slot="dropdown-content"]');
  //     assert.isTrue(elementIsVisible(node));
  //   });
  //
  //   it('hiddes the content on outside click', async () => {
  //     const element = await noAnimationsFixture();
  //     await untilOpened(element);
  //     MockInteractions.tap(document.body);
  //   });
  //
  //   it('sets sizingTarget to the content', async () => {
  //     const element = await basicFixture();
  //     const content = element.querySelector('[slot="dropdown-content"]');
  //     assert.equal(element.sizingTarget, content);
  //   });
  //
  //   it('sets sizingTarget to self when no content', async () => {
  //     const element = await noContentFixture();
  //     assert.equal(element.sizingTarget, element);
  //   });
  //
  //   it('ignores open action when disabled', async () => {
  //     const element = await disabledFixture();
  //     element.opened = true;
  //     assert.isFalse(element.opened);
  //   });
  //
  //   it('sets "lock" scroll action', async () => {
  //     const element = await basicFixture();
  //     element.allowOutsideScroll = true;
  //     element.allowOutsideScroll = false;
  //     assert.equal(element.scrollAction, 'lock');
  //   });
  //
  //   it('sets "refit" scroll action', async () => {
  //     const element = await basicFixture();
  //     element.scrollAction = 'lock';
  //     element.allowOutsideScroll = true;
  //     assert.equal(element.scrollAction, 'refit');
  //   });
  //
  //   it('keeps existing scroll action', async () => {
  //     const element = await basicFixture();
  //     element.scrollAction = 'other';
  //     element.allowOutsideScroll = true;
  //     assert.equal(element.scrollAction, 'other');
  //   });
  // });

  describe('a11y', () => {
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

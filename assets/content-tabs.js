import { Component } from '@theme/component';

class ContentTabsComponent extends Component {
  #abort = null;

  connectedCallback() {
    super.connectedCallback();
    this.#abort?.abort();
    this.#abort = new AbortController();
    const opts = { signal: this.#abort.signal };
    const { tablist, tabs, panels } = this.refs;
    if (!tablist || !Array.isArray(tabs) || !Array.isArray(panels) || tabs.length === 0) return;

    tablist.addEventListener('click', (e) => this.#onTablistClick(e), opts);
    tablist.addEventListener('keydown', (e) => this.#onTablistKeydown(e), opts);

    let active = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    if (active < 0) active = 0;
    this.selectTab(active);
  }

  disconnectedCallback() {
    this.#abort?.abort();
    this.#abort = null;
    super.disconnectedCallback();
  }

  #onTablistClick(e) {
    const tab = e.target instanceof Element ? e.target.closest('.content-tabs__tab') : null;
    if (!tab || !(tab instanceof HTMLButtonElement) || !this.contains(tab)) return;
    const tabs = this.refs.tabs;
    if (!Array.isArray(tabs)) return;
    const i = tabs.indexOf(tab);
    if (i >= 0) this.selectTab(i);
  }

  #onTablistKeydown(e) {
    const tabs = this.refs.tabs;
    if (!Array.isArray(tabs) || tabs.length === 0) return;
    const focused = document.activeElement;
    if (!(focused instanceof HTMLButtonElement) || !tabs.includes(focused)) return;

    const i = tabs.indexOf(focused);
    if (i < 0) return;

    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      next = (i + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      next = (i - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      next = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      next = tabs.length - 1;
    } else {
      return;
    }

    this.selectTab(next);
    tabs[next]?.focus();
  }

  selectTab(index) {
    const tabs = this.refs.tabs;
    const panels = this.refs.panels;
    if (!Array.isArray(tabs) || !Array.isArray(panels)) return;

    const n = Math.min(tabs.length, panels.length);
    if (n === 0) return;

    const i = Math.max(0, Math.min(Math.floor(index), n - 1));

    for (let j = 0; j < n; j++) {
      const tab = tabs[j];
      const panel = panels[j];
      const on = j === i;
      tab?.setAttribute('aria-selected', on ? 'true' : 'false');
      tab?.setAttribute('tabindex', on ? '0' : '-1');
      if (on) panel?.removeAttribute('hidden');
      else panel?.setAttribute('hidden', '');
    }
  }
}

if (!customElements.get('content-tabs-component')) {
  customElements.define('content-tabs-component', ContentTabsComponent);
}

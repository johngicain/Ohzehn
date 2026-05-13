import { Component } from '@theme/component';

class RecommendedProductImagesCarousel extends Component {
  requiredRefs = ['track'];

  #currentPage = 0;

  connectedCallback() {
    super.connectedCallback();
    this.#update();
  }

  next() {
    const pageCount = Number(this.dataset.pageCount);
    if (!pageCount || this.#currentPage >= pageCount - 1) return;

    this.#currentPage += 1;
    this.#update();
  }

  previous() {
    if (this.#currentPage <= 0) return;

    this.#currentPage -= 1;
    this.#update();
  }

  #update() {
    const pageCount = Number(this.dataset.pageCount);
    const { track, previousButton, nextButton } = this.refs;

    if (!track || !pageCount) return;

    track.style.transform = `translateX(-${(this.#currentPage * 100) / pageCount}%)`;

    if (previousButton instanceof HTMLElement) {
      previousButton.disabled = pageCount <= 1 || this.#currentPage <= 0;
    }

    if (nextButton instanceof HTMLElement) {
      nextButton.disabled = pageCount <= 1 || this.#currentPage >= pageCount - 1;
    }
  }
}

if (!customElements.get('recommended-product-images-carousel')) {
  customElements.define('recommended-product-images-carousel', RecommendedProductImagesCarousel);
}

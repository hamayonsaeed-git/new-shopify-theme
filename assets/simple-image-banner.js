if (!customElements.get('simple-image-banner-product')) {
  customElements.define(
    'simple-image-banner-product',
    class SimpleImageBannerProduct extends HTMLElement {
      constructor() {
        super();
        this.handleClick = this.onClick.bind(this);
      }

      connectedCallback() {
        this.addEventListener('click', this.handleClick);

        this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, ({ data }) => {
          if (data.sectionId !== this.dataset.section) return;

          const productMedia = this.querySelector(`#ProductMedia-${this.dataset.section}`);
          const updatedProductMedia = data.html.getElementById(`ProductMedia-${this.dataset.section}`);
          if (productMedia && updatedProductMedia) {
            productMedia.innerHTML = updatedProductMedia.innerHTML;
          }

          const submitPrice = this.querySelector(`#ProductSubmitPrice-${this.dataset.section}`);
          const updatedSubmitPrice = data.html.getElementById(`ProductSubmitPrice-${this.dataset.section}`);
          if (submitPrice && updatedSubmitPrice) {
            submitPrice.innerHTML = updatedSubmitPrice.innerHTML;
          }

          const quantity = this.querySelector(`#Quantity-${this.dataset.section}`);
          const updatedQuantity = data.html.getElementById(`Quantity-${this.dataset.section}`);
          if (!quantity || !updatedQuantity) return;

          quantity.min = updatedQuantity.min;
          quantity.max = updatedQuantity.max;
          quantity.step = updatedQuantity.step;
          quantity.dataset.min = updatedQuantity.dataset.min;

          if (updatedQuantity.dataset.max) {
            quantity.dataset.max = updatedQuantity.dataset.max;
          } else {
            delete quantity.dataset.max;
          }

          quantity.value = updatedQuantity.value;
          publish(PUB_SUB_EVENTS.quantityUpdate);
        });
      }

      disconnectedCallback() {
        this.removeEventListener('click', this.handleClick);
        this.unsubscribe?.();
      }

      onClick(event) {
        const thumbnail = event.target.closest('[data-banner-thumbnail]');
        if (!thumbnail || !this.contains(thumbnail)) return;

        const mainImage = this.querySelector('.simple-image-banner__gallery-main img');
        if (!mainImage) return;

        mainImage.src = thumbnail.dataset.imageSrc;
        mainImage.removeAttribute('srcset');
        mainImage.alt = thumbnail.dataset.imageAlt;

        this.querySelectorAll('[data-banner-thumbnail]').forEach((button) => {
          button.setAttribute('aria-current', button === thumbnail ? 'true' : 'false');
        });
      }
    }
  );
}

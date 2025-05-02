function createSpanText(text, css_class) {
      const span = document.createElement('span');
      span.textContent = text;
      span.classList.add(css_class);

      return span;
}

const span_component = {
      createSpanText,
};
export default span_component;
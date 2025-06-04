function createSpanText(text, css_class) {
      const span = document.createElement('span');
      span.textContent = text;
      span.classList.add(css_class);

      return span;
}

function updateSpanText(span_id, text) {
      const span_element = document.getElementById(span_id);
      span_element.textContent = text;
      return span_element;
}

const span_component = {
      createSpanText,
      updateSpanText,
};
export default span_component;
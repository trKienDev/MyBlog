function createArticle(css_clas) {
      const article = document.createElement('article');
      article.classList.add(css_clas);
      return article;
}
function createDiv(css_clas, text) {
      const div = document.createElement('div');
      div.classList.add(css_clas);
      if(text) {
            div.textContent = text;
      }
      return div;
}
function createAhref({ href, text, css_class }) {
      const a = document.createElement('a');
      if(href) a.href = href;
      if(text) a.textContent = text;
      if(css_class) a.classList.add(css_class);

      return a;
}
function createH3(text, css_class) {
      const h3 = document.createElement('h3');
      h3.textContent = text;
      h3.classList.add(css_class);
      return h3;
}
function createSpan({ text, css_class}) {
      const span = document.createElement('span');
      if(text) span.textContent = text;
      if(css_class) span.classList.add(css_class);

      return span;
}
function createLiElement(css_class) {
      const li_element = document.createElement('li');
      li_element.classList.add(css_class);

      return li_element;
}
function CreateSection({id, css_class}) {
      const section_element = document.createElement('section');
      if(id) {
            section_element.id = id;
      }
      if(css_class) {
            section_element.classList.add(css_class);
      }

      return section_element;
}
const doms_component = {
      createArticle,
      createDiv,
      createAhref,
      createH3,
      createSpan,
      createLiElement,
      CreateSection,
}
export default doms_component;
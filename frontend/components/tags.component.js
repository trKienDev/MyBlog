import tag_api from "../api/tag.api.js";
import doms_component from "./doms.component.js";

async function createTagDivFromAPI({tag_field, tag_css }) {
      const tag_value = await tag_api.getTagById(tag_field);
      const tag_element = createTagDiv(tag_value, tag_css);
      
      return tag_element;
}

function createTagLi(tag, tag_css) {
      const tag_li = doms_component.createLiElement(tag_css);
      const tag_ahref = createTagAhref(tag);
      tag_li.appendChild(tag_ahref);
      
      return tag_li;
}

function createTagDiv(tag, tag_css) {
      const tag_div = doms_component.createDiv(tag_css);
      const tag_ahref = createTagAhref(tag);
      tag_div.appendChild(tag_ahref);

      return tag_div;
}

function createTagAhref(tag) {
      const tag_ahref = doms_component.createAhref({
            href: tag.url || `#${encodeURIComponent(tag.name.trim().toLowerCase().replace(/\s+/g, '-'))}`,
            text: tag.name,
            css_class: 'tag-link',
      });

      return tag_ahref;
}

const tags_component = {
      createTagLi,
      createTagDiv,
      createTagDivFromAPI,
}
export default tags_component;
import doms_component from "./doms.component.js";

function createTagItem(tag, tag_css) {
      const tag_li = doms_component.createLiElement(tag_css);
      const tag_ahref = doms_component.createAhref({
            href: tag.url || `#${encodeURIComponent(tag.name.trim().toLowerCase().replace(/\s+/g, '-'))}`,
            text: tag.name,
            css_class: 'tag-link',
      });

      tag_li.appendChild(tag_ahref);
      return tag_li;
}

const tags_component = {
      createTagItem,
}
export default tags_component;
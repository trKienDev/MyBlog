import tag_api from "../../api/tag.api.js";
import tags_component from "../../components/tags.component.js";
import ul_li_component from "../../components/ul-li.component.js";
import css_selectors from "../../selectors/css.selectors.js";

export async function TagsSectionController() {
      let tagLists_ul = ul_li_component.removeLiFromUl(css_selectors.tags.tags_list);
      const tags = await tag_api.getTags();

      tags.forEach(tag => {
            const tag_li = tags_component.createTagItem(tag, 'tag-item');
            tagLists_ul.appendChild(tag_li);
      });
}






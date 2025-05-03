import tag_api from "../../api/tag.api.js";
import div_component from "../../components/div.component.js";
import css_selectors from "../../selectors/css.selectors.js";


/**
 * Lấy thông tin tag rồi tạo div và append vào container
 * @param {string[]} tagIds  Mảng các _id của tag
 * @param {HTMLElement} container  Phần tử DOM chứa các tag
 */
async function renderSelectedTags(tag_ids, container) {
      for (const tag_id of tag_ids) {
            const tag = await tag_api.getTagById(tag_id);

            const tag_div = div_component.createDiv({
                  icss_class: css_selectors.tags.selected_tag,
                  idiv_id:    tag._id,
                  idiv_name:  tag.name
            });
            // 3. Gắn vào container
            container.appendChild(tag_div);
      }
}

const tag_helper = {
      renderSelectedTags,
}
export default tag_helper;
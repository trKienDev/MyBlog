import css_selectors from "../selectors/css.selectors.js";
import { showToast } from "../utils/toast-notification.js";
import doms_component from "./doms.component.js";
import tags_component from "./tags.component.js";

/**
 * Xóa tất cả các thẻ <li> con khỏi một thẻ <ul> được chỉ định.
 * @param {HTMLElement|string} css_class - Phần tử <ul> thực tế hoặc một chuỗi selector CSS cho thẻ <ul>.
 */
function removeLiFromUl(css_class) {
      let ul_element;

      if (typeof css_class === 'string') {
            ul_element = document.querySelector(`ul.${css_class}`);
      } else if (css_class instanceof HTMLElement && css_class.tagName === 'UL') {
            ul_element = css_class;
      } else {
            console.error('Invalid parameter: Must be a UL HTMLElement or a CSS selector string for a UL.');
            showToast('Invalid parameter: Must be a UL HTMLElement or a CSS selector string for a UL.', 'error');
            return;
      }

      if (ul_element) {
            while (ul_element.firstChild) {
                  ul_element.removeChild(ul_element.firstChild);
            }
            return ul_element;
      } else {
            if (typeof css_class === 'string') {
                  console.error(`UL element with selector "${css_class}" not found.`);
                  showToast('UL element with selector "${css_class}" not found', 'error');
                  return;
            } else {
                  console.error('The provided UL element is invalid or was not found.');
                  showToast('The provided UL element is invalid or was not found.', 'error');
                  return;
            }
      }
}


const ul_li_component = {
      removeLiFromUl,
}
export default ul_li_component;
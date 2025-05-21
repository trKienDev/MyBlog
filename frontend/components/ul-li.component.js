import css_selectors from "../selectors/css.selectors.js";
import { showToast } from "../utils/toast-notification.js";

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

/**
 * Creates a new <li> element with an <a> tag and appends it to the given <ul>.
 * @param {HTMLUListElement} ul_element - The <ul> element to append the new <li> to.
 * @param {object} tag - An object containing tag data. Expected to have a 'name' property.
 * Optionally, it can have a 'url' property for the link's href.
 * @returns {HTMLLIElement|null} The newly created <li> element, or null if an error occurs.
 */
function createLiElement(ul_element, tag) {
      const error_notification = 'error create li element';
      if (!(ul_element instanceof HTMLElement) || ul_element.tagName !== 'UL') {
            console.error('createLiElement Error: First argument must be a UL HTML element.');
            showToast(error_notification, 'error');
            return null;
      }
      if (!tag || typeof tag.name === 'undefined') {
            console.error('createLiElement Error: Second argument must be an object with a "name" property.');
            showToast(error_notification, 'error');
            return null;
      }

      const li_element = document.createElement('li');
      li_element.classList.add(css_selectors.tags.tag_item);

      const a_element = document.createElement('a');
      a_element.href = tag.url || `#${encodeURIComponent(tag.name.trim().toLowerCase().replace(/\s+/g, '-'))}`;
      a_element.classList.add(css_selectors.tags.tag_link);
      a_element.textContent = tag.name;

      li_element.appendChild(a_element);
      ul_element.appendChild(li_element);

      return li_element; 
}

const ul_li_component = {
      removeLiFromUl,
      createLiElement,
}
export default ul_li_component;
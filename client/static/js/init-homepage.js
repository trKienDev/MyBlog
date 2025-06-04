import ClientPages from "../../constants/client-pages.constant.js";
import ElementsId from "../../constants/element-id.constant.js";
import { HomePageController } from "../../pages/homepage/homepage.page.js";
import css_selectors from "../../selectors/css.selectors.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import { handleElementActiveState } from "../../utils/active-state.js";

document.addEventListener("DOMContentLoaded", ClientController);

function ClientController() {
      handleElementActiveState(`.${css_selectors.sidebar.sidebar_item}`);
      loadPageContent();
}

export function loadPageContent() {
      spa_renderHTML.loadContentFromUrl(ClientPages.HOMEPAGE, ElementsId.PAGECONTENT, HomePageController);
}



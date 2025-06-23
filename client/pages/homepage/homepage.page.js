import ClientSections from "../../constants/client-sections.constant.js";
import ElementsId from "../../constants/element-id.constant.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import { TagsSectionController } from "../../sections/tags/tags.section.js";
import activeState_utils from "../../utils/active-state.js";
import videoPagination_section from "../../sections/pagined-videos/pagined-videos.section.js";

export function HomePageController() {
      spa_renderHTML.loadContentFromUrl(ClientSections.TAGS, ElementsId.TAGSECTION, TagsSectionController);
      spa_renderHTML.loadContentFromUrl(
            ClientSections.NEWVIDEOS, 
            ElementsId.NEWVIDEOSECTION, 
            () => videoPagination_section.PaginedVideosSectionController('pagined-videos') 
      );
      activeState_utils.InitializeActiveState('sidebar-item', (activatedSidebar) => {
            HandleActiveSidebar(activatedSidebar);
      });
}

async function HandleActiveSidebar(selected_sidebar) {
      
}



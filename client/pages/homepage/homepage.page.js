import ClientSections from "../../constants/client-sections.constant.js";
import ElementsId from "../../constants/element-id.constant.js";
import { NewVideosSectionController } from "../../sections/new-videos/new-video.section.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import { TagsSectionController } from "../../sections/tags/tags.section.js";
import activeState_utils from "../../utils/active-state.js";

export function HomePageController() {
      spa_renderHTML.loadContentFromUrl(ClientSections.TAGS, ElementsId.TAGSECTION, TagsSectionController);
      spa_renderHTML.loadContentFromUrl(ClientSections.NEWVIDEOS, ElementsId.NEWVIDEOSECTION, NewVideosSectionController);
      activeState_utils.InitializeActiveState('sidebar-item', (activatedSidebar) => {
            HandleActiveSidebar(activatedSidebar);
      });
}

async function HandleActiveSidebar(selected_sidebar) {
      
}



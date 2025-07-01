import ClientSections from "../../constants/client-sections.constant.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import videoPagination_section from "../pagination-videos/pagination-videos.section.js";

export function HomepageVideosSectionController() {
      spa_renderHTML.loadContentFromUrl(
            ClientSections.PAGINATE_VIDEOS,
            'paginated-homepage-videos',
            () => videoPagination_section.PaginedVideosSectionController('videos-pagination_section')
      );
}
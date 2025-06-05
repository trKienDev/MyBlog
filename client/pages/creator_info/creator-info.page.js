import creator_api from "../../api/creator.api.js";
import { video_api } from "../../api/video.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import date_utils from "../../utils/date.utils.js";

export async function creatorInforController(creator_id) {
      const creator = await creator_api.getCreatorById(creator_id);

      const videosByCreator = await video_api.getVideosByCreatorId(creator_id);

      const creatorVideos_section = document.getElementById('creator-videos_section');
      
      populateCreatorAvatar(creator_id);
      populateCreatorBio(creator_id);
}

async function populateCreatorAvatar(creator_id) {
      const creatorAvatar_div = document.getElementById('creator-avatar');
      const creatorAvatar_image = await images_component.createImgFromApi({
            api_function: creator_api.getCreatorImg,
            id: creator_id,
            upload_path: ServerFolders.CREATOR_AVATARS,
            css_class: 'creator-avatar',
      })
      creatorAvatar_div.appendChild(creatorAvatar_image);
}

async function populateCreatorBio(creator_id) {
      const creator_bio = await creator_api.getCreatorById(creator_id);

      const creatorName_div = document.getElementById('creator-name');
      const creatorName_span = doms_component.createSpan({
            text: creator_bio.name,
            css_class: 'creator-name',
      });
      creatorName_div.appendChild(creatorName_span);

      const creator_birth = date_utils.getDateFromStr(new Date(creator_bio.birth));
      const creatorBirth_div = document.getElementById('creator-birth');
      const creatorBirth_span = doms_component.createSpan({
            text: creator_birth,
            css_class: 'creator-birth',
      });
      creatorBirth_div.appendChild(creatorBirth_span);

      const creatorYearsOld_div = document.getElementById('creator_years-old');
      const creator_yearsold = parseInt(creator_birth.split('-')[2], 10);
      const creator_age = date_utils.calculateAgeFromBirth(creator_yearsold);
      const creatorYearsOld_span = doms_component.createSpan({
            text: creator_age,
            css_class: 'creator-years_old',
      });
      creatorYearsOld_div.appendChild(creatorYearsOld_span);

}
import creator_api from "../../api/creator.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";

export async function HomePageCreatorsSectionController() {      
      const homepageCreators_section = document.getElementById('homepage-creators_section');
      const homepageCreatorsSection_container = homepageCreators_section.querySelector('.homepage_creator-section_wrapper');

      const creators = await creator_api.getCreators();
      creators.forEach(async (creator) => {
            const creator_wrapper = doms_component.createDiv('creator-wrapper');
            const creator_avatar = await images_component.createCreatorAvatar(creator._id);
            creator_wrapper.appendChild(creator_avatar);
            const creator_name = doms_component.createDiv('creator-name', creator.name);
            creator_wrapper.appendChild(creator_name);
            homepageCreatorsSection_container.appendChild(creator_wrapper);
      });
}
import { studio_api } from "../../api/studio.api.js";
import doms_component from "../../components/doms.component.js";

export async function StudiosSectionController() {
      const listStudios_section = document.getElementById('list-studios_section'),
      listStudiosSection_wrapper = listStudios_section.querySelector('.list-studios_section-wrapper');
      listStudiosSection_wrapper.innerHTML = '';
      
      const studios = await studio_api.GetStudios();
      studios.forEach(studio => {
            const studio_div = CreateStudioElement(studio);
            listStudiosSection_wrapper.appendChild(studio_div);   
      });

}

function CreateStudioElement(studio) {
      const studio_div = doms_component.createDiv('studio-container');
      const studio_ahref = doms_component.createAhref({
            href: `studio/#id=${studio._id}`,
            text: studio.name,
            css_class: 'studio-link',
      });
      studio_div.appendChild(studio_ahref);

      return studio_div;
}
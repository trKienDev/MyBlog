import collection_api from "../../api/collection.api.js";
import doms_component from "../../components/doms.component.js";

export async function HomepageCollectionSectionController() {
      const homepageCollections_section = document.getElementById('homepage_collections-section');
      const homepageCollectionsSection_container = homepageCollections_section.querySelector('.section-wrapper');
      homepageCollectionsSection_container.innerHTML = '';

      const collections = await collection_api.GetCollections();
      collections.forEach(collection => {
            const collection_div = doms_component.createDiv('collection-wrapper');
            collection_div.classList.add('tag-item');
            const collection_ahref = doms_component.createAhref({
                  href: `collection/#id=${collection._id}`,
                  text: collection.name,
                  css_class: 'collection-link',
            });
            collection_ahref.classList.add('tag-link');     
            collection_div.appendChild(collection_ahref);
            homepageCollectionsSection_container.appendChild(collection_div);
      });
}
import collection_api from "../../api/collection.api.js";
import { film_api } from "../../api/film.api.js";
import doms_component from "../../components/doms.component.js";
import film_component from "../../components/films.component.js";

export async function CollectionInforPageController(collection_id) {
      const films = await film_api.GetFilmsByCollectionId(collection_id);
      console.log('films: ', films);

      const collectionFilms_div = document.getElementById('collection-films');
      PopulateCollectionName(collection_id, 'collection-name');
      films.forEach(film => {
            const film_article = film_component.CreateFilmThumbnailFrame(film);
            collectionFilms_div.appendChild(film_article);
      });
}

async function PopulateCollectionName(collection_id, element_id) {
      const collection_name = await collection_api.getCollectionName(collection_id);
      const collectionName_div = document.getElementById(element_id);
      const collectionName_h3 = doms_component.createH3(collection_name, 'collection-name');
      collectionName_div.appendChild(collectionName_h3);
}
import { api_user } from "../../api/endpoint.api.js";
import images_component from "../../components/image.component.js";
import selectSearch_component from "../../components/select-search.component.js";

export function AdminImageController() {
      selectSearch_component.initSelectSearch('image-tag', api_user.getTagsByImages, 'name');
      selectSearch_component.initSelectSearch('image-idol', api_user.getAllIdols, 'name');
      images_component.HandleImageUpload("image-img", "image-input");
}
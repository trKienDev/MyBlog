import tag_api from "../../api/tag.api.js";

export async function initTagSection() {
      const tags = await tag_api.getTags();
}
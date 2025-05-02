import api_configs from "../api/api.config.js";

async function getImgSourceFromApi(apiFn, id, upload_path, file_name) {
      const image = await apiFn(id);
      const img_src = `${api_configs.server}/uploads/${upload_path}/${file_name}`;
      return img_src;
}

const image_utils = {
      getImgSourceFromApi,
};
export default image_utils;
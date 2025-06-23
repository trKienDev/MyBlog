import api_configs from "./api.config.js";
import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function getVideoById(id) {
      const result = await fetch_api.apiGet(`${api_user.getVideoById}/${id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}

async function getVideos() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getVideos);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

/**
 * Gọi API để lấy danh sách video có phân trang.
 * @param {object} params - Một object chứa page và limit.
 * @param {number} params.page - Trang hiện tại cần lấy.
 * @param {number} params.limit - Số lượng video trên mỗi trang.
 * @param {IVideoFilters} params.filters - Đối tượng chứa các bộ lọc
 * @returns {Promise<object>} - Toàn bộ object kết quả trả về từ server, 
 * bao gồm { success, data, pagination }.
 */
async function GetVideosPaginated({ page, limit, filters = {} }) {
      const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
      });
      for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null) {
                params.append(key, value);
            }
      }

      const enpoint = api_user.GetPaginatedVideos;
      
      const url = `${enpoint}?${params.toString()}`; 
      console.log("Đang gọi API tới:", url); // Log lại để debug
      const result = await  fetch_api.apiGet(url);
      if(!result || result.success === false) throw new Error(result.error);

      return result.data;
}

async function getVideosByCreatorId(creator_id) {
      const result = await fetch_api.apiGet(`${api_user.getVideosByCreatorId}/${creator_id}`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

async function getVideoFilePath(id) {
      const result = await getVideoById(id);
      if(result.success === false) throw new Error(result.error);
      return result.file_path;
}

async function getVideoName(id) {
      const result = await getVideoById(id);
      if(result.success === false) throw new Error(result.error);
      return result.name;
}

async function GetFilmIdFromVideo(id) {
      const result = await getVideoById(id);
      if(result.success === false) throw new Error(result.error);
      return result.film_id;
}

async function updateVideo(video_id, form_data) {
      const result = await fetch_api.updateForm(`${api_configs.endpoints.updateVideo}/${video_id}`, form_data);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

async function increaseVideoViewsByOne(video_id) {
      const result = await fetch_api.updateJson(`${api_user.increaseVideoViewsByOne}/${video_id}`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

async function increaseVideoLikeByOne(video_id) {
      const result = await fetch_api.updateJson(`/video/${video_id}/like`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

export const video_api = {
      getVideos,
      GetVideosPaginated,
      getVideoById,
      getVideoName,
      getVideosByCreatorId,
      getVideoFilePath,
      GetFilmIdFromVideo,
      updateVideo,
      increaseVideoViewsByOne,
      increaseVideoLikeByOne,
}
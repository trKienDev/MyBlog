import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllShorts() {
      const result = await fetch_api.apiGet(api_user.getAllShorts);
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
async function GetShortsPaginated({ page, limit, filters = {} }) {
      const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
      });
      for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null) {
                params.append(key, value);
            }
      }

      const enpoint = api_user.GetPaginatedShort;
      
      const url = `${enpoint}?${params.toString()}`; 
      console.log("Đang gọi API tới:", url); // Log lại để debug
      const result = await  fetch_api.apiGet(url);
      if(!result || result.success === false) throw new Error(result.error);

      return result.data;
}

const short_api = {
      GetAllShorts,
      GetShortsPaginated,
}
export default short_api;
import code_api from "../../api/code.api.js";
import { api_admin, api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import records_api from "../../api/record.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";

export async function AdminRecordController() {
      NavigateAdminRecordMenu();
      const codes = await code_api.GetAllCodes();
      selectSearch_component.initSelectSearch('record-code', api_user.getCodes, 'code');
      selectSearch_component.initSelectSearch('record-creator', api_user.getCreators, 'name');
      selectSearch_component.initSelectSearch('record-idol', api_user.getAllIdols, 'name');
      selectSearch_component.initSelectSearch('record-studio', api_user.GetStudios, 'name');
      selectSearch_component.initSelectSearch('record-tag', api_user.getTagsByFilm, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'record-tag');

      const add_record_infor_btn = document.getElementById('add-record-infor_btn');
      add_record_infor_btn.addEventListener('click', async (event) => {
            CreateRecord(event);
      });

      try {
            const records = await records_api.GetAllRecords();
            console.log('records: ', records);
      } catch(error) {
            console.error('Error getting records: ', error);
            showToast(error, 'error');
      }
}

function NavigateAdminRecordMenu() {
      const record_infor_section = document.getElementById('admin-record-info');
      const record_clips_section = document.getElementById('admin-record-clips');

      const admin_records_link = document.querySelector('a[href=admin-records]');
      const admin_clips_link = document.querySelector('a[href=admin-clips]');

      // admin-records
      admin_records_link.addEventListener('click', event => {
            event.preventDefault();
            record_infor_section.style.display = 'block';
            record_clips_section.style.display = 'none';

            // Cập nhật trạng thái active cho link (tùy chọn)
            admin_records_link.classList.add('active');
            admin_clips_link.classList.remove('active');
      });

      // admin-clips
      admin_clips_link.addEventListener('click', event => {
            event.preventDefault();
            record_clips_section.style.display = 'block';
            record_infor_section.style.display = 'none';

            // Cập nhật trạng thái active cho link (tùy chọn)
            admin_clips_link.classList.add('active');
            admin_records_link.classList.remove('active');
      });
}

async function AdminRecordInforController() {
      alert('run');
      
      
}

async function CreateRecord(event) {
      event.preventDefault();
      const code_id = selectSearch_component.getSelectedOptionValue('record-code', 'id');
      const code_number = document.getElementById('record-number').value;
      const record_code = selectSearch_component.getSelectedOptionValue('record-code', 'text');
      const record_name = record_code + '-' + code_number;
      const creator_id = selectSearch_component.getSelectedOptionValue('record-creator', 'id');
      const idol_id = selectSearch_component.getSelectedOptionValue('record-idol', 'id');
      const record_rating = document.getElementById('record-rating').value;
      const studio_id = selectSearch_component.getSelectedOptionValue('record-studio', 'id');
      const record_description = document.getElementById('record-description').value;
      const record_tags = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      if(creator_id && idol_id) {
            showToast('1 creator or 1 idol', 'warning');
            return;
      }

      const record_data = {
            record_name: record_name,
            code_id: code_id,
            creator_id: creator_id,
            idol_id: idol_id,
            record_rating: record_rating,
            studio_id: studio_id,
            record_description: record_description,
            record_tags: record_tags,
      };

      console.log('record_data: ', record_data);

      try {
            const response = await fetch_api.createJson(api_admin.createRecord, record_data);
            if(response.success === false) throw new Error(response.error);

            showToast('record created', 'success');
      } catch(error) {
            console.error('Error creating record: ', error);
            showToast(error, 'error');
      }
}
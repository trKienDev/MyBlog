import code_api from "../../api/code.api.js";
import { api_user } from "../../api/endpoint.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_class from "../../constants/css.constant.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import tags_utils from "../../utils/tags.utils.js";

export async function AdminRecordController() {
      NavigateAdminRecordMenu();
      const codes = await code_api.GetAllCodes();
      console.log('codes: ', codes);
      selectSearch_component.initSelectSearch('record-code', api_user.getCodes, 'code');
      selectSearch_component.initSelectSearch('record-creator', api_user.getCreators, 'name');
      selectSearch_component.initSelectSearch('record-idol', api_user.getAllIdols, 'name');
      selectSearch_component.initSelectSearch('record-studio', api_user.GetStudios, 'name');
      selectSearch_component.initSelectSearch('record-tag', api_user.getTagsByFilm, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'record-tag');

      const add_record_infor_btn = document.getElementById('add-record-infor_btn');
      add_record_infor_btn.addEventListener('click', async (event) => {
            event.preventDefault();
            const code_id = selectSearch_component.getSelectedOptionValue('record-code', 'id');
            const code_number = document.getElementById('record-number').value;
            const record_code = selectSearch_component.getSelectedOptionValue('record-code', 'text');
            console.log('record code: ', record_code);
      });
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

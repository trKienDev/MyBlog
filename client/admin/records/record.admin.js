import album_api from "../../api/album.api.js";
import code_api from "../../api/code.api.js";
import { api_admin, api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import records_api from "../../api/record.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import file_utils from "../../utils/file.utils.js";
import string_utils from "../../utils/string.utils.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";
import video_utils from "../../utils/video.utils.js";

export async function AdminRecordController() {
      NavigateAdminRecordMenu();
      const codes = await code_api.GetAllCodes();
      selectSearch_component.initSelectSearch('record-code', api_user.getCodes, 'code');
      selectSearch_component.initSelectSearch('record-creator', api_user.getCreators, 'name');
      selectSearch_component.initSelectSearch('record-idol', api_user.getAllIdols, 'name');
      selectSearch_component.initSelectSearch('record-studio', api_user.GetStudios, 'name');
      selectSearch_component.initSelectSearch('record-tag', api_user.getTagsByFilm, 'name');
      tags_utils.displaySelectedTag('selected-record-tags_container', css_selectors.tags.selected_tag, 'record-tag');
      const add_record_infor_btn = document.getElementById('add-record-infor_btn');
      add_record_infor_btn.addEventListener('click', async (event) => {
            CreateRecord(event);
      });

      selectSearch_component.initSelectSearch('clip-record', api_user.getAllRecords, 'name');
      selectSearch_component.initSelectSearch('clip-action', api_user.getTagsByAction, 'name');
      selectSearch_component.initSelectSearch('clip-tags', api_user.getTagsByVideo, 'name');
      tags_utils.displaySelectedTag('selected-clip-tags_container', css_selectors.tags.selected_tag, 'clip-tags');
      AwaitUploadClip(); 
      const add_clip_btn = document.getElementById('add-clip_btn');
      add_clip_btn.addEventListener('click', async(event) => {
            CreateClip(event);
      });

      const add_album_btn = document.getElementById('add-album_btn');
      add_album_btn.addEventListener('click', async(event) => {
            CreateAlbum(event);
      });
}

function NavigateAdminRecordMenu() {
      const record_infor_section = document.getElementById('admin-record-info');
      const record_clips_section = document.getElementById('admin-record-clips');
      const record_albums_section = document.getElementById('admin-record-albums');

      const admin_records_link = document.querySelector('a[href=admin-records]');
      const admin_clips_link = document.querySelector('a[href=admin-clips]');
      const admin_albums_link = document.querySelector('a[href=admin-albums]');

      // admin-records
      admin_records_link.addEventListener('click', event => {
            event.preventDefault();
            record_infor_section.style.display = 'block';
            record_clips_section.style.display = 'none';
            record_albums_section.style.display = 'none';

            admin_records_link.classList.add('active');
            admin_clips_link.classList.remove('active');
            admin_albums_link.classList.remove('active');
      });

      // admin-clips
      admin_clips_link.addEventListener('click', event => {
            event.preventDefault();
            record_clips_section.style.display = 'block';
            record_infor_section.style.display = 'none';
            record_albums_section.style.display = 'none';

            admin_clips_link.classList.add('active');
            admin_records_link.classList.remove('active');
            admin_albums_link.classList.remove('active');
      });

      // admin-album
      admin_albums_link.addEventListener('click', async (event) => {
            event.preventDefault();
            record_albums_section.style.display = 'block';
            record_clips_section.style.display = 'none';
            record_infor_section.style.display = 'none';

            admin_albums_link.classList.add('active');
            admin_records_link.classList.remove('active');
            admin_clips_link.classList.remove('active');

            const albums = await album_api.GetAllAlbums();
            console.log('albums: ', albums);
      });
}

// record
async function CreateRecord(event) {
      event.preventDefault();
      const code_id = selectSearch_component.getSelectedOptionValue('record-code', 'id');
      const code_number = document.getElementById('record-number').value;
      const record_code = selectSearch_component.getSelectedOptionValue('record-code', 'text');
      const creator_id = selectSearch_component.getSelectedOptionValue('record-creator', 'id');
      const idol_id = selectSearch_component.getSelectedOptionValue('record-idol', 'id');
      const record_rating = document.getElementById('record-rating').value;
      const studio_id = selectSearch_component.getSelectedOptionValue('record-studio', 'id');
      const record_description = document.getElementById('record-description').value;
      let record_name = record_description;
      const record_tags = tags_utils.getSelectedTags('selected-record-tags_container', css_selectors.tags.selected_tag);

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

      try {
            const response = await fetch_api.createJson(api_admin.createRecord, record_data);
            if(response.success === false) throw new Error(response.error);

            showToast('record created', 'success');
      } catch(error) {
            console.error('Error creating record: ', error);
            showToast(error, 'error');
      }
}
function AwaitUploadClip() {
      const thumbnail = document.getElementById('clip-img');
      const upload_input = document.getElementById('clip-input');
      thumbnail.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', HandleClipUpload);
}

// clip
async function CreateClip(event) {
      event.preventDefault();
      const record_id = selectSearch_component.getSelectedOptionValue('clip-record', 'id');
      const record_info = await records_api.GetRecordById(record_id);
      const action_id = selectSearch_component.getSelectedOptionValue('clip-action', 'id');
      let action_text = selectSearch_component.getSelectedOptionValue('clip-action', 'text');
      action_text = string_utils.replaceSpacesWithUnderscore(action_text);
      const tag_ids = tags_utils.getSelectedTags('selected-clip-tags_container', css_selectors.tags.selected_tag, 'clip-tags');
      let clip_name = record_info.name + '_' + action_text;
      clip_name = string_utils.RemoveAccents(clip_name);

      const clip_file = document.getElementById('clip-input').files[0];
      if(!clip_file) {
            showToast('Please upload a clip before submitting');
            return null;
      }     
      const renamed_clip = file_utils.renameUploadedFile(clip_file, clip_name);

      const create_form = new FormData();
      create_form.append("clip_name", clip_name);
      create_form.append("record_id", record_id);
      create_form.append("action_id", action_id);
      create_form.append("tag_ids", tag_ids);
      create_form.append("file", renamed_clip);

      if(record_info.code_id) create_form.append("code_id", record_info.code_id);
      if(record_info.creator_id) create_form.append("creator_id", record_info.creator_id);
      if(record_info.idol_id) create_form.append("idol_id", record_info.idol_id);
      if(record_info.studio_id) create_form.append("studio_id", record_info.studio_id);
      
      try {
            const response = await fetch_api.createForm(api_admin.createClip, create_form);
            if(response.success === false) throw new Error(response.error);

            showToast('Clip created', 'success');
            ResetClipForm();
      } catch(error) {
            console.error('Error creating clip: ', error);
            showToast(error, 'error');
      }
}
function HandleClipUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'video/mp4') {
            const video_element  = document.querySelector('video');
            const source_element = video_element.querySelector('source');

            const thumbnail_image = document.getElementById('clip-img');

            const video_url = URL.createObjectURL(file);
            source_element.src = video_url;
            video_element.load();
            video_element.classList.remove('d-none');
            thumbnail_image.style.display = 'none';
      } else {
            showToast('Please upload a valid mp4 video', 'error');
      }
}
function ResetClipForm() {
      const clip_thumbnail = document.getElementById('clip-img');
      const clip_input = document.getElementById('clip-input');
      video_utils.ResetVideoPreview(clip_thumbnail, clip_input);

      selectSearch_component.resetSelectSearch([
            { id: 'clip-action', placeholder: "Select action"},
      ]);
}

// album
async function CreateAlbum(event) {
      event.preventDefault();
      const album_name = document.getElementById('album-name').value;
      const data = { name: album_name };

      try {
            const response = await fetch_api.createJson(api_admin.createAlbum, data);
            if(response.success === false) throw new Error(response.error);

            success_sweetAlert('album created');
      } catch(error) {
            console.error('Error creating album: ', error);
            error_sweetAlert(error);
      }
}
function RenderAllAlbums(albums) {
      
}
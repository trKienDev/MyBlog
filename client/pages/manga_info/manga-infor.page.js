import manga_api from "../../api/manga.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import app_configs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import image_utils from "../../utils/image.utils.js";

export async function MangaInforPageController(manga_id) {
      const manga = await manga_api.FindMangaById(manga_id);
            const manga_images_container = document.getElementById('manga-images'); // Đổi tên biến cho rõ ràng

      // 1. Chỉ thêm các phần tử ảnh vào DOM
      manga.image_list.forEach(image_filepath => {
            const image_wrapper = doms_component.createDiv('manga-img_container');
            const image_src = `${app_configs.SERVER}/${ServerFolders.MANGAS}/${manga.manga_folder}/${image_filepath}`;
            const manga_img = images_component.createImg(image_src, 'manga-img');
            image_wrapper.appendChild(manga_img);
            image_utils.addEffectHoverToZoomImage(image_wrapper, manga_img);
            manga_images_container.appendChild(image_wrapper);
      });

    // 2. Dùng imagesLoaded để "lắng nghe"
    // Nó sẽ đợi tất cả thẻ <img> bên trong 'manga_images_container' tải xong
      imagesLoaded( manga_images_container, function() {
            
            // 3. Bây giờ, khi tất cả ảnh đã có kích thước thật, chúng ta mới khởi tạo Masonry
            console.log('Tất cả ảnh đã tải xong! Bắt đầu sắp xếp Masonry.');

            var msnry = new Masonry( manga_images_container, {
                  itemSelector: '.manga-img_container',
                  columnWidth: '.manga-img_container',
                  gutter: 10,
                  percentPosition: true
            });
      });
}
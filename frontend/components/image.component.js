import image_utils from "../utils/image.utils.js";

export function HandleImageUpload(imageElementId, fileInputElementId) {
      const imageElement = document.getElementById(imageElementId);
      const fileInput = document.getElementById(fileInputElementId);

      imageElement.addEventListener("click", function() {
            fileInput.click();
      });

      fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                        imageElement.src = e.target.result; 
                  };
                  reader.readAsDataURL(file);
            }
      });
}

function createImg(img_src, css_class) {
      const image = document.createElement('img');
      image.src = img_src;
      image.classList.add(css_class);
      
      return image;
}

async function createImgFromApi({api_function, id, upload_path, css_class}) {
      const image_source = await image_utils.getImageSourceFromApi(api_function, id, upload_path);
      return createImg(image_source, css_class);
}

const images_component = {
      createImg,
      createImgFromApi,
}
export default images_component;
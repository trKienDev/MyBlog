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
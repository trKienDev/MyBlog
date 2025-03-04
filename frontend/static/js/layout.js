document.addEventListener("DOMContentLoaded", function() {
      fetch("../layout/header.html")
      .then(response => response.text())
      .then(data => {
            document.getElementById("header").innerHTML = data;

            // Chạy các đoạn script trong file header
            const scripts = document.querySelectorAll('#header script');
            scripts.forEach(oldScript => {
                        const newScript = document.createElement('script');
                        newScript.text = oldScript.text;
                        document.head.appendChild(newScript);
            });
      })
      .catch(error => console.error("Error loading header: ", error));
});

// Load phần footer từ file footer.html
document.addEventListener("DOMContentLoaded", function() {
      fetch("../layout/footer.html")
      .then(response => response.text())
      .then(data => {
            document.getElementById("footer").innerHTML = data;
      })
      .catch(error => console.error("Error loading footer: ", error));
});

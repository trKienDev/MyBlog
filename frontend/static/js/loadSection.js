document.addEventListener("DOMContentLoaded", function() {
      // Lấy vùng section "about-us"
      const aboutUsSection = document.getElementById("about-us");
    
      // Fetch file aboutus.html
      fetch("path/to/aboutus.html")
        .then(response => response.text())
        .then(data => {
          // Chèn HTML của aboutus.html vào khu vực #about-us
          aboutUsSection.innerHTML = data;
          
          // Nếu trong aboutus.html có script, cần thủ thuật để đảm bảo script được thực thi:
          const scripts = aboutUsSection.querySelectorAll("script");
          scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.text = oldScript.text;
            // Thêm script vào <head> để chạy
            document.head.appendChild(newScript);
          });
        })
        .catch(error => console.error("Error loading aboutus.html: ", error));
    });
    
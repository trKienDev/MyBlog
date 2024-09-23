var title = document.querySelector('title');
var path = window.location.pathname;

if (path.includes('about')) {
        document.title = 'About Us';
} else if (path.includes('admin')) {
        document.title = 'Admin';
} else {
        document.title = 'My Website';
}


// function handleDOMContentLoaded() {
//         var title = document.querySelector('title');
//         var path = window.location.pathname;
//         console.log(title, path);
//         if (path.includes('index')) {
//                 title.innerText = 'Homepage';
//         } else if (path.includes('about')) {
//                 title.innerText = 'About Us';
//         } else if (path.includes('admin')) {
//                 title.innerText = 'Admin';
//         } else {
//                 title.innerText = 'My Website';
//         }
// }

// // Thêm cơ chế đợi khi toàn bộ document được loading xong thì mới thực hiện DOMContentLoaded.
// if (document.readyState === "loading") {
//         document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
// } else {
//         handleDOMContentLoaded();
// }
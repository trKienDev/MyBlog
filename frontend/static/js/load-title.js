var title = document.querySelector('title');
var path = window.location.pathname;

if (path.includes('about')) {
        document.title = 'About Us';
} else if (path.includes('admin')) {
        document.title = 'Admin';
} else {
        document.title = 'My Website';
}
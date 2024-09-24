**Question** : 

tôi muốn khi user click vào thẻ a href=" admin/pages/setting" thì thẻ h1 của file setting.html sẽ được tải và thêm vào thẻ main id="dynamic-data"của file index.html

**Answer** : 

To achieve this behavior, you need to modify the index html file's JavaScript so that when the user clicks the link (the <a href="/admin/pages/setting"> element), the contents of the setting.html file are loaded and dynamically inserted into the <main id="dynamic-data"> element.

# Step
1. Prevent default action of the link:  The click event should not trigger a page refresh but instead load the content dynamically.
2. Fetch the setting.html content
3. Insert the fetched content into the main element

# Modified Code for index.html
1. **HTML** : No changes needed to the HTML structure.
2. **JavaScript** : update the *loadContent* function to handle the click event on the **Setting** link and dynamically load the content of **setting.html**

```Javascript
<script>
    document.addEventListener("DOMContentLoaded", function () {
        // Get the link to the settings page
        const settingsLink = document.querySelector('a[href="/admin/pages/setting"]');

        // Add an event listener to the link
        settingsLink.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default link behavior

            // Fetch the settings page content
            loadContent("/admin/pages/setting.html"); // Update with the actual path to the settings file
        });

        // Function to load content dynamically
        function loadContent(url) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch page: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Insert the HTML into the dynamic-data element
                    const dynamicDataElement = document.getElementById('dynamic-data');
                    dynamicDataElement.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading content', error);
                });
        }
    });
</script>
````

# Explanation
1. **Event Listener** 
The script waits for the page to load, then attaches a click event listener to the "Settings" link (<a href="/admin/pages/setting">). This prevents the default action (navigating to the page) and instead triggers the custom function.

2. **Fetching setting.html**
When the link is clicked, the loadContent function fetches the HTML content from /admin/pages/setting.html (make sure this path is correct).

3. **Inserting HTML**
The fetched content (setting.html) is inserted into the <main id="dynamic-data"> element, replacing its previous contents.

This way, when the user clicks on the "Settings" link, the content of setting.html (in this case, the <h1>Settings</h1> tag) will be loaded into the main element of index.html without reloading the entire page.
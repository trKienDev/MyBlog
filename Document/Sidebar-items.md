❓ **Question**: 

các menu-item bao gồm có icon và tên, tôi muốn lưu các mục này vào database thông qua mongoose đã khai báo ở thư mục backend và thư mục frontend sẽ gọi api để lấy dữ liệu và trình bày ra trang index.html.

bạn hãy tư vấn cho tôi công nghệ và các hướng để đáp ứng yêu cầu trên?

💡 **Solution**: 

To achieve your goal of storing the Sidebar-item data (icon and name) in a database, and then fetching it via an API and rendering it dynamically on the frontend, you can follow these steps. 

Below are the key technologies and an approach for the backend and frontend to meet this requirement.

# **1. Backend Setup with Mongoose and API Endpoints**
## Step 1: Define a Mongoose Model for Sidebar-item
In the 📁 **backend/src/Admin/models** directory, create a new Mongoose model for the menu items.

For example, 📄 **sidebar-item.model.ts**:

```typescript
import mongoose, { Schema, Document } from "mongoose";

interface ISidebarItem extends Document {
        icon: string;
        name: string;
}

const SidebarItemSchema: Schema = new Schema({
        icon: { type: String, required: true },
        name: { type: String, required: true }
}, { collection: 'SidebarItems' });  // Specify custom collection name

const SidebarItem = mongoose.model<ISidebarItem>('SidebarItem', SidebarItemSchema);
export default SidebarItem;

```

## Step 2: Create a Controller to Handle API Logic
In 📁 **backend/src/Admin/Controllers** / 📄 **sidebar.controller.ts**, create a controller to handle API logic for fetching and adding menu items.

```typescript
export const getSidebarItems = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const sidebarItems = await SidebarItem.find(); // Lấy dữ liệu từ MongoDB
                
                res.statusCode = 200; // Set the status 
                res.setHeader('Content-Type',  'application/json'); // Set the content-type header to JSON
                res.end(JSON.stringify(sidebarItems)); // Send the response as JSON string
        } catch(error) {
                // Handle errors, set status code to 500 for server error
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');

                res.end(JSON.stringify({ message: 'Server Error', error })); // Send the error message
        }
};
```

## Step 3: Define Routes for Menu Item API
In 📁 **backend/src/routes** / 📄 **admin.route.ts**, set up the routes for fetching and adding menu items:

```typescript
import express from 'express';
import { getMenuItems, createMenuItem } from '../controllers/menu.controller';

const router = express.Router();

// Get all menu items
router.get('/menu-items', getMenuItems);

// Create a new menu item
router.post('/menu-items', createMenuItem);

export default router;
```

# **2. Frontend Setup for Fetching and Rendering Data**

## Step 1: Use Axios to Fetch Data from the Backend

In your 📁 **frontend/admin/services** / 📄 **apiService.js**, use Axios to fetch the menu items from the backend API:

```typescript
Promise.all([
        fetch(`${config.domain}${config.endpoints.adminPage}`),
        fetch(`${config.domain}${config.endpoints.sidebarList}`)
])
.then(response => {
        // Kiểm tra xem cả 2 phản hồi có thành công ?
        const [adminPageResponse, sidebarListResponse] = response;
        if(!adminPageResponse.ok) {
                throw new Error(`HTTP error! Status: ${adminPageResponse.status}`);
        }
        if(!sidebarListResponse.ok) {
                throw new Error(`HTTP error! Status: ${sidebarListResponse.status}`);
        }
        // Trả về kết quả JSON của cả 2
        return Promise.all([adminPageResponse.json(), sidebarListResponse.json()]);
})
.then(([adminPageData, sidebarItems]) => {
        // Xử lý dữ liệu từ adminPage
        // ................................................

        // Render sidebar items ra giao diện
        const menuList = document.getElementById('menu-list');
        
        sidebarItems.forEach(item => {
                console.log(item);
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');

                const menuItemIcon = document.createElement('div');
                menuItemIcon.classList.add('menu-item-icon');
                const iconElement = document.createElement('i');
                iconElement.className = item.icon; // gán class icon từ API
                menuItemIcon.appendChild(iconElement);

                const menuItemName = document.createElement('div');
                menuItemName.classList.add('menu-item-name');
                const nameElement = document.createElement('span');
                nameElement.textContent = item.name;
                menuItemName.appendChild(nameElement);

                menuItem.appendChild(menuItemIcon);
                menuItem.appendChild(menuItemName);

                menuList.appendChild(menuItem);
        });
})
.catch(error => {
        console.error('Error fetching data', error);
})
```

## Step 2: Modify the HTML File to Include the Sidebar and Axios
Ensure your 📄 **index.html** has an empty sidebar div where the menu will be rendered:

```html
<div id="sidebar"></div>

Also, include Axios for making the HTTP requests:

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="../static/js/layout.js"></script>
```

# **3. Testing and Deployment**
## 1. Testing the API:
Use Postman or another tool to manually test your API. Ensure you can create and fetch menu items via POST and GET requests respectively.
## 2. Frontend Testing:
Run your backend server and open the admin index.html. The JavaScript should call the backend API and dynamically render the menu-item components into the sidebar.
## 3. Deployment:
- For production, you might need to bundle your frontend and backend together using a tool like Webpack or Gulp.
- You can host the backend on a service like Heroku or a cloud provider, and use MongoDB Atlas as your database.

# **4. Hướng dẫn cách test API trên Postman:**
## 1. Method:
Ensure you have selected the POST method from the dropdown menu 
## 2. URL
Make sure the URL is set correctly to localhost:3000/admin/sidebar/edit
## 3. Headers
- Go to the Headers tab
- Add a new header with deatail:
    * Key: Content-Type
    * Value: application/json
      
## 4. Body
- Go to the Body tab below the URL input field
- Select raw as the input type
- In the dropdown next to raw --> select JSON
- In the raw text area, enter JSON payload:

{
  "icon": "icon-class",
  "name": "Menu Item Name"
}

## 5. Send the Request

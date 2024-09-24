❓ **Question**: 

các menu-item bao gồm có icon và tên, tôi muốn lưu các mục này vào database thông qua mongoose đã khai báo ở thư mục backend và thư mục frontend sẽ gọi api để lấy dữ liệu và trình bày ra trang index.html.

bạn hãy tư vấn cho tôi công nghệ và các hướng để đáp ứng yêu cầu trên?

💡 **Solution**: 

To achieve your goal of storing the menu-item data (icon and name) in a database, and then fetching it via an API and rendering it dynamically on the frontend, you can follow these steps. 

Below are the key technologies and an approach for the backend and frontend to meet this requirement.

# **1. Backend Setup with Mongoose and API Endpoints**
## Step 1: Define a Mongoose Model for menu-item
In the *backend/src/models* directory, create a new Mongoose model for the menu items, for example, menu.model.ts:

```typescript
import mongoose, { Schema, Document } from 'mongoose';

// Define the MenuItem interface
interface IMenuItem extends Document {
    icon: string;
    name: string;
}

// Define the MenuItem schema
const MenuItemSchema: Schema = new Schema({
    icon: { type: String, required: true },
    name: { type: String, required: true },
});

// Export the MenuItem model
const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
export default MenuItem;
```

## Step 2: Create a Controller to Handle API Logic
In backend/src/controllers/menu.controller.ts, create a controller to handle API logic for fetching and adding menu items.

```typescript
import { Request, Response } from 'express';
import MenuItem from '../models/menu.model';

// Fetch all menu items
export const getMenuItems = async (req: Request, res: Response) => {
    try {
        const menuItems = await MenuItem.find(); // Fetch from MongoDB
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Add a new menu item
export const createMenuItem = async (req: Request, res: Response) => {
    const { icon, name } = req.body;
    try {
        const newMenuItem = new MenuItem({ icon, name });
        await newMenuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating menu item', error });
    }
};
```

## Step 3: Define Routes for Menu Item API
In backend/src/routes/menu.route.ts, set up the routes for fetching and adding menu items:

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

## Step 4: Integrate the Routes into the Backend
In your main server file (likely server.ts), make sure to include the new route:

```typescript
import express from 'express';
import menuRoutes from './routes/menu.route';

const app = express();
app.use(express.json());

// Add the menu route
app.use('/api', menuRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

# **2. Frontend Setup for Fetching and Rendering Data**
## Step 1: Use Axios to Fetch Data from the Backend

In your frontend/admin/static/js/layout.js (or another suitable JavaScript file), use Axios to fetch the menu items from the backend API:

```typescript
// Fetch and render the menu items
const loadMenuItems = async () => {
    try {
        const response = await axios.get('/api/menu-items'); // Call to the API
        const menuItems = response.data;

        // Render the menu items into the sidebar
        const sidebar = document.getElementById('sidebar');
        menuItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');

            const iconDiv = document.createElement('div');
            iconDiv.classList.add('menu-item-icon');
            iconDiv.innerHTML = `<i class="${item.icon}"></i>`;

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('menu-item-name');
            nameDiv.innerHTML = `<span>${item.name}</span>`;

            menuItemDiv.appendChild(iconDiv);
            menuItemDiv.appendChild(nameDiv);
            sidebar.appendChild(menuItemDiv);
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
};

// Call the function on page load
window.onload = loadMenuItems;
```

## Step 2: Modify the HTML File to Include the Sidebar and Axios
Ensure your index.html has an empty sidebar div where the menu will be rendered:

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

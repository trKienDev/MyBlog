import mongoose, { Schema, Document } from "mongoose";

// Định nghĩa interface cho Sidebar Item
interface ISidebarItem extends Document {
        icon: string;
        name: string;
}

// Định nghĩa schema cho SidebarItem
const SidebarItemSchema: Schema = new Schema({
        icon: { type: String, required: true },
        name: { type: String, required: true }
}, { collection: 'SidebarItems' });  // Specify custom collection name

// export model SidebarItem
const SidebarItem = mongoose.model<ISidebarItem>('SidebarItem', SidebarItemSchema);
export default SidebarItem;



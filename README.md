��#   M y B l o g 
 
How to start server: 

- Backend: npm start.

- Frontend: http-server.
 
20/09/2024: update title - header.html.

02/01/2024:
- add videoState in handleEdit:
  _ dễ dàng quản lý hơn các list_videoAdded và list_videoDeleted.

  
- 6. Thay thế forEach bằng for...of trong các hàm async
  Trong các hàm async, nếu dùng forEach, các lệnh async có thể không chạy tuần tự. Nên dùng for...of:

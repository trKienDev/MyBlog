export function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');

      const existingToast = container.querySelector('.toast');
      if (existingToast) {
            existingToast.remove();
      }

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      const icon = getToastIcon(type); 
      const text = document.createElement('span');
      text.textContent = message;

      toast.appendChild(icon);
      toast.appendChild(text);
      container.appendChild(toast);

      setTimeout(() => {
            toast.remove();
      }, 3000);
}
  
function getToastIcon(type) {
      const icon = document.createElement('i');
      icon.classList.add('toast-icon');
  
      switch (type) {
            case 'success':
                  icon.classList.add('fa-solid', 'fa-circle-check'); 
                  break;
            case 'warning':
                  icon.classList.add('fa-solid', 'fa-triangle-exclamation'); 
                  break;
            case 'error':
                  icon.classList.add('fa-solid', 'fa-circle-xmark'); 
                  break;
            case 'info':
            default:
                  icon.classList.add('fa-solid', 'fa-circle-info'); 
                  break;
      }
      return icon;
  }
  
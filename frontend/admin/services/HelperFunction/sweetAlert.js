export function confirmSweetAlert(text, confirmCallback) {
        Swal.fire({
                title: 'Are you sure ?',
                text: text,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#007bff',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
        }).then((result) => {
                if(result.isConfirmed) {
                        confirmCallback();
                }
        });
}

export function showToastNotification() {
        Swal.fire({
                toast: true,                
                position: 'top-end',       
                icon: 'success',         
                title: 'success !', 
                showConfirmButton: false, 
                timer: 3000,      
                timerProgressBar: true,     
                customClass: {
                        popup: 'custom-toast',
                        timerProgressBar: 'toast-progress-bar',
                        icon: 'toast-icon', 
                }
        });
}
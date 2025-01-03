export function successSweetAlert(text) {
        Swal.fire({
                title: 'Success!',
                text: text,
                icon: 'success',
                confirmButtonTest: 'OK',
                confirmButtonColor: '#61b939',
        });
}

export function errorSweetAlert(text) {
        Swal.fire({
                title: 'Error!',
                text: text,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#c82333',
        });
}

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

export function showToastNotification(status, notification) {
        let toastColor = '';
        if(status === "success") {
                toastColor = 'success-toast';
        } else if(status === "fail") {
                toastColor = 'fail-toast'; 
        }
        Swal.fire({
                toast: true,         
                position: 'top-end',       
                title: notification, 
                showConfirmButton: false, 
                timer: 3000,      
                timerProgressBar: true,     
                customClass: {
                        popup: `custom-toast ${toastColor}`,
                        timerProgressBar: 'toast-progress-bar',
                }
        });
}
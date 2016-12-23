require('jquery');
require('bootstrap-sass');
require('toastr');

toastr.options = {
    positionClass: "toast-top-center",
    closeButton: true
}

$('#hello').html('Hello from jQuery!');
toastr.success('Hello from toastr!');

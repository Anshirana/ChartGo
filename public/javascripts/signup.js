$(document).ready(function () {
    // Disable form submissions if there are invalid fields
    (function () {
        'use strict';
        window.addEventListener('load', function () {
            // Get the forms we want to add validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    })();

    $('#signup-form').validate({
        rules: {
            'password': {
                regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
            },
            'password2': {
                equalTo: "#password"
            },
        },
        messages: {
            'password': {
                regex: "Must have 1 uppercase and lowercase, 1 Special character and Minimum 8 characters"
            },
            'password2': {
                equalTo: "Password didn't match"
            },
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorPlacement: function (error, element) {
            $(element).next().append(error);
        }
    });
    // message close
    $(".message .close").on("click", function () {
        $(this).closest(".message").transition("fade");
    });

});
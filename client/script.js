$(document).ready(function() {
    // I want to get the form element
    const form = $('#contact-form');
    const success = $('#success');
    const errorMessage = $('#msg');
    let isAjaxSuccess = false;

    success.hide();

    // Add an event listener to the form
    form.on('submit', function(e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Validate the form
        validateForm();

        // Get the form data at the time of submission
        const formData = form.serialize();

        // Set the URL for the AJAX request
        const formAction = 'http://localhost:8080/api/contact';

        // Send the form data to the server
        $.ajax({
            url: formAction,
            method: 'POST',
            data: formData,
            success: function(data, textStatus, xhr) {
                if (xhr.status === 200) {
                    isAjaxSuccess = true;
                    errorMessage.text('');


                    // Clear the form fields upon successful submission
                    form.trigger('reset');

                    // Hide the form and display the success message
                    form.hide();
                    success.show();

                } else if (xhr.status === 400) {
                    errorMessage.text(data.msg);
                }
            },
            error: function(xhr, textStatus, err) {
                errorMessage.text('Something went wrong. Please try again later.');
            }
        });

    });

    $('#name, #email, #message').on('input', function() {
        if (isAjaxSuccess) {
            errorMessage.text('');
            isAjaxSuccess = false;
        }
    });

});

// function to validate form
function validateForm() {
    // get form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // check if form values are empty
    if (!name || !email || !message) {
        $('#msg').text('Please fill out all missing fields');
        return false;
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        $('#msg').text('Please enter a valid email address');
        return false;
    }

}
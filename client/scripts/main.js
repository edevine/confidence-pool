document.addEventListener('DOMContentLoaded', function (event) {
    var loginDialog = document.getElementById('login-dialog');
    var loginForm = document.getElementById('login-form');
    var signinButton = document.querySelector('.sign-in');

    loginDialog.style.removeProperty('display');
    loginDialog.className = 'opening';

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        signinButton.disabled = true;
        loginDialog.className = '';

        var fields = event.target.querySelectorAll('input');
        var data = '';
        for (var i = 0; i < fields.length; i++) {
            data += (i > 0 ? '&' : '')
                + encodeURIComponent(fields[i].name).replace(/%20/g, '+')
                + '=' + encodeURIComponent(fields[i].value).replace(/%20/g, '+');
        }

        var request = new XMLHttpRequest();
        request.onload = function (event) {
            signinButton.disabled = false;
            if (request.status === 200) {
                loginDialog.className = 'closed';
                setTimeout(function() {
                    loginDialog.style.setProperty('display', 'none');
                }, 250);
            } else {
                loginDialog.className = 'failed';
            }
        };
        request.open(event.target.method.toUpperCase(), event.target.action);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(data);

    });

});

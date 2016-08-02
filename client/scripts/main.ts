document.addEventListener('DOMContentLoaded', function (event) {
    const loginDialog = <HTMLElement>document.getElementById('login-dialog');
    const loginForm = <HTMLFormElement>document.getElementById('login-form');
    const signinButton = <HTMLButtonElement>document.querySelector('.sign-in');

    loginDialog.style.removeProperty('display');
    loginDialog.className = 'opening';

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        signinButton.disabled = true;
        loginDialog.className = '';

        const fields = loginForm.querySelectorAll('input');
        let data = '';
        for (let i = 0; i < fields.length; i++) {
            data += (i > 0 ? '&' : '')
                + encodeURIComponent(fields[i].name).replace(/%20/g, '+')
                + '=' + encodeURIComponent(fields[i].value).replace(/%20/g, '+');
        }

        const request = new XMLHttpRequest();
        request.onload = (event) => {
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
        request.open(loginForm.method, loginForm.action);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('Accept', 'application/json');
        request.send(data);
    });
});

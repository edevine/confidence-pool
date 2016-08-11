document.addEventListener('DOMContentLoaded', () => {
    const loginDialog = <HTMLElement>document.getElementById('login-dialog');
    const loginForm = <HTMLFormElement>document.getElementById('login-form');
    const signinButton = <HTMLButtonElement>document.querySelector('.sign-in');
    const leaguesPane = <HTMLElement>document.getElementById('leagues-pane');
    const leaguesTable = leaguesPane.querySelector('tbody');

    loginDialog.style.removeProperty('display');
    loginDialog.className = 'dialog opening';

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        signinButton.disabled = true;
        loginDialog.className = 'dialog';

        submitForm(loginForm, event => {
            signinButton.disabled = false;
            const request = <XMLHttpRequest>event.target;
            if (request.status === 200) {
                loginDialog.className = 'dialog closed';
                setTimeout(() => {
                    loginDialog.style.setProperty('display', 'none');
                    leaguesPane.style.removeProperty('display');
                    leaguesPane.classList.add('opening');
                }, 250);
                renderLeagues(request.response);
            } else {
                loginDialog.className = 'dialog failed';
            }
        });
    });

    function renderLeagues(leagues: League[]) {
        leaguesTable.innerHTML = leagues.map(toLeaguesRowHtml).join('');
    }

    function toLeaguesRowHtml(league: League) {
        return `<tr><td><a href="/leagues/${league.id}">${league.name}</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }

    /**
     * Listens to an event once
     */
    function listenOnce(host: EventTarget, type: string, handler: (event: Event) => void) {
        function listener(event: Event) {
            host.removeEventListener(type, listener);
            handler(event);
        }
        host.addEventListener(type, listener);
    }

    /**
     * Submits a form via XHR and invokes the callback with the payload
     */
    function submitForm<V, E>(
        form: HTMLFormElement,
        onload: (event: Event) => void
    ) {
        const request = new XMLHttpRequest();
        listenOnce(request, 'load', onload);
        request.responseType = "json";
        request.open(loginForm.method, loginForm.action);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('Accept', 'application/json');
        request.send(encodeForm(loginForm));
    }

    /**
     * Process form input elements into a application/x-www-form-urlencoded string
     */
    function encodeForm(form: HTMLFormElement) {
        const fields = <NodeListOf<HTMLInputElement>>form.querySelectorAll('input[name]');
        let data = '';
        for (let i = 0; i < fields.length; i++) {
            data += (i > 0 ? '&' : '')
                + encodeURIComponent(fields[i].name).replace(/%20/g, '+')
                + '=' + encodeURIComponent(fields[i].value).replace(/%20/g, '+');
        }
        return data;
    }

});

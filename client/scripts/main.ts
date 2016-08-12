document.addEventListener('DOMContentLoaded', () => {
    const loginDialog = <HTMLElement>document.getElementById('login-dialog');
    const loginForm = <HTMLFormElement>document.getElementById('login-form');
    const signinButton = <HTMLButtonElement>document.querySelector('.sign-in');
    const leaguesListPane = <HTMLElement>document.getElementById('leagues-list-pane');
    const leaguesListTable = leaguesListPane.querySelector('tbody');
    const leagueOverviewPane = <HTMLElement>document.getElementById('league-overview-pane');
    const leagueOverviewTable = leagueOverviewPane.querySelector('tbody');
    const logoutLink = <HTMLAnchorElement>document.querySelector('a.logout');

    const request = new XMLHttpRequest();
    listenOnce(request, 'load', () => {
        if (request.status === 200) {
            leaguesListPane.style.removeProperty('display');
            leaguesListPane.classList.add('opening');
            logoutLink.style.removeProperty('display');
            renderLeaguesList(request.response);
        }
        else {
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
                            leaguesListPane.style.removeProperty('display');
                            leaguesListPane.classList.add('opening');
                            logoutLink.style.removeProperty('display');
                        }, 250);
                        renderLeaguesList(request.response);
                    } else {
                        loginDialog.className = 'dialog failed';
                    }
                });
            });
        }
    });
    request.responseType = "json";
    request.open('get', '/leagues');
    request.setRequestHeader('Accept', 'application/json');
    request.send();


    function renderLeaguesList(leagues: LeagueInfo[]) {
        leaguesListTable.innerHTML = leagues.map(toLeaguesRowHtml).join('');
    }

    function toLeaguesRowHtml(league: LeagueInfo) {
        return `<tr><td><a href="/leagues/${league.id}">${league.name}</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }

    function renderLeagueOverview(details: LeagueDetails) {
        leagueOverviewPane.querySelector('.league-name').textContent = details.name;
        leagueOverviewTable.innerHTML = details.members.map(toMembersRowHtml).join('');
    }

    function toMembersRowHtml(member: User) {
        return `<tr><td>${member.name}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }

    leaguesListPane.addEventListener('click', (event: MouseEvent) => {
        if (event.target instanceof HTMLAnchorElement) {
            event.preventDefault();
            leaguesListPane.className = 'pane closed';
            sendHyperlink(event.target, event => {
                const request = <XMLHttpRequest>event.target;
                leaguesListPane.style.setProperty('display', 'none');
                leagueOverviewPane.style.removeProperty('display');
                leagueOverviewPane.classList.add('opening');
                if (request.status === 200) {
                    renderLeagueOverview(request.response);
                }
            });
        }
    });

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
     * Send a hyperlink via XHR
     */
    function sendHyperlink(
        anchor: HTMLAnchorElement,
        onload: (event: Event) => void
    ) {
        const request = new XMLHttpRequest();
        listenOnce(request, 'load', onload);
        request.responseType = "json";
        request.open('get', anchor.href);
        request.setRequestHeader('Accept', 'application/json');
        request.send();
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
        request.open(form.method, form.action);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('Accept', 'application/json');
        request.send(encodeForm(form));
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

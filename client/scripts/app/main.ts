import { listenOnce, submitForm, sendHyperlink } from 'dom-util';
import { renderLeaguesList } from './views/LeaguesList';
import { renderLeagueOverview } from './views/LeagueOverview';

const loginDialog = <HTMLElement>document.getElementById('login-dialog');
const loginForm = <HTMLFormElement>document.getElementById('login-form');
const signinButton = <HTMLButtonElement>document.querySelector('.sign-in');
const leaguesListPane = <HTMLElement>document.getElementById('leagues-list-pane');
const leaguesListTable = leaguesListPane.querySelector('tbody')!;
const leagueOverviewPane = <HTMLElement>document.getElementById('league-overview-pane')!;
const logoutLink = <HTMLAnchorElement>document.querySelector('a.logout');

const request = new XMLHttpRequest();

listenOnce(request, 'load', () => {
    if (request.status === 200) {
        leaguesListPane.style.removeProperty('display');
        leaguesListPane.classList.add('opening');
        logoutLink.style.removeProperty('display');
        renderLeaguesList(request.response, leaguesListTable);
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
                    renderLeaguesList(request.response, leaguesListTable);
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
                renderLeagueOverview(request.response, leagueOverviewPane);
            }
        });
    }
});

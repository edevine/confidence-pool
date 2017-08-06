import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { listenOnce, requestJson } from './dom-util';
import LoginDialog from './views/LoginDialog';
import LeaguesList from './views/LeaguesList';
import LeagueOverview from './views/LeagueOverview';

const mainElement = document.querySelector('main')!;
const logoutLink = <HTMLAnchorElement>document.querySelector('a.logout');

requestJson('/leagues', request => {
    if (request.status === 200) {
        logoutLink.style.removeProperty('display');
        onLogin(request.response as LeagueInfo[]);
    }
    else {
        ReactDOM.render(React.createElement(LoginDialog, { onLogin }), mainElement);
    }
});

function onLogin(leagues: LeagueInfo[]) {
    ReactDOM.render(React.createElement(LeaguesList, { leagues, onClickLeague }), mainElement);
}

function onClickLeague(url: string) {
    requestJson(url, request => {
        if (request.status === 200) {
            const leageDetails: LeagueDetails = request.response;
            ReactDOM.render(React.createElement(LeagueOverview, { leageDetails }), mainElement);
        }
    });
}

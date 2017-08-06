import * as React from 'react';
import { requestJson } from '../dom-util';
import LoginDialog from './LoginDialog';
import LeagueList from './LeaguesList';
import LeagueOverview from "./LeagueOverview";

export interface AppState {
    page: null | 'login' | 'leagues-list' | 'league-overview';
    leagues: LeagueInfo[];
    leageDetails: LeagueDetails | null;
}

export default class App extends React.Component<{}, AppState> {

    private showLeaguesList = (leagues: LeagueInfo[]) => {
        this.setState({ page: 'leagues-list', leagues });
    };

    private loadLeagueDetails = (url: string) => {
        requestJson<LeagueDetails>(url, leageDetails => {
            this.setState({ page: 'league-overview', leageDetails });
        });
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            page: null,
            leagues: [],
            leageDetails: null,
        };

        requestJson<LeagueInfo[]>(
            '/leagues',
            this.showLeaguesList,
            () => this.setState({ page: 'login' }),
        );
    }

    render() {
        const isLoggedIn = this.state.page != null && this.state.page !== 'login';

        return (
            <div>
                <header className="app-header">
                    { isLoggedIn ? <a className="logout opening" href="/logout">Logout</a> : null }
                    <h1>NFL Confidence Pool</h1>
                </header>
                { this.renderPage() }
            </div>
        );
    }

    private renderPage() {
        switch(this.state.page) {
            case 'login':
                return <LoginDialog onLogin={this.showLeaguesList} />;
            case 'leagues-list':
                return <LeagueList leagues={this.state.leagues} onClickLeague={this.loadLeagueDetails} />;
            case 'league-overview':
                return <LeagueOverview leageDetails={this.state.leageDetails!} />;
            default:
                return null;
        }
    }

}

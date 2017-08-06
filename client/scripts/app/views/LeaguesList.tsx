import * as React from 'react';
import SeasonTable from './SeasonTable';

export interface LeagueOverViewPaneProps {
    onClickLeague: (url: string) => void;
    leagues: LeagueInfo[];
}

export default function LeagueList({ onClickLeague, leagues }: LeagueOverViewPaneProps): JSX.Element {
    return (
        <section className="pane opening">
            <header>
                <h2>Leagues</h2>
            </header>
            <SeasonTable>
                {leagues.map(league => toLeaguesRow(onClickLeague, league))}
            </SeasonTable>
        </section>
    );
}

function toLeaguesRow(
    onClickLeague: (url: string) => void,
    league: LeagueInfo,
): JSX.Element {
    const onClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onClickLeague(event.currentTarget.href);
    };
    return (
        <tr key={league.id}>
            <td><a href={`/leagues/${league.id}`} onClick={onClick}>{league.name}</a></td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
    );
}

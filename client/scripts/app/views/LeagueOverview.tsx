import * as React from 'react';
import SeasonTable from './SeasonTable';

export interface LeagueOverViewPaneProps {
    leageDetails: LeagueDetails;
}

export default function LeagueOverview({ leageDetails }: LeagueOverViewPaneProps): JSX.Element {
    return (
        <section className="league-overview pane opening">
            <header>
                <h2>Leagues &raquo {leageDetails.name}</h2>
            </header>
            <SeasonTable>
                {leageDetails.members.map(toMembersRow)}
            </SeasonTable>
        </section>
    );
}

function toMembersRow(member: MemberDetails): JSX.Element {
    return <tr key={member.name}><td>{member.name}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>;
}

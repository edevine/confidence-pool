
export function renderLeaguesList(leagues: LeagueInfo[], leaguesListTable: HTMLTableSectionElement): void {
    leaguesListTable.innerHTML = leagues.map(toLeaguesRowHtml).join('');
}

function toLeaguesRowHtml(league: LeagueInfo) {
    return `<tr><td><a href="/leagues/${league.id}">${league.name}</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
}

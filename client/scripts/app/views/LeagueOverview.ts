
export function renderLeagueOverview(
    details: LeagueDetails,
    leagueOverviewPane: HTMLElement,
): void {
    const leagueOverviewTable = leagueOverviewPane.querySelector('tbody')!;
    leagueOverviewPane.querySelector('.league-name')!.textContent = details.name;
    leagueOverviewTable.innerHTML = details.members.map(toMembersRowHtml).join('');
}

function toMembersRowHtml(member: MemberDetails) {
    return `<tr><td>${member.name}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
}

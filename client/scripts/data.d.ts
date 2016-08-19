interface LeagueInfo {
    id: string;
    name: string;
}

interface LeagueDetails {
    id: string;
    name: string;
    members: MemberDetails[];
}

interface MemberDetails {
    name: string;
    weeklyScores: number[];
}

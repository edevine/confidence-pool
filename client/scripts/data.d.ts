interface LeagueInfo {
    id: string;
    name: string;
}

interface LeagueDetails {
    id: string;
    name: string;
    members: User[];
}

interface User {
    name: string;
}

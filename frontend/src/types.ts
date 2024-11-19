export interface Team {
    id: number;
    name: string;
    coach: string;
    wins: number;
    losses: number;
    draws: number;
    points: number;
    gamesPlayed: number;
    players: Player[];
}

export interface Player {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    tries: number;
    tackles: number;
    carries: number;
    teamId: number;
}

export interface Match {
    id: number;
    date: string;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
    result: string;
}

export interface Root {
    id: number;
    numplayers: number;
    liveid: string;
    creatorplayer: Creatorplayer;
    name: string;
    description: string;
    registrationstart: number;
    registrationend: number;
    startdate: number;
    enddate: number;
    leaderboardid: number;
    manialink: string;
    rulesurl: string;
    streamurl: string;
    websiteurl: string;
    logourl: string;
    verticalurl: string;
    rounds: Round[];
}

export interface Creatorplayer {
    name: string;
    id: string;
    meta: Meta;
}

export interface Meta {
    vanity: string;
    comment: string;
    mainaccount: string;
    nadeo: boolean;
}

export interface Round {
    id: number;
    name: string;
    status: string;
    matches: Match[];
    challenges: Challenge[];
}

export interface Match {
    id: number;
    name: string;
    completed: boolean;
}

export interface Challenge {
    id: number;
    name: string;
}

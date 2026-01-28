export interface UCLTeam {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  stats: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    form: string[];
    avgShots: number;
    avgShotsOnTarget: number;
    avgCorners: number;
    avgFouls: number;
    avgYellowCards: number;
    cleanSheets: number;
  };
}

export interface UCLFixture {
  id: number;
  homeTeam: UCLTeam;
  awayTeam: UCLTeam;
  date: string;
  time: string;
  venue: string;
  round: string;
  prediction?: {
    homeGoals: number;
    awayGoals: number;
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
  };
}

const teams: Record<string, UCLTeam> = {
  benfica: {
    id: 1,
    name: "SL Benfica",
    shortName: "Benfica",
    logo: "https://media.api-sports.io/football/teams/211.png",
    stats: { played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 14, goalsAgainst: 8, form: ['W','D','W','W','L'], avgShots: 14, avgShotsOnTarget: 6, avgCorners: 6, avgFouls: 11, avgYellowCards: 2.1, cleanSheets: 2 }
  },
  realMadrid: {
    id: 2,
    name: "Real Madrid",
    shortName: "Real Madrid",
    logo: "https://media.api-sports.io/football/teams/541.png",
    stats: { played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 15, goalsAgainst: 10, form: ['W','W','L','W','D'], avgShots: 16, avgShotsOnTarget: 7, avgCorners: 7, avgFouls: 10, avgYellowCards: 1.8, cleanSheets: 2 }
  },
  barcelona: {
    id: 3,
    name: "FC Barcelona",
    shortName: "Barcelona",
    logo: "https://media.api-sports.io/football/teams/529.png",
    stats: { played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 18, goalsAgainst: 9, form: ['W','W','W','D','W'], avgShots: 17, avgShotsOnTarget: 8, avgCorners: 8, avgFouls: 9, avgYellowCards: 1.5, cleanSheets: 2 }
  },
  copenhagen: {
    id: 4,
    name: "FC Copenhagen",
    shortName: "Copenhagen",
    logo: "https://media.api-sports.io/football/teams/400.png",
    stats: { played: 7, won: 1, drawn: 2, lost: 4, goalsFor: 5, goalsAgainst: 12, form: ['L','D','L','W','L'], avgShots: 9, avgShotsOnTarget: 3, avgCorners: 4, avgFouls: 13, avgYellowCards: 2.3, cleanSheets: 1 }
  },
  manCity: {
    id: 5,
    name: "Manchester City",
    shortName: "Man City",
    logo: "https://media.api-sports.io/football/teams/50.png",
    stats: { played: 7, won: 4, drawn: 0, lost: 3, goalsFor: 13, goalsAgainst: 10, form: ['W','L','W','W','L'], avgShots: 18, avgShotsOnTarget: 8, avgCorners: 8, avgFouls: 8, avgYellowCards: 1.4, cleanSheets: 3 }
  },
  galatasaray: {
    id: 6,
    name: "Galatasaray SK",
    shortName: "Galatasaray",
    logo: "https://media.api-sports.io/football/teams/645.png",
    stats: { played: 7, won: 2, drawn: 3, lost: 2, goalsFor: 9, goalsAgainst: 8, form: ['D','W','D','L','W'], avgShots: 12, avgShotsOnTarget: 5, avgCorners: 5, avgFouls: 14, avgYellowCards: 2.5, cleanSheets: 2 }
  },
  liverpool: {
    id: 7,
    name: "Liverpool FC",
    shortName: "Liverpool",
    logo: "https://media.api-sports.io/football/teams/40.png",
    stats: { played: 7, won: 7, drawn: 0, lost: 0, goalsFor: 15, goalsAgainst: 2, form: ['W','W','W','W','W'], avgShots: 15, avgShotsOnTarget: 7, avgCorners: 7, avgFouls: 9, avgYellowCards: 1.2, cleanSheets: 5 }
  },
  qarabag: {
    id: 8,
    name: "Qarabag FK",
    shortName: "Qarabag",
    logo: "https://media.api-sports.io/football/teams/556.png",
    stats: { played: 7, won: 1, drawn: 1, lost: 5, goalsFor: 4, goalsAgainst: 14, form: ['L','L','W','L','D'], avgShots: 8, avgShotsOnTarget: 3, avgCorners: 3, avgFouls: 15, avgYellowCards: 2.8, cleanSheets: 1 }
  },
  napoli: {
    id: 9,
    name: "SSC Napoli",
    shortName: "Napoli",
    logo: "https://media.api-sports.io/football/teams/492.png",
    stats: { played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 10, goalsAgainst: 8, form: ['W','D','W','L','D'], avgShots: 13, avgShotsOnTarget: 5, avgCorners: 5, avgFouls: 12, avgYellowCards: 2.0, cleanSheets: 2 }
  },
  chelsea: {
    id: 10,
    name: "Chelsea FC",
    shortName: "Chelsea",
    logo: "https://media.api-sports.io/football/teams/49.png",
    stats: { played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 14, goalsAgainst: 6, form: ['W','W','D','W','D'], avgShots: 14, avgShotsOnTarget: 6, avgCorners: 6, avgFouls: 10, avgYellowCards: 1.6, cleanSheets: 3 }
  },
  arsenal: {
    id: 11,
    name: "Arsenal FC",
    shortName: "Arsenal",
    logo: "https://media.api-sports.io/football/teams/42.png",
    stats: { played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 12, goalsAgainst: 5, form: ['W','D','W','W','D'], avgShots: 15, avgShotsOnTarget: 6, avgCorners: 7, avgFouls: 9, avgYellowCards: 1.5, cleanSheets: 4 }
  },
  gladbach: {
    id: 12,
    name: "Borussia Mönchengladbach",
    shortName: "Gladbach",
    logo: "https://media.api-sports.io/football/teams/163.png",
    stats: { played: 7, won: 2, drawn: 2, lost: 3, goalsFor: 8, goalsAgainst: 11, form: ['L','D','W','L','W'], avgShots: 11, avgShotsOnTarget: 4, avgCorners: 5, avgFouls: 12, avgYellowCards: 2.2, cleanSheets: 1 }
  },
  psg: {
    id: 13,
    name: "Paris Saint-Germain",
    shortName: "PSG",
    logo: "https://media.api-sports.io/football/teams/85.png",
    stats: { played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 8, goalsAgainst: 7, form: ['D','W','L','W','D'], avgShots: 16, avgShotsOnTarget: 6, avgCorners: 7, avgFouls: 10, avgYellowCards: 1.7, cleanSheets: 2 }
  },
  newcastle: {
    id: 14,
    name: "Newcastle United",
    shortName: "Newcastle",
    logo: "https://media.api-sports.io/football/teams/34.png",
    stats: { played: 7, won: 2, drawn: 3, lost: 2, goalsFor: 7, goalsAgainst: 8, form: ['D','W','D','L','W'], avgShots: 12, avgShotsOnTarget: 5, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.9, cleanSheets: 2 }
  },
  psv: {
    id: 15,
    name: "PSV Eindhoven",
    shortName: "PSV",
    logo: "https://media.api-sports.io/football/teams/197.png",
    stats: { played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 11, goalsAgainst: 9, form: ['W','D','L','W','D'], avgShots: 14, avgShotsOnTarget: 6, avgCorners: 6, avgFouls: 11, avgYellowCards: 1.8, cleanSheets: 2 }
  },
  bayern: {
    id: 16,
    name: "FC Bayern München",
    shortName: "Bayern",
    logo: "https://media.api-sports.io/football/teams/157.png",
    stats: { played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 17, goalsAgainst: 8, form: ['W','W','D','W','W'], avgShots: 17, avgShotsOnTarget: 8, avgCorners: 8, avgFouls: 9, avgYellowCards: 1.5, cleanSheets: 3 }
  },
  dortmund: {
    id: 17,
    name: "Borussia Dortmund",
    shortName: "Dortmund",
    logo: "https://media.api-sports.io/football/teams/165.png",
    stats: { played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 14, goalsAgainst: 9, form: ['W','L','W','W','D'], avgShots: 14, avgShotsOnTarget: 6, avgCorners: 6, avgFouls: 10, avgYellowCards: 1.7, cleanSheets: 2 }
  },
  inter: {
    id: 18,
    name: "Inter Milan",
    shortName: "Inter",
    logo: "https://media.api-sports.io/football/teams/505.png",
    stats: { played: 7, won: 5, drawn: 2, lost: 0, goalsFor: 11, goalsAgainst: 3, form: ['W','D','W','W','D'], avgShots: 13, avgShotsOnTarget: 5, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8, cleanSheets: 5 }
  }
};

export const uclRound8Fixtures: UCLFixture[] = [
  {
    id: 1,
    homeTeam: teams.benfica,
    awayTeam: teams.realMadrid,
    date: "2026-01-28",
    time: "21:00",
    venue: "Estádio da Luz",
    round: "League Phase - Round 8"
  },
  {
    id: 2,
    homeTeam: teams.barcelona,
    awayTeam: teams.copenhagen,
    date: "2026-01-28",
    time: "21:00",
    venue: "Camp Nou",
    round: "League Phase - Round 8"
  },
  {
    id: 3,
    homeTeam: teams.manCity,
    awayTeam: teams.galatasaray,
    date: "2026-01-28",
    time: "21:00",
    venue: "Etihad Stadium",
    round: "League Phase - Round 8"
  },
  {
    id: 4,
    homeTeam: teams.liverpool,
    awayTeam: teams.qarabag,
    date: "2026-01-28",
    time: "21:00",
    venue: "Anfield",
    round: "League Phase - Round 8"
  },
  {
    id: 5,
    homeTeam: teams.napoli,
    awayTeam: teams.chelsea,
    date: "2026-01-28",
    time: "21:00",
    venue: "Stadio Diego Armando Maradona",
    round: "League Phase - Round 8"
  },
  {
    id: 6,
    homeTeam: teams.arsenal,
    awayTeam: teams.gladbach,
    date: "2026-01-28",
    time: "21:00",
    venue: "Emirates Stadium",
    round: "League Phase - Round 8"
  },
  {
    id: 7,
    homeTeam: teams.psg,
    awayTeam: teams.newcastle,
    date: "2026-01-28",
    time: "21:00",
    venue: "Parc des Princes",
    round: "League Phase - Round 8"
  },
  {
    id: 8,
    homeTeam: teams.psv,
    awayTeam: teams.bayern,
    date: "2026-01-28",
    time: "21:00",
    venue: "Philips Stadion",
    round: "League Phase - Round 8"
  },
  {
    id: 9,
    homeTeam: teams.dortmund,
    awayTeam: teams.inter,
    date: "2026-01-29",
    time: "21:00",
    venue: "Signal Iduna Park",
    round: "League Phase - Round 8"
  }
];

export function getTeams() {
  return Object.values(teams);
}

export function getFixtures() {
  return uclRound8Fixtures;
}

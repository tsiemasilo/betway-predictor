import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { uclRound8Fixtures } from './ucl-data';

export interface LiveMatch {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'not_started' | 'first_half' | 'half_time' | 'second_half' | 'full_time';
  events: MatchEvent[];
}

interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  team: 'home' | 'away';
  player?: string;
}

class LiveScoreEngine {
  private wss: WebSocketServer | null = null;
  private matches: Map<number, LiveMatch> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;
  private tickCount = 0;

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/live-scores' });

    this.wss.on('connection', (ws) => {
      console.log('Live score client connected');
      ws.send(JSON.stringify({
        type: 'initial',
        matches: Array.from(this.matches.values())
      }));

      ws.on('close', () => {
        console.log('Live score client disconnected');
      });
    });

    this.initializeMatches();
    this.startSimulation();
  }

  private initializeMatches() {
    uclRound8Fixtures.forEach((fixture) => {
      this.matches.set(fixture.id, {
        fixtureId: fixture.id,
        homeTeam: fixture.homeTeam.shortName,
        awayTeam: fixture.awayTeam.shortName,
        homeScore: 0,
        awayScore: 0,
        minute: 0,
        status: 'not_started',
        events: []
      });
    });
  }

  private startSimulation() {
    this.simulationInterval = setInterval(() => {
      this.tickCount++;
      this.updateMatches();
      this.broadcast();
    }, 1000);
  }

  private updateMatches() {
    this.matches.forEach((match) => {
      if (match.status === 'not_started') {
        if (this.tickCount >= 3) {
          match.status = 'first_half';
          match.minute = 1;
        }
      } else if (match.status === 'first_half') {
        match.minute++;
        this.maybeScoreGoal(match);
        if (match.minute >= 45) {
          match.status = 'half_time';
        }
      } else if (match.status === 'half_time') {
        if (this.tickCount % 5 === 0) {
          match.status = 'second_half';
          match.minute = 46;
        }
      } else if (match.status === 'second_half') {
        match.minute++;
        this.maybeScoreGoal(match);
        if (match.minute >= 90) {
          match.status = 'full_time';
        }
      }
    });
  }

  private maybeScoreGoal(match: LiveMatch) {
    const goalChance = 0.015;
    
    if (Math.random() < goalChance) {
      const isHome = Math.random() < 0.5;
      if (isHome) {
        match.homeScore++;
      } else {
        match.awayScore++;
      }
      match.events.push({
        minute: match.minute,
        type: 'goal',
        team: isHome ? 'home' : 'away'
      });
    }
  }

  private broadcast() {
    if (!this.wss) return;

    const message = JSON.stringify({
      type: 'update',
      matches: Array.from(this.matches.values())
    });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  getMatches(): LiveMatch[] {
    return Array.from(this.matches.values());
  }

  resetMatches() {
    this.tickCount = 0;
    this.initializeMatches();
  }
}

export const liveScoreEngine = new LiveScoreEngine();

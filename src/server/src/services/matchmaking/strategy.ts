import { Socket } from 'socket.io';
import { requestMatch } from '../../controllers/matchmaking';
import { requestMatchWithBot } from '../../controllers/matchmaking';

export interface Strategy {
  findMatch(socket: Socket, data: any): Promise<void>;
  findMatchWithBot(socket: Socket, data: any): Promise<void>;
}

export class StrategyFactory {
  public static createAuthenticatedStrategy(): Strategy {
    return new AuthenticatedStrategy();
  }

  public static createGuestStrategy(): Strategy {
    return new GuestStrategy();
  }
}

export class AuthenticatedStrategy implements Strategy {
  public async findMatch(socket: Socket): Promise<void> {
    const username = this.getUsername(socket);
    console.log(`User ${username} is finding a match`);
    await requestMatch(username);
  }

  public async findMatchWithBot(socket: Socket): Promise<void> {
    const username = this.getUsername(socket);
    console.log(`User ${username} is finding a match with a bot`);
    await requestMatchWithBot(username);
  }

  private getUsername(socket: Socket): string {
    if (!socket.handshake.auth.account || !socket.handshake.auth.account.username) {
      throw new Error('Username not found in socket handshake auth');
    }
    return socket.handshake.auth.account.username;
  }
}

export class GuestStrategy implements Strategy {
  public async findMatch(socket: Socket): Promise<void> {
    console.log('Guest is finding a match');
    await requestMatch(this.getGuestUsername());
  }

  public async findMatchWithBot(socket: Socket): Promise<void> {
    console.log('Guest is finding a match with a bot');
    await requestMatchWithBot(this.getGuestUsername());
  }

  public getGuestUsername(): string {
    return 'guest';
    // TODO IMPLEMENT THIS UNIQUE GUEST USERNAME GENERATION
    // return 'guest_' + Math.random().toString(36).substring(2, 15);
  }
}
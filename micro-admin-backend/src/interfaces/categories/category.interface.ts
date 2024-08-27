import { Document } from 'mongoose';
import { Event } from './event.interface';
import { Player } from '../players/player.interface';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

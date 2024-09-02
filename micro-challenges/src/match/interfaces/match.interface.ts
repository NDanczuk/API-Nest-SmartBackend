import { Document } from 'mongoose';
import { Result } from './result.interface';

export interface Match extends Document {
  category: string;
  challenge: string;
  players: string[];
  def: string;
  result: Array<Result>;
}

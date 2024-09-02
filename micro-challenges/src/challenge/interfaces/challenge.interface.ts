import { Document } from 'mongoose';
import { ChallengeStatus } from '../challenge-status.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeSolicitation: Date;
  dateTimeAnswer?: Date;
  applicant: string;
  category: string;
  match?: string;
  players: string[];
}

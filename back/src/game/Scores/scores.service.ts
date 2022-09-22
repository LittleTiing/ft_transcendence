import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accounts } from '../../account/entities/accounts.entity';
import { Scores } from './entities/scores.entities';
import { ScoresDto } from './utils/types';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Accounts) private userRepo: Repository<Accounts>,
    @InjectRepository(Scores) private scoresRepo: Repository<Scores>,
  ) {}

  async histoty() {
    return await this.scoresRepo.find();
  }

  async histotyById(account_id: string) {
    const player1 = await this.scoresRepo.find({
      where: { idWinner: account_id },
    });
    const player2 = await this.scoresRepo.find({
      where: { idLoser: account_id },
    });
    return [...player1, ...player2];
  }

  async addScore(scores: ScoresDto) {
	  console.log("scoooore", scores);
    const newScore = this.scoresRepo.create(scores);
    return this.scoresRepo.save(newScore);
  }
}

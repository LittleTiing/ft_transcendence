import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../../account/account/account.service';
import { Accounts } from '../../account/entities/accounts.entity';
import { Scores } from './entities/scores.entities';
import { ScoresDbDto, ScoresDto } from './utils/types';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Accounts) private userRepo: Repository<Accounts>,
    @InjectRepository(Scores) private scoresRepo: Repository<Scores>,
    private readonly usersService: AccountService,
  ) {}

  async histoty() {
    return await this.scoresRepo.find();
  }

  async historyById(account_id: string) {
    const player1 = await this.scoresRepo.find({
      where: { idWinner: account_id },
    });
    const player2 = await this.scoresRepo.find({
      where: { idLoser: account_id },
    });
    const player = [...player1, ...player2];
    const history: ScoresDto[] = player.map((score) => score);
    for (const score of history) {
      score.UsernameWinner = await this.usersService.getUsernameById(
        score.idWinner,
      );
      score.UsernameLoser = await this.usersService.getUsernameById(
        score.idLoser,
      );
    }
    return history;
  }

  async addScore(scores: ScoresDto) {
    const newScore = this.scoresRepo.create(scores);
    await this.addPoint(scores.idWinner, scores.ScorePlayer1);
    return this.scoresRepo.save(newScore);
  }

  async statsById(id: string) {
    const gameWon = await this.scoresRepo.countBy({ idWinner: id });
    const gameLost = await this.scoresRepo.countBy({ idLoser: id });
    return { gameWon: gameWon, gameLost: gameLost };
  }

  async getClassement() {
    return await this.userRepo.find({ order: { points: 'DESC' } });
  }

  async addPoint(account_id: string, points: number) {
    const user = await this.userRepo.findOneBy({ account_id });
    const newPoints: number = +user.points + +points;
    return await this.userRepo.save({
      ...user, // existing fields
      points: newPoints,
    });
  }
}

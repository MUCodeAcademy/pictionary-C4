import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { FormControl } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Player } from '../interfaces/player.interface';
import { Observable } from 'rxjs';
import { GameInfo } from '../interfaces/gameInfo.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameInfo: GameInfo;
  displayName: string = '';
  savedName: boolean = true;


  constructor(private socket: SocketService, private router: Router, private gameService: GameService, private actr: ActivatedRoute) { }

  savePlayer() {
    console.log(this.gameInfo.gameId);
    console.log(this.displayName);
    this.savedName = true
    this.gameService.newPlayer(this.displayName, this.gameInfo.gameId)
  }

  assignArtist() {
    this.gameService.updateArtist(this.gameInfo.gameId)
  }

  newTopic() {
    this.gameService.newTopic(this.gameInfo.gameId);
  }

  ngOnInit(): void {
    this.socket.joinGame(this.actr.snapshot.params.gameId);
    let gameId = this.actr.snapshot.params.gameId;
    this.gameService.gameInfo(gameId).subscribe((val) => {

      this.gameInfo = {
        gameId: val.gameId,
        artist: val.currentArtist,
        currentTopic: val.currentTopic,
        users: val.users,
        gameConfig: {
          maxRounds: val.gameConfig.maxRounds,
          maxScore: val.gameConfig.maxScore,
          currentRound: val.gameConfig.currentRound
        }
      }
      console.log(this.gameInfo);
    })
  }

  ngOnDestroy(): void {
    this.socket.leaveGame();
  }

}

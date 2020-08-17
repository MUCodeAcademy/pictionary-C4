import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { FormControl } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Player } from '../interfaces/player.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy{
  gameId: string;
  displayName: string = '';
  savedName: boolean = true;
  artist: Player;

  constructor(private socket: SocketService, private router: Router, private gameService: GameService, private actr: ActivatedRoute) {
   
   }
  

  savePlayer(){

    console.log(this.gameId);
    console.log(this.displayName);
    this.savedName = true
    this.gameService.newPlayer(this.displayName, this.gameId)
  }

  assignArtist(){
    this.gameService.updateArtist(this.gameId)
  }

  newTopic(){
    this.gameService.newTopic(this.gameId);
  }

  ngOnInit(): void {
    this.socket.joinGame(this.actr.snapshot.params.gameId);
    this.gameId = this.actr.snapshot.params.gameId;
    this.gameService.gameInfo(this.gameId).subscribe(val => {
      this.artist = val.currentArtist;
      
    })
  }

  ngOnDestroy(): void{
    this.socket.leaveGame();
  }

}

import { Player, world } from "@minecraft/server";
import EventEmitter from "eventemitter3";

function getOnlinePlayers() {
  return world.getAllPlayers().length;
}

export enum MatchingStatus {
  WaitingForPlayers,
  Preparing,
  Ready,
}

export class Matcher extends EventEmitter {
  players: Player[] = [];
  minPlayerCount = 4;
  animTick = 0;
  countdownTick = -1;
  gameAvailable: boolean = false;
  status: MatchingStatus = MatchingStatus.WaitingForPlayers;
  updateStatus() {
    if (this.gameAvailable && this.players.length >= Math.min(this.minPlayerCount, getOnlinePlayers())) {
      if (this.status != MatchingStatus.Ready) {
        this.status = MatchingStatus.Ready;
        this.countdownTick = 100;
      }
      return;
    }
    if (!this.gameAvailable && this.players.length >= Math.min(this.minPlayerCount, getOnlinePlayers())) {
      this.status = MatchingStatus.Preparing;
      this.countdownTick = -1;
      return;
    }
    if (this.players.length < Math.min(this.minPlayerCount, getOnlinePlayers())) {
      this.status = MatchingStatus.WaitingForPlayers;
      this.countdownTick = -1;
      return;
    }
  }

  showStatus(p: Player) {}
}

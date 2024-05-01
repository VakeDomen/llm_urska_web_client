import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageResponse, SocketService } from 'src/app/services/socket.service';

enum ServerLoad {
  Healthy,
  Light,
  Heavy,
  Unknown,
}

enum SocketStatus {
  Connecting,
  Open,
  Closing,
  Closed
}


@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.sass'
})
export class ServerStatusComponent implements OnInit {
  private socketStatus: SocketStatus =SocketStatus.Closed;
  private que: number = 0;
  private pos: number = 0;
  
  ngOnInit(): void {
    SocketService.messages$.subscribe(this.messageParser)
    this.updateSocketStatus();
    setInterval(() => this.updateSocketStatus(), 100);
    setInterval(() => this.updateServerQue(), 300);
  }


  private messageParser = (response: MessageResponse) => {
    const data = JSON.parse(response.data);
    if (data['QueLenResponse'] != undefined) {
      this.que = data['QueLenResponse']
    }

    if (data['QuePosResponse'] != undefined) {
      this.pos = data['QuePosResponse']
    }
  }

  private updateServerQue() {
    SocketService.sendMessage("QueueLen");
    SocketService.sendMessage("QueuePos");
  }

  private updateSocketStatus() {
    const statusNum = SocketService.getState();
    if (statusNum == 0) this.socketStatus = SocketStatus.Connecting;
    if (statusNum == 1) this.socketStatus = SocketStatus.Open;
    if (statusNum == 2) this.socketStatus = SocketStatus.Closing;
    if (statusNum == 3) this.socketStatus = SocketStatus.Closed;
  }

  public posLabel(): string {
    if (this.pos < 0) {
      return "Not in queue";
    } else {
      return `Position in que: ${this.pos}`
    }
  }

  public serverLoadLabel(): string {
    const load = this.getServerLoad();
    if (load === ServerLoad.Healthy) return "Healthy"
    if (load === ServerLoad.Light) return "Light"
    if (load === ServerLoad.Heavy) return "Heavy"
    return "Unknown"
  }

  public socketStatusLabel(): string {
    if (this.socketStatus === SocketStatus.Connecting) return "Connecting...";
    if (this.socketStatus === SocketStatus.Open) return "Open";
    if (this.socketStatus === SocketStatus.Closing) return "Closing...";
    if (this.socketStatus === SocketStatus.Closed) return "Closed";
    return "Unknown"
  }

  public getServerLoad(): ServerLoad {
    if (this.que <= 2) return ServerLoad.Healthy;
    if (this.que <= 10) return ServerLoad.Light;
    if (this.que > 10) return ServerLoad.Heavy;
    return ServerLoad.Unknown;
  }

  public inQue(): boolean {
    return (this.que  > 2)
  }
}

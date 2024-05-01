import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { MessageResponse, SocketService } from 'src/app/services/socket.service';

export type MessageType = 'bot' | 'user';
export interface Message {
  content: string,
  type: MessageType,
  loader: boolean,
  state: string,
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass']
})
export class MessageComponent implements OnChanges {
  @Input() public message: Message | undefined;

  constructor(
  ) { 
    SocketService.messages$.subscribe(this.messageParser)
  }

  ngOnChanges(): void { }

  private messageParser = (response: MessageResponse) => {
    const content = JSON.parse(response.data);
    if (content["PromptStatus"] != undefined) {
      console.log(content["PromptStatus"]);
      if (!this.message) {
        return;
      }
      
      this.message.state = content["PromptStatus"];
    }
  }

  public getName(): string {
    if (!this.message) return "Unknown";
    if (this.message.type == 'bot') return "Urška";
    else return "User";
  }
}

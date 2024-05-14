import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { MessageResponse, SocketService } from 'src/app/services/socket.service';

export type MessageType = 'bot' | 'user';
export interface RatingChange {
  id: string,
  change: number,
}
export interface Message {
  id: string,
  content: string,
  type: MessageType,
  loader: boolean,
  state: string,
  rating: number;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass']
})
export class MessageComponent implements OnChanges {
  @Input() public message: Message | undefined;
  @Output() public ratingChange: EventEmitter<RatingChange> = new EventEmitter();

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

  public rate(change: number) {
    if (!this.message) {
      return;
    }

    let newRating = this.message.rating + change;
    if (newRating > 0) newRating = 1;
    if (newRating < 0) newRating = -1;
    if (this.message.rating != newRating) {
      this.message.rating = newRating;
      this.ratingChange.emit({
        id: this.message.id,
        change: this.message.rating,
      })
    }
  }
}

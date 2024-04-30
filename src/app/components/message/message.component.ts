import { Component, Input, OnChanges, OnInit } from '@angular/core';

export type MessageType = 'bot' | 'user';
export interface Message {
  content: string,
  type: MessageType,
  loader: boolean
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass']
})
export class MessageComponent implements OnChanges {
  @Input() public message: Message | undefined;

  constructor() { }

  ngOnChanges(): void { }

  public getName(): string {
    if (!this.message) return "Unknown";
    if (this.message.type == 'bot') return "Urška";
    else return "User";
  }
}

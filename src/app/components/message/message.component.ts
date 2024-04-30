import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

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
  @Input() public content: string | undefined;

  constructor(
    private markdown: MarkdownService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges(): void {
    this.markdown.reload()
    this.cdr.detectChanges()
    console.log("update")
  }

  public getName(): string {
    if (!this.message) return "Unknown";
    if (this.message.type == 'bot') return "Urška";
    else return "User";
  }
}

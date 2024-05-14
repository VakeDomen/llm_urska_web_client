import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message, RatingChange } from '../message/message.component';
import { MessageResponse, SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-msgr',
  templateUrl: './msgr.component.html',
  styleUrls: ['./msgr.component.sass']
})
export class MsgrComponent implements OnInit {

  public panel: 'pre-panel' | 'passages' | 'response' = 'pre-panel';
  public messageContent: string = '';
  public messages: Message[] = [];
  public passages: Message[] = [];
  public waiting: boolean = false;
  public prompted: boolean = false;
  public streamMessage: Message | undefined;
  private pileSelectorString: string | undefined;

  @ViewChild('chat') private messenger!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    SocketService.messages$.subscribe(this.messageParser)
  }

  private messageParser = (response: MessageResponse) => {
    const content = JSON.parse(response.data);
    if (content["PromptResponseToken"] != undefined) {
      if (!this.streamMessage) {
        return;
      }
      this.streamMessage.loader = false;
      this.streamMessage.content = this.streamMessage.content + content["PromptResponseToken"];
      this.scrollToBottom()
    }

    if (content["PromptResponse"] != undefined) {
      if (this.streamMessage) this.streamMessage.id = content["PromptResponse"][0];
      this.waiting = false;
      this.prompted = true;
    }

    if (content["PromptPassage"] != undefined) {
      this.passages.push({
        id: content["PromptPassage"][0],
        content: content["PromptPassage"][1],
        type: 'bot',
        loader: false,
        state: "",
        rating: 0
      } as Message)
    }
  }

  public toggleCheckedPassages() {
    if (this.panel == 'passages') {
      this.panel = 'response'
      return;
    }
    if (this.panel == 'response') {
      this.panel = 'passages'
      return;
    }
    this.scrollToBottom();
  }

  public nextQuestion() {
    this.panel = 'pre-panel';
    this.messageContent = '';
    this.messages = [];
    this.passages = [];
    this.waiting = false;
    this.prompted = false;
    this.streamMessage = undefined;
  }

  async sendMessage(): Promise<void> {
    if (this.waiting) return;
    else this.waiting = true;

    const userMsg = {
      content: this.messageContent,
      type: 'user',
      loader: false,
      state: "",
      rating: 0
    } as Message;
    this.messages.push(userMsg);
    this.passages.push(userMsg);
    this.messageContent = ''; // Clear input after sending

    const botMsg = {
      content: "",
      type: 'bot',
      loader: true,
      state: "Waiting for the server...",
      rating: 0
    } as Message;
    this.messages.push(botMsg);
    this.streamMessage = botMsg;
    SocketService.sendMessage(`Prompt ${this.pileSelectorString} ${userMsg.content}`);
    this.panel = 'response';
  }

  scrollToBottom(): void {
    try {
      this.messenger.nativeElement.scrollTop = this.messenger.nativeElement.scrollHeight;
    } catch (err) { }
  }

  public pileUpdate(pileSelectorString: string): void {
    this.pileSelectorString = pileSelectorString;
  }

  public rateResponse(rate: RatingChange): void {
    SocketService.sendMessage(`RateResponse ${rate.id} ${this.ratingChangeToSocketKey(rate.change)}`);
  }

  public ratePassage(rate: RatingChange): void {
    SocketService.sendMessage(`RatePassage ${rate.id} ${this.ratingChangeToSocketKey(rate.change)}`);
  }

  private ratingChangeToSocketKey(rating: number): string {
    if (rating > 0) return "Positive";
    if (rating < 0) return "Negative";
    return "Neutral";
  }
}

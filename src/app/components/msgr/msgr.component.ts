import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../message/message.component';
import { MessageResponse, SocketService } from 'src/app/services/socket.service';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-msgr',
  templateUrl: './msgr.component.html',
  styleUrls: ['./msgr.component.sass']
})
export class MsgrComponent implements OnInit {

  public messageContent: string = '';
  public messages: Message[] = [];
  public waiting: boolean = false;
  public sloConversation: boolean = false;
  public hydeConversation: boolean = false;
  public prompted: boolean = false;
  public streamMessage: Message | undefined;


  @ViewChild('chat') private messenger!: ElementRef;

  constructor(
    // private chatService: ChatService
  ) { }

  ngOnInit(): void {
    const botMsg = {
      content: "Hello, how can I help you?",
      type: 'bot',
      loader: false,
    } as Message;
    this.messages.push(botMsg);
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
      this.waiting = false;
      SocketService.stopWaitingMessage();
    }
  }

  async sendMessage(): Promise<void> {
    if (this.waiting) return;
    else this.waiting = true;

    const userMsg = {
      content: this.messageContent,
      type: 'user',
      loader: false,
    } as Message;
    this.messages.push(userMsg);
    this.messageContent = ''; // Clear input after sending

    const botMsg = {
      content: "",
      type: 'bot',
      loader: true,
    } as Message;
    this.messages.push(botMsg);
    this.streamMessage = botMsg;
    this.prompted = true;
    SocketService.sendMessage("prompt", `Prompt ${userMsg.content}`);
  }

  scrollToBottom(): void {
    try {
      this.messenger.nativeElement.scrollTop = this.messenger.nativeElement.scrollHeight;
    } catch (err) { }
  }
}

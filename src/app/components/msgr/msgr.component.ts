import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../message/message.component';

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
  
  private stream: boolean = false;

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
    setTimeout(() => this.scrollToBottom(), 10);
    this.messageContent = ''; // Clear input after sending

    const botMsg = {
      content: "",
      type: 'bot',
      loader: true,
    } as Message;
    this.messages.push(botMsg);
    setTimeout(() => this.scrollToBottom(), 10)

    // if (this.stream) {
    //     this.chatService.streamData(userMsg.content).subscribe({
    //       next: (data: string) => {
    //         botMsg.loader = false;
    //         botMsg.content += data;
    //       },
    //       error: (error: any) => console.error(error),
    //     });
    // } else if (this.chatConversation) {
    //   botMsg.content = await this.chatService.chat(userMsg.content);
    // } else {
    //   // botMsg.content = await this.chatService.query(userMsg.content);
    //   botMsg.content = await this.chatService.query_hyde(userMsg.content);
    // }

    // this.chatService.lang = this.sloConversation ? "sl" : "en";
    // if (this.hydeConversation) {
    //   botMsg.content = await this.chatService.query_hyde(userMsg.content);
    // } else {
    //   botMsg.content = await this.chatService.query(userMsg.content);
    // }

    botMsg.loader = false;



    setTimeout(() => this.scrollToBottom(), 10)
    this.waiting = false;
  }

  scrollToBottom(): void {
    try {
      this.messenger.nativeElement.scrollTop = this.messenger.nativeElement.scrollHeight;
    } catch (err) { }
  }
}

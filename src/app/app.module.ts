import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './pages/chat/chat.component';
import { HeadComponent } from './components/head/head.component';
import { MsgrComponent } from './components/msgr/msgr.component';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './components/message/message.component';
import { MarkdownModule } from 'ngx-markdown';
import { ServerStatusComponent } from './components/server-status/server-status.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HeadComponent,
    MsgrComponent,
    MessageComponent,
    ServerStatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

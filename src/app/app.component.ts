import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Urška web client';
  

  ngOnInit(): void {
    SocketService.connect("ws://127.0.0.1:4321");
  }

}

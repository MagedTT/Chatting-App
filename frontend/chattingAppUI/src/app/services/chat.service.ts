import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5232/chatHub')
    .configureLogging(signalR.LogLevel.Information)
    .build();

  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = []
  public users: string[] = [];

  constructor() {
    this.start();
    this.hubConnection.on('ReceiveMessage', (user: string, message: string, messageTime: string) => {
      // console.log('User: ', user);
      // console.log('Message: ', message);
      // console.log('Message Time: ', messageTime);
      this.messages = [...this.messages, { user, message, messageTime }];
      this.messages$.next(this.messages);
    });
    this.hubConnection.on('ConnectedUsers', (users: any) => {
      // console.log("users: ", users);
      this.connectedUsers$.next(users);
    });
  }

  public async start() {
    try {
      await this.hubConnection.start();
      console.log('Connection Started');
    } catch(error) {
      console.log(error);
    }
  }

  public async joinRoom(username: string, roomName: string) {
    return this.hubConnection.invoke("JoinRoom", { username, roomName });
  }

  public async sendMessage(message: string) {
    return this.hubConnection.invoke('SendMessage', message);
  }

  public async leaveChat() {
    return this.hubConnection.stop();
  }

   
  // private hubConnection!: signalR.HubConnection;
  
  // startConnection() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('http://localhost:5232/chatHub')
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   this.hubConnection.start()
  //     .then(() => console.log("connected started"))
  //     .catch(err => console.log("Error:", err));

  //   this.hubConnection.on('ReceiveMessage', (user: string, message: string, messageTime: string) => {
  //     console.log('User: ', user);
  //     console.log('Message: ', message);
  //     console.log('Message Time: ', messageTime);
  //   });

  //   this.hubConnection.on('ConnectedUsers', (users: any) => {
  //     console.log("users: ", users);
  //   });
  // }
}

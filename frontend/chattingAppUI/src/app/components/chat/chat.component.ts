import { AfterViewChecked, Component, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule, DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule, NgClass, DatePipe, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  constructor(private router: Router, public chatService: ChatService) { }

  inputMessage: string = '';
  messages: any[] = [];
  loggedInUserName = sessionStorage.getItem('user');
  roomName = sessionStorage.getItem('room');
  @ViewChild('scroll') private scroll!: ElementRef;

  ngOnInit(): void {
    this.chatService.messages$.subscribe(response => {
      this.messages = response;
      console.log(this.messages);
    });
  }

  ngAfterViewChecked(): void {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  sendMessage() {
    this.chatService.sendMessage(this.inputMessage)
      .then(() => {
        this.inputMessage = '';
      }).catch((error) => {
        console.log(error);
      });
  }

  leaveChat() {
    this.chatService.leaveChat()
      .then(() => {
        this.router.navigateByUrl('welcome');
        setTimeout(() => {
          location.reload();
        }, 0);
      }).catch((error) => {
        console.log(error);
      });
  }
}

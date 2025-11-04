import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private notifyService: NotificationService) { }
  title = 'chattingAppUI';

  showToastrSuccess() {
    this.notifyService.showSuccess('Data shown successfylly', 'something');
  }
}

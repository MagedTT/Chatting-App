import { Routes } from '@angular/router';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    { path: '', redirectTo: 'join-room', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'join-room', component: JoinRoomComponent },
    { path: 'chat', component: ChatComponent }
];

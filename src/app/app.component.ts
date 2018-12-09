import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthSerService } from './auth/auth-ser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService:AuthSerService) {}
  
  ngOnInit(){
    this.authService.autoAuthUser();
  }
}

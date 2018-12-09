import { AuthSerService } from './../auth-ser.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(private authService: AuthSerService) { }

  ngOnInit() {
  }
  onLogin(form: NgForm) {
      console.log(form.value);
      if (form.invalid) {
          return;
      } 
      this.isLoading = true;
      this.authService.loginUser(form.value.email, form.value.password);
  }
}

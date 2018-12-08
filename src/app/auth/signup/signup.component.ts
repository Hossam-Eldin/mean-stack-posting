import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthSerService} from '../auth-ser.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(public authService: AuthSerService ) { }

  ngOnInit() {
  }
  onSignup(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}

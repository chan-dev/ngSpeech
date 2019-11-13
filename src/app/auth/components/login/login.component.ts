import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showErrorMessage: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.showErrorMessage = false;
  }

  ngOnInit() {}

  login() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(credentials => {
        console.log(credentials);
        this.showErrorMessage = false;
        this.router.navigate(['/speeches']);
      })
      .catch(error => {
        this.showErrorMessage = true;
      })
  }

  closeAlert() {
    this.showErrorMessage = false;
  }

  get controls() {
    return this.loginForm.controls;
  }

  get email() {
    return this.controls.email;
  }

  get password() {
    return this.controls.password;
  }
}

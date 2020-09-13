import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {  NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "../../../services/authentication.service";
import { first } from 'rxjs/operators';
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit  {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  loginForm:boolean;
  message: string;
  error:Object;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loginForm = event.url === "/signup" ? false : true;
      }
    });
  }

  ngOnInit(): void {
    const {token} = this.authenticationService.userValue || {}
    if (token) {
      this.router.navigate(['/dashboard','home']);
    }

    this.authForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  get authFormControls() { return this.authForm.controls; }

  loginEvent() {
    this.authenticationService.login(this.authFormControls.email.value, this.authFormControls.password.value)
    .pipe(first())
    .subscribe({
        next: (data) => {
          this.message = data?.message ?? '';
          this.clearEvent(['/dashboard','home'])
        },
        error: error => {
            this.error = error; 
            this.clearEvent();
        }
    });
  }

  signUpEvent() {
    this.authenticationService.registration(this.authFormControls.email.value, this.authFormControls.password.value)
    .subscribe({
        next: (data) => {
          this.message = data?.message ?? '';
          this.clearEvent(['/verify',data.hashToken]);
        },
        error: error => {
            this.error = error;  
            this.clearEvent();
        }
    });
  }

  clearEvent(route?){
    this.loading = false;
    setTimeout(() => {
      this.error = {};
      if(route){
        this.router.navigate(route);
      }
    }, 2000)
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      this.authForm.markAsTouched();
      this.authForm.markAsPristine();
      return;
    }
    this.loading = true;
    if (this.loginForm) {
      this.loginEvent();
    } else {
      this.signUpEvent();
    }
  }


}

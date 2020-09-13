import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  verifyForm: FormGroup;
  submitted = false;
  message: string;
  error:Object;
  hashToken:string;
  loading = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.hashToken = params.get("vToken")
    })

    this.verifyForm = this.formBuilder.group({
      otp: ["", Validators.required]
    });
  }

  get verifyFormControls() { return this.verifyForm.controls; }

  onSubmit(){
    this.submitted = true;
    this.loading = true;
    this.authenticationService.verification(+this.verifyFormControls.otp.value, this.hashToken)
    .subscribe({
        next: (data) => {
          this.message = data?.message ?? '';
          setTimeout(() => {
            this.router.navigate(['/login']);
            this.loading = false;
          }, 2000)
        },
        error: error => {
          setTimeout(() => {
            this.error = error;
            this.loading = false;
          },2000);  
        }
    });
  }

}

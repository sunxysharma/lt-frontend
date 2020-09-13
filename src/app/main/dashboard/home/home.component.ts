import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { User } from "../../../models/user";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  profileForm: FormGroup;
  user: User;
  message: string;
  error: Object;
  loading = false;
  edit = false;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      id: [""],
      firstname: [""],
      lastname: [""],
      bio: [""],
      country: [""],
      email: ["", Validators.required],
    });

    this.userService.getProfile().subscribe({
      next: (user) => {
        console.log(user);
        this.user = user;
        this.profileForm.setValue(this.user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get profileFormControls() {
    return this.profileForm.controls;
  }

  editToggle() {
    this.edit = !this.edit;
  }

  onSubmit() {
    this.loading = true;
    const user = { ...this.profileForm.value };
    delete user.id;
    if (this.profileForm.invalid) {
      return;
    }
    this.userService.updateProfile(user).subscribe({
      next: (data) => {
        this.message = data?.message ?? "";
        this.clearEvent();
      },
      error: (error) => {
        this.error = error;
        this.clearEvent();
      },
    });
  }

  clearEvent() {
    this.loading = false;
    setTimeout(() => {
      this.edit = false;
      this.error = {};
      this.message = "";
    }, 2000);
  }
}

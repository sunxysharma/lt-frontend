import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate() {
        const {token} = this.authenticationService.userValue || {};
        if (token) {
           return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
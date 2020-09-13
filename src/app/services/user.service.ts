import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { map, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getProfile() {
        return this.http.get<any>(`${environment.apiUrl}/auth/user`) .pipe(
            map((obj) => {
              return  obj.data;
            }));
    }

    updateProfile(profile:User){
        return this.http.put<User>(`${environment.apiUrl}/auth/user`,profile);
    }
}
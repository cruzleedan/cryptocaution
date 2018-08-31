import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public authenticatingSubject = new BehaviorSubject(false);
    public authenticating$ = this.authenticatingSubject.asObservable();
    constructor() { }
}

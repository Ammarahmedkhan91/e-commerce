import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { signUp, login } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  isloginError = new EventEmitter<boolean>(false)

  userSignUp(data: signUp) {
    return this.http.post('http://localhost:3333/users', data, { observe: 'response' }).subscribe((result) => {
      if (result) {
        localStorage.setItem('user', JSON.stringify(result.body))
        this.router.navigate(['/'])
      }
    })
  }

  reloadUser() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/'])
    }
  }

  userlogin(data: login) {
    return this.http.get(`http://localhost:3333/users?email=${data.email}&password=${data.password}`, { observe: 'response' }).subscribe((result: any) => {
      if (result && result.body && result.body.length) {
        localStorage.setItem('user', JSON.stringify(result.body))
        this.router.navigate(['/'])
        this.isloginError.emit(false)
      } else {
        this.isloginError.emit(true)
      }
    })
  }

}



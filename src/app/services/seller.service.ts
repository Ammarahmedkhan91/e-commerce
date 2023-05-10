import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { SignUp, Login } from '../data-type';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  
  constructor(private http: HttpClient, private router: Router) { }

  isSellerLoggedIn = new BehaviorSubject<boolean>(false)
  isLoginError = new EventEmitter<boolean>(false)

  sellerSignUp(data: SignUp) {
    return this.http.post('http://localhost:3333/seller', data, { observe: 'response' }).subscribe((result) => {
      if (result) {
        this.isSellerLoggedIn.next(true)
        localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['seller-home'])
      }
    })
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true)
      this.router.navigate(['seller-home'])
    }
  }

  sellerLogin(data: Login) {
    return this.http.get(`http://localhost:3333/seller?email=${data.email}&password=${data.password}`, { observe: 'response' }).subscribe((result: any) => {

      if (result && result.body && result.body.length) {
        this.isSellerLoggedIn.next(true)
        localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['seller-home'])

      } else {
        this.isLoginError.emit(true)
      }
    })
  }

}



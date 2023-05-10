import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { Login, SignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {

  showLogin = false;
  authError:string = '';

  constructor(private seller:SellerService, private router:Router) {}
  
  ngOnInit():void{
    this.seller.reloadSeller()
  }
  
  signUp(data:SignUp):void{
    this.seller.sellerSignUp(data)
  }
  
  login(data:Login):void{
    this.seller.sellerLogin(data)
    this.seller.isLoginError.subscribe((isError)=>{
      if (isError) {
        this.authError = "Email or password isn't correct";
      }
    })
  }

  openLogin(){
    this.showLogin = true;
  }

  openSignup(){
    this.authError = "";
    this.showLogin = false;
  }

}

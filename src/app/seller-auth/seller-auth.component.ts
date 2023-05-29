import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Login, SignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {

  showLogin = true;
  authError:string = '';

  constructor(private seller:SellerService) {}
  
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

  openLoginForm(){
    this.showLogin = true;
  }

  openSignupForm(){
    this.authError = "";
    this.showLogin = false;
  }

}

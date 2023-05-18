import { Component } from '@angular/core';
import { Login, SignUp } from '../data-type';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  showLogin = false;
  authError:string = '';

  constructor(private user:UserService) {}
  
  ngOnInit():void{
    this.user.reloadUser()
  }
  
  signUp(data:SignUp):void{
    this.user.userSignUp(data)
  }
  
  login(data:Login):void{
    this.user.userLogin(data)
    this.user.isLoginError.subscribe((isError)=>{
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

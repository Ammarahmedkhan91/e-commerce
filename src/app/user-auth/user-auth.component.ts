import { Component } from '@angular/core';
import { Login, SignUp, cart, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  showLogin = false;
  authError: string = '';

  constructor(private user: UserService, private product: ProductService) { }

  ngOnInit(): void {
    this.user.reloadUser()
  }

  signUp(data: SignUp): void {
    this.user.userSignUp(data)
  }

  login(data: Login): void {
    this.user.userLogin(data)
    this.user.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Email or password isn't correct";
      }
      else {
        this.localCartToRemoteCart();
      }
    })
  }

  openLoginForm() {
    this.showLogin = true;
  }

  openSignupForm() {
    this.authError = "";
    this.showLogin = false;
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;
    if (data) {
      let cartDataList: product[] = JSON.parse(data);
      cartDataList.forEach((product: product, index) => {
      let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        };
        delete cartData.id;

        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((res) => {
            if (res) {
              console.log("Item stored in db")
            }
          })
          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500)

      })
    }

    setTimeout(()=> {
      this.product.getCartList(userId)
    }, 500)

  }
}

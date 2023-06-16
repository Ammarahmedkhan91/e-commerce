import { Component } from '@angular/core';
import { login, signUp, cart, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  showLogin = true;
  authError: string = '';

  constructor(private user: UserService, private product: ProductService) { }

  ngOnInit(): void {
    this.user.reloadUser()
  }

  signUp(data: signUp): void {
    this.user.userSignUp(data)
  }

  login(data: login): void {
    this.user.userlogin(data)
    this.user.isloginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Email or password isn't correct";
      }
      else {
        this.localCartToRemoteCart();
        this.product.getUserOrderLength();
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
    let localCart = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;
    if (localCart) {
      let cartDataList: product[] = JSON.parse(localCart);
      cartDataList.forEach((product: product, index) => {

        let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        };
        delete cartData.id;

        this.product.addToCart(cartData).subscribe((res) => {
          if (res) {
            console.log("Item stored in db")
          }
        })
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }

      })
    }
    this.product.getCartItems(userId);

  }
}

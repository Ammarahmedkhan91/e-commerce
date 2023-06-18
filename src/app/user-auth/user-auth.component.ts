import { Component } from '@angular/core';
import { login, signUp, cart, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  showLogin = true;
  authError: string = '';

  constructor(private user: UserService, private product: ProductService, private router: Router) { }

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

        let id = localStorage.getItem('id');
        if (id) {
          this.router.navigate([`details/${id}`])
        }

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

        delete product.sellerId;
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

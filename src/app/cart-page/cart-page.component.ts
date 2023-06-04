import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, summary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cartData: cart[] | undefined;
  summary: summary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      let price: number = 0;
      result.forEach((item) => {
        if (item.quantity) {
          let x = Number(item.price.toString().replace(/[^\d.-]/g, '')) * item.quantity;
          price += x
        }
      })
      this.summary.price = Math.floor(price);
      this.summary.discount = Math.floor(price / 500);
      this.summary.tax = Math.floor(price / 50);
      this.summary.delivery = 100;
      this.summary.total = this.summary.price - this.summary.discount + this.summary.tax + this.summary.delivery;

      if (!this.cartData.length) {
        this.router.navigate(['home'])
      }

    });
  }

  checkout() {
    this.router.navigate(['checkout']);
  }

  removeToCart(cartId: number | undefined) {
    cartId && this.product.removeToCart(cartId)
      .subscribe((result) => {
        this.getCartItems();
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user)[0].id;
        this.product.getCartList(userId);
      })
  }

}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order, summary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartData: cart[] | undefined;
  orderMsg: string | undefined;
  summary: summary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {

    let productId = localStorage.getItem('productId')
    if (productId) {
      this.cartItems();
    } else {
      this.getCartItems();
    }

  }

  cartItems() {
    this.product.cartItems().subscribe((result) => {
      let price: number = 0;
      this.cartData = result;
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
        this.router.navigate(['/'])
      }

    });
  }

  getCartItems() {
    this.product.userCartItems().subscribe((result) => {
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
        this.router.navigate(['/'])
      }

    });
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;
    if (user) {
      if (this.summary.total) {
        let orderData: order = {
          ...data,
          totalPrice: this.summary.total,
          userId,
          id: undefined
        }

        this.product.orderNow(orderData).subscribe((result) => {
          if (result) {
            this.orderMsg = "Your order has been placed"
            setTimeout(() => {
              this.router.navigate(['my-orders']);
              this.orderMsg = undefined;
            }, 3000);
          }
        })

        this.cartData?.forEach((item) => {
          item.id && this.product.deleteCartItems(item.id)
        })
      }

    } else {
      if (this.summary.total) {
        let orderData: order = {
          ...data,
          totalPrice: this.summary.total,
          userId: undefined,
          id: undefined
        }

        this.product.orderNow(orderData).subscribe((result) => {
          if (result) {
            this.orderMsg = "Your order has been placed"
            setTimeout(() => {
              this.router.navigate(['my-orders']);
              localStorage.removeItem('productId')
              this.orderMsg = undefined;
            }, 3000);
          }
        })

        this.cartData?.forEach((item) => {
          item.id && this.product.deleteCartItems(item.id)
        })

      }
    }
  }

}

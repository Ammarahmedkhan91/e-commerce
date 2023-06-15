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

  userCartData: cart[] | undefined;
  localCartData: cart | undefined;
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
    this.buyProduct();
  }

  buyProduct() {

    let localProduct = localStorage.getItem('product');
    if (localProduct) {
      let product = JSON.parse(localProduct);
      product['productId'] = product['id'];
      delete product.id;
      this.localCartData = product;
      let price: number = 0;
      if (this.localCartData && this.localCartData.quantity) {
        let x = Number(this.localCartData.price.toString().replace(/[^\d.-]/g, '')) * this.localCartData.quantity;
        price += x;
      }
      this.summary.price = Math.floor(price);
      this.summary.discount = Math.floor(price / 500);
      this.summary.tax = Math.floor(price / 50);
      this.summary.delivery = 100;
      this.summary.total = this.summary.price - this.summary.discount + this.summary.tax + this.summary.delivery;
    } else {
      this.router.navigate(['/'])
    }

  }

  cartItems() {
    this.product.cartItems().subscribe((result) => {
      let price: number = 0;
      this.userCartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          let x = Number(item.price.toString().replace(/[^\d.-]/g, '')) * item.quantity;
          price += x;
        }
      })
      this.summary.price = Math.floor(price);
      this.summary.discount = Math.floor(price / 500);
      this.summary.tax = Math.floor(price / 50);
      this.summary.delivery = 100;
      this.summary.total = this.summary.price - this.summary.discount + this.summary.tax + this.summary.delivery;

      if (!this.userCartData.length) {
        this.router.navigate(['/'])
      }
    });

  }

  getCartItems() {
    this.product.userCartItems().subscribe((result) => {
      this.userCartData = result;
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

      if (!this.userCartData.length) {
        this.router.navigate(['/'])
      }

    });
  }

  orderNow(data: { email: string, address: string, contact: string }) {

    let user = localStorage.getItem('user');
    let localProduct = localStorage.getItem('product');

    let userId = user && JSON.parse(user)[0].id;
    let productId = localProduct && JSON.parse(localProduct).id;
    let productName = localProduct && JSON.parse(localProduct).name;
    let productImage = localProduct && JSON.parse(localProduct).image;

      if (this.summary.total) {
        let orderData: order = {
          ...data,
          productName,
          totalPrice: this.summary.total,
          productImage,
          userId: userId,
          productId,
          id: undefined
        }

        this.product.userOrder(orderData).subscribe((result) => {
          if (result) {
            this.orderMsg = "Your order has been placed";
            this.product.getUserOrderLength();
            setTimeout(() => {
              this.router.navigate(['my-orders']);
              localStorage.removeItem('product');
              this.orderMsg = undefined;
            }, 3000);
          }
        });
      }

  };


}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {
      let price: number = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          let x = Number(item.price.toString().replace(/[^\d.-]/g, '')) * item.quantity;
          price += x;
        }
      })
      this.totalPrice = Math.floor(price) - Math.floor(price / 500) + Math.floor(price / 50) + 100;;
    });
    
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;

    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
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
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id)
        }, 500);
      })
      
    }
  }
}

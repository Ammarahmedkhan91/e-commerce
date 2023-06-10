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
    this.product.cartItems().subscribe((result) => {
      this.cartData = result;
      if (!this.cartData.length) {
        this.router.navigate(['/'])
      }
    })
  }

  removeToCart(cartId: number | undefined) {
    cartId && this.product.removeToCart(cartId).subscribe(() => {
      this.product.getCartLength();
      this.product.cartItems().subscribe((result) => {
        this.cartData = result;
        if (!this.cartData.length) {
          this.router.navigate(['/'])
        }
      })
    })
  }

  checkout() {
    this.router.navigate(['checkout']);
  }

}

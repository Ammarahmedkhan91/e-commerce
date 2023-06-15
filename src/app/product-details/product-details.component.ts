import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  removeCart: boolean = false;
  cartData: product | undefined;

  constructor(private activatedRoute: ActivatedRoute, private product: ProductService, private router: Router) { }

  ngOnInit(): void {

    let productId = this.activatedRoute.snapshot.paramMap.get('productId');
    let localCart = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');

    productId && this.product.getProduct(productId).subscribe((result) => {
      this.productData = result;
    });

    let userId = user && JSON.parse(user)[0].id;
    this.product.getCartItems(userId);

    if (!user) {
      if (productId && localCart) {
        let cartData = JSON.parse(localCart);
        cartData = cartData.filter((cartItems: product) => productId === cartItems.id.toString())
        if (cartData.length) {
          this.removeCart = true;
        } else {
          this.removeCart = false;
        }
      }
    }

    this.product.cartLength.subscribe((result) => {
      let item = result.filter((item: product) => productId?.toString() === item.productId?.toString())
      if (item.length) {
        this.cartData = item[0];
        this.removeCart = true;
      }
    })

  }

  buyProduct() {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['user-auth'])
    } else {
      if (this.productData) {
        this.productData.quantity = this.productQuantity;
        this.productData.sellerId = undefined;
        localStorage.setItem('product', JSON.stringify(this.productData));
        this.router.navigate(['checkout']);
      }
    }

  }

  addToCart() {
    if (this.productData) {
      if (!localStorage.getItem('user')) {
        this.productData.quantity = this.productQuantity;
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user)[0].id;
        let productId = this.productData.id;
        let cartData: cart = {
          ...this.productData,
          userId,
          productId
        }
        delete cartData.id;
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartItems(userId);
            this.removeCart = true;
          }
        })
      }
    }
  }

  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.localRemoveToCart(productId);
      this.removeCart = false;
    } else {
      this.cartData && this.product.removeToCart(this.cartData.id).subscribe((result) => {
        if (result) {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user)[0].id;
          this.product.getCartItems(userId);
          this.removeCart = false;
          this.product.getCartLength();
        }
      })
    }
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }
}

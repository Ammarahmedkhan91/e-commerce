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

    let productId = this.activatedRoute.snapshot.paramMap.get('productId')
    productId && this.product.getProduct(productId).subscribe((result) => {
      this.productData = result;
    })

    let cartData = localStorage.getItem('localCart');
    if (productId && cartData) {
      let items = JSON.parse(cartData)
      items = items.filter((item: product) => productId === item.id.toString())
      if (items.length) {
        this.removeCart = true;
      } else {
        this.removeCart = false;
      }
    }

    let user = localStorage.getItem('user');
    if (user) {
      let userId = user && JSON.parse(user)[0].id;
      this.product.getCartList(userId);
      this.product.cartLength.subscribe((result) => {
        let item = result.filter((item: product) => productId?.toString() === item.productId?.toString())
        if (item.length) {
          this.cartData = item[0];
          this.removeCart = true;
        }
      })
    }

  }

  buyProduct() {

    if (this.productData) {
      this.productData.quantity = this.productQuantity;
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
          this.product.getCartList(userId);
          this.removeCart = true;
        }
      })
      this.router.navigate(['cart-page'])

    }

  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData)
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
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        })
      }
    }
  }

  removeToCart(id: number) {
    if (!localStorage.getItem('user')) {
      this.product.localRemoveToCart(id);
    } else {
      this.cartData && this.product.removeToCart(this.cartData.id)
        .subscribe((result) => {
          if (result) {
            let user = localStorage.getItem('user');
            let userId = user && JSON.parse(user)[0].id;
            this.product.getCartList(userId);
            this.removeCart = false;
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

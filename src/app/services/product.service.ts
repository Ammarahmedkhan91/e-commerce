import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  localCartLength = new EventEmitter<product[] | []>();
  // localOrderLength = new EventEmitter<order[] | []>();
  cartLength = new EventEmitter<cart[] | []>();
  orderLength = new EventEmitter<order[] | []>();
  orderData = new EventEmitter<order[] | undefined>();

  constructor(private http: HttpClient, private router: Router) { }

  addProduct(data: product) {
    return this.http.post('http://localhost:3333/products', data);
  }

  productList(id: number) {
    return this.http.get<product[]>(`http://localhost:3333/products?sellerId=${id}`);
    // return this.http.get<product[]>('http://192.168.53.105:8080/api/products');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3333/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3333/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(`http://localhost:3333/products/${product.id}`, product);
  }

  popularProducts() {
    return this.http.get<product[]>('http://localhost:3333/products?_limit=5');
    // return this.http.get<product[]>('http://192.168.53.105:8080/api/products?_limit=5');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3333/products?_limit=12');
    // return this.http.get<product[]>('http://192.168.53.105:8080/api/products?_limit=12');
  }

  searchProducts(query: string) {
    return this.http.get<product[]>(`http://localhost:3333/products?q=${query}`);
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3333/cart', cartData);
  }

  localAddToCart(productData: product) {
    let cartData = []
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([productData]))
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(productData);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.localCartLength.emit(cartData);
  }

  localRemoveToCart(productId: number) {
    let localCart = localStorage.getItem('localCart');
    if (localCart) {
      let items: product[] = JSON.parse(localCart);
      items = items.filter((item: product) => productId !== item.id);
      this.localCartLength.emit(items);
      localStorage.setItem('localCart', JSON.stringify(items));
    }
  }

  // cartItems() {
  //   return this.http.get<cart[]>(`http://localhost:3333/cart`);
  // }

  userCartItems() {
    let user = localStorage.getItem('user');
    let userData = user && JSON.parse(user)[0];
    return this.http.get<cart[]>(`http://localhost:3333/cart?userId=${userData.id}`);
  }

  getCartItems(userId: number) {
    return this.http.get<cart[]>(`http://localhost:3333/cart?userId=${userId}`,
      { observe: 'response' }).subscribe((res) => {
        if (res && res.body) {
          this.cartLength.emit(res.body);
        }
      });
  }

  getCartLength() {
    let user = localStorage.getItem('user');
    let userData = user && JSON.parse(user)[0];
    return userData && this.http.get<cart[]>(`http://localhost:3333/cart?userId=${userData.id}`,
      { observe: 'response' }).subscribe((res) => {
        res.body && this.cartLength.emit(res.body);
      })
  }

  removeToCart(cartId: number) {
    return this.http.delete(`http://localhost:3333/cart/${cartId}`)
  }

  deleteCartItems(cartId: number) {
    return this.http.delete(`http://localhost:3333/cart/${cartId}`,
      { observe: 'response' }).subscribe((result) => {
        if (result) {
          this.cartLength.emit([]);
        }
      });
  }

  userOrder(data: order) {
    return this.http.post('http://localhost:3333/orders', data)
  }

  userOrderList() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;
    if (userId) {
      this.http.get<order[]>(`http://localhost:3333/orders?userId=${userId}`)
        .subscribe((result) => {
          if (result.length) {
            this.orderData.emit(result);
            this.orderLength.emit(result)
          }
          else {
            this.router.navigate(['/'])
          }
        })
    }
  }

  getUserOrder(userId: number) {
    return this.http.get<order[]>(`http://localhost:3333/orders?userId=${userId}`)
  }

  getUserOrderLength() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;
    if (userId) {
      this.http.get<order[]>(`http://localhost:3333/orders?userId=${userId}`)
        .subscribe((result) => {
          if (result.length) {
            this.orderLength.emit(result)
          }
        })
    }
  }

  cancelOrder(id: number) {
    return this.http.delete<order[]>(`http://localhost:3333/orders/${id}`)
  }

}

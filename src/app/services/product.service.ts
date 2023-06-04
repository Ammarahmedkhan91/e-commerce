import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartLength = new EventEmitter<product[] | []>();
  orderLength = new EventEmitter<order[] | []>();
  orderData = new EventEmitter<order[] | undefined>();

  constructor(private http: HttpClient, private router: Router) { }

  getOrderLength() {
    let user = localStorage.getItem('user');
    let userData = user && JSON.parse(user)[0];
    return userData && this.http.get<order[]>(`http://localhost:3333/orders?userId=${userData.id}`)
      .subscribe((result) => {
        if (result.length) {
          this.orderLength.emit(result)
        }
      })
  }

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

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart')
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]))
      this.cartLength.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData))
      this.cartLength.emit(cartData);
    }
  }

  localRemoveToCart(productId: number) {
    let cart = localStorage.getItem('localCart');
    if (cart) {
      let items: product[] = JSON.parse(cart);
      items = items.filter((item: product) => productId !== item.id)
      localStorage.setItem('localCart', JSON.stringify(items))
      this.cartLength.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3333/cart', cartData);
  }

  getCartList(userId: number) {
    return this.http.get<product[]>(`http://localhost:3333/cart?userId=${userId}`,
      { observe: 'response' }).subscribe((res) => {
        if (res && res.body) {
          this.cartLength.emit(res.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete(`http://localhost:3333/cart/${cartId}`);
  }

  currentCart() {
    let user = localStorage.getItem('user');
    let userData = user && JSON.parse(user)[0];
    return this.http.get<cart[]>(`http://localhost:3333/cart?userId=${userData.id}`);
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3333/orders', data)
  }

  orderList() {
    let user = localStorage.getItem('user');
    let userData = user && JSON.parse(user)[0];
    return this.http.get<order[]>(`http://localhost:3333/orders?userId=${userData.id}`)
      .subscribe((result) => {
        this.orderLength.emit(result)
        if (result.length) {
          this.orderData.emit(result);
          this.router.navigate(['my-orders'])
        }
        else {
          this.router.navigate(['home'])
        }
      })

  }

  deleteCartItems(cartId: number) {
    return this.http.delete(`http://localhost:3333/cart/${cartId}`,
      { observe: 'response' }).subscribe((result) => {
        if (result) {
          this.cartLength.emit([]);
        }
      });
  }

  cancelOrder(id: number) {
    return this.http.delete(`http://localhost:3333/orders/${id}`)
  }

}

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, product } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartLength = new EventEmitter<product[] | []>();

  constructor(private http: HttpClient) { }

  addProduct(data: product) {
    return this.http.post('http://localhost:3333/products', data);
  }

  productList() {
    return this.http.get<product[]>('http://localhost:3333/products');
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
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3333/products?_limit=12');
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
    return this.http.get<product[]>("http://localhost:3333/cart?userId="+userId,
      { observe: 'response' }).subscribe((res) => {
        if (res && res.body) {       
          this.cartLength.emit(res.body);
        }
      });
  }

}

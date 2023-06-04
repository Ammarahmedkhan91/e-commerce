import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  addProductMessage: string | undefined;
  constructor(private product: ProductService) { }

  submit(product: product) {
    let seller = localStorage.getItem('seller')
    let sellerId = seller && JSON.parse(seller)[0].id;
    
    let data: product = {
      ...product,
      sellerId
    }

    this.product.addProduct(data).subscribe((result) => {
      if (result) {
        this.addProductMessage = "Product is successfully added"
      }
      setTimeout(() => this.addProductMessage = undefined, 2000)
    })
  }

}

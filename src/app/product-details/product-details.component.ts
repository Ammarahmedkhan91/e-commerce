import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  productData: any = [];
  productQuantity:number = 1;

  constructor(private activatedRouter: ActivatedRoute, private product: ProductService) {}

  ngOnInit():void {
    let productId = this.activatedRouter.snapshot.paramMap.get('productId')
    console.log(productId)
    if (productId) {
      this.product.getProduct(productId).subscribe((result)=>{
        console.log(result)
        this.productData = result;
      })
    }
  }

  handleQuantity(val:string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

}
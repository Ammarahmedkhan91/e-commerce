import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  productData: undefined | product;
  productId: undefined | string;
  productMessage: undefined | string;

  constructor(private activate: ActivatedRoute, private productService: ProductService, private router:Router) { }

  ngOnInit(): void {
    let productId = this.activate.snapshot.paramMap.get('id')
    productId && this.productService.getProduct(productId).subscribe((data) => {
      this.productData = data;
    })
  }

  submit(data: product) {
    if (this.productData) {
      data.id = this.productData.id;
    }
    this.productService.updateProduct(data).subscribe((result) => {
      if (result) {
          this.productMessage = "Product has updated";
          setTimeout(()=>{
            this.productMessage = undefined;
            this.router.navigate(['seller-home']);  
          },3000)
      }
    })
  }

}

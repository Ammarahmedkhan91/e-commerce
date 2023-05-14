import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {

  productList: undefined | product[];
  productMessage: undefined | string;
  trash = faTrash;
  edit = faEdit;

  constructor(private product: ProductService, private router:Router) { }

  ngOnInit(): void {
    this.list(); 
  }



  list(){
    this.product.productList().subscribe((result) => {
      this.productList = result;
    })
  }

  deleteProduct(id: number) {
    this.product.deleteProduct(id).subscribe((result) => {

      if (result) {
        this.productMessage = 'Product is deleted';
        setTimeout( () => this.productMessage = undefined, 2000)
        this.list()
      }
    })
  }

}

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

  productHeading: string | undefined = "Product List";
  productList: product[] | undefined;
  productMessage: string | undefined;
  trash = faTrash;
  edit = faEdit;

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.list();
  }

  list() {
    let seller = localStorage.getItem('seller')
    let sellerId = seller && JSON.parse(seller)[0].id;

    this.product.productList(sellerId).subscribe((result) => {
      this.productList = result;
      if (result.length === 0) {
        this.router.navigate(['seller-add-product'])
      }
    })
  }

  deleteProduct(id: number) {
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product is deleted';
        setTimeout(() => this.productMessage = undefined, 2000)
        this.list()
      }
    })
  }

}

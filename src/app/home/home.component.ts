import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  popularProduct: undefined | product[];

  constructor(private productService: ProductService) {}

  ngOnInit(): void{
    this.productService.popularProducts().subscribe((product)=>{
      this.popularProduct = product;
    })
  }

} 

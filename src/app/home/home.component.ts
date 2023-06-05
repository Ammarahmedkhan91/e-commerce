import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];
  page:number = 1;
  itemsPerPage: number = 4;

  constructor(private productService: ProductService) {}

  ngOnInit(): void{
    this.productService.popularProducts().subscribe((data)=>{
      this.popularProducts = data;
    })

    this.productService.trendyProducts().subscribe((data)=>{
      this.trendyProducts = data;
    })
  }

} 

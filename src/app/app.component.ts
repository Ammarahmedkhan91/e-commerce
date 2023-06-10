import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ecom-project';
  constructor(private product: ProductService) { }
  ngOnInit(): void {
    this.product.getCartLength();
  }
}

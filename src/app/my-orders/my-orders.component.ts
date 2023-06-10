import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { order } from '../data-type';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orderData: order[] | undefined;

  constructor(private product: ProductService) { }

  ngOnInit(): void {
    let user = localStorage.getItem('user')
    if (user) {
      this.getOrderList();
    } else {
      this.getLocalOrderList()
    }
  }

  getOrderList() {
    this.product.orderList();
    this.product.orderData.subscribe((result) => {
      this.orderData = result;
    });
  }

  getLocalOrderList() {
    this.product.localOrderList();
    this.product.orderData.subscribe((result) => {
      this.orderData = result;
    });
  }

  cancelOrder(id: number | undefined) {
    let user = localStorage.getItem('user')
    if (user) {
      id && this.product.cancelOrder(id).subscribe(() => {
        this.getOrderList();
      })
    } else {
      id && this.product.cancelOrder(id).subscribe(() => {
        this.getLocalOrderList();
      })
    }

  }

}
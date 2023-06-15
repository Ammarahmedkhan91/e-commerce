import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orderData: order[] | undefined;

  constructor(private product: ProductService, public router: Router) { }

  ngOnInit(): void {
    let user = localStorage.getItem('user')
    if (user) {
      this.userOrderList();
    }
  }

  userOrderList() {
    this.product.userOrderList();
    this.product.orderData.subscribe((result) => {
      this.orderData = result;
    });
  }

  cancelOrder(id: number | undefined) {

    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)[0].id;

    id && this.product.cancelOrder(id).subscribe((result) => {
      this.product.getUserOrder(userId).subscribe((result) => {
        if (result.length) {
          this.orderData = result;
          this.product.orderLength.emit(result)
        } else {
          this.router.navigate(['/']);
          this.product.orderLength.emit([]);
        }
      })
    })

  }

}
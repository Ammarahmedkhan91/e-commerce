import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faMagnifyingGlass, faCartShopping, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  user: any = '';
  userName: string = '';
  seller: any = '';
  sellerName: string = '';
  searchResult: undefined | product[];
  searchNotFound: undefined | string;
  searchIcon = faMagnifyingGlass;
  logo = faCartShopping;
  bar = faBars;
  time = faTimes;
  cartItems = 0;
  orderLength = 0

  constructor(private router: Router, private product: ProductService) { }

  ngOnInit(): void {

    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([]))
    }

    this.product.orderLength.subscribe((items) => {
      this.orderLength = items.length;
    });

    this.product.cartLength.subscribe((items) => {
      this.cartItems = items.length;
    })

    let user = localStorage.getItem('user');

    if (user) {

      this.product.getUserOrderLength();
      this.product.orderLength.subscribe((items) => {
        this.orderLength = items.length;
      });

      this.product.getCartLength();
      this.product.cartLength.subscribe((items) => {
        this.cartItems = items.length;
      });

    } else {

      let localCart = localStorage.getItem('localCart');
      if (localCart) {
        this.cartItems = JSON.parse(localCart).length;
        this.product.localCartLength.subscribe((items) => {
          this.cartItems = items.length;
        });
      }

      // let localOrder = localStorage.getItem('order');
      // if (localOrder) {
      //   this.orderLength = JSON.parse(localOrder).length;
      //   this.product.localOrderLength.subscribe((items) => {
      //     this.orderLength = items.length;
      //   });
      // }

    }

    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.seller = localStorage.getItem('seller')
          let sellerData = JSON.parse(this.seller)[0] || JSON.parse(this.seller)
          this.sellerName = sellerData.fName;
          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {
          this.user = localStorage.getItem('user')
          let userData = JSON.parse(this.user)[0] || JSON.parse(this.seller)
          this.userName = userData.fName;
          this.menuType = 'user';
          this.product.getCartItems(userData.id)
        }
        else {
          this.menuType = 'default';
        }
      }
    });

  }

  sellerLogOut() {
    localStorage.removeItem('seller');
    this.router.navigate(['seller-auth'])
  }
  userLogOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('product');
    localStorage.removeItem('productId');
    this.router.navigate(['user-auth'])
    this.product.cartLength.emit([]);
    this.product.orderLength.emit([]);
  }

  searchProducts(value: string) {
    if (value) {
      this.product.searchProducts(value).subscribe((result) => {

        if (result.length >= 5) {
          result.length = 5;
        } else if (result.length == 0) {
          this.searchNotFound = "Search not found";
        } else if (this.searchResult) {
          this.searchNotFound = undefined;
        }
        this.searchResult = result;
      })
    }
    else {
      this.searchResult = undefined;
      this.searchNotFound = undefined;
    }
  }

  hideSearchProducts() {
    this.searchResult = undefined;
    this.searchNotFound = undefined
  }

  submitSearch(searchVal: string) {
    if (searchVal) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`search/${searchVal}`]);
      });
    }
  }

  redirectToDetails(id: number) {
    if (id) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`details/${id}`]);
      });
    }
  }

  navigateToOrderPage() {
    let user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['user-auth']);
    } else {
      if (this.orderLength > 0) {
        this.router.navigate(['my-orders']);
      }
    }
  }

  navigateToCartPage() {
    if (this.cartItems > 0) {
      this.router.navigate(['user-auth']);
    } 
  }

}

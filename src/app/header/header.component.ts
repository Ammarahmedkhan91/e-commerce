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

  constructor(private router: Router, private product: ProductService) { }

  ngOnInit(): void {
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
        } 
        else {
          this.menuType = 'default';
        }
      }
    })

    let cart = localStorage.getItem('localCart');
    if (cart) {
      this.cartItems = JSON.parse(cart).length;
    }
    this.product.cartLength.subscribe((items) => {
      this.cartItems = items.length;
    })
  }

  sellerLogOut() {
    localStorage.removeItem('seller');
    this.router.navigate(['seller-auth'])
  }
  userLogOut() {
    localStorage.removeItem('user');
    this.router.navigate(['user-auth'])
    this.product.cartLength.emit([])
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

}

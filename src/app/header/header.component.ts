import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuType: string = 'default';
  seller: any = '';
  sellerName: string = '';
  searchResult: undefined | product[];
  searchNotFound: undefined | string;
  searchIcon = faMagnifyingGlass;

  constructor(private router: Router, private product: ProductService) { }

  ngOnInit(): void {
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.menuType = 'seller';
          this.seller = localStorage.getItem('seller')
          let sellerData = JSON.parse(this.seller)[0]
          this.sellerName = sellerData.fName;
        } else {
          this.menuType = 'default';
        }
      }
    })
  }

  logOut() {
    localStorage.removeItem('seller');
    this.router.navigate(['/'])
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
    else{
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
      this.router.navigate([`search/${searchVal}`])
      window.location.replace(`/search/${searchVal}`)
    }
    else{
      window.location.replace('/')
    }
  }

}

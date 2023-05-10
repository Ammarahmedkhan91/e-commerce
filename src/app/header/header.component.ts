import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuType: string = 'default';
  seller: any = '';
  sellerName: string = ''

  constructor(private router: Router) { }

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

}

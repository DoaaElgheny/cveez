import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.scss'],
})
export class ClientLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  wattsApp() {
    let href='cveez';

      return window.open('https://api.whatsapp.com/send?phone=971543349643', '_blank');
    
  }
}

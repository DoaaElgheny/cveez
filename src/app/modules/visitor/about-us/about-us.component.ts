import { Component, OnInit , ViewChild,} from '@angular/core';
import { CommunicationService } from 'src/app/services/common/communication.service';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  constructor(private communicationService: CommunicationService,) { this.communicationService.getHeaderClass(true);}
  images = [
    '/assets/imgs/home-bg.jpg',
    '../../../../assets/imgs/about-bg.jpg',
    '../../../../assets/imgs/about.jpg',
  ];
  @ViewChild('ngcarousel', { static: true }) ngCarousel!: NgbCarousel;

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  ngOnDestroy(): void {
    this.communicationService.getHeaderClass(false);
  }


  nextFun() {
    this.ngCarousel.next();
    window.scrollTo(0, 0);
  }

  prevFun() {
    this.ngCarousel.prev();
    window.scrollTo(0, 0);
  }
}

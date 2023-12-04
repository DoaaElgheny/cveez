import { Component, OnInit , ViewChild,} from '@angular/core';

import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationService } from 'src/app/services/common/communication.service';

@Component({
  selector: 'app-news_blogs',
  templateUrl: './news_blogs.component.html',
  styleUrls: ['./news_blogs.component.scss'],
})
export class NewsBlogsComponent implements OnInit {
  constructor(private communicationService: CommunicationService,) { this.communicationService.getHeaderClass(true);}
 
  @ViewChild('ngcarousel', { static: true }) ngCarousel!: NgbCarousel;

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  ngOnDestroy(): void {
    this.communicationService.getHeaderClass(false);
  }


}

import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoStatus } from 'src/app/services/enums/video-status';

@Component({
  selector: 'app-view-video-modal',
  templateUrl: './view-video-modal.component.html',
  styleUrls: ['./view-video-modal.component.scss']
})
export class ViewVideoModalComponent implements OnInit {
 @Input() videoLink: any;
 @Input() vedioStatus: any;
 thevideoStatus = VideoStatus;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
   
  }

  closeFunction()
  {
    this.modalService.dismissAll('Cross click');
  }
}

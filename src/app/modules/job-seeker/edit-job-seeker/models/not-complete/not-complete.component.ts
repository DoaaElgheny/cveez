import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-not-complete',
  templateUrl: './not-complete.component.html',
  styleUrls: ['./not-complete.component.scss']
})
export class NotCompleteComponent implements OnInit {

  constructor( private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  closeFunction() {
    this.modalService.dismissAll('Cross click');
  }

}

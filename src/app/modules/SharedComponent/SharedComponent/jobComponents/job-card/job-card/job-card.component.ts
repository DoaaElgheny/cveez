import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MyOrderJopSeekerService } from 'src/app/services/api/my-order-jop-seeker.service';
import { OpportunityAcceptanceState } from 'src/app/services/enums/opportunity-acceptance-state';
import { OpportunityState } from 'src/app/services/enums/opportunity-state';
@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
})
export class JobCardComponent implements OnInit {
  @Input() item: any;
  @Input() isDetails: any;
  @Input() isSaved: boolean;
  @Input() id: any;
  @Input() logoConditions: boolean;
  @Input() ShowOpportunityCondition: boolean;
  opportunityState = OpportunityState;
  opportunityAcceptanceState = OpportunityAcceptanceState;
  @Output() bindValue: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private myOrderService: MyOrderJopSeekerService,
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
  ) {}

  ngOnInit(): void {
  
  }

  showDetails(item: any) { 
   
    this.spinner.show();
    this.isDetails = this.id;
    this.myOrderService.getDetails(this.id).subscribe( {
      next: (res) => {
        this.bindValue.emit({
          object: res,
          isDetails: this.isDetails,
        });
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
     
    });
  }
}

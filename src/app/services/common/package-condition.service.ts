import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../Constants/constants';
import { ConditionType, Payment } from '../enums/payment-conditions.enum';

@Injectable({
  providedIn: 'root',
})
export class PackageConditionService {
  payment = Payment;
  conditionType: any = ConditionType;
  //package codition
  private logoConditions = new BehaviorSubject<boolean>(false);
  private ShowOpportunityCondition = new BehaviorSubject<boolean>(false);
  private paymentType = new BehaviorSubject<number>(this.payment.NotPaied);

  //
  currentUser: any;
  //package codition
  logoConditions$ = this.logoConditions.asObservable();
  ShowOpportunityCondition$ = this.ShowOpportunityCondition.asObservable();

  paymentType$ = this.paymentType.asObservable();
  //
  condtionsToCurrentUser: any = JSON.parse(
    String(localStorage.getItem('condtions-to-current-user'))
  );
  constructor() {}

  //get condition Package
  getConditionPackage() {
    this.condtionsToCurrentUser = JSON.parse(
      String(localStorage.getItem('condtions-to-current-user'))
    );

    this.currentUser = window.localStorage.getItem('currentUsercveez')
      ? JSON.parse(window.localStorage.getItem('currentUsercveez') || '')
      : null;

    if (!this.currentUser) {
      this.logoConditions.next(false);
      this.ShowOpportunityCondition.next(false);
      this.paymentType.next(this.payment.Expired);
    } else if (
      this.currentUser.roles[0] === Constants.AllRoles.cveezSuperAdmin
    ) {
      this.logoConditions.next(true);
      this.ShowOpportunityCondition.next(true);
      this.paymentType.next(this.payment.Paied);
    } else if (
      this.currentUser.roles[0] === Constants.AllRoles.cveezAgent &&
      this.condtionsToCurrentUser.paymentType === this.payment.Paied
    ) {
      this.logoConditions.next(true);
      this.ShowOpportunityCondition.next(true);

      this.paymentType.next(this.condtionsToCurrentUser.paymentType);
    } else if (
      this.currentUser.roles[0] === Constants.AllRoles.cveezJobSeeker &&
      this.condtionsToCurrentUser.paymentType === this.payment.Paied
    ) {
      this.paymentType.next(this.condtionsToCurrentUser.paymentType);
      let logoConditions = this.condtionsToCurrentUser.getConditions.find(
        (condition: any) =>
          condition.conditionType === this.conditionType.ShowLogo
      );
      logoConditions
        ? this.logoConditions.next(true)
        : this.logoConditions.next(false);
      let ShowOpportunityCondition =
        this.condtionsToCurrentUser.getConditions.find(
          (condition: any) =>
            condition.conditionType === this.conditionType.ShowOpportunity
        );
      ShowOpportunityCondition
        ? this.ShowOpportunityCondition.next(true)
        : this.ShowOpportunityCondition.next(false);
    } else {
      this.logoConditions.next(false);
      this.ShowOpportunityCondition.next(false);

      this.paymentType.next(this.payment.Expired);
    }
  }
}

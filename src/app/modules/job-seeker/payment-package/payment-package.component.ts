import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { Constants } from 'src/app/services/Constants/constants';
import { AgentManagementService } from 'src/app/services/api/agent-management.service';
import { JobSekerManagementService } from 'src/app/services/api/job-seker-management.service';
import { ManageDiscountCodesService } from 'src/app/services/api/manage-discount-codes.service';
import { DiscountCondtion } from 'src/app/services/enums/discount-code.enum';
import { ManageStripePaymentService } from 'src/app/services/api/manage-stripe-payment.service';

import { DurationPackage } from 'src/app/services/enums/duration-package';

@Component({
  selector: 'app-payment-package',
  templateUrl: './payment-package.component.html',
  styleUrls: ['./payment-package.component.scss'],
})
export class PaymentPackageComponent implements OnInit, OnDestroy {
  packages: any = [];
  isHover: boolean = false;
  private currentUser: any = null;
  code: string | null = null;
  packageId: number = 0;
  discoundCondtion: any = DiscountCondtion;
  durationPackage: any = DurationPackage;
  dicountCodeResult: any = null;
  private unsubscribe: Subscription[] = [];
  paymentHandler: any = null;
  packagePrice: any;
  stripeToken: any;
  stripeAPIKey: any =
  // 'pk_test_51NZEeoEIgAaUD7lb9uK00yTEiCK9S5RJO9TpWFfwxcFsOhkkSb5fCo4YE7CSKNGbNz8JYTBtdLPjHTaTclqrCxZI00ltKTXdqU';
    'pk_live_51NZEeoEIgAaUD7lbqDbgbRmdftnWfWwa3MCu1cdV1LYYWDMOVWV8DK5eBTYhf8fTAav747fBJlVV5W4BhDiH0KWV00vRmsFT6S';
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private manageStripePaymentService: ManageStripePaymentService,
    public router: Router,
    private JobSeekerServices: JobSekerManagementService,
    private authService: AuthService,
    private manageDiscountCodeService: ManageDiscountCodesService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getData();
    this.invokeStripe();
  }

  getData() {
    this.spinner.show();
    this.JobSeekerServices.getAllPackages().subscribe({
      next: (packages) => {
        this.packages = packages;
        this.packages.map((item: any) => {
          if (item.isSelected) {
            this.packageId = item.id;
          }
        });
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
    });
  }

  submitDiscountCode() {
    this.dicountCodeResult = null;
    if (this.packageId === 0) {
      this.toastr.error(
        this.translate.instant('viewProfileuser.YouShouldSelectPackageFirst')
      );
      return;
    }
    if (this.code === null) {
      if (document.getElementById('error')) {
        document.getElementsByClassName('error')[0]!.innerHTML =
          this.translate.instant(
            'viewProfileuser.YouShouldEnterDiscountCodeFirst'
          );
      }
      return;
    }

    this.spinner.show();
    this.manageDiscountCodeService
      .discountPrice({ id: this.packageId, code: this.code })
      .subscribe({
        next: (result) => {
          this.spinner.hide();
          document.getElementById('error')!.innerHTML = '';
          this.dicountCodeResult = result;
          this.packagePrice = result.packagePrice;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.spinner.hide();
          this.dicountCodeResult = null;
          document.getElementById('error')!.innerHTML =
            err.error?.error?.message;
          this.cdr.detectChanges();
        },
      });
  }

  submit() {
    if (this.packageId === 0) {
      this.toastr.error(
        this.translate.instant('viewProfileuser.YouShouldSelectPackageFirst')
      );
      return;
    }

    let object = { id: this.packageId, code: this.code };
    if (!this.code || (!this.dicountCodeResult && this.code)) {
      object.code = null;
      this.code = null;
    }

    this.spinner.show();
    this.makePayment();
  }
  completPayment() {
    this.spinner.show();

    let obj = {
      amount: this.packagePrice,
      currency: 'USD',
      cardToken: this.stripeToken,
      id: this.packageId,
      code: this.code,
    };
    this.manageStripePaymentService.payment(obj).subscribe({
      next: (res) => {
        if (this.currentUser.roles[0] == Constants.AllRoles.cveezAgent) {
          this.toastr.success(
            this.translate.instant('jobSeeker.PackageChoosedSuccessfully')
          );
          this.router.navigate(['/client/edit-agent-profile']);
        } else {
          this.toastr.success(
            this.translate.instant('jobSeeker.PackageChoosedSuccessfully')
          );
          this.router.navigate(['/client/edit-job-seeker']);
        }

        this.authService.getconditionsToCurrentUser();

        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error.error.message);
      },
    });
  }

  selectPackage(id: any, price: any) {
    this.packagePrice = price;
    document
      .querySelectorAll('.active')
      ?.forEach((obj) => obj.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    document
      .getElementById('select-package')
      ?.scrollIntoView({ behavior: 'smooth' });

    this.cdr.detectChanges();
    this.submit();
  }

  addActiveClass(id: any) {
    document.getElementById(id)?.classList.add('active');
    this.cdr.detectChanges();
  }

  removeActiveClass(id: any) {
    if (this.packageId !== id) {
      document.getElementById(id)?.classList.remove('active');
    }
    this.cdr.detectChanges();
  }

  redirectTo() {
    if (this.currentUser.roles[0] == Constants.AllRoles.cveezAgent) {
      this.router.url.includes('/client')
        ? this.router.navigate(['/client/edit-agent-profile'])
        : this.router.navigate(['/home']);
    } else if (this.currentUser.roles[0] == Constants.AllRoles.cveezJobSeeker) {
      this.router.url.includes('/client')
        ? this.router.navigate(['/client/edit-job-seeker'])
        : this.router.navigate(['/home']);
    }
  }

  makePayment() {
    this.spinner.hide();
    if (this.packagePrice == 0) {
      this.completPayment();
    } else {
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: this.stripeAPIKey,
        locale: 'auto',
        token: (token: any) => {
          this.stripeToken = token.id;
          this.completPayment();
        },
      });
      paymentHandler.open({
        name: 'CVEEEZ',
        height: '500px', // some option to configure height
        width: '500px', //  some option to configure width 
        image: 'http://prod-cveeez.azurewebsites.net/assets/imgs/logo.svg',
        description:
          'Please fill out the following payment details to complete your transaction:',
        // zipCode: true,
        allowRememberMe: true,
        amount: this.packagePrice * 100,
        // stripeEmail:"alo,o"
      });
    }
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');

      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

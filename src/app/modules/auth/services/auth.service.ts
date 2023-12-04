import {
  Injectable,
  OnDestroy,
} from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map,  finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { getMessaging,  onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebApiService } from 'src/app/services/webApi.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/services/Constants/constants';
import { TranslationService } from 'src/app/i18n/translation.service';

import { PackageConditionService } from 'src/app/services/common/package-condition.service';
import { Payment } from 'src/app/services/enums/payment-conditions.enum';
import { MessagingService } from 'src/app/services/api/messaging.service';
export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = ``;
  public image: any;
  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  payment = Payment;
  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private webApi: WebApiService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private router: Router,
    private translate: TranslationService,
    private packageConditionService: PackageConditionService,
    private toastr: ToastrService,
    private messagingService: MessagingService,
  
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  singUp(body: any) {
    return this.webApi.post(
      'api/app/manage-service-provider/register-service-provider',
      body
    );
  }

  resendEmail(email: string) {
    return this.webApi.post(
      `api/app/manage-service-provider/resend-confirmation-email?email=${email}`
    );
  }

  verificationCode(body: any) {
    return this.webApi.post(
      'api/app/manage-account/verify-verification-code-at-register',
      body
    );
  }

  manageIndustry() {
    return this.webApi.get('api/app/manage-industry');
  }

  ServiceProviderDeatiles(id: number) {
    return this.webApi.get(
      `api/app/manage-service-provider/${id}/service-provider-details`
    );
  }

  editServiceProviderDeatiles(body: any) {
    return this.webApi.post(
      'api/app/manage-service-provider/edit-service-provider',
      body
    );
  }

  changePassword(body: any) {
    return this.webApi.post('api/app/manage-account/change-password', body);
  }

  GetClinetById(id: any) {
    return this.webApi.get(`api/app/manage-client/${id}/client-by-id`);
  }

  getImage() {
    this.getcurrentUser().subscribe((res) => {
      this.image = res.imageUrl;
      return res.imageUrl;
    });
  }

  login(param: any) {
    this.spinner.show();
    setTimeout(() => this.spinner.show(), 400);

    let body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'Cveez_App');
    body.set('username', param.email);
    body.set('password', param.password);
    let headersConfig = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': this.translate.getSelectedLanguage(),
    };
    let options = {
      headers: new HttpHeaders(headersConfig),
    };
    this.http
      .post(`${environment.api_url}connect/token`, body.toString(), options)
      .subscribe({
        next: (auth: any) => {
          this.spinner.hide();
          this.messagingService.requestPermission();
          this.listen();
        
          localStorage.setItem('remeberMe', param.remeberMe);
          // this.isLoadingSubject.next(auth);
          if (param.remeberMe) {
            localStorage.setItem('email', param.email);
            localStorage.setItem('password', param.password);
          
          }
          this.setAuthFromLocalStorage(auth);
          this.getcurrentUser().subscribe((res) => {
            this.roleAndPermissions(res);
          });
        },
        error: (mockError) => {
          setTimeout(() => {
            this.spinner.hide();
            console.log(mockError.error.error_description);
            this.toastr.error(mockError.error.error_description);
            console.log('error', mockError);
          }, 400);
        },
      });
  }
  getUser(){
   
    this.getcurrentUser().subscribe((res) => {
      this.roleAndPermissions(res);
    });
  }
  listen() {
   
    const messaging = getMessaging();
    onMessage(messaging, payload => {
      let respones = payload;
     
      // this.audioPlayerRef.nativeElement.play();
      if (this.translate.getSelectedLanguage() === 'en') {
         this.toastr.info(payload.data?.titleEn);
      } else {
         this.toastr.info(payload.data?.titleAr);
        
      }

      setTimeout(() => {
        this.messagingService.
        getUnReadNotification();
      }, 1000);
     
    });
  }
  getconditionsToCurrentUser() {

    this.conditionsToCurrentUser().subscribe({
      next: (res) => {
        localStorage.setItem('condtions-to-current-user', JSON.stringify(res));
        setTimeout(() => {
          this.packageConditionService.getConditionPackage();
        }, 2000);
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  logout() {
    this.messagingService.deleteToken();
    localStorage.removeItem('access_token_cveez');
    localStorage.removeItem('currentUsercveez');
    localStorage.removeItem('yearsExperienceId');

    localStorage.removeItem('name');
    localStorage.removeItem('paymentType');
   
    localStorage.removeItem('authLocalStorageTokencveez');
    localStorage.removeItem(this.authLocalStorageToken);
    localStorage.removeItem('condtions-to-current-user');
  
    this.packageConditionService.getConditionPackage();
    if (this.router.routerState.snapshot.url == '/home') {
      location.reload();
    } else {
      this.router.navigate(['/home']);
    }
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.getcurrentUser().pipe(
      map((user) => {
        if (user.currentUser) {
          this.currentUserSubject.next(user.currentUser);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  roleAndPermissions(data: any) {
    debugger
    this.currentUserSubject.next(data['currentUser']);
    // admin
    localStorage.setItem(
      'currentUsercveez',
      JSON.stringify(data['currentUser'])
    );
    localStorage.setItem('name', JSON.stringify(data['name']));
    localStorage.setItem('paymentType', JSON.stringify(data['paymentType']));
    localStorage.setItem(
      'yearsExperienceId',
      JSON.stringify(data['yearsExperienceId'])
    );
    if (
      data['currentUser']['roles'][0] !== Constants.AllRoles.cveezSuperAdmin
    ) {
      this.getconditionsToCurrentUser();
    } else {
      this.packageConditionService.getConditionPackage();
    }
    setTimeout(() => {
      this.goToDefaultPage(
      data['currentUser'],
      data['paymentType'],
      data['yearsExperienceId']
    );
    }, 2000);
    
  }

  goToDefaultPage(user: any, paymentType: any = 0, yearsExperienceId = null) {
    if (user['roles'][0] == Constants.AllRoles.cveezAgent) {
      if (paymentType === Payment.NotPaied) {
        this.router.navigate(['/auth/payment-package']);
      } else {
        this.router.navigate(['/client/posted-opportunities']);
      }
    } else if (user['roles'][0] == Constants.AllRoles.cveezJobSeeker) {
     if (paymentType === Payment.NotPaied) {
        this.router.navigate(['/auth/payment-package']);
      } else {
        this.router.navigate(['/client/edit-job-seeker']);
      }
    } else if (user['roles'][0] == Constants.AllRoles.cveezSuperAdmin) {
      this.router.navigate(['/admin/manage-agent']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  getcurrentUser() {
    return this.webApi.get('api/app/manage-account/current-user');
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.access_token) {
      localStorage.setItem('authLocalStorageTokencveez', JSON.stringify(auth));
      localStorage.setItem('access_token_cveez', `Bearer ${auth.access_token}`);
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem('authLocalStorageTokencveez');
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getCurrentUser() {
    let currentUserObject = window.localStorage.getItem('currentUsercveez');
    return JSON.parse(currentUserObject!);
  }

  getpaymentType() {
    let paymentTypeObject = window.localStorage.getItem('paymentType');
    return JSON.parse(paymentTypeObject!);
  }

  getyearsExperienceId() {
  
    let yearsExperienceIdObject =
      window.localStorage.getItem('yearsExperienceId');
    return JSON.parse(yearsExperienceIdObject!);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // Register agent representative api
  registerAgentRepresentative(body: any) {
    return this.webApi.post('api/app/manage-agent/register-agent', body);
  }

  registerJobSeeker(body: any) {
    return this.webApi.post(
      'api/app/manage-job-seeker/register-job-seeker',
      body
    );
  }

  // Activate email api
  ActivateCode(ConfirmEmailTokenId: any) {
    return this.webApi.post(
      `api/app/manage-account/confirm-email/${ConfirmEmailTokenId}`
    );
  }

  // Forget password api
  forgetPassword(email: string) {
    return this.webApi.post(
      `api/app/manage-account/forget-password?email=${email}`
    );
  }

  // Reset passowrd api
  resetPassword(body: any, token: any) {
    return this.webApi.post(`api/app/manage-account/reset-password`, {
      email: body.email,
      password: body.password,
      resetPasswordToken: token,
    });
  }

  isUsedLinkReset(token: any) {
    return this.webApi.post(
      `api/app/manage-account/is-used-link-reset-password?resetPasswordToken=${token}`
    );
  }

  conditionsToCurrentUser() {
    return this.webApi.get(`api/app/manage-package/conditions-to-current-user`);
  }
}

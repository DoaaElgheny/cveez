import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidationPattern } from 'src/app/modules/SharedComponent/helper/validator';
import { ContactUsService } from 'src/app/services/api/contact-us.service';
import { UserType, MessageType } from 'src/app/services/enums/contact-us.enum';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Constants } from 'src/app/services/Constants/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  userType: any = UserType;
  messageType: any = MessageType;
  currentUser: any = null;
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private contactUsService: ContactUsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.setFormValues();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: [{value:null,disabled: this.currentUser ? true : false}, Validators.compose([Validators.required])],
      email: [
        {value:null,disabled: this.currentUser ? true : false},
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidationPattern.Email),
        ]),
      ],
      message: [null, Validators.compose([Validators.required])],
      messageType: ['', Validators.compose([Validators.required])],
      userType: [
        this.userType.Visitor,
        Validators.compose([Validators.required]),
      ],
    });
  }

  setFormValues() {
    if (!this.currentUser) {
      this.form.get('userType')?.setValue(this.userType.Visitor);
    } else if (
      this.currentUser &&
      this.currentUser.roles[0] === Constants.AllRoles.cveezJobSeeker
    ) {

      this.form
        .get('name')
        ?.setValue(localStorage.getItem('name')?.split('"')[1]);
      this.form.get('email')?.setValue(this.currentUser?.email);
      this.form.get('userType')?.setValue(this.userType.JobSeeker);
    } else if (
      this.currentUser &&
      this.currentUser.roles[0] === Constants.AllRoles.cveezAgent
    ) {

      this.form
        .get('name')
        ?.setValue(localStorage.getItem('name')?.split('"')[1]);
      this.form.get('email')?.setValue(this.currentUser?.email);
      this.form.get('userType')?.setValue(this.userType.Agent);
    }

    this.cdr.detectChanges();
 
  }

  // showDataBasedOnRole()
  // {
  //   if(this.currentUser.roles[0] === Constants.AllRoles.broker ||
  //      this.currentUser.roles[0] === Constants.AllRoles.user)
  //   {
  //     this.IsUser = true;
  //     this.contactUsForm.get('name').setValue(this.currentUser.name);
  //     this.contactUsForm.get('email').setValue(this.currentUser.email) ;
  //     this.contactUsForm.get('mobileNumber').setValue(this.currentUser.phoneNumber) ;
  //   }
  // }

  submit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((field) => {
        // {1}
        const control = this.form.get(field); // {2}
        control?.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }else{
      this.spinner.show();
      this.contactUsService.sendContactUsMessage(this.form.getRawValue()).subscribe({
        next: (value: any) => {
          this.spinner.hide();
          this.toastr.success(
            this.translate.instant('ContactUs.SuccessfulMessage')
          );
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err.error?.error?.message);
        },
      });
    }


 
  }
}

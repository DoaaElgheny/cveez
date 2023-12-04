import { AbstractControl } from "@angular/forms";

export class EmailValidatorMatch {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl): void {
    const email = control.get('agentRepresentativeEmail')?.value;
    const Domain = email.split('@')[1];

    // if (Domain === "gmail.com"||Domain === "outlook.com" ) {
    //   control.get('agentRepresentativeEmail')?.setErrors({ ConfirmEmail: true });
    // }
  }
}

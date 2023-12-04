import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const date = new Date(value);
    console.log()
    return isNaN(date.getTime()) ? { 'invalidDate': true } : null;
  };
}
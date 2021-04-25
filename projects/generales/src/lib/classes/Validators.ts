import { FormGroup } from '@angular/forms';

export class CustomValidators {
  public static checkPasswords(group: FormGroup) {
    const password = group.get('pass').value;
    const confirmPassword = group.get('repeatPass').value;
    return password === confirmPassword ? null : { notSame: true };
  }
}

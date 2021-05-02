import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BasicAlertcomponent } from '../../classes/BasicAlertComponent';
import { MyErrorStateMatcher } from '../../classes/ErrorMatcher';
import { CustomValidators } from '../../classes/Validators';
import {
  LoginCredentials,
  RecoverCredentials,
} from '../../models/LoginCredentials';
import {
  GenericDialog,
  GenericDialogComponent,
} from '../generic-dialog/generic-dialog.component';
import { PrivacyTermsComponent } from '../privacy-terms/privacy-terms.component';
import { TermsUseComponent } from '../terms-use/terms-use.component';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('appearSlowly', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate(500),
      ]),
    ]),
  ],
})
export class LoginComponent extends BasicAlertcomponent implements OnInit {
  @Input() leftImageURL: string;
  @Input() logoImageURL: string;

  public formGroup: FormGroup;
  @Input() estadoForm: 'login' | 'registro' | 'olvidada' | 'seteandoNuevaPass' =
    'login';
  public customErrorMatcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  @Output() loginExitosoFront = new EventEmitter<LoginCredentials>();
  @Output() registroExitosoFront = new EventEmitter<LoginCredentials>();
  @Output() recuperarExitoso = new EventEmitter<RecoverCredentials>();
  @Output() seteoNuevaContrasenyaExitoso = new EventEmitter<LoginCredentials>();
  constructor(private fb: FormBuilder, private matDialog: MatDialog) {
    super();
    this.formGroup = this.fb.group(
      {
        correo: ['', Validators.required],
        pass: ['', Validators.required],
        repeatPass: ['', Validators.required],
      },
      { validators: CustomValidators.checkPasswords }
    );
  }

  ngOnInit(): void {}

  private accederPorLogin() {
    this.formGroup.markAllAsTouched();
    if (
      this.formGroup.get('correo').valid &&
      this.formGroup.get('pass').valid
    ) {
      this.loginExitosoFront.emit({
        email: this.formGroup.get('correo').value,
        pass: this.formGroup.get('pass').value,
      });
    } else {
      this.alertHappen.emit({
        title: 'Login incorrecto',
        desc: 'Revise los datos usados para acceder',
        type: 'error',
      });
    }
  }

  private registrarse() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.registroExitosoFront.emit({
        email: this.formGroup.get('correo').value,
        pass: this.formGroup.get('pass').value,
      });
    } else {
      this.alertHappen.emit({
        title: 'Registro incorrecto',
        desc: 'Revise los datos usados para acceder',
        type: 'error',
      });
    }
  }

  private recoverAccount() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.get('correo').valid) {
      this.recuperarExitoso.emit({ email: this.formGroup.get('correo').value });
    } else {
      this.alertHappen.emit({
        title: 'Datos incorrectos',
        desc: 'Revise los datos usados para acceder',
        type: 'error',
      });
    }
  }

  private setearNuevaContrasenya() {
    this.formGroup.markAllAsTouched();
    if (
      this.formGroup.get('correo').valid &&
      this.formGroup.get('pass').valid
    ) {
      this.registroExitosoFront.emit({
        email: this.formGroup.get('correo').value,
        pass: this.formGroup.get('pass').value,
      });
    } else {
      this.alertHappen.emit({
        title: 'Datos incorrectos',
        desc: 'Revise los datos usados para acceder',
        type: 'error',
      });
    }
  }

  public acceder() {
    switch (this.estadoForm) {
      case 'login':
        this.accederPorLogin();
        break;
      case 'registro':
        this.registrarse();
        break;

      case 'olvidada':
        this.recoverAccount();
        break;
      case 'seteandoNuevaPass':
        this.setearNuevaContrasenya();
        break;

      default:
        break;
    }
  }

  public openTermsUse() {
    this.matDialog.open(GenericDialogComponent, {
      width: '1200px',
      data: {
        title: null,
        component: TermsUseComponent,
        actionButtons: [],
      } as GenericDialog,
    });
  }

  public openPrivacyPolicy() {
    this.matDialog.open(GenericDialogComponent, {
      width: '1200px',
      data: {
        title: null,
        component: PrivacyTermsComponent,
        actionButtons: [],
      } as GenericDialog,
    });
  }

  public obtainLabelButton() {
    switch (this.estadoForm) {
      case 'registro':
        return 'Registrarse';
      case 'login':
        return 'Acceder';
      case 'olvidada':
        return 'Recuperar';
      case 'seteandoNuevaPass':
        return 'Confirmar';
      default:
        return 'Error';
    }
  }

  public obtainTitleLabel() {
    switch (this.estadoForm) {
      case 'registro':
        return 'Registra su cuenta';
      case 'login':
        return 'Accede a tu cuenta';
      case 'olvidada':
        return 'Recuperar tu cuenta';
      case 'seteandoNuevaPass':
        return 'Confirmar nueva contraseña';
      default:
        return 'Error';
    }
  }
}

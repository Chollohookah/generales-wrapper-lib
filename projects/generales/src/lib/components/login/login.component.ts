import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
  @Input() public set estadoForm(
    data: 'login' | 'registro' | 'olvidada' | 'seteandoNuevaPass'
  ) {
    if (data) {
      this._estadoForm = data;
      this.cd.detectChanges();
    }
  }
  public get estadoForm() {
    return this._estadoForm;
  }

  private _estadoForm:
    | 'login'
    | 'registro'
    | 'olvidada'
    | 'seteandoNuevaPass' = null;

  public customErrorMatcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  @Output() loginExitosoFront = new EventEmitter<LoginCredentials>();
  @Output() registroExitosoFront = new EventEmitter<LoginCredentials>();
  @Output() recuperarExitoso = new EventEmitter<RecoverCredentials>();
  @Output() seteoNuevaContrasenyaExitoso = new EventEmitter<string>();
  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.formGroup = this.fb.group(
      {
        correo: ['', Validators.required],
        pass: ['', Validators.required],
        repeatPass: ['', Validators.required],
        name: ['', Validators.required],
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
        name: this.formGroup.get('name').value,
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
      this.formGroup.get('repeatPass').valid &&
      this.formGroup.get('pass').valid
    ) {
      this.seteoNuevaContrasenyaExitoso.emit(this.formGroup.get('pass').value);
    } else {
      this.alertHappen.emit({
        title: 'Datos incorrectos',
        desc: 'Revise los datos usados para acceder',
        type: 'error',
      });
    }
  }

  public acceder() {
    switch (this._estadoForm) {
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
    switch (this._estadoForm) {
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
    switch (this._estadoForm) {
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

  public keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.acceder();
    }
  }
}

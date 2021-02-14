import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicAlertcomponent } from '../../classes/BasicAlertComponent';
import { LoginCredentials } from '../../models/LoginCredentials';



@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BasicAlertcomponent implements OnInit {
  @Input() leftImageURL: string;
  @Input() logoImageURL: string;
  public formGroup: FormGroup;
  @Output() loginExitosoFront = new EventEmitter<LoginCredentials>();
  constructor(private fb: FormBuilder) {
    super();
    this.formGroup = this.fb.group({
      correo: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  public acceder() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.alertHappen.emit({
        title: 'Login correcto',
        desc: '',
        type: 'success',
      });
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
}

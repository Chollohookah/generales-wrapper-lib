import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicAlertcomponent } from '../../classes/BasicAlertComponent';

export interface ButtonActionFunction {
  function: Function;
  type: 'normal' | 'async';
  succesMessage: string;
}

@Component({
  selector: 'lib-subscribe-input-button-in-one',
  templateUrl: './subscribe-input-button-in-one.component.html',
  styleUrls: ['./subscribe-input-button-in-one.component.scss'],
})
export class SubscribeInputButtonInOneComponent
  extends BasicAlertcomponent
  implements OnInit {
  public rootElement: HTMLElement;
  public emailElement: HTMLElement;
  public buttonElement: HTMLElement;
  public formGroup: FormGroup;
  public loadingAsync: boolean = false;
  public workflowTerminado: boolean = false;

  @Input() onClickCallback: ButtonActionFunction;

  constructor(private fb: FormBuilder) {
    super();
    this.formGroup = this.fb.group({
      email: ['', Validators.email],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      if (this.formGroup.valid) {
        this.buttonElement.classList.add('is-active');
      }
    });
  }

  ngOnInit(): void {
    this.rootElement = document.getElementById('rootSubscribeButtonInOne');
    if (this.rootElement) {
      this.emailElement = this.rootElement.querySelector('#email');
      this.buttonElement = this.rootElement.querySelector('#button');
      if (this.buttonElement) {
        this.buttonElement.addEventListener('click', async (e) => {
          e.preventDefault();
          if (this.formGroup.valid && !this.workflowTerminado) {
            if (this.onClickCallback) {
              if (this.onClickCallback.type == 'async') {
                this.loadingAsync = true;
                let data;
                try {
                  data = await this.onClickCallback.function(
                    this.formGroup.get('email').value
                  );
                  this.loadingAsync = false;
                  this.isDone();
                  this.alertHappen.emit({
                    title: this.onClickCallback.succesMessage,
                    desc: 'Exito',
                    type: 'success',
                  });
                } catch (error) {
                  this.loadingAsync = false;
                  this.alertHappen.emit({
                    title: error.error.error.message,
                    desc: 'Error',
                    type: 'error',
                  });
                }
              } else {
                this.onClickCallback.function(this.emailElement.innerHTML);
                this.isDone();
              }
            }
          }
        });
      }
    }
  }

  private isDone() {
    this.buttonElement.classList.add('is-done', 'is-active');
    setTimeout(() => {
      this.buttonElement.innerHTML = 'Gracias! Compruebe su buzón!';
      this.workflowTerminado = true;
    }, 500);
  }
}

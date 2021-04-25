import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Inject,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface GenericDialog {
  title: string;
  component: Type<Component>;
  actionButtons: Array<{ label: string; class: string; action: Function }>;
}
@Component({
  selector: 'lib-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss'],
})
export class GenericDialogComponent implements OnInit {
  @ViewChild('injectHere', { read: ViewContainerRef })
  divToInject: ViewContainerRef;
  public genericDialogData: GenericDialog;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: GenericDialog,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.genericDialogData = this.data;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const componentFactory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(
        this.data.component
      );
      this.divToInject.createComponent(componentFactory);
    }, 0);
  }
}

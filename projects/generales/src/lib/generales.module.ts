import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {
  ComparadorHookasComponent,
  FiltrosAvanzadosComponent,
  SelectorConBuscadorComponent,
  InlineBlockPickerComponent,
  CargandoCachimbasComponent,
  LateralActionsComponent,
  HookaSearcherInputComponent,
  AllTagsViewerComponent,
  ImgAccordionComponent,
  DescriptionComponent,
  SubscribeInputButtonInOneComponent,
  getSpanishPaginatorIntl,
  SliderComponent,
  CardViewerComponent,
} from '.';
import { GeneralesComponent } from './generales.component';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './components/login/login.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { BlockListComponent } from './components/block-list/block-list.component';
import { FabButtonWithItemsComponent } from './components/fab-button-with-items/fab-button-with-items.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const declaredAndExported = [
  GeneralesComponent,
  LoginComponent,
  ComparadorHookasComponent,
  FiltrosAvanzadosComponent,
  SelectorConBuscadorComponent,
  InlineBlockPickerComponent,
  CardViewerComponent,
  CargandoCachimbasComponent,
  LateralActionsComponent,
  HookaSearcherInputComponent,
  AllTagsViewerComponent,
  SliderComponent,
  ImgAccordionComponent,
  DescriptionComponent,
  SubscribeInputButtonInOneComponent,
  HeaderComponent,
  FabButtonWithItemsComponent,
  BlockListComponent,
];

@NgModule({
  declarations: declaredAndExported,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDividerModule,
    ScrollingModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatPaginatorModule,
    NgxSliderModule,
    MatSidenavModule,
    ClipboardModule,
    MatToolbarModule,
  ],
  exports: [...declaredAndExported],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    CookieService,
  ],
})
export class GeneralesModule {}

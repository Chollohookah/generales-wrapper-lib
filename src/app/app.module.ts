import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeneralesModule } from 'projects/generales/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    GeneralesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

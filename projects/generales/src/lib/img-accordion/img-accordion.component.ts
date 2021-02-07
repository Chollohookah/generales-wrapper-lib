import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-img-accordion',
  templateUrl: './img-accordion.component.html',
  styleUrls: ['./img-accordion.component.scss'],
})
export class ImgAccordionComponent implements OnInit {
  @Input() imagenes: Array<string> = [];
  public selectedIndex = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Array<string>) {
    this.imagenes = data;
  }

  ngOnInit(): void {}
  
}

import { Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { HeaderItems } from '../header/header.component';

@Component({
  selector: 'lib-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss'],
})
export class BlockListComponent implements OnInit {
  @Input() blocks: Array<HeaderItems> = [];
  @Input() inSideNav: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}

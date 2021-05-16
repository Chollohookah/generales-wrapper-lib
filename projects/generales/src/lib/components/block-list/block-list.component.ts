import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() selectedBlock: number = -1;
  @Output() blockClicked = new EventEmitter<HeaderItems>();
  constructor() {}

  ngOnInit(): void {
  }

  public emitSelected(selectHeaderItem: HeaderItems) {
    this.blockClicked.emit(selectHeaderItem);
  }
}

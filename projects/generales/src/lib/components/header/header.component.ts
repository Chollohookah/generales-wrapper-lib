import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
export interface HeaderItems {
  text: string;
  assetName: string;
  linkPath: string;
}
@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerItems: Array<HeaderItems> = [];
  @Output() public sidenavToggle = new EventEmitter();
  @Output() blockCliked = new EventEmitter<HeaderItems>();

  constructor() {}

  ngOnInit(): void {}

  public onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

}

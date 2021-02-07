import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BootstrapColors } from '../card-viewer/models/AnunciosHookas';
import { PosibleActions } from './models/PosibleActions';

@Component({
  selector: 'lib-lateral-actions',
  templateUrl: './lateral-actions.component.html',
  styleUrls: ['./lateral-actions.component.scss'],
})
export class LateralActionsComponent implements OnInit {
  @Input() backgroundColor: BootstrapColors = 'primary';
  @Input() actions: Array<PosibleActions> = [];
  @Output() cerrarComponente = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
}

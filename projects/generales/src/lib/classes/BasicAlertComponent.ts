import { Component, EventEmitter, Output } from '@angular/core';
import { SimpleAlert } from '..';

@Component({ template: '' })
export class BasicAlertcomponent {
  @Output() alertHappen = new EventEmitter<SimpleAlert>();
  constructor() {}
}

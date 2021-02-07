import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkerManagerService {
  constructor() {}

  public generateWorker(path: string) {
    if (typeof Worker !== 'undefined') {
      return new Worker(path, { type: 'module' });
    }
    return null;
  }
}

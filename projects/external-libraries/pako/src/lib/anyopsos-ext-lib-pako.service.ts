import { Injectable } from '@angular/core';

import * as Pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSExtLibPakoService {

  public Pako;

  constructor() {
    this.Pako = (Pako as any).default;
  }
}

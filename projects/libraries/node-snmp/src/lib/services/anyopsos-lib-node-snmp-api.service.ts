import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AnyOpsOSLibLoggerService } from '@anyopsos/lib-logger';

@Injectable({
  providedIn: 'root'
})
export class AnyOpsOSLibNodeSnmpApiService {

  constructor(private readonly http: HttpClient,
              private readonly logger: AnyOpsOSLibLoggerService) {
  }

  /**
   * Custom errorHandler function for Snmp
   */
  private errorHandler(e: any): { status: string, error: any } {
    console.error({
      status: 'error',
      error: (e.html && e.html.head[0].title ? e.html.head[0].title : e)
    });

    return {
      status: 'error',
      error: (e.html && e.html.head[0].title ? e.html.head[0].title : e)
    };
  }

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'aaim-k8s-object-param-toggler',
  templateUrl: './k8s-object-param-toggler.component.html',
  styleUrls: ['./k8s-object-param-toggler.component.scss']
})
export class K8sObjectParamTogglerComponent {
  @Input() readonly label: string;

  open: boolean = false;

  constructor() { }

  icon(): string {
    return `arrow_drop_${open ? 'up' : 'down'}`;
  }

  link(): string {
    return this.open ? `Hide` : `Show`;
  }

  toggleOpen(): void {
    this.open = !this.open;
  }

}

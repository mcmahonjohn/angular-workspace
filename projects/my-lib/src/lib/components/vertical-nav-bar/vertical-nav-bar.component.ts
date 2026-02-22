import { Component, Input, TemplateRef, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavRoute } from '../../models/nav-route';

@Component({
    selector: 'my-lib-vertical-nav-bar',
    templateUrl: './vertical-nav-bar.component.html',
    styleUrls: ['./vertical-nav-bar.component.scss'],
    imports: [CommonModule, RouterModule]
})
export class VerticalNavBarComponent {
  readonly position = input<'left' | 'right'>('left');
  readonly customClass = input('');
  readonly customStyle = input<{
    [key: string]: string;
}>({});
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input({ required: false }) logoTemplate?: TemplateRef<any>;
  readonly routes = input.required<NavRoute[]>();

  activeRoute = signal('');
}

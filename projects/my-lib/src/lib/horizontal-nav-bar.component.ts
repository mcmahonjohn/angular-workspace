
import { Component, Input, TemplateRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavRoute } from './models/nav-route';

@Component({
    selector: 'my-lib-horizontal-nav-bar',
    templateUrl: './horizontal-nav-bar.component.html',
    styleUrls: ['./horizontal-nav-bar.component.scss'],
    imports: [CommonModule, RouterModule]
})
export class HorizontalNavBarComponent {
  /**
   * Position of the nav bar: 'left' or 'right'.
   */
  readonly position = input<'left' | 'right'>('left');

  /**
   * Custom class for the nav bar root element.
   */
  readonly customClass = input('');

  /**
   * Custom style for the nav bar root element.
   */
  readonly customStyle = input<{
    [key: string]: string;
}>({});

  /**
   * Template for the logo (optional)
   */
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() logoTemplate?: TemplateRef<any>;

  /**
   * Routes to display in the nav bar
   */
  readonly routes = input<NavRoute[]>([]);
}

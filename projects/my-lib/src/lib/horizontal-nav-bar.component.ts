
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'my-lib-horizontal-nav-bar',
  standalone: true,
  templateUrl: './horizontal-nav-bar.component.html',
  styleUrls: ['./horizontal-nav-bar.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class HorizontalNavBarComponent {
  /**
   * Position of the nav bar: 'left' or 'right'.
   */
  @Input() position: 'left' | 'right' = 'left';

  /**
   * Custom class for the nav bar root element.
   */
  @Input() customClass = '';

  /**
   * Custom style for the nav bar root element.
   */
  @Input() customStyle: { [key: string]: string } = {};

  /**
   * Template for the logo (optional)
   */
  @Input() logoTemplate?: TemplateRef<any>;

  /**
   * Routes to display in the nav bar
   */
  @Input() routes: NavRoute[] = [];
}

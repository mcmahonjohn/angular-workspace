import { Component, Input, TemplateRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'my-lib-vertical-nav-bar',
  templateUrl: './vertical-nav-bar.component.html',
  styleUrls: ['./vertical-nav-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class VerticalNavBarComponent {
  @Input({ required: false }) position: 'left' | 'right' = 'left';
  @Input({ required: false }) customClass = '';
  @Input({ required: false }) customStyle: { [key: string]: string } = {};
  @Input({ required: false }) logoTemplate?: TemplateRef<any>;
  @Input({ required: true }) routes: NavRoute[] = [];

  activeRoute = signal('');
}

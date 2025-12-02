import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MyLibComponent, NavRoute, VerticalNavBarComponent } from 'my-lib';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VerticalNavBarComponent, MyLibComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-app';
  formGroup = new FormGroup<{
    myField: FormControl<string | null>;
  }>({
    myField: new FormControl<string | null>(null)
  });

  navRoutes: NavRoute[] = [
    { path: '', label: 'Home' },
    { path: 'about', label: 'About' },
    { path: 'contact', label: 'Contact' },
    { path: 'help', label: 'Help' }
  ];

  get myFieldValue(): string | null {
    return this.formGroup.controls.myField.value;
  }
}

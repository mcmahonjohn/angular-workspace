import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MyLibComponent } from 'my-lib';

import { SignalInputDemoComponent } from './signal-input-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyLibComponent, SignalInputDemoComponent, ReactiveFormsModule],
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
}

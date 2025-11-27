import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-signal-input-demo',
  standalone: true,
  templateUrl: './signal-input-demo.component.html'
})
export class SignalInputDemoComponent {

  inputSignal = input<string|null>(null);

}

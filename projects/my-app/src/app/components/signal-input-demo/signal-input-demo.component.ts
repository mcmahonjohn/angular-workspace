import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-signal-input-demo',
  standalone: true,
  template: `
    <div>
      <h3>Signal-based Input Demo 233</h3>
      <p>Current value: {{ inputSignal() === null ? 'null' : inputSignal() }}</p>
    </div>
  `
})
export class SignalInputDemoComponent {

  inputSignal: InputSignal<string | null> = input<string|null>(null);

}

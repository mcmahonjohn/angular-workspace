import { SignalInputDemoComponent } from './signal-input-demo';

// Type assertions using TypeScript's type system
const component = new SignalInputDemoComponent();

// Should be string | null
const value: string | null = component.inputSignal();

// Should accept string
component.inputSignal('foo');

// Should accept null
component.inputSignal(null);

// Uncommenting the following line should cause a type error:
// component.inputSignal(123); // Error: Argument of type 'number' is not assignable to parameter of type 'string | null'.

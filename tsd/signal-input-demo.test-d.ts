import { expectType } from 'tsd';
import { SignalInputDemoComponent } from '.';

const component = new SignalInputDemoComponent();

// inputSignal should be a signal that returns string|null
expectType<string | null>(component.inputSignal());

// Should accept string
component.inputSignal('foo');
expectType<string | null>(component.inputSignal());

// Should accept null
component.inputSignal(null);
expectType<string | null>(component.inputSignal());

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalInputDemoComponent } from './signal-input-demo.component';

@Component({
  selector: 'host-component',
  standalone: true,
  imports: [SignalInputDemoComponent],
  template: `<app-signal-input-demo [inputSignal]="hostSignal"></app-signal-input-demo>`
})
class HostComponent {
  hostSignal: any = null;
}

describe('SignalInputDemoComponent (hosted)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;
  let demoComponent: SignalInputDemoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const demoDebug = fixture.debugElement.children.find(
      d => d.componentInstance instanceof SignalInputDemoComponent
    );

    demoComponent = demoDebug?.componentInstance;
  });

  it('should accept a string value for inputSignal', () => {
    hostComponent.hostSignal = 'test string';
    fixture.detectChanges();
    expect(demoComponent.inputSignal()).toEqual('test string');
  });

  it('should accept null value for inputSignal', () => {
    hostComponent.hostSignal = null;
    fixture.detectChanges();
    expect(demoComponent.inputSignal()).toBeNull();
  });
});

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  private signals: { [key: string]: Subject<any> } = {};

  dispatchSignal(signalName: string, data?: any) {
    if (this.signals[signalName]) {
      this.signals[signalName].next(data);
    }
  }
 
  updateSignalValue(key: string, newValue: string): void {
    const signal = this.signals[key];
    if (!signal) {
      this.signals[key] = new BehaviorSubject<string>(newValue);
    } else {
      signal.next(newValue);
    }
  }

  subscribeToSignal(signalName: string): Subject<any> {
    let signal = this.signals[signalName];
    if (!signal) {
      signal = new Subject<any>();
      this.signals[signalName] = signal;
    }
    return signal;
  }
}

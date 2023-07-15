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
 
  updateSignalValue(key:string ,newValue: string): void {
    if (!this.signals[key]) {
      this.signals[key] = new BehaviorSubject<string>(newValue);
    } else {
      this.signals[key].next(newValue);
    }
  }

  subscribeToSignal(signalName: string): Subject<any> {
    if (!this.signals[signalName]) {
      this.signals[signalName] = new Subject<any>();
    }
    return this.signals[signalName];
  }
}

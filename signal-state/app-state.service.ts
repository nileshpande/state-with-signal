import { Injectable } from '@angular/core';
import { SignalService } from './signal.service';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private states: { [key: string]: any } = {};

  constructor(private signalService: SignalService) {
    // Load states from local storage if available
    const savedStates = localStorage.getItem('appStates');
    if (savedStates) {
      this.states = JSON.parse(savedStates);
      for (const key in this.states) {
        if (Object.prototype.hasOwnProperty.call(this.states, key)) {
          const value = this.states[key];
          this.signalService.updateSignalValue(key, value); 
        }
      } 
    }
  }
  
  getState(key: string): Observable<string> {
    const fromSignal = this.signalService.subscribeToSignal(key);
    const fromLocal = localStorage.getItem(key);
  
    return fromSignal ? fromSignal : of(fromLocal ? fromLocal.toString() : '');
  }

  setState<T>(key: string, newState: T) {
    this.states[key] = newState;
    // Save states to local storage
    localStorage.setItem('appStates', JSON.stringify(this.states));
    // Dispatch a signal indicating the state change
    this.signalService.dispatchSignal(key, newState);
  }
}

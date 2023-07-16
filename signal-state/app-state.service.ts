import { Injectable } from '@angular/core';
import { SignalService } from './signal.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private states: { [key: string]: any } = {};

  constructor(private signalService: SignalService) {
    this.loadStatesFromLocalStorage();
  }
  
  private loadStatesFromLocalStorage() {
    const savedStates = localStorage.getItem('appStates');
    if (savedStates) {
      this.states = JSON.parse(savedStates);
      for (const key in this.states) {
        if (this.states.hasOwnProperty(key)) {
          const value = this.states[key];
          this.signalService.updateSignalValue(key, value); 
        }
      } 
    }
  }
  
  getState(key: string): Observable<string> {
    const fromSignal = this.signalService.subscribeToSignal(key);
    const fromLocal = localStorage.getItem(key);
  
    return fromSignal || of(fromLocal || '');
  }

  setState<T>(key: string, newState: T) {
    this.states[key] = newState;
    this.saveStatesToLocalStorage();
    this.signalService.dispatchSignal(key, newState);
  }

  private saveStatesToLocalStorage() {
    localStorage.setItem('appStates', JSON.stringify(this.states));
  }
}

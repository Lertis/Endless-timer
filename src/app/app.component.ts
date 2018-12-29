import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, of, merge, Subscription } from 'rxjs';
import { mapTo, startWith, switchMap, scan } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  timerSubs: Subscription;

  startD = false;
  pauseD = true;
  resumeD = true;
  stopD = true;


  constructor() { }

  ngOnInit() {
  }


  start() {
    this.startD = true;
    this.pauseD = false;
    this.resumeD = false;
    this.stopD = false;

    const startTick = 0;
    const setHTML = id => val => document.getElementById(id).innerHTML = val;
    const pauseButton = document.getElementById('pause');
    const resumeButton = document.getElementById('resume');
    const interval$ = interval(1000).pipe(mapTo(+1));

    const pause$ = fromEvent(pauseButton, 'click').pipe(
      mapTo(of(0))
    );
    const resume$ = fromEvent(resumeButton, 'click').pipe(
      mapTo(interval$)
    );

    this.timerSubs = merge(pause$, resume$).pipe(
      startWith(interval$),
      switchMap(val => val),
      scan((acc, curr) => curr ? curr + acc : acc, startTick)
    ).subscribe(setHTML('remaining'));
  }

  stop() {
    this.timerSubs.unsubscribe();
    this.startD = false;
    this.pauseD = true;
    this.resumeD = true;
    this.stopD = true;
    document.getElementById('remaining').innerHTML = null;
  }

  disP($e){
   this.pauseD = true;
   this.resumeD = false;
  }

  disR($e){
    this.resumeD = true;
    this.pauseD = false;
  }

}

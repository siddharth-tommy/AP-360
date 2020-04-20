import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { AssetprohelperService } from 'src/app/share/services/assetprohelper.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-assertpro',
  templateUrl: './assertpro.component.html',
  styleUrls: ['./assertpro.component.css']
})
export class AssertproComponent implements OnInit,OnDestroy {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  route: string;
  menubar=true;
  sidebar=true;
  private menuHideSubscription: Subscription;
  constructor(location: Location, router: Router,private assetprohelperService: AssetprohelperService,) {
    router.events.subscribe(val => {
      if (location.path() == "/home/pagemap") {
        this.sidebar=false;
      }else{
        this.sidebar=true;
      }
    });
    this.menuHideSubscription = this.assetprohelperService.menuHide$.subscribe((data) => {
      if(data){
        this.menubar=false;
        this.sidebar=false;
      }else{
        this.menubar=true;
        this.sidebar=true;
      }
    });
  }
  ngOnInit() {
    
  }
  ngOnDestroy(){
    this.menuHideSubscription.unsubscribe();
  }

}

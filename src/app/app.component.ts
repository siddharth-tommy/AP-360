import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit,AfterViewInit{
  
  ngAfterViewInit(){
  }
  ngOnInit(){ 
   // this.setWindowSize();
  }
  title = 'assertpro';
  
   setWindowSize(){
    var screenCssPixelRatio = (window.outerWidth - 8) / window.innerWidth;
    if(screenCssPixelRatio < 0.99)
    {
        var diff = (1- screenCssPixelRatio)*50;
        document.getElementById('left-holder').setAttribute("style","width:"+diff+"%;height:80px;");
        document.getElementById('right-holder').setAttribute("style","width:"+diff+"%");
        document.getElementById('content-container').setAttribute("style","width:"+(100 - (2 *diff))+"%;float:left");
        if( document.getElementById('menu-holder')!=null)
        document.getElementById('menu-holder').setAttribute("style","width:"+(100 - (2 *diff))+"%");

    }
    else
    {
      document.getElementById('left-holder').setAttribute("style","width:0px;height:0;");
        document.getElementById('right-holder').setAttribute("style","width:0px");
        document.getElementById('content-container').setAttribute("style","width:100%;float;left");
        if( document.getElementById('menu-holder')!=null)
        document.getElementById('menu-holder').setAttribute("style","width:100%");
    }
};
}

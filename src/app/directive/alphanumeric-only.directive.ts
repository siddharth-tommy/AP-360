import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "input[alphanumeric]"
})
export class AlphanumericDirective {
  constructor(private _el: ElementRef) {}

  @HostListener("input", ["$event"]) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^a-z0-9]/gi, "");
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

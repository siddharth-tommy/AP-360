import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "commonsearchPipe"
})
export class CommonSearchPipe implements PipeTransform {
  public transform(value, key: string, term: string) {
    //if(value==undefined || value==null || value=='') return false;
    return value.filter(item => {
      if (item.hasOwnProperty(key)) {
        if (term) {
          let regExp = new RegExp("\\b" + term, "gi");
          return regExp.test(item[key]);
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
  }
}

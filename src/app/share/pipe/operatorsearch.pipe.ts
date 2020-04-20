import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operatorsearch'
})
export class OperatorsearchPipe implements PipeTransform {


  transform(JsonObject: any[], terms: any): any[] {
    if (!JsonObject)
        return JsonObject;

    if (terms === undefined)
        return JsonObject;


    return JsonObject.filter(function (JsonObject) {
        if (JsonObject.OperatorName.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
            // code...
            return JsonObject;
        }
       

        else {
            // code...
            return '';
        }




    });

}

}

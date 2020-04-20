import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {



    transform(JsonObject: any[], terms: any): any[] {
        if (!JsonObject)
            return JsonObject;

        if (terms === undefined)
            return JsonObject;


        return JsonObject.filter(function (JsonObject) {
            if (JsonObject.assetstype.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
                // code...
                return JsonObject;
            }
            else if (JsonObject.assets.length > 0) {
                
                for (var i = 0; i < JsonObject.assets.length; i++) {
                    if (JsonObject.assets[i].name.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
                        return JsonObject.assets[i];
                    }
                }

            }

            else {
                // code...
                return '';
            }




        });

    }

}

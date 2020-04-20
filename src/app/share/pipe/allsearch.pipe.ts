import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'commonallsearchPipe',
})
export class AllSearchPipe implements PipeTransform {
    transform(items, nameSearch: string, emailSearch: string, companySearch: string){
        if (items && items.length){
            return items.filter(item =>{
                if (!nameSearch) return true;
                if (nameSearch && item.Name!=undefined && item.Name && item.Name.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
                if (nameSearch && item.OperatorName!=undefined && item.OperatorName && item.OperatorName.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
                if (nameSearch && item.AdminName!=undefined && item.AdminName && item.AdminName.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
                if (nameSearch &&  item.AssetTypeName!=undefined && item.AssetTypeName && item.AssetTypeName.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
                if (nameSearch &&  item.EventName!=undefined && item.EventName && item.EventName.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
                if (nameSearch &&  item.TotalCount!=undefined && item.TotalCount && (item.TotalCount+"").toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
                if (nameSearch &&  item.Eventdate!=undefined && item.Eventdate && item.Eventdate.toLowerCase().indexOf(nameSearch.toLowerCase()) != -1){
                    return true;
                }
               
                return false;
           })
        }
        else{
            return items;
        }
    }
}
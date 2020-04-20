import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class UserMenuService {
    constructor() { }

    private menuModel = new BehaviorSubject<any>({});
    menuModel$ = this.menuModel.asObservable();

    changeModel(data) {
        if (data == undefined || data == null || data.length == 0 || Object.keys(data).length == 0) {
            this.menuModel.next({});
        } else {
            this.menuModel.next(data);
        }
    }
}
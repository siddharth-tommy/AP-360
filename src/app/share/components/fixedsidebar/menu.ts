export class Menu {
    dashboard: boolean = false;
    asset: boolean = false;
    userDirectory: boolean = false;
    tracker: boolean = false;
    reports: boolean = false;
    messaging: boolean = false;
    notification: boolean = false;
    configuration: boolean = false;
    admin: boolean = false;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
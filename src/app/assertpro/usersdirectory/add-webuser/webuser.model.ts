export class Webuser {
    id
    name = '';
    role = '';
    phoneNo = '';
    ext = '';
    mobileNo = '';
    mobileProv = '';
    email = '';
    username = '';
    password = '';
    verifyPassword = '';
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
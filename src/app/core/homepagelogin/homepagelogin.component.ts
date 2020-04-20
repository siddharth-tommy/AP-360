
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetprohelperService } from '../../share/services/assetprohelper.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-homepagelogin',
  templateUrl: './homepagelogin.component.html',
  styleUrls: ['./homepagelogin.component.css']
})
export class HomepageloginComponent implements OnInit {


  forgotPassword_disabled:boolean;
  public form: FormGroup;
  public usernameform: AbstractControl;
  public passwordform: AbstractControl;
  public eMailform: AbstractControl;


  constructor(private _router: Router, private spinner: NgxSpinnerService, private assetprohelperService: AssetprohelperService, private toastr: ToastrService, fb: FormBuilder,
    private route: ActivatedRoute) {

    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(3)])],

      'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'eMail': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.usernameform = this.form.controls['username'];
    this.passwordform = this.form.controls['password'];
    this.eMailform = this.form.controls['eMail'];
  }

  ngOnInit() {
    let token=this.route.snapshot.queryParamMap.get("token")
    if(token!=undefined && token!=null && token!=''){
      localStorage.removeItem('assetprotoken');
      localStorage.removeItem('sitename');
      localStorage.removeItem('selectitemId');
      this.tokenlogin(token);
    }
  }
  public username: any;
  public password: any;
  public eMail: any

  changePassword(){
    this.forgotPassword_disabled=!this.forgotPassword_disabled;
    this.eMail=undefined
  }
  login() {
    let data = { 'UserName': this.username, 'Password': this.password };
    let url = 'Account/login';
    if (this.usernameform.valid && this.passwordform.valid) {
      this.spinner.show();
      this.assetprohelperService.PostMethod(url, data).subscribe(
        data => {
          var body = JSON.parse(data['_body']);
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!');
            localStorage.setItem('assetprotoken', body.Data.token);
            localStorage.setItem('sitename', 'All Sites');
            localStorage.setItem('selectitemId', null);
            this._router.navigate(['home/pagemap']);
            this.spinner.hide();
          }
          else {
            this.toastr.error(body.Message, 'Error!');
            this.spinner.hide();
          }
        });
    }
    else {
      if (!this.usernameform.valid) {
        this.usernameform.markAsTouched();
      }
      if (!this.passwordform.valid) {
        this.passwordform.markAsTouched();
      }

    }


  }
  forgotClick(){
    if (!this.eMailform.valid) {
      this.eMailform.markAsTouched();
    }else{
      this.spinner.show();
      let data = { 	"ExsEmail" : this.eMail };
      let url = 'Account/ForgetPassword';
      this.assetprohelperService.PostMethod(url, data).subscribe(
        data => {
          var body = JSON.parse(data['_body']);
          if (body.Status) {
            this.eMail=undefined
            this.username=undefined
            this.password=undefined
            this.forgotPassword_disabled=false
            this.toastr.success(body.Message, 'Success!');
            this.spinner.hide();
          }
          else {
            this.toastr.error(body.Message, 'Error!');
            this.spinner.hide();
          }
        });
    }
  }


  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.keyCode == 13 && !this.forgotPassword_disabled) {
        this.login()
    } 
    event.stopPropagation();
  }
  tokenlogin(id) {
    let data = { 	"ExsToken" : id };
    let url = 'Account/TrackerLogin';
      this.spinner.show();
      this.assetprohelperService.PostMethod(url, data).subscribe(
        data => {
          var body = JSON.parse(data['_body']);
          if (body.Status) {
            this.toastr.success(body.Message, 'Success!');
            localStorage.setItem('assetprotoken', body.Data.token);
            localStorage.setItem('sitename', body.Data.SiteName);
            localStorage.setItem('selectitemId', body.Data.LastVisitedSiteId);
            localStorage.setItem('siteUnique', body.Data.UniqueID)
            this._router.navigate(['home/tracker']);
            this.spinner.hide();
          }
          else {
            this.toastr.error(body.Message, 'Error!');
            this.spinner.hide();
          }
        });

  }

}

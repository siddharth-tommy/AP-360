import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageloginComponent } from './homepagelogin.component';

describe('HomepageloginComponent', () => {
  let component: HomepageloginComponent;
  let fixture: ComponentFixture<HomepageloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

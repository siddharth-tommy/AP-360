import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersdirectoryComponent } from './usersdirectory.component';

describe('UsersdirectoryComponent', () => {
  let component: UsersdirectoryComponent;
  let fixture: ComponentFixture<UsersdirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersdirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersdirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

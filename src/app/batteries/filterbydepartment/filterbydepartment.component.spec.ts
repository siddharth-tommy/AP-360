import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbydepartmentComponent } from './filterbydepartment.component';

describe('FilterbydepartmentComponent', () => {
  let component: FilterbydepartmentComponent;
  let fixture: ComponentFixture<FilterbydepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterbydepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterbydepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

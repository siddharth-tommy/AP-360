import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertproComponent } from './assertpro.component';

describe('AssertproComponent', () => {
  let component: AssertproComponent;
  let fixture: ComponentFixture<AssertproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssertproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

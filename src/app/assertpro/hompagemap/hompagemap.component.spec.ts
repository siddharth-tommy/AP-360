import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HompagemapComponent } from './hompagemap.component';

describe('HompagemapComponent', () => {
  let component: HompagemapComponent;
  let fixture: ComponentFixture<HompagemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HompagemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HompagemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

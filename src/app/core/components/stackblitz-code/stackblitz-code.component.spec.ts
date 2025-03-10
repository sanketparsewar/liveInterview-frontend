import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackblitzCodeComponent } from './stackblitz-code.component';

describe('StackblitzCodeComponent', () => {
  let component: StackblitzCodeComponent;
  let fixture: ComponentFixture<StackblitzCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackblitzCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackblitzCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

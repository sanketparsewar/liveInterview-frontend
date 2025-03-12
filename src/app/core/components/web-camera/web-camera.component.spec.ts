import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCameraComponent } from './web-camera.component';

describe('WebCameraComponent', () => {
  let component: WebCameraComponent;
  let fixture: ComponentFixture<WebCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebCameraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

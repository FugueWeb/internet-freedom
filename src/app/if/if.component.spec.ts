import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { IFComponent } from './if.component';
import { InternetFreedomService } from '../services/internet-freedom.service';

describe('IFComponent', () => {
  let component: IFComponent;
  let fixture: ComponentFixture<IFComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IFComponent ],
      imports : [HttpClientModule],
      providers: [InternetFreedomService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

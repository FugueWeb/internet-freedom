import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InternetFreedomService } from './internet-freedom.service';
import { DebugService } from './debug.service';

describe('InternetFreedomService', () => {
  let service: InternetFreedomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [DebugService]
    });
    service = TestBed.inject(InternetFreedomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';

import { SearchComponent } from './search.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  const mockProducts: Product[] = [
    { _id: '1', name: 'A', price: 10, stock: 1 },
    { _id: '2', name: 'B', price: 20, stock: 2 },
  ];

  const mockProductService = {
    getProductsBySearching: jasmine.createSpy().and.returnValue(of(mockProducts)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        provideHttpClient(),
      ],
    }).compileComponents(); // สร้าง "module จำลอง" เพื่อเทส Component

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance; // fixture.componentInstance → เข้าถึง instance (เหมือน this ของ component)
    fixture.detectChanges(); // fixture.detectChanges() → trigger Angular lifecycle (ngOnInit, re-render)
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call productService and emit products on submit', () => {
    const emitSpy = spyOn(component.productsFound, 'emit');

    component.searchTerm = 'A';
    component.onSubmit();

    expect(mockProductService.getProductsBySearching).toHaveBeenCalledWith('A');
    expect(mockProductService.getProductsBySearching).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(mockProducts);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear searchTerm and emit empty on clear', () => {
    const emitSpy = spyOn(component.productsFound, 'emit');
    const mockForm = {
      resetForm: jasmine.createSpy(),
    } as any as NgForm;

    component.searchTerm = 'test';
    component.onClear(mockForm);

    expect(component.searchTerm).toBe('');
    expect(mockForm.resetForm).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith();
  });
});

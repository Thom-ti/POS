import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { ProductService } from '../../../core/services/product.service';
import { provideHttpClient } from '@angular/common/http';
import { Product } from '../../../core/models/product.model';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;

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
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call productService and emit products on submit', () => {
    const emitSpy = spyOn(component.productsFound, 'emit');

    component.searchTerm = 'A';
    component.onSubmit();

    expect(mockProductService.getProductsBySearching).toHaveBeenCalledWith('A');
    expect(emitSpy).toHaveBeenCalledWith(mockProducts);
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

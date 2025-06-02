import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchTerm: string = '';

  onSubmit() {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
      // TODO: Emit or call API here
      
    }
  }
}

import {DOCUMENT, Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  setTheme(theme: string) {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
  getTheme(): string | null {
    return this.document.documentElement.getAttribute('data-theme');
  }
}

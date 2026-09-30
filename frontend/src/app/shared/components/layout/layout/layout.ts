import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { LucideAngularModule, Menu, User } from 'lucide-angular';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  readonly mobileMenuOpen = signal(false);

  readonly icons = {
    menu: Menu,
    user: User,
  };

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}

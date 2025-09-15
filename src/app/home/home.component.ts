import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../services/article/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [ArticleService] 
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly refreshInterval = 5 * 60 * 1000; // 5 minutes
  private refreshTimer: any;

  // Modern dependency injection
  public readonly articleService = inject(ArticleService);
  private readonly snackBar = inject(MatSnackBar);

  // Signal for loading state
  protected readonly isLoading = signal(false);

  ngOnInit(): void {
    this.loadArticles();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  private setupAutoRefresh(): void {
    this.refreshTimer = setInterval(() => {
      this.refreshArticles(false);
    }, this.refreshInterval);
  }

  private loadArticles(): void {
    this.isLoading.set(true);
    this.articleService.getAllArticles(1, 10)
      .subscribe({
        next: (articles) => {
          const source = this.articleService.isCached ? 'cache' : 'API';
          console.log(`Articles loaded from ${source}`);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.showNotification('Error al cargar los artículos', true);
          this.isLoading.set(false);
        }
      });
  }

  protected showNotification(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  protected refreshArticles(showNotification: boolean = true): void {
    this.isLoading.set(true);
    this.articleService.refreshArticles()
      .subscribe({
        next: () => {
          if (showNotification) {
            this.showNotification('Artículos actualizados');
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error refreshing articles:', error);
          if (showNotification) {
            this.showNotification('Error al actualizar los artículos', true);
          }
          this.isLoading.set(false);
        }
      });
  }
}

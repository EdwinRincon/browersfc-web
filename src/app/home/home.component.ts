import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../services/article/article.service';
import { MaterialModule } from '../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule],
  providers: [ArticleService] 
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly refreshInterval = 5 * 60 * 1000; // 5 minutes
  private refreshTimer: any;

  constructor(
    public readonly articleService: ArticleService,
    private readonly snackBar: MatSnackBar
  ) {}

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
    this.articleService.getAllArticles(1, 10)
      .subscribe({
        next: (articles) => {
          const source = this.articleService.isCached ? 'cache' : 'API';
          console.log(`Articles loaded from ${source}`);
        },
        error: (error) => {
          this.showNotification('Error al cargar los artículos', true);
        }
      });
  }

  showNotification(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  refreshArticles(showNotification: boolean = true): void {
    this.articleService.refreshArticles()
      .subscribe({
        next: () => {
          if (showNotification) {
            this.showNotification('Artículos actualizados');
          }
        },
        error: (error) => {
          console.error('Error refreshing articles:', error);
          if (showNotification) {
            this.showNotification('Error al actualizar los artículos', true);
          }
        }
      });
  }
}

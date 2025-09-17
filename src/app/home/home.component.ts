import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage  } from '@angular/common';
import { ArticleService } from '../services/article/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage]
})
export class HomeComponent implements OnInit {

  // Modern dependency injection
  public readonly articleService = inject(ArticleService);

  // Signal for loading state
  protected readonly isLoading = signal(false);

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.isLoading.set(true);
    // Load latest 6 articles for home page (0-based pagination)
    this.articleService.getAllArticles(0, 6)
      .subscribe({
        next: (articles) => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
}

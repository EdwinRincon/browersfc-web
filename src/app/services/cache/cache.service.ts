import { Injectable } from '@angular/core';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly STORAGE_KEY = 'app_cache';

  set<T>(key: string, data: T, duration: number = this.CACHE_DURATION): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + duration;
    const entry: CacheEntry<T> = { data, timestamp, expiresAt };
    
    // Store in memory and localStorage
    localStorage.setItem(
      `${this.STORAGE_KEY}_${key}`,
      JSON.stringify(entry)
    );
  }

  get<T>(key: string): T | null {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
    if (!stored) return null;

    const entry: CacheEntry<T> = JSON.parse(stored);
    if (Date.now() > entry.expiresAt) {
      console.log(`Cache expired for: ${key}`);
      this.delete(key);
      return null;
    }

    console.log(`Cache hit for: ${key}`);
    return entry.data;
  }

  getEntry<T>(key: string): CacheEntry<T> | null {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
    if (!stored) return null;
    return JSON.parse(stored);
  }

  delete(key: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}_${key}`);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.STORAGE_KEY))
      .forEach(key => localStorage.removeItem(key));
  }
}
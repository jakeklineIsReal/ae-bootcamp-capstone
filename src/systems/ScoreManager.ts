/**
 * ScoreManager
 * Tracks collectibles by type (stars, hearts, circles)
 * Requirement: FR-009 - Collection tracking
 */
export class ScoreManager {
  private stars: number = 0;
  private hearts: number = 0;
  private circles: number = 0;

  /**
   * Add a collectible by type
   */
  addCollectible(type: 'star' | 'heart' | 'circle'): void {
    switch (type) {
      case 'star':
        this.stars++;
        break;
      case 'heart':
        this.hearts++;
        break;
      case 'circle':
        this.circles++;
        break;
    }
  }

  /**
   * Get count for a specific type
   */
  getCount(type: 'star' | 'heart' | 'circle'): number {
    switch (type) {
      case 'star':
        return this.stars;
      case 'heart':
        return this.hearts;
      case 'circle':
        return this.circles;
    }
  }

  /**
   * Get total collectibles collected
   */
  getTotal(): number {
    return this.stars + this.hearts + this.circles;
  }

  /**
   * Get all counts as an object
   */
  getAllCounts(): { stars: number; hearts: number; circles: number } {
    return {
      stars: this.stars,
      hearts: this.hearts,
      circles: this.circles,
    };
  }

  /**
   * Reset all counts to zero
   */
  reset(): void {
    this.stars = 0;
    this.hearts = 0;
    this.circles = 0;
  }
}

const { getDb } = require('../config/database');

/**
 * Matching Algorithm
 * Weights: Category 30%, Budget 25%, People 20%, Tags 25%
 */
function findMatches(request, callback) {
  const db = getDb();
  const { category, budget_min, budget_max, people_count, preferred_tags = [] } = request;
  
  // Get all products
  db.all(
    `SELECT p.*, se.name as se_name 
     FROM products p 
     JOIN social_enterprises se ON p.se_id = se.id`,
    [],
    (err, products) => {
      if (err) return callback(err);
      
      const scored = products.map(product => {
        const tags = JSON.parse(product.tags || '[]');
        const metrics = JSON.parse(product.impact_metrics || '{}');
        
        let score = 0;
        
        // Category match (30%)
        if (product.type === category || category === 'all') {
          score += 30;
        } else if (category === 'employee_benefit' && (product.type === 'product' || product.type === 'workshop')) {
          score += 20;
        } else if (category === 'procurement' && product.type === 'product') {
          score += 25;
        }
        
        // Budget match (25%)
        const productAvgPrice = (product.price_min + product.price_max) / 2;
        const requestAvgBudget = (parseInt(budget_min) + parseInt(budget_max)) / 2;
        if (productAvgPrice <= parseInt(budget_max) && productAvgPrice >= parseInt(budget_min)) {
          score += 25;
        } else if (productAvgPrice <= parseInt(budget_max) * 1.2) {
          score += 15;
        }
        
        // People count match (20%)
        if (people_count) {
          const people = parseInt(people_count);
          if (product.capacity_min && product.capacity_max) {
            if (people >= product.capacity_min && people <= product.capacity_max) {
              score += 20;
            } else if (people <= product.capacity_max * 1.5) {
              score += 10;
            }
          } else {
            score += 15; // No capacity constraint, assume flexible
          }
        }
        
        // Tags match (25%) - Jaccard similarity
        if (preferred_tags.length > 0) {
          const intersection = preferred_tags.filter(tag => tags.includes(tag));
          const union = [...new Set([...preferred_tags, ...tags])];
          const jaccard = union.length > 0 ? intersection.length / union.length : 0;
          score += jaccard * 25;
        } else {
          score += 15; // No preference, neutral
        }
        
        return {
          product_id: product.id,
          name: product.name,
          type: product.type,
          se_name: product.se_name,
          se_id: product.se_id,
          description: product.description,
          price_min: product.price_min,
          price_max: product.price_max,
          unit: product.unit,
          capacity_min: product.capacity_min,
          capacity_max: product.capacity_max,
          duration: product.duration,
          tags,
          impact_metrics: metrics,
          match_score: Math.round(score * 10) / 10,
          match_percentage: Math.round(score)
        };
      });
      
      // Sort by score descending
      scored.sort((a, b) => b.match_score - a.match_score);
      
      // Return top 10
      callback(null, scored.slice(0, 10));
    }
  );
}

module.exports = { findMatches };

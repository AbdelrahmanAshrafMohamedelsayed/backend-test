# Challenge 2: Database Query Optimization

## Objective

Write optimized SQL/NoSQL queries to retrieve product data efficiently.

---

## SQL Query (PostgreSQL)

```sql
-- SQL query to fetch products with a price between $50 and $200,
-- ordered by price (ascending), with pagination (10 products per page)

SELECT *
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC
LIMIT 10 OFFSET 10 * (PAGE_NUMBER - 1);
```

### Explanation:

- **`WHERE price BETWEEN 50 AND 200`**: Filters products within the price range.
- **`ORDER BY price ASC`**: Orders the results by price in ascending order.
- **`LIMIT 10`**: Restricts the results to 10 products per page.
- **`OFFSET 10 * (PAGE_NUMBER - 1)`**: Implements pagination by skipping rows based on the page number.

---

## NoSQL Query (MongoDB)

```javascript
//  to retrieve products by category, sorted by price (descending), limited to 5 products per page

db.products
  .find(
    { category: "Electronics" } // Filter products by category
  )
  .sort({ price: -1 }) // Sort by price in descending order
  .skip(5 * (PAGE_NUMBER - 1)) // Skip documents based on page number
  .limit(5); // Limit results to 5 products per page
```

### Explanation:

- **`find({ category: "Electronics" })`**: Filters products by category.
- **`sort({ price: -1 })`**: Sorts products by price in descending order.
- **`skip(5 * (PAGE_NUMBER - 1))`**: Implements pagination by skipping documents.
- **`limit(5)`**: Restricts results to 5 products per page.

---

## Optimizations for High-Traffic Scenarios

### SQL (PostgreSQL):

1. **Indexing**:

   - Create an index on the `price` column to speed up the filtering and sorting:
     ```sql
     CREATE INDEX idx_price ON products (price);
     ```
   - For multi-column queries, consider a composite index (e.g., `(price, product_id)`).

2. **Caching**:

   - Use a caching layer like Redis to store frequently accessed results.
   - Cache results for specific price ranges and pages to reduce database load.

3. **Query Tuning**:

   - Use `EXPLAIN` or `EXPLAIN ANALYZE` to analyze query execution plans and identify bottlenecks.
   - Use partitioning or sharding for large tables.

4. **Connection Pooling**:
   - Implement connection pooling to handle concurrent queries efficiently.

---

### NoSQL (MongoDB):

1. **Indexing**:

   - Create an index on the `category` and `price` fields to improve query performance:
     ```javascript
     db.products.createIndex({ category: 1, price: -1 });
     ```

2. **Caching**:

   - Use a caching solution like Redis to store frequently queried categories and pages.

3. **Sharding**:

   - Distribute data across multiple shards based on the `category` field to handle high traffic efficiently.

4. **Projection**:

   - Return only necessary fields (`product_name` and `price`) to reduce network bandwidth.

5. **Aggregation Framework**:
   - If advanced filtering or transformation is needed, use the aggregation framework to optimize data retrieval and processing.

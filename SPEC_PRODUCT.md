# Product Service Specification

## Overview

Product Service chịu trách nhiệm quản lý toàn bộ danh mục sản phẩm của hệ thống Tiệm Nhà Zịt.

### Responsibilities

* Product Catalog Management
* Product Detail Management
* Product Variant Management
* Inventory Management
* Product Search
* Product Review Summary
* Product Recommendation
* Product SEO Metadata
* Product Media Management

---

# Domain Model

## Product

```typescript
interface Product {
  id: string;
  sku: string;
  slug: string;

  name: string;
  description: string;

  categoryId: string;
  categoryName: string;

  price: number;

  woolType: string;

  imageUrl: string;
  images?: string[];
  videos?: string[];

  colors?: Color[];

  types?: string[];

  dimensions?: ProductDimension;

  weight?: number;

  tags?: string[];

  rating?: number;
  reviewCount?: number;

  status: ProductStatus;

  inventoryStock: number;

  createdAt: string;
  updatedAt?: string;
}
```

---

## Color

```typescript
interface Color {
  name: string;
  hex: string;
  imageUrl?: string;
}
```

---

## Product Dimension

```typescript
interface ProductDimension {
  width: number;
  height: number;
  depth?: number;
}
```

---

## Product Status

```typescript
type ProductStatus =
  | "Draft"
  | "Active"
  | "OutOfStock"
  | "Archived";
```

---

# Category APIs

## Get Categories

```http
GET /api/categories
```

Response

```json
[
  {
    "id": "cat-001",
    "name": "Móc Khóa"
  }
]
```

---

## Create Category

```http
POST /api/categories
```

Request

```json
{
  "name": "Móc Khóa"
}
```

---

## Update Category

```http
PUT /api/categories/{id}
```

---

## Delete Category

```http
DELETE /api/categories/{id}
```

---

# Product APIs

## Get Product List

```http
GET /api/products
```

Query Parameters

```text
page
pageSize
keyword
categoryId
minPrice
maxPrice
status
sort
```

Example

```http
GET /api/products?page=1&pageSize=20
```

Response

```json
{
  "items": [],
  "totalItems": 100,
  "page": 1,
  "pageSize": 20
}
```

---

## Get Product Detail

```http
GET /api/products/{id}
```

Response

```json
{
  "id": "prod-001",
  "name": "Calcifer"
}
```

---

## Get Product By Slug

```http
GET /api/products/slug/{slug}
```

Example

```http
GET /api/products/slug/moc-khoa-calcifer
```

---

## Create Product

```http
POST /api/products
```

Request

```json
{
  "name": "Calcifer",
  "description": "Handmade",
  "price": 35000,
  "categoryId": "cat-001"
}
```

---

## Update Product

```http
PUT /api/products/{id}
```

---

## Delete Product

```http
DELETE /api/products/{id}
```

Soft Delete

```json
{
  "isDeleted": true
}
```

---

## Publish Product

```http
PATCH /api/products/{id}/publish
```

---

## Archive Product

```http
PATCH /api/products/{id}/archive
```

---

# Product Search APIs

## Search Product

```http
GET /api/products/search
```

Query

```text
keyword
categoryId
tag
woolType
minPrice
maxPrice
sort
```

Example

```http
GET /api/products/search?keyword=calcifer
```

---

## Product Suggestions

```http
GET /api/products/suggestions
```

Example

```http
GET /api/products/suggestions?q=cal
```

Response

```json
[
  "Calcifer",
  "Calcifer Blue"
]
```

---

# Inventory APIs

## Get Inventory

```http
GET /api/inventory/{productId}
```

Response

```json
{
  "inventoryStock": 50,
  "reservedStock": 10,
  "availableStock": 40
}
```

---

## Update Inventory

```http
PUT /api/inventory/{productId}
```

Request

```json
{
  "inventoryStock": 100
}
```

---

## Reserve Inventory

Used by Order Service.

```http
POST /api/inventory/reserve
```

Request

```json
{
  "productId": "prod-001",
  "quantity": 2
}
```

---

## Release Inventory

```http
POST /api/inventory/release
```

---

# Product Media APIs

## Upload Image

```http
POST /api/products/media/images
```

multipart/form-data

---

## Upload Video

```http
POST /api/products/media/videos
```

multipart/form-data

---

## Delete Media

```http
DELETE /api/products/media/{id}
```

---

# Product Review APIs

## Get Product Reviews

```http
GET /api/products/{productId}/reviews
```

---

## Create Review

```http
POST /api/products/{productId}/reviews
```

Request

```json
{
  "rating": 5,
  "comment": "Sản phẩm đẹp"
}
```

---

## Update Review

```http
PUT /api/reviews/{reviewId}
```

---

## Delete Review

```http
DELETE /api/reviews/{reviewId}
```

---

# Recommendation APIs

## Related Products

```http
GET /api/products/{id}/related
```

Response

```json
[
  {
    "id": "prod-002",
    "name": "Totoro"
  }
]
```

---

## Featured Products

```http
GET /api/products/featured
```

---

## Best Seller Products

```http
GET /api/products/best-sellers
```

---

## New Arrival Products

```http
GET /api/products/new-arrivals
```

---

# Admin Dashboard APIs

## Product Statistics

```http
GET /api/admin/products/statistics
```

Response

```json
{
  "totalProducts": 200,
  "activeProducts": 180,
  "outOfStockProducts": 10,
  "draftProducts": 10
}
```

---

## Low Stock Products

```http
GET /api/admin/products/low-stock
```

Query

```text
threshold=10
```

---

# Events

## ProductCreated

```json
{
  "productId": "prod-001"
}
```

---

## ProductUpdated

```json
{
  "productId": "prod-001"
}
```

---

## ProductDeleted

```json
{
  "productId": "prod-001"
}
```

---

## ProductPriceChanged

```json
{
  "productId": "prod-001",
  "oldPrice": 30000,
  "newPrice": 35000
}
```

---

## ProductStockChanged

```json
{
  "productId": "prod-001",
  "inventoryStock": 50
}
```

---

# Service Dependencies

## Product Service

Dependencies

* PostgreSQL
* Redis
* RabbitMQ
* MinIO/S3

---

## Consumed By

* Storefront Web (Next.js)
* CRM Admin Portal (Angular)
* Cart Service
* Order Service
* Search Service
* Recommendation Service

---

# Security

Admin APIs

```text
ROLE_ADMIN
ROLE_MANAGER
```

Storefront APIs

```text
Anonymous
Authenticated
```

---

# Versioning

```http
/api/v1/products
/api/v1/categories
/api/v1/inventory
```

All breaking changes must be introduced through a new API version.

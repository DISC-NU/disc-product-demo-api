# Express Supabase API

A RESTful API built with Express.js and Supabase for managing products with image upload capabilities. This API provides endpoints for creating, reading, updating, and deleting products, with image storage handled by Supabase Storage.

## Features

- CRUD operations for products
- Image upload and storage using Supabase Storage
- TypeScript support
- Environment variable configuration
- Error handling
- Image URL generation and management

## Prerequisites

- Node.js v18.x
- Supabase account and project
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## Project Structure

```
├── src/
│   ├── config/
│   │   └── supabase.ts
│   ├── controllers/
│   │   └── productController.ts
│   ├── routes/
│   │   └── productRoutes.ts
│   ├── types/
│   │   └── product.ts
│   ├── utils/
│   │   └── storageHelper.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd express-supabase-api
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

For development with hot-reload:

```bash
npm run dev
```

## API Endpoints

### Products

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/products`     | Get all products       |
| GET    | `/api/products/:id` | Get a specific product |
| POST   | `/api/products`     | Create a new product   |
| PUT    | `/api/products/:id` | Update a product       |
| DELETE | `/api/products/:id` | Delete a product       |

### Request Examples

#### Create Product

```bash
curl -X POST -F "name=Product Name" \
  -F "price=99.99" \
  -F "description=Product Description" \
  -F "image=@/path/to/image.jpg" \
  http://localhost:3000/api/products
```

#### Update Product

```bash
curl -X PUT -F "name=Updated Name" \
  -F "price=149.99" \
  -F "image=@/path/to/new-image.jpg" \
  http://localhost:3000/api/products/1
```

## Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `disc-product-images`
3. Create a products table with the following schema:

```sql
create table products (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  price decimal(10,2) not null,
  description text,
  image_url text
);
```

4. Set up storage bucket policies:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'disc-product-images');

CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'disc-product-images');
```

## Error Handling

The API includes comprehensive error handling for:

- Invalid requests
- File upload failures
- Database operations
- Missing resources
- Server errors

## Development

### Available Scripts

- `npm run build`: Compiles TypeScript to JavaScript
- `npm start`: Starts the production server
- `npm run dev`: Starts the development server with hot-reload
- `npm run reset`: Resets the database (if configured)
- `npm run setup-storage`: Sets up Supabase storage bucket

### Type Definitions

The project uses TypeScript interfaces for type safety:

```typescript
interface Product {
  id: number;
  created_at: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}
```

## Deployment

This API can be deployed to platforms like Render, Heroku, or any other Node.js hosting service. Make sure to:

1. Set all required environment variables
2. Configure the build command: `npm install && npm run build`
3. Set the start command: `npm start`
4. Use Node.js 18.x runtime

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT License](LICENSE)

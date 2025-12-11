

# React Ecommerce Backend API

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodemon/nodemon-original.svg" alt="Nodemon" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotenv/dotenv-original.svg" alt="Dotenv" width="50" height="50"/>
</p>

> Backend API for managing **users, products, and orders** with analytics, sorting, and filtering.

---

## Features

* ✅ CRUD for **Users**, **Products**, **Orders**
* ✅ Soft delete functionality
* ✅ Sorting & filtering support
* ✅ Orders by user with total orders and total spent
* ✅ Most selling product analytics
* ✅ Orders filtering by **day, month, year, week, date**
* ✅ Statistics: top users by total spent, city with most orders

---

## Technologies

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodemon/nodemon-original.svg" alt="Nodemon" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotenv/dotenv-original.svg" alt="Dotenv" width="40" height="40"/>
</p>

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/react-email-backend.git
cd react-email-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=ecommerce
PORT=4000
```

4. Start the server:

```bash
npm start
```

Server runs at `http://localhost:4000`.

---

## API Endpoints

### Users

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/users`     | Get all users     |
| GET    | `/api/users/:id` | Get user by ID    |
| PUT    | `/api/users/:id` | Update user by ID |
| DELETE | `/api/users/:id` | Soft delete user  |

### Products

| Method | Endpoint                     | Description                         |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | `/api/products`              | Get all products (supports sorting) |
| GET    | `/api/products/:id`          | Get product by ID                   |
| POST   | `/api/products`              | Create new product                  |
| PUT    | `/api/products/:id`          | Update product                      |
| DELETE | `/api/products/:id`          | Soft delete product                 |
| GET    | `/api/products/most-selling` | Get the most selling product        |

### Orders

| Method | Endpoint                                           | Description                                 |
| ------ | -------------------------------------------------- | ------------------------------------------- |
| GET    | `/api/orders`                                      | Get all orders (supports sorting)           |
| GET    | `/api/orders/:o_id`                                | Get order by ID                             |
| GET    | `/api/user-orders/:user_id`                        | Get orders by user with total count & price |
| PUT    | `/api/orders/:o_id`                                | Update order                                |
| DELETE | `/api/orders/:o_id`                                | Soft delete order                           |
| GET    | `/api/orders/stats`                                | Get top users and top city by orders        |
| GET    | `/api/orders/filter?day=&month=&year=&week=&date=` | Filter orders by date                       |

---

## Sorting Example

```http
GET /api/products?sort_by=price&order=ASC
GET /api/orders?sort_by=created_at&order=DESC
```

Allowed fields: `name`, `price`, `qty`, `created_at`, `updated_at`.

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

MIT License © 2025

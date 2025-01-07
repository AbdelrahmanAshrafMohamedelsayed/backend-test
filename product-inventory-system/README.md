# 🌟 Product Inventory System

A robust **Product Inventory System** built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication** to handle secure and efficient inventory management.

---

## 🚀 Project Setup

Follow these steps to get the project up and running on your local machine:

### 1️⃣ Clone the Repository

Fork and clone the repository to your local machine:

```bash
git clone https://github.com/AbdelrahmanAshrafMohamedelsayed/backend-test.git
cd backend-test/product-inventory-system
```

---

### 2️⃣ Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

---

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory of the project and configure the following variables:

```bash
# Set to 'production' for secure cookies and HTTPS
NODE_ENV=development

# Server Port
PORT=3000

# MongoDB Connection Details
DATABASE=
DATABASE_PASSWORD=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=
```

#### 🛠️ Explanation of Environment Variables:

- **`NODE_ENV`**: Specifies the environment (`development` or `production`).
- **`PORT`**: Port number the server will run on.
- **`DATABASE`**: MongoDB connection string.
- **`DATABASE_PASSWORD`**: MongoDB password.
- **`JWT_SECRET`**: Secret key to sign and verify JWT tokens.
- **`JWT_EXPIRES_IN`**: Expiration duration for JWT tokens.
- **`JWT_COOKIE_EXPIRES_IN`**: Expiration time for the authentication cookie.

---

### 4️⃣ Run the Application

Start the server using the following command:

```bash
npm start
```

The server will run on the port specified in the `.env` file (default: **3000**).

---

## 📌 API Endpoints

Here is an overview of the key API endpoints:

| Endpoint                | Method | Description                      |
|-------------------------|--------|----------------------------------|
| **`/auth/login`**       | POST   | Login and receive a JWT token.   |
| **`/products`**         | POST   | Add a new product (Admin only).  |
| **`/products`**         | GET    | List all products.               |
| **`/products/:id`**     | GET    | Fetch a product by ID.           |
| **`/products/:id`**     | PUT    | Update a product (Admin only).   |
| **`/products/:id`**     | DELETE | Delete a product (Admin only).   |

---

### 5️⃣ 🧪 Testing

To test the API endpoints:

1. Ensure your `.env` file is properly configured.
2. Use an API testing tool like **Postman** or **cURL** to send requests to the server.

---

💡 **Happy Coding!** 🚀

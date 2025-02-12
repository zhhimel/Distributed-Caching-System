# Distributed Caching with Node.js & Redis

## 📌 Overview
This project demonstrates how to implement a **distributed caching system** using **Node.js and Redis**. It simulates **cache invalidation** and shows the **performance improvements** for repeated database queries.

## 🚀 Features
- Uses **PostgreSQL** as the primary database.
- Implements **Redis caching** to store frequently accessed data.
- Demonstrates **cache invalidation**.
- Shows **performance improvements** with caching.

---

## 🛠️ Setup Instructions

### **1️⃣ Install Dependencies**
Make sure you have **Node.js, Redis, and PostgreSQL** installed. Then, install the required Node.js packages:
```sh
npm install express pg redis
```

### **2️⃣ Start Redis and PostgreSQL**
Run Redis:
```sh
redis-server
```
Run PostgreSQL:
```sh
sudo systemctl start postgresql
```

### **3️⃣ Create PostgreSQL Database & Table**
Log into PostgreSQL:
```sh
psql -U your_user -d your_database
```
Run the following SQL commands to create the required table:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);
```
Insert some test data:
```sql
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
```

### **4️⃣ Update Database Credentials**
Modify your `server.js` file to match your PostgreSQL credentials:
```javascript
const db = new Pool({
  user: "your_user",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});
```

### **5️⃣ Run the Server**
```sh
node server.js
```

---

## 📡 API Endpoints
### **Get User Data (With Caching)**
```sh
curl -X GET http://localhost:3000/user/1
```
#### **Response (First Time - Cache Miss)**
```json
{
  "fromCache": false,
  "data": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```
#### **Response (Second Time - Cache Hit)**
```json
{
  "fromCache": true,
  "data": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

### **Clear Cache (Invalidate Cache)**
```sh
curl -X DELETE http://localhost:3000/clear-cache
```

---

## 📊 Performance Improvement
| Scenario | Response Time |
|----------|--------------|
| Without Redis (DB Query) | ~100ms |
| With Redis (Cache Hit) | ~5ms |

You can check the performance logs:
```sh
cat performance.log
```
Example Output:
```
DB Query: 102ms
Cache Hit: 5ms
Cache Hit: 4ms
DB Query: 98ms
Cache Hit: 6ms
```

---

## 📎 Additional Notes
- If you get **"ECONNREFUSED"**, make sure PostgreSQL is running.
- If you get **"relation 'users' does not exist"**, create the table in PostgreSQL.
- You can tweak the **Redis TTL (time-to-live)** to control cache expiration.

---

## 📜 License
This project is open-source and free to use.

---

## 💡 Author
Developed by **[ZH Himel]** 🚀


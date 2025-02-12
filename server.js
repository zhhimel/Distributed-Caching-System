const express = require("express");
const Redis = require("ioredis");
const { Pool } = require("pg");
const fs = require("fs");

const app = express();
app.use(express.json()); 


const redis = new Redis();

const db = new Pool({
    user: "zhhimel",         
    host: "localhost",
    database: "mydb",      
    password: "hihimel123",
    port: 5432,
  });
  

const CACHE_EXPIRY = 60;

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `user:${id}`;

  try {
    console.time("Response Time"); 
    const startTime = Date.now();

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.timeEnd("Response Time"); 
      fs.appendFileSync("performance.log", `Cache Hit: ${Date.now() - startTime}ms\n`);
      return res.json({ fromCache: true, data: JSON.parse(cachedData) });
    }


    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(rows[0]));

    console.timeEnd("Response Time"); 
    fs.appendFileSync("performance.log", `DB Query: ${Date.now() - startTime}ms\n`);

    res.json({ fromCache: false, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    
    await db.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id]);

    
    await redis.del(`user:${id}`);

    res.json({ message: "User updated, cache invalidated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

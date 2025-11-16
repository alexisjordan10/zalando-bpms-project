import sql from "mssql";

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  options: {
    encrypt: false, // local dev
    trustServerCertificate: true, // local dev
  },
};

let pool;

/**
 * Get (or create) a shared SQL connection pool
 */
export async function getPool() {
  if (pool) return pool;

  pool = await sql.connect(sqlConfig);
  return pool;
}

/**
 * Get all active products (for Create Order form later)
 */
export async function getAllProducts() {
  const pool = await getPool();
  const result = await pool
    .request()
    .query("SELECT ProductId, Name, Price, Stock FROM dbo.Products");

  return result.recordset; // array of { ProductId, Name, Price, Stock }
}

/**
 * Decrease stock for a product (for Warehouse fulfillment later)
 */
export async function decreaseStock(productId, quantity) {
  const pool = await getPool();
  await pool
    .request()
    .input("ProductId", sql.Int, productId)
    .input("Quantity", sql.Int, quantity).query(`
      UPDATE dbo.Products
      SET Stock = Stock - @Quantity
      WHERE ProductId = @ProductId
    `);
}

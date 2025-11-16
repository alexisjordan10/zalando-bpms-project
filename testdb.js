import "dotenv/config";
import { getAllProducts } from "./db.js";

async function main() {
  const products = await getAllProducts();
  console.log("Products from DB:", products);
}

main().catch((err) => {
  console.error("DB test error:", err);
});

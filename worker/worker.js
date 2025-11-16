import "dotenv/config";
import axios from "axios";
import { ZBClient } from "zeebe-node";
import { getAllProducts } from "../db.js";

console.log("🔧 Using CAMUNDA CLOUD mode (clusterId + region)…");

const zbc = new ZBClient({
  camundaCloud: {
    clientId: process.env.CAMUNDA_CLIENT_ID,
    clientSecret: process.env.CAMUNDA_CLIENT_SECRET,
    clusterId: process.env.CAMUNDA_CLUSTER_ID,
    region: process.env.CAMUNDA_CLUSTER_REGION,
  },
});

console.log("✅ Connected to Camunda Cloud (explicit OAuth config)");

//Worker "fetch-server-time"
zbc.createWorker({
  taskType: "fetch-server-time",
  taskHandler: async (job) => {
    try {
      console.log("⏱ Fetching time from API...");

      const res = await axios.get(
        "https://timeapi.io/api/Time/current/zone?timeZone=UTC"
      );

      const serverTime = res.data.dateTime;

      console.log("✅ Server time:", serverTime);

      return job.complete({
        serverTime,
      });
    } catch (err) {
      console.log("❌ API ERROR:", err.message);
      throw new Error("Failed to fetch server time from API.");
    }
  },
});

//Worker "load-products"
zbc.createWorker({
  taskType: "load-products",
  taskHandler: async (job) => {
    try {
      console.log("[load-products] Fetching products from DB...");

      const products = await getAllProducts();

      const productOptions = products.map((p) => ({
        label: `${p.Name} (${p.Price} € – stock: ${p.Stock})`,
        value: p.ProductId,
      }));

      console.log("[load-products] Loaded productOptions:", productOptions);

      return job.complete({
        productOptions,
      });
    } catch (err) {
      console.error("[load-products] DB error:", err);
      throw new Error("Failed to load products from DB");
    }
  },
});

console.log("🚀 Worker fetch-server-time is ready and waiting for jobs...");
console.log("🚀 Worker load-products is ready and waiting for jobs...");

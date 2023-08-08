import express from "express";
import ProductManager from "../../ProductManager.js";
import { Server } from "socket.io";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("index", { products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error al obtener los productos");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realtimeProducts", { products });
});

router.post("/products", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  req.app.get("socketServer").emit("product_created", newProduct);
  res.json(newProduct);
});

router.delete("/products/:id", async (req, res) => {
  let id = Number(req.params.id);
  const deletedProduct = await productManager.deleteProduct(id);
  res.send({
    status: "ok",
    message: "El Producto se eliminó correctamente!",
  });
  req.app.get("socketServer").emit("product_deleted", deletedProduct);
  res.json(deletedProduct);
});

export default router;

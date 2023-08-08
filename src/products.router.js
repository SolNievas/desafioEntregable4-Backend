import { Router } from "express";
import ProductManager from "../../ProductManager.js";

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    let limit = Number(req.query.limit);
    if (limit) {
      let arrayProds = [...products];
      const productsLimit = arrayProds.slice(0, limit);
      return res.send(productsLimit);
    } else {
      res.send(products);
    }
  } catch (error) {
    console.log(error);
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    let pid = Number(req.params.pid);
    const product = products.find((prod) => prod.id === pid);
    if (product) {
      res.status(200).send({
        product,
      });
    } else {
      res.send({
        status: "error",
        message: "No se encontro ningún producto con el id #" + pid,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (!title) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Title!",
      });
      return false;
    }

    if (!description) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Description!",
      });
      return false;
    }

    if (!code) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Code!",
      });
      return false;
    }

    if (!price) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Price!",
      });
      return false;
    }

    status = !status && true;

    if (!stock) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Stock!",
      });
      return false;
    }

    if (!category) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Category!",
      });
      return false;
    }

    if (
      await productManager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      })
    ) {
      res.send({
        status: "ok",
        message: "El Producto se agregó correctamente!",
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Error! No se pudo agregar el Producto!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const existingProduct = await productManager.getProductById(pid);

    if (!existingProduct) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found!" });
    }

    if (req.body.title) {
      existingProduct.title = req.body.title;
    }

    if (req.body.description) {
      existingProduct.description = req.body.description;
    }

    if (req.body.code) {
      existingProduct.code = req.body.code;
    }

    if (req.body.price) {
      existingProduct.price = req.body.price;
    }

    if (req.body.stock) {
      existingProduct.stock = req.body.stock;
    }

    if (req.body.category) {
      existingProduct.category = req.body.category;
    }

    if (req.body.thumbnails) {
      existingProduct.thumbnails = req.body.thumbnails;
    }

    if (productManager.updateProduct(pid, existingProduct)) {
      res.status(200).send({ status: "OK", message: "Producto actualizado!" });
    } else {
      res.status(500).send({
        status: "error",
        message:
          "Error! El producto no se actualizó! Por favor, compruebe que no se repita el code!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    let pid = Number(req.params.pid);

    if (productManager.deleteProduct(pid)) {
      res.send({
        status: "ok",
        message: "El Producto se eliminó correctamente!",
      });
    } else {
      res.status(500).send({
        status: "error",
        message: "Error! No se pudo eliminar el Producto!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export default productsRouter;

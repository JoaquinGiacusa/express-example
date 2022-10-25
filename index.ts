import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

const products: { id: number; name: string; marca: string }[] = [
  {
    name: "Teclado",
    marca: "Logitech",
    id: 2131231,
  },
  {
    name: "Placa",
    marca: "AMD",
    id: 21312312,
  },
  {
    name: "Placa",
    marca: "AMD",
    id: 21312312,
  },
];

/**
 * Get all products
 */
app.get("/product", (req, res) => {
  return res.status(200).json(products);
});

/**
 * Get a single Product by id
 */
app.get("/product/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1)
    return res.status(400).json({ message: "product could not be found" });
  return res.status(200).json(products[index]);
});

/**
 * Create product
 */
app.post("/product", (req, res) => {
  const { name, marca } = req.body;
  if (!name || !marca)
    return res
      .status(400)
      .json({ message: "fields 'name' and 'marca' is requiered" });
  products.push({ id: new Date().getTime(), name, marca });
  return res.status(200).json(...products.slice(-1));
});

/**
 * Edit product by id
 */
app.put("/product/:id", (req, res) => {
  const { name, marca } = req.body;
  const id = Number(req.params.id);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1)
    return res.status(400).json({ message: "no se encontro producto" });
  if (marca) {
    products[index].marca = marca;
  }
  if (name) {
    products[index].name = name;
  }
  return res.status(200).json(products[index]);
});

/**
 * Delete product by id
 */
app.delete("/product/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1)
    return res.status(400).json({ message: "product could not be found" });

  return res.status(200).json(products.splice(index, 1));
});

app.listen(3000, () => {
  console.log("Corriendo");
});

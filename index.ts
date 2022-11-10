import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

type Product = { id: number; name: string; brand: string };

const products: Product[] = [
  {
    name: "Teclado",
    brand: "Logitech",
    id: 12356234,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 42345612,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 4235232,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 4234612,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 474612,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 4234123,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 425312,
  },
  {
    name: "Placa",
    brand: "AMD",
    id: 4234212,
  },
];

/**
 * Get all products
 */
app.get("/product", (req, res) => {
  const query = req.query as {
    // name?: string;
    // brand?: string;
    search: string;
    limit?: string;
    page?: string;
  };

  let currentProducts: Product[] = products;
  let totalPage = 0;
  let limit = query?.limit ? Number(query?.limit) : 5;

  if (query.search) {
    currentProducts = currentProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.search.toLowerCase())
    );
  }

  // if (query.brand) {
  //   currentProducts = currentProducts.filter((product) =>
  //     product.brand.toLowerCase().includes(query.brand.toLowerCase())
  //   );
  //}

  if (query.page) {
    const page = Number(query.page);
    // console.log(currentProducts.length);

    totalPage = Math.ceil(currentProducts.length / limit);
    const result = currentProducts.slice((page - 1) * limit, limit * page);
    return res.status(200).json({ result, totalPage });
  }

  return res.status(200).json({ result: currentProducts });
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
  const { name, brand } = req.body;
  if (!name || !brand)
    return res
      .status(400)
      .json({ message: "fields 'name' and 'brand' is requiered" });
  products.push({ id: new Date().getTime(), name, brand });
  return res.status(200).json(...products.slice(-1));
});

/**
 * Edit product by id
 */
app.put("/product/:id", (req, res) => {
  const { name, brand } = req.body;
  const id = Number(req.params.id);
  const index = products.findIndex((product) => product.id === id);
  console.log(name, brand);

  if (index === -1)
    return res.status(400).json({ message: "no se encontro producto" });
  if (brand) {
    products[index].brand = brand;
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
  console.log("Corriendo en el puerto 3000");
});

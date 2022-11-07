import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

const products: { id: number; name: string; marca: string }[] = [
  {
    name: "Teclado",
    marca: "Logitech",
    id: 12356234,
  },
  {
    name: "Placa",
    marca: "AMD",
    id: 42345612,
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

const getOffsetAndLimitFromReq = (
  limit,
  offset,
  maxLimit = 10,
  maxOffset = 100
) => {
  // const queryLimit = Number(limit);
  // const queryOffset = Number(offset) || 0;

  const finalLimit = limit ? (limit < maxLimit ? limit : maxLimit) : maxLimit;

  const finalOffset = offset < maxOffset ? offset : 0;

  return { finalLimit, finalOffset };
};

/**
 * Search Products by query
 */
app.get("/search", (req, res) => {
  const { q, limit, offset } = req.query;
  const queryLimit = Number(limit);
  const queryOffset = Number(offset);

  const { finalLimit, finalOffset } = getOffsetAndLimitFromReq(
    queryLimit,
    queryOffset
  );

  const search = products.filter((p) => {
    if (
      p.name.toLocaleLowerCase().includes(q as string) ||
      p.marca.toLocaleLowerCase().includes(q as string)
    )
      return p;
  });

  if (search.length > 0) {
    if (search.length > finalOffset) {
      const filtered = search
        .slice(finalOffset, search.length)
        .slice(0, finalLimit);

      return res.status(200).json({ serachResult: filtered });
    } else {
      return res.status(200).json({ serachResult: search });
    }
  } else
    return res
      .status(400)
      .json({ message: "No hubo coincidencias con la busqueda" });
});

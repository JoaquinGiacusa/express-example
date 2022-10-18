import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

let product: { id: number; name: string; marca: string }[] = [
  {
    name: "mause",
    marca: "telefe",
    id: 2131231,
  },
];

app.get("/product", (req, res) => {
  res.status(200).json(product);
});

app.post("/product", (req, res) => {
  const { name, marca } = req.body;
  try {
    if (!name || !marca) throw new Error("che pasame el name y marca");
    product.push({ id: new Date().getTime(), name, marca });
    res.status(200).json(...product.slice(-1));
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.put("/product", (req, res) => {
  const { name, id } = req.body;

  const index = product.findIndex((product) => product.id === id);
  console.log(index);

  if (index === -1)
    return res.status(400).json({ message: "no se encontro producto" });

  product[index] = { ...product[index], name };
  res.status(200).json(product[index]);
});

app.delete("/products", (req, res) => {
  const { id } = req.body;
  product = product.filter((item) => {
    return item.id != id;
  });
  res.status(200).json({ product, message: "elemento eliminado" });
});

app.listen(3000, () => {
  return console.log(`Server running on 3000`);
});

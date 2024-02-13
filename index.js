import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json")
    return JSON.parse(data);
  } catch(error) {
    console.log(error);
  }
};
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch(error) {
    console.error(error);
  }
};


app.get("/", (req, res) => {
  res.send("bienvenidos a mi primera api con Node.js!!!")
});


app.get("/pacientes", (req, res) => {
  const data = readData();
  res.json(data.pacientes);
});

app.get("/pacientes/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const paciente = data.pacientes.find((paciente) => paciente.id === id);
  res.json(paciente);
});

app.post("/pacientes", (req, res) => {
  let data = readData();
  if (!data) {
    data = { pacientes: [] };
  }
  const body = req.body;
  const newpaciente = {
    id: data.pacientes.length + 1,
    ...body,  
  };
  data.pacientes.push(newpaciente);
  writeData(data);
  res.json(newpaciente);
});

app.put("/pacientes/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const pacienteIndex = data.pacientes.findIndex((paciente) => paciente.id === id);
  data.pacientes[pacienteIndex] = {
    ...data.pacientes[pacienteIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "paciente actualizado exitosamente" });
});


app.delete("/pacientes/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const pacienteIndex = data.pacientes.findIndex((paciente) => paciente.id === id);
  data.pacientes.splice(pacienteIndex, 1);
  writeData(data);
  res.json({message: "paciente borrado exitosamente"});
});





app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
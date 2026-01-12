import { db } from "./db.js";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/appointments", (req, res) => {
  const sql = "SELECT * from appointments";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/appointments", (req, res) => {
  const { name, doctor, date, time } = req.body;

  const sql =
    "INSERT INTO appointments (name, doctor, date, time) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, doctor, date, time], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Appointment received." });
  });
});

app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM appointments WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Appointment deleted." });
  });
});

app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { doctor, time } = req.body;

  if (!doctor || !time) {
    return res.status(400).json({ error: "Doctor and Time is required." });
  }
  const sql = "UPDATE appointments SET doctor = ?, time = ? WHERE id = ?";
  db.query(sql, [doctor, time, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment Saved." });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

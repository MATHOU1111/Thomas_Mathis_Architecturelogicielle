const express = require("express");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("./core/errors");

function createApi(tournament) {
  const app = express();
  app.use(express.json());

  app.get("/teams", async (req, res) => {
    res.json(await tournament.listTeams());
  });

  app.get("/matches", async (req, res) => {
    res.json(await tournament.listMatches());
  });

  app.post("/matches", async (req, res) => {
    const { team1Id, team2Id } = req.body || {};
    const match = await tournament.createMatch(team1Id, team2Id);
    res.status(201).json(match);
  });

  app.post("/matches/:id/result", async (req, res) => {
    const { scoreTeam1, scoreTeam2 } = req.body || {};
    const match = await tournament.recordResult(
      req.params.id,
      scoreTeam1,
      scoreTeam2,
    );
    res.json(match);
  });

  app.get("/ranking", async (req, res) => {
    res.json(await tournament.getRanking());
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Route introuvable." });
  });

  app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
      return res
        .status(400)
        .json({ error: "Le corps de la requête doit être un JSON valide." });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof ConflictError) {
      return res.status(409).json({ error: error.message });
    }
    const status = error.status >= 400 && error.status < 500 ? error.status : 500;
    res.status(status).json({
      error: status === 500 ? "Erreur interne du serveur." : error.message,
    });
  });

  return app;
}

module.exports = { createApi };

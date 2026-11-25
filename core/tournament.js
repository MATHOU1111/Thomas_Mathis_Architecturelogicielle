const { ValidationError, NotFoundError, ConflictError } = require('./errors');
const { calculateRanking } = require('./ranking');

function createTournament(storage, notifier) {
  async function init() {
    const teams = await storage.getTeams();
    const matches = await storage.getMatches();
    await storage.saveRanking(calculateRanking(teams, matches));
  }

  async function listTeams() {
    return storage.getTeams();
  }

  async function listMatches() {
    return storage.getMatches();
  }

  async function createMatch(team1Id, team2Id) {
    if (!Number.isSafeInteger(team1Id) || !Number.isSafeInteger(team2Id)) {
      throw new ValidationError('Les identifiants des équipes doivent être des entiers.');
    }
    const teams = await storage.getTeams();
    const team1 = teams.find((team) => team.id === team1Id);
    const team2 = teams.find((team) => team.id === team2Id);
    if (!team1 || !team2) {
      throw new NotFoundError('Une des équipes est introuvable.');
    }
    if (team1Id === team2Id) {
      throw new ValidationError('Une équipe ne peut pas jouer contre elle-même.');
    }

    return storage.addMatch(team1Id, team2Id);
  }

  async function recordResult(id, scoreTeam1, scoreTeam2) {
    const match = await storage.getMatch(id);
    if (!match) {
      throw new NotFoundError('Match introuvable.');
    }
    if (match.status === 'completed') {
      throw new ConflictError('Le résultat de ce match a déjà été enregistré.');
    }

    if (!Number.isSafeInteger(scoreTeam1) || scoreTeam1 < 0 ||
        !Number.isSafeInteger(scoreTeam2) || scoreTeam2 < 0) {
      throw new ValidationError('Les scores doivent être des entiers positifs ou nuls.');
    }

    const result = await storage.saveResult(id, scoreTeam1, scoreTeam2);
    if (!result) {
      throw new ConflictError('Le résultat de ce match a déjà été enregistré.');
    }
    await init();

    const teams = await storage.getTeams();
    const team1 = teams.find((team) => team.id === result.team1Id);
    const team2 = teams.find((team) => team.id === result.team2Id);
    await notifier.notify(result, team1, team2);
    return result;
  }

  async function getRanking() {
    return storage.getRanking();
  }

  return { init, listTeams, listMatches, createMatch, recordResult, getRanking };
}

module.exports = { createTournament };

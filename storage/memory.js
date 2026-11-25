const data = require('../data');

async function getTeams() {
  return data.teams;
}

async function getMatches() {
  return data.matches;
}

async function getMatch(id) {
  return data.matches.find((entry) => String(entry.id) === id);
}

async function addMatch(team1Id, team2Id) {
  const match = {
    id: Math.max(0, ...data.matches.map((entry) => entry.id)) + 1,
    team1Id,
    team2Id,
    scoreTeam1: null,
    scoreTeam2: null,
    status: 'pending',
  };
  data.matches.push(match);
  return match;
}

async function saveResult(id, scoreTeam1, scoreTeam2) {
  const match = await getMatch(id);
  if (match.status === 'completed') return null;
  match.scoreTeam1 = scoreTeam1;
  match.scoreTeam2 = scoreTeam2;
  match.status = 'completed';
  return match;
}

async function getRanking() {
  return data.ranking;
}

async function saveRanking(ranking) {
  data.ranking = ranking;
}

module.exports = { getTeams, getMatches, getMatch, addMatch, saveResult, getRanking, saveRanking };

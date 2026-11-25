const readline = require('node:readline');

function startCli(tournament) {
  const terminal = readline.createInterface({ input: process.stdin });
  console.log('Commandes : teams, matches, ranking, create, result');

  terminal.on('line', async (line) => {
    const [command, a, b, c] = line.trim().split(' ');

    try {
      switch (command) {
        case 'teams':
          console.log(await tournament.listTeams());
          break;
        case 'matches':
          console.log(await tournament.listMatches());
          break;
        case 'ranking':
          console.log(await tournament.getRanking());
          break;
        case 'create':
          console.log(await tournament.createMatch(Number(a), Number(b)));
          break;
        case 'result':
          console.log(await tournament.recordResult(a, Number(b), Number(c)));
          break;
        default:
          console.log('Commande inconnue.');
      }
    } catch (error) {
      console.error(`Erreur : ${error.message}`);
    }
  });
}

module.exports = { startCli };

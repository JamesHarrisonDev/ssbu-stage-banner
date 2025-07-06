const API_KEY = process.env.NEXT_PUBLIC_STARTGG_API_KEY;
const API_URL = 'https://api.start.gg/gql/alpha';

// GraphQL query to get tournament sets with stage data
const GET_TOURNAMENT_SETS = `
  query GetTournamentSets($tournamentId: ID!, $page: Int, $perPage: Int) {
    tournament(id: $tournamentId) {
      events {
        sets(page: $page, perPage: $perPage) {
          nodes {
            id
            winnerId
            games {
              winnerId
              stage {
                id
                name
              }
              selections {
                character {
                  id
                  name
                }
                entrant {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to search for Ultimate tournaments
const SEARCH_TOURNAMENTS = `
  query SearchTournaments($videogameId: ID!, $perPage: Int, $page: Int) {
    tournaments(query: {
      perPage: $perPage
      page: $page
      filter: {
        videogameIds: [$videogameId]
        upcoming: false
      }
    }) {
      nodes {
        id
        name
        startAt
        events {
          id
          videogame {
            id
            name
          }
        }
      }
    }
  }
`;

async function makeGraphQLRequest(query, variables = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
}

export async function searchUltimateTournaments(page = 1, perPage = 10) {
  const ULTIMATE_VIDEOGAME_ID = 1386; // Smash Ultimate's ID on start.gg
  
  return makeGraphQLRequest(SEARCH_TOURNAMENTS, {
    videogameId: ULTIMATE_VIDEOGAME_ID,
    page,
    perPage,
  });
}

export async function getTournamentSets(tournamentId, page = 1, perPage = 50) {
  return makeGraphQLRequest(GET_TOURNAMENT_SETS, {
    tournamentId,
    page,
    perPage,
  });
}

export async function getCharacterStageData(characterId, maxTournaments = 20) {
  const stageWinrates = new Map();
  
  try {
    // Get recent tournaments
    const tournaments = await searchUltimateTournaments(1, maxTournaments);
    
    for (const tournament of tournaments.tournaments.nodes) {
      const sets = await getTournamentSets(tournament.id);
      
      if (sets.tournament?.events) {
        for (const event of sets.tournament.events) {
          if (event.sets?.nodes) {
            for (const set of event.sets.nodes) {
              if (set.games) {
                for (const game of set.games) {
                  if (game.stage && game.selections) {
                    const characterSelection = game.selections.find(
                      selection => selection.character?.id === characterId
                    );
                    
                    if (characterSelection) {
                      const stageId = game.stage.id;
                      const stageName = game.stage.name;
                      const isWin = game.winnerId === characterSelection.entrant.id;
                      
                      if (!stageWinrates.has(stageId)) {
                        stageWinrates.set(stageId, {
                          id: stageId,
                          name: stageName,
                          wins: 0,
                          total: 0,
                        });
                      }
                      
                      const stageData = stageWinrates.get(stageId);
                      stageData.total++;
                      if (isWin) stageData.wins++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Calculate winrates and sort
    return Array.from(stageWinrates.values())
      .filter(stage => stage.total >= 5) // Minimum 5 games
      .map(stage => ({
        ...stage,
        winrate: (stage.wins / stage.total) * 100,
      }))
      .sort((a, b) => b.winrate - a.winrate);
      
  } catch (error) {
    console.error('Error fetching character stage data:', error);
    throw error;
  }
}
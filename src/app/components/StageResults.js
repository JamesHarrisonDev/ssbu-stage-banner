'use client';

import { useEffect, useState } from 'react';
import { getCharacterStageData } from '../lib/startgg-api';

export default function StageResults({ character }) {
  const [stageData, setStageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!character) {
      setStageData([]);
      return;
    }

    fetchStageData();
  }, [character]);

  const fetchStageData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCharacterStageData(character.id);
      setStageData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stage data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a character to view stage data</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading stage data for {character.displayName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error loading stage data: {error}</p>
          <button
            onClick={fetchStageData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (stageData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No stage data found for {character.displayName}</p>
        <p className="text-sm text-gray-400 mt-2">
          This could mean there isn't enough tournament data available for this character.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Stage Performance for {character.displayName}
      </h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
            <span>Rank</span>
            <span>Stage</span>
            <span>Win Rate</span>
            <span>Games Played</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {stageData.map((stage, index) => (
            <div key={stage.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-4 gap-4 items-center">
                <span className="text-lg font-semibold text-gray-900">
                  #{index + 1}
                </span>
                
                <span className="font-medium text-gray-900">
                  {stage.name}
                </span>
                
                <div className="flex items-center">
                  <div className="flex-1 mr-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stage.winrate >= 60 ? 'bg-green-500' :
                          stage.winrate >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(stage.winrate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    stage.winrate >= 60 ? 'text-green-600' :
                    stage.winrate >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {stage.winrate.toFixed(1)}%
                  </span>
                </div>
                
                <span className="text-gray-600">
                  {stage.wins}/{stage.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Data shows winrate on each stage (minimum 5 games played)</p>
        <p>Based on recent tournament data from start.gg</p>
      </div>
    </div>
  );
}
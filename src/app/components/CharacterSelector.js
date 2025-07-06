'use client';

import { useState } from 'react';
import { SMASH_ULTIMATE_CHARACTERS } from '@/app/lib/characters';

export default function CharacterSelector({ onCharacterSelect, selectedCharacter }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharacters = SMASH_ULTIMATE_CHARACTERS.filter(character =>
    character.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="character-search" className="block text-sm font-medium text-gray-700 mb-2">
          Select Character
        </label>
        <input
          id="character-search"
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
      </div>

      <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
        {filteredCharacters.map((character) => (
          <button
            key={character.id}
            onClick={() => onCharacterSelect(character)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 ${
              selectedCharacter?.id === character.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="font-medium">{character.displayName}</div>
          </button>
        ))}
      </div>

      {selectedCharacter && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Selected: <span className="font-semibold">{selectedCharacter.displayName}</span>
          </p>
        </div>
      )}
    </div>
  );
}
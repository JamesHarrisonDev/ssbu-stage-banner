'use client';

import { useState } from 'react';
import CharacterSelector from '@/app/components/CharacterSelector';
import StageResults from '@/app/components/StageResults';

export default function HomePage() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smash Ultimate Stage Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Discover your character's best and worst stages based on tournament data
          </p>
        </div>

        {/* Character Selection */}
        <div className="mb-8">
          <CharacterSelector 
            onCharacterSelect={handleCharacterSelect}
            selectedCharacter={selectedCharacter}
          />
        </div>

        {/* Stage Results */}
        <div className="mb-8">
          <StageResults character={selectedCharacter} />
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-12">
          <p>Data powered by start.gg API</p>
          <p className="mt-1">
            This tool analyzes tournament data to help you understand stage performance
          </p>
        </footer>
      </div>
    </div>
  );
}
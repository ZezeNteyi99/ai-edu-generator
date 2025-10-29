import React, { useState } from 'react';
import type { GenerateOptions } from '../types';
import { ContentType, Difficulty, Length, Grade, Tone } from '../types';

interface GeneratorFormProps {
  onGenerate: (options: GenerateOptions) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType>(ContentType.StudyGuide);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [length, setLength] = useState<Length>(Length.Standard);
  const [grade, setGrade] = useState<Grade>(Grade.Grade10);
  const [tone, setTone] = useState<Tone>(Tone.Academic);
  const [instructions, setInstructions] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() === '' || isLoading) return;
    onGenerate({ topic, contentType, difficulty, length, grade, tone, instructions });
  };

  const isButtonDisabled = isLoading || topic.trim() === '';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-indigo-300 mb-2">
            Topic or Subject
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, The Cold War, React Hooks"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-indigo-300 mb-2">
              Content Type
            </label>
            <select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={ContentType.StudyGuide}>Study Guide</option>
              <option value={ContentType.Quiz}>Quiz</option>
            </select>
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-indigo-300 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="grade" className="block text-sm font-medium text-indigo-300 mb-2">
              Grade Level
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-indigo-300 mb-2">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-indigo-300 mb-2">
              Length / Detail
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value as Length)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Length).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-indigo-300 mb-2">
            Additional Instructions (Optional)
          </label>
          <textarea
            id="instructions"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., Focus on the historical context, include a section on key figures..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
              isButtonDisabled
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate Content'}
          </button>
        </div>
      </form>
    </div>
  );
};
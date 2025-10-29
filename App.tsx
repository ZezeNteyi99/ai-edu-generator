import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { GeneratorForm } from './components/GeneratorForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Spinner } from './components/Spinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Header } from './components/Header';
import { generateEducationalContent } from './services/geminiService';
import type { GenerateOptions, PerformanceMetrics } from './types';
import { ContentType } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [contentType, setContentType] = useState<ContentType>(ContentType.StudyGuide);


  const handleGenerate = useCallback(async (options: GenerateOptions) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setPerformanceMetrics(null);
    setContentType(options.contentType);

    const startTime = performance.now();

    try {
      const content = await generateEducationalContent(options);
      setGeneratedContent(content);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Generation failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during content generation.');
      }
    } finally {
      const endTime = performance.now();
      setPerformanceMetrics({
        generationTime: ((endTime - startTime) / 1000).toFixed(2),
      });
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
          
          {isLoading && <Spinner />}
          
          {error && <ErrorDisplay message={error} />}
          
          {generatedContent && performanceMetrics && !isLoading && (
            <OutputDisplay 
              content={generatedContent} 
              metrics={performanceMetrics}
              contentType={contentType}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

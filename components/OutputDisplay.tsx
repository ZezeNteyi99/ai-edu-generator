import React, { useState, useEffect } from 'react';
import type { PerformanceMetrics, QuizData } from '../types';
import { ContentType } from '../types';

interface OutputDisplayProps {
  content: string;
  metrics: PerformanceMetrics;
  contentType: ContentType;
}

// A simple Markdown-like renderer for study guides to avoid a full library dependency
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n').map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-indigo-300">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 border-b border-gray-600 pb-2 text-indigo-300">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 border-b-2 border-indigo-400 pb-2 text-indigo-300">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        // Basic bold/italic support
        const formattedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return <p key={index} className="my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });

    return <div className="prose prose-invert max-w-none">{lines}</div>;
};

const QuizRenderer: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
    const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

    const toggleAnswer = (type: 'mc' | 'sa', index: number) => {
        const key = `${type}-${index}`;
        setShowAnswers(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-300">{quizData.title}</h1>

            {quizData.multipleChoice.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Multiple Choice</h2>
                    {quizData.multipleChoice.map((q, index) => (
                        <div key={index} className="mb-6 p-4 bg-gray-700 rounded-md">
                            <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                            <ul className="space-y-2 ml-4">
                                {q.options.map((opt, i) => <li key={i}>{String.fromCharCode(97 + i)}&#41; {opt}</li>)}
                            </ul>
                            <button onClick={() => toggleAnswer('mc', index)} className="text-sm text-indigo-400 hover:underline mt-3">
                                {showAnswers[`mc-${index}`] ? 'Hide' : 'Show'} Answer
                            </button>
                            {showAnswers[`mc-${index}`] && (
                                <p className="mt-2 p-2 bg-green-900/50 text-green-300 rounded-md">
                                    <strong>Answer:</strong> {q.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {quizData.shortAnswer.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Short Answer</h2>
                    {quizData.shortAnswer.map((q, index) => (
                        <div key={index} className="mb-6 p-4 bg-gray-700 rounded-md">
                            <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                            <button onClick={() => toggleAnswer('sa', index)} className="text-sm text-indigo-400 hover:underline mt-2">
                                {showAnswers[`sa-${index}`] ? 'Hide' : 'Show'} Answer
                            </button>
                            {showAnswers[`sa-${index}`] && (
                                <p className="mt-2 p-2 bg-green-900/50 text-green-300 rounded-md">
                                    <strong>Answer:</strong> {q.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, metrics, contentType }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);

    useEffect(() => {
        if (contentType === ContentType.Quiz) {
            try {
                const parsed = JSON.parse(content);
                // Basic validation
                if (parsed.title && Array.isArray(parsed.multipleChoice) && Array.isArray(parsed.shortAnswer)) {
                    setQuizData(parsed);
                    setParseError(null);
                } else {
                    throw new Error("Parsed JSON does not match expected Quiz format.");
                }
            } catch (e) {
                console.error("Failed to parse quiz JSON:", e);
                setParseError("Could not render quiz. The AI returned an invalid format. Showing raw output instead.");
                setQuizData(null);
            }
        } else {
            setQuizData(null);
            setParseError(null);
        }
    }, [content, contentType]);


    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        });
    };
    
    const handleDownload = () => {
        const fileExtension = contentType === ContentType.Quiz ? 'json' : 'md';
        const mimeType = contentType === ContentType.Quiz ? 'application/json' : 'text/markdown';
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated-content.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-600 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2 sm:mb-0">Generated Content</h2>
                <div className="text-sm text-gray-400">
                    Generation Time: <span className="font-semibold text-indigo-400">{metrics.generationTime}s</span>
                </div>
            </div>
            
            <div className="flex space-x-2 mb-4">
                <button onClick={handleCopy} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">{copyButtonText}</button>
                <button onClick={handleDownload} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors text-sm">Download</button>
            </div>

            <div className="bg-gray-900 p-4 rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto text-gray-200 leading-relaxed">
                {parseError && <div className="text-red-400 mb-4 p-3 bg-red-900/50 rounded-md">{parseError}</div>}
                
                {contentType === ContentType.Quiz && quizData && !parseError ? (
                    <QuizRenderer quizData={quizData} />
                ) : contentType === ContentType.StudyGuide ? (
                     <SimpleMarkdown text={content} />
                ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
                )}
            </div>
        </div>
    );
};

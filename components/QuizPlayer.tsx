import React, { useState } from 'react';
import { Quiz, Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentQuestion.correctOptionIndex) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === currentQuestion.correctOptionIndex ? 1 : 0));
    }
  };

  if (isFinished) {
    const finalScore = score;
    const percentage = Math.round((finalScore / quiz.questions.length) * 100);

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-yetomart-teal/20 rounded-full flex items-center justify-center text-yetomart-teal mb-8 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic font-serif">Quiz Concluído!</h2>
        <p className="text-slate-400 text-xl mb-10 font-medium">
          Você acertou <span className="text-white font-black">{finalScore}</span> de <span className="text-white font-black">{quiz.questions.length}</span> questões.
        </p>
        <div className="text-6xl font-black text-yetomart-orange mb-12 italic tracking-tighter font-serif">{percentage}%</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-yetomart-teal text-white px-10 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-lg active:scale-95"
        >
          Refazer Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] font-black text-yetomart-teal uppercase tracking-[0.3em]">Questão {currentQuestionIndex + 1} de {quiz.questions.length}</span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}% concluído</span>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <motion.div 
            className="bg-yetomart-teal h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h3 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tighter italic font-serif">
            {currentQuestion.text}
          </h3>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full p-6 rounded-sm border text-left transition-all flex items-center space-x-4 group ${
                  selectedOption === index 
                    ? 'bg-yetomart-teal/10 border-yetomart-teal text-white shadow-xl' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedOption === index ? 'border-yetomart-teal bg-yetomart-teal' : 'border-white/20'
                }`}>
                  {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-bold text-lg">{option}</span>
              </button>
            ))}
          </div>

          <div className="pt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-yetomart-teal text-white px-12 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-yetomart-teal/80 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center space-x-3"
            >
              <span>{currentQuestionIndex === quiz.questions.length - 1 ? 'Finalizar' : 'Próxima Questão'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPlayer;

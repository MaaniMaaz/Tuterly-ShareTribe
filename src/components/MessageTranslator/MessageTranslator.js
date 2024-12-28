import React, { useState } from 'react';
import { Button } from '../../components';
import css from './MessageTranslator.module.css';

const MessageTranslator = ({ message, onTranslate }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en'); // Default to English

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message.content,
          targetLanguage,
        }),
      });

      const data = await response.json();
      setTranslatedText(data.translation);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <div className={css.messageWrapper}>
      <div className={css.originalMessage}>{message.content}</div>

      <div className={css.translationControls}>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className={css.languageSelect}
        >
          {languageOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={css.translateButton}
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </Button>
      </div>

      {translatedText && (
        <div className={css.translatedMessage}>
          <div className={css.translationLabel}>Translation:</div>
          <div>{translatedText}</div>
        </div>
      )}
    </div>
  );
};

export default MessageTranslator;

import { TfIdf, TfIdfTerm, WordTokenizer } from 'natural';
import { eng, removeStopwords, rus } from 'stopword';
import { TextProcessor } from './text-processor';

export function extractKeywords(text: string) {
  // Приводим текст к нижнему регистру;
  const textProcessor = new TextProcessor(text);

  // Удаляем все знаки препинания, числа, слова с большой буквы, английские слова, длинные слова
  const processedTitle = textProcessor
    .decapitalizeFirstLetter()
    .removePunctuation()
    .removeNumbers()
    .removeCapitalizedWords()
    .removeEnglishWords()
    .removeShortWords()
    .trim();

  // Выделяем все слова строки
  const words = processedTitle.split(' ');

  // Удаляем стоп-слова
  const textWithoutStopWords = removeStopwords(words, [...rus, ...eng]).join(
    ' '
  );

  // Разбиение текста на отдельные токены (слова)
  const tokenizer = new WordTokenizer();
  const tokens = tokenizer.tokenize(textWithoutStopWords);

  // Создание и обучение модели TF-IDF
  const tfidf = new TfIdf();
  tfidf.addDocument(tokens);

  // Сбор всех ключевых слов и их значений TF-IDF
  const keywords = {};
  tfidf.listTerms(0).forEach(({ term, tfidf }: TfIdfTerm) => {
    keywords[term] = tfidf;
  });

  // Сортировка ключевых слов по их значению TF-IDF
  return Object.entries(keywords)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .map(([token]) => token);
}

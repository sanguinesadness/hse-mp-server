export class TextProcessor extends String {
  private _text = '';

  constructor(text: string) {
    super();
    this._text = text;
  }

  private assignResult(result: string): TextProcessor {
    this._text = result;
    return new TextProcessor(result);
  }

  capitalizeFirstLetter(): TextProcessor {
    return this.assignResult(
      this._text.charAt(0).toUpperCase() + this._text.slice(1).toLowerCase()
    );
  }

  decapitalizeFirstLetter(): TextProcessor {
    return this.assignResult(
      this._text.charAt(0).toLowerCase() + this._text.slice(1)
    );
  }

  removeCapitalizedWords(): TextProcessor {
    const capitalizedWordsRegex = /(?:^|\s)([A-ZА-Я][a-zа-яё]*)/g;
    return this.assignResult(this._text.replace(capitalizedWordsRegex, ''));
  }

  removeEnglishWords(): TextProcessor {
    const englishWordsRegex = /[a-zA-Z]+/g;
    return this.assignResult(this._text.replace(englishWordsRegex, ''));
  }

  removeNumbers(): TextProcessor {
    return this.assignResult(this._text.replace(/\d+/g, ''));
  }

  removePunctuation(): TextProcessor {
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~«»]/g;
    return this.assignResult(this._text.replace(punctuationRegex, ''));
  }

  removeShortWords(minCount = 2): TextProcessor {
    const words = this._text.split(' ');
    const onlyLongWords = words.filter(
      (word: string) => word.length > minCount
    );
    return this.assignResult(onlyLongWords.join(' '));
  }

  toString(): string {
    return this._text;
  }
}

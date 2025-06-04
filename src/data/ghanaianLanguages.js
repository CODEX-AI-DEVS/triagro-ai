export const ghanaianLanguages = {
  languages: {
    'en': { 
      name: 'English', 
      nativeName: 'English', 
      flag: '🇬🇧' 
    },
    'tw': { 
      name: 'Twi', 
      nativeName: 'Twi', 
      flag: '🇬🇭' 
    },
    'ee': { 
      name: 'Ewe', 
      nativeName: 'Eʋegbe', 
      flag: '🇬🇭' 
    },
    'ga': { 
      name: 'Ga', 
      nativeName: 'Gã', 
      flag: '🇬🇭' 
    },
    'dag': { 
      name: 'Dagbani', 
      nativeName: 'Dagbanli', 
      flag: '🇬🇭' 
    }
  },
  defaultLanguage: 'en',
  supportedPairs: [
    'en-tw', 'tw-en',
    'en-ee', 'ee-en', 
    'en-ga', 'ga-en',
    'en-dag', 'dag-en'
  ]
};

export default ghanaianLanguages;
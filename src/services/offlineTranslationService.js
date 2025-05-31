import { ghanaianLanguages, getTranslation } from '../data/ghanaianLanguages';

// Offline translation service with local language data
class OfflineTranslationService {
  constructor() {
    // Common disease detection translations
    this.diseaseTranslations = {
      // Common plant names
      'Maize': {
        tw: 'Aburo',
        ee: 'Bli',
        gaa: 'Blɛ',
        dag: 'Kawunsiri',
        ha: 'Masara'
      },
      'Rice': {
        tw: 'Ɛmo',
        ee: 'Mɔlu',
        gaa: 'Mɔɔ',
        dag: 'Shinkafa',
        ha: 'Shinkafa'
      },
      'Cassava': {
        tw: 'Bankye',
        ee: 'Agbeli',
        gaa: 'Duade',
        dag: 'Chinchaga',
        ha: 'Rogo'
      },
      'Tomato': {
        tw: 'Tomato',
        ee: 'Tomato',
        gaa: 'Tomato',
        dag: 'Kamantua',
        ha: 'Tumatir'
      },
      
      // Common diseases
      'Blight': {
        tw: 'Nhwiren yare',
        ee: 'Aŋgba dɔ',
        gaa: 'Gbeke hewale',
        dag: 'Tihi dɔɣim',
        ha: 'Cututtukan ganye'
      },
      'Leaf spot': {
        tw: 'Nhwiren ho nsensanee',
        ee: 'Aŋgba ƒe akpɔkplɔe',
        gaa: 'Gbeke tsɔ',
        dag: 'Gbanzuŋ dɔɣim',
        ha: 'Tabon ganye'
      },
      'Rust': {
        tw: 'Dadeben yare',
        ee: 'Ga dɔ',
        gaa: 'Nɔni hewale',
        dag: 'Karifi dɔɣim',
        ha: 'Tsatsa'
      },
      'Wilt': {
        tw: 'Nwuw yare',
        ee: 'Ku dɔ',
        gaa: 'Gbɔ hewale',
        dag: 'Ku dɔɣim',
        ha: 'Bushewa'
      },
      'Mosaic virus': {
        tw: 'Nsensanee yare',
        ee: 'Amadede dɔ',
        gaa: 'Fɛɛ hewale',
        dag: 'Banzara dɔɣim',
        ha: 'Cututtukan iri-iri'
      },
      
      // Common treatments
      'Apply fungicide': {
        tw: 'Pete nnwurammoa aduru',
        ee: 'Wɔ atike',
        gaa: 'Tsɔ yitso',
        dag: 'Ti tiim',
        ha: 'Shafa maganin naman kwari'
      },
      'Remove infected leaves': {
        tw: 'Yi nhwiren a yare aka mu no',
        ee: 'Ɖe aŋgba siwo dɔ le la ɖa',
        gaa: 'Kɛ gbeke ni hewale mli',
        dag: 'Ciri gbanzuŋ din dɔɣi',
        ha: 'Cire ganyen da cuta ta kama'
      },
      'Improve drainage': {
        tw: 'Ma nsu nkɔ yiye',
        ee: 'Na tsi nasi nyuie',
        gaa: 'Na nu shi kɛ yɛ',
        dag: 'Mali kom salima zuɣu',
        ha: 'Inganta hanyar ruwa'
      },
      'Use resistant varieties': {
        tw: 'Fa nnɔbae a wontumi nnye yare',
        ee: 'Zã nuku siwo tea ŋu ɖoa dɔ',
        gaa: 'Yɛ nkpakpa ni ahewale ko',
        dag: 'Tuma bindirigu bɛ ka dɔɣi',
        ha: 'Yi amfani da irin shuka masu juriya'
      },
      'Spray pesticide': {
        tw: 'Pete nnwurammoa aduru',
        ee: 'Wu atike',
        gaa: 'Tsɔ tsɛtsɛ yitso',
        dag: 'Ti bibimhi tiim',
        ha: 'Fesa maganin kwari'
      },
      
      // Health status
      'Healthy': {
        tw: 'Apɔmuden',
        ee: 'Lãme nyui',
        gaa: 'Hewalɛ',
        dag: 'Alaafee',
        ha: 'Lafiya'
      },
      'Infected': {
        tw: 'Yare aka no',
        ee: 'Dɔ le eŋu',
        gaa: 'Hewale mli',
        dag: 'Dɔɣim n-daa',
        ha: 'Cuta ta kama'
      },
      'Severe infection': {
        tw: 'Yare no mu yɛ den',
        ee: 'Dɔ la nu sẽ ŋutɔ',
        gaa: 'Hewale la gbɔjɔɔ',
        dag: 'Dɔɣim la pam taɣa',
        ha: 'Cuta ta yi muni'
      }
    };

    // Common agricultural phrases
    this.commonPhrases = {
      'Your crop has been infected with': {
        tw: 'Yare a aka wo afifide no yɛ',
        ee: 'Dɔ si le wò ati ŋu enye',
        gaa: 'Hewale ni kɛ bo gbeke lɛ ji',
        dag: 'Dɔɣim mali n ti bo tihi maa be la',
        ha: 'Cuta ta kama amfanin ku ita'
      },
      'Recommended treatment': {
        tw: 'Ayaresa a yɛkamfo kyerɛ',
        ee: 'Dɔyɔyɔ si wokafu',
        gaa: 'Hewalefamo ni amɛkafuɔ',
        dag: 'Tibu bɛ ti puhim di maa',
        ha: 'Maganin da ake shawarwari'
      },
      'Apply immediately': {
        tw: 'Fa di dwuma ntɛm ara',
        ee: 'Wɔe enumake',
        gaa: 'Yɛ lɛ sɛɛ',
        dag: 'Ti maa yogu yogu',
        ha: 'Yi amfani nan take'
      },
      'Consult agricultural expert': {
        tw: 'Kɔhunu ɔkuadɔ nimdefo',
        ee: 'Bia agbledela nyala',
        gaa: 'Kasa nikaseli tsui yɛ',
        dag: 'Sɔri purigu naaya',
        ha: 'Tuntubi masanin gona'
      }
    };
  }

  // Translate text offline using local dictionary
  translateOffline(text, sourceLang, targetLang) {
    if (sourceLang === targetLang) return text;
    
    // Try exact match first
    if (this.diseaseTranslations[text] && this.diseaseTranslations[text][targetLang]) {
      return this.diseaseTranslations[text][targetLang];
    }
    
    // Try phrase match
    for (const [phrase, translations] of Object.entries(this.commonPhrases)) {
      if (text.includes(phrase) && translations[targetLang]) {
        return text.replace(phrase, translations[targetLang]);
      }
    }
    
    // Try word-by-word translation
    const words = text.split(' ');
    const translatedWords = words.map(word => {
      // Check agricultural terms
      const agTerms = ghanaianLanguages.agriculturalTerms;
      if (agTerms[sourceLang] && agTerms[targetLang]) {
        // Find the key for this word in source language
        for (const [key, value] of Object.entries(agTerms[sourceLang])) {
          if (value.toLowerCase() === word.toLowerCase()) {
            return agTerms[targetLang][key] || word;
          }
        }
      }
      
      // Check disease translations
      if (this.diseaseTranslations[word] && this.diseaseTranslations[word][targetLang]) {
        return this.diseaseTranslations[word][targetLang];
      }
      
      return word;
    });
    
    return translatedWords.join(' ');
  }

  // Get confidence score for offline translation
  getTranslationConfidence(text, targetLang) {
    let matchedWords = 0;
    let totalWords = text.split(' ').length;
    
    const words = text.split(' ');
    words.forEach(word => {
      if (this.diseaseTranslations[word] && this.diseaseTranslations[word][targetLang]) {
        matchedWords++;
      }
    });
    
    return matchedWords / totalWords;
  }

  // Translate disease results offline
  translateDiseaseResultsOffline(results, targetLang) {
    return {
      plant: this.translateOffline(results.plant, 'en', targetLang),
      disease: this.translateOffline(results.disease, 'en', targetLang),
      remedy: this.translateOffline(results.remedy, 'en', targetLang),
      confidence: results.confidence,
      translationType: 'offline',
      translationConfidence: this.getTranslationConfidence(
        `${results.plant} ${results.disease} ${results.remedy}`,
        targetLang
      )
    };
  }

  // Generate audio-friendly text for TTS
  generateAudioText(results, language) {
    const templates = {
      en: `Your ${results.plant} has been diagnosed. ${results.disease} was detected. Recommended treatment: ${results.remedy}`,
      tw: `Wo ${results.plant} no, yɛahu sɛ ${results.disease} aka no. Ayaresa a yɛkamfo kyerɛ ne: ${results.remedy}`,
      ee: `Wò ${results.plant} la, míekpɔ be ${results.disease} le eŋu. Dɔyɔyɔ si míekafu enye: ${results.remedy}`,
      gaa: `Bo ${results.plant} lɛ, amɛhu ni ${results.disease} kɛ lɛ. Hewalefamo ni amɛkafuɔ ji: ${results.remedy}`,
      dag: `A ${results.plant} maa, ti nyaŋ ka ${results.disease} n-daa maa. Tibu bɛ ti puhim di maa: ${results.remedy}`,
      ha: `${results.plant} naku, mun gano ${results.disease} ya kama shi. Maganin da ake shawarwari shi ne: ${results.remedy}`
    };
    
    return templates[language] || templates.en;
  }

  // Get language-specific agricultural tips
  getAgriculturalTips(language) {
    const tips = {
      en: [
        'Always inspect your crops regularly for early disease detection',
        'Maintain proper spacing between plants for good air circulation',
        'Use certified seeds and disease-resistant varieties',
        'Practice crop rotation to prevent disease buildup',
        'Remove and destroy infected plant parts immediately'
      ],
      tw: [
        'Hwɛ wo nnɔbae daa na ama woahu yare ntɛm',
        'Ma kwan nna afifide ntam na ama mframa akɔ mu yiye',
        'Fa aba a wɔapene so ne nnɔbae a wontumi nnye yare',
        'Sesa nnɔbae a wudua wɔ asase no so daa',
        'Yi afifide fa a yare aka mu no ntɛm na sɛe no'
      ],
      ee: [
        'Kpɔ wò agblemenukuwo ɣesiaɣi be nàkpɔ dɔléle kaba',
        'Na dometsotso nyui nanɔ atikuwo dome be yame nagbɔ eme nyuie',
        'Zã nuku siwo ŋu wokpɔ kple esiwo tea ŋu ɖoa dɔ',
        'Trɔ nuku siwo nèƒãna le anyigba dzi enuenu',
        'Ɖe atiku ƒe akpa siwo dzi dɔ le la ɖa enumake eye nàtsrɔ̃ wo'
      ]
    };
    
    return tips[language] || tips.en;
  }
}

export default new OfflineTranslationService();
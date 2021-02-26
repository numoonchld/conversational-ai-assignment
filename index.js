
// node modules
const fetch = require('node-fetch');
const natural = require('natural');
const stopword = require('remove-stopwords')
const Counter = require('pycollections').Counter;

// initialize tokenizer
const tokenizer = new natural.WordTokenizer();

// API KEY for SYN and POS extractor API
const API_KEY = 'dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9'

// Log to Console:
console.log('---------------------------------------------------------------\n Conversational AI Exercise Solution by Raghavendra N. Saralaya\n---------------------------------------------------------------')

// fetch and process
fetch('http://norvig.com/big.txt')
    .then(res => res.text())
    .then(body => {

        // tokenize 
        const tokenizedArray = tokenizer.tokenize(body)

        // log to console total number of words in document
        console.log('Total words in document:',tokenizedArray.length)

        // remove stop words 
        const filteredArray = stopword.removeStopwords(tokenizedArray)

        // counter 
        const countOfFilteredArray = new Counter(filteredArray)

        // extract 10 most common
        const tenMostCommon = countOfFilteredArray.mostCommon(10)

        // log top 10 to console 
        console.log('Top 10 words and the number of their occurrences: --------------------\n',tenMostCommon)

        // process 10 most common words
        tenMostCommon.map(async wordInfo => {

            // extract word
            const word = wordInfo[0]

            // extract number of occurrences
            const wordCount = wordInfo[1]

            // make API call to get word info
            const response = await fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-en&text=${word}`)
            const yandexPayload = await response.json()

            // extract word synonyms 
            const wordSynonyms = yandexPayload.def[0] ? yandexPayload.def[0].tr : 'Not found in DB!'

            // extract word pos
            if (!yandexPayload.def[0] && word[0] === word[0].toUpperCase()) {
                var wordPOS = 'noun'
            } else if (yandexPayload.def[0]) {
                var wordPOS = yandexPayload.def[0].pos
            } else {
                var wordPOS = null
            }

            // log to console word details
            console.log('--------------------------------------------------\n',{ word, wordCount, wordPOS, wordSynonyms })

        })

    });



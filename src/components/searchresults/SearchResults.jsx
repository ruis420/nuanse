import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/languagecontext/LanguageContext';
import './searchresults.css'; 

const SearchResults = ({ results, setSelectedSong, setLoading, loading }) => {
  const { selectedLanguage } = useContext(LanguageContext);

  const handleClick = async (result) => {
    setLoading(true);
    setSelectedSong(result);

    try {
      const lyricsResponse = await fetch(`https://europe-west2-nuans-382922.cloudfunctions.net/get_lyrics?artist=${encodeURIComponent(result.artist.name)}&title=${encodeURIComponent(result.title)}`);
      const lyricsData = await lyricsResponse.json();
      console.log('Lyrics Request:', lyricsResponse);
      console.log('Lyrics Response:', lyricsData);
      const translatedLyrics = await translateLyrics(lyricsData.lyrics, selectedLanguage);
      console.log('Translated Lyrics:', translatedLyrics);
      result.translatedLyrics = translatedLyrics;
      setSelectedSong({ ...result, translatedLyrics });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const translateLyrics = async (lyrics, language) => {
    const formattedLyrics = lyrics.split('\n').join(' | ');
    
    const prompt = {
      "model": "gpt-3.5-turbo-0301",
      "messages": [
        {
          "role": "system",
          "content": `Please translate the following song lyrics to ${language} line for line. Please try to retain the nuances of the lyrics, including slang, culturally specific idioms/sayings, and cultural context. Each line is separated by the symbol '|':`
        },
        {
          "role": "user",
          "content": formattedLyrics
        }
      ],
      "max_tokens": 500, 
      "temperature": 0.8 
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer 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' },
      body: JSON.stringify(prompt)
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
    const data = await response.json();
    const translatedLyrics = data.choices[0].message.content.split(' | ');
    const originalLyrics = lyrics.split('\n');
    
    return originalLyrics.map((originalLine, index) => ({
      original: originalLine,
      translated: translatedLyrics[index] || '',
  }));

  };

  return (
    <div className="search-results">
      {results.map((result, index) => (
        <div
          key={index}
          className="result"
          onClick={() => handleClick(result)}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <img src={result.album.cover_xl} alt={result.title} />
              <p>{result.title} by {result.artist.name}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;

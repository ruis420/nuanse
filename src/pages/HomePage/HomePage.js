import React, { useState, useEffect } from 'react';
import { Searchbar, LanguageSelector, SearchResults } from '../../components';
import { LanguageContext } from '../../contexts/languagecontext/LanguageContext' 
import nuanselogo from '../../assets/nuanselogo.jpeg';
import expandicon from '../../assets/expandicon.png'
import './HomePage.css';

const defaultColors = ['#570D4B', '#0093E5', '#1300EE', '#00FF0A', '#B86E00', '#E200B1', '#F3BE00'];

const HomePage = () => {
  const [results, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [circleColors, setCircleColors] = useState(defaultColors);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleExpand = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  useEffect(() => {
    console.log(selectedSong);
    if (selectedSong && selectedSong.album) {
      fetch(`https://europe-west2-nuans-382922.cloudfunctions.net/color_palette`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: selectedSong.album.cover_xl }),
      })
      .then(response => response.json())
      .then(data => {
        const newColors = data.palette.map(colorArray => 
          `#${colorArray.map(c => c.toString(16).padStart(2, '0')).join('')}`
        );
        setCircleColors(newColors);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      setCircleColors(defaultColors); 
    }
  }, [selectedSong]);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {!isFullScreen ? (
        <>
          <div className="background">
            {circleColors.map((color, i) => (
              <div 
                key={i} 
                className={`circle circle-${i + 1}`}
                style={{ backgroundColor: color }} 
              />
            ))}
          </div>
          <div className="HomePage">
            {selectedSong == null ? (
              <>
                <br></br>
                <img src={nuanselogo} className="App-logo" alt="nuanselogo" />
                <br></br>
                <div className="language-search-container">
                  <br></br>
                  <p>Nuanse Translates and Analyzes your Favorite Songs</p>
                  <h1>Select your Language</h1>
                  <LanguageSelector />
                  <h1>Search a Song</h1>
                  <Searchbar onSearch={setSearchResults} /> 
                  <SearchResults results={results} setSelectedSong={setSelectedSong} setLoading={setLoading} loading={loading}/>
                </div>
              </> 
            ) : (
              <>
                <img src={selectedSong.album.cover_xl} className="song-cover" alt={selectedSong.title} />
                <div className="song-info">
                  <h2>{selectedSong.title}</h2>
                  <h3>{selectedSong.artist.name}</h3>
                </div>
                {loading ? <p>Loading translated lyrics...</p> : null}
                {selectedSong.translatedLyrics ? (
                  <div className="lyrics-container">
                    <div className="header-container">
                      <h2>Lyrics</h2>
                      <button className="expand-button" onClick={handleExpand}>
                        <img src={expandicon} alt="Expand" />
                      </button>
                    </div>
                    <div className="lyrics-content">
                      {selectedSong.translatedLyrics && Array.isArray(selectedSong.translatedLyrics) && selectedSong.translatedLyrics.length ? (
                        selectedSong.translatedLyrics.map((line, index) => (
                          <div className="lyrics" key={index}>
                            <p>{line.original}</p>
                            <p>{line.translated || 'Translation not available for this line.'}</p>
                          </div>
                        ))
                      ) : (
                        <p>No lyrics found.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="lyrics-container-full">
          <div className="header-container">
            <div className="title-container">
              <h2>{selectedSong.title}</h2>
              <h3>{selectedSong.artist.name}</h3>
            </div>
            <button className="expand-button" onClick={handleExpand}>
              <img src={expandicon} alt="Collapse" />
            </button>
          </div>
          <div className="white-bar"></div>
          <div className="lyrics-content">
            {selectedSong.translatedLyrics && Array.isArray(selectedSong.translatedLyrics) && selectedSong.translatedLyrics.length ? (
              selectedSong.translatedLyrics.map((line, index) => (
                <div className="lyrics" key={index}>
                  <p>{line.original}</p>
                  <p>{line.translated || 'Translation not available for this line.'}</p>
                </div>
              ))
            ) : (
              <p>No lyrics found.</p>
            )}
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export default HomePage;
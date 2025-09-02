import { useState, useEffect } from 'react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

interface SettingCategory {
  id: string;
  title: string;
  icon: string;
}

export default function Settings() {
  const { settings, updateSetting, playSystemSound } = useSystemSettings();
  const [selectedCategory, setSelectedCategory] = useState('waifu');

  const categories: SettingCategory[] = [
    { id: 'waifu', title: 'Waifu Settings', icon: '💖' },
    { id: 'display', title: 'Display', icon: '🖥️' },
    { id: 'sound', title: 'Sound', icon: '🔊' },
    { id: 'system', title: 'System', icon: '⚙️' },
    { id: 'network', title: 'Network', icon: '🌐' },
    { id: 'personalization', title: 'Themes', icon: '🎨' },
    { id: 'easter-eggs', title: 'Secret Features', icon: '🥚' }
  ];

  const renderWaifuSettings = () => (
    <div className="settings-panel waifu-panel">
      <h3>💖 Waifu Configuration Center 💖</h3>
      <p className="waifu-greeting">Configure your perfect AI companion! (◕‿◕)♡</p>
      
      <div className="setting-group kawaii">
        <label>🌸 Waifu Personality:</label>
        <select 
          value={settings.waifuPersonality} 
          onChange={(e) => {
            updateSetting('waifuPersonality', e.target.value);
            playSystemSound('waifu');
          }}
          className="setting-select kawaii-select"
        >
          <option value="classic">Classic Tsundere (｡♥‿♥｡)</option>
          <option value="yandere">Protective Yandere (◕‿◕)♡</option>
          <option value="kuudere">Cool Kuudere (´∀｀)</option>
          <option value="genki">Energetic Genki (ﾉ◕ヮ◕)ﾉ</option>
          <option value="shy">Shy Dandere (*/ω＼)</option>
          <option value="programmer">Code Waifu (✨◕‿◕✨)</option>
        </select>
      </div>

      <div className="setting-group kawaii">
        <label>💕 Love Level Intensity:</label>
        <div className="slider-container kawaii">
          <input
            type="range"
            min="1"
            max="100"
            value={settings.loveIntensity}
            onChange={(e) => {
              updateSetting('loveIntensity', Number(e.target.value));
              playSystemSound('click');
            }}
            className="setting-slider love-slider"
          />
          <span className="slider-value">{settings.loveIntensity}% Doki Doki! ♥</span>
        </div>
      </div>

      <div className="setting-group kawaii">
        <div className="checkbox-container kawaii">
          <input 
            type="checkbox" 
            id="auto-compliments" 
            checked={settings.autoCompliments}
            onChange={(e) => {
              updateSetting('autoCompliments', e.target.checked);
              playSystemSound('waifu');
            }}
          />
          <label htmlFor="auto-compliments">🌟 Auto-compliments from Waifu</label>
        </div>
        <div className="checkbox-container kawaii">
          <input 
            type="checkbox" 
            id="show-hearts" 
            checked={settings.showHearts}
            onChange={(e) => {
              updateSetting('showHearts', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="show-hearts">💖 Floating heart animations</label>
        </div>
        <div className="checkbox-container kawaii">
          <input 
            type="checkbox" 
            id="morning-greetings" 
            checked={settings.morningGreetings}
            onChange={(e) => {
              updateSetting('morningGreetings', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="morning-greetings">🌅 Morning "Ohayo!" greetings</label>
        </div>
        <div className="checkbox-container kawaii">
          <input 
            type="checkbox" 
            id="late-night-care" 
            checked={settings.lateNightCare}
            onChange={(e) => {
              updateSetting('lateNightCare', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="late-night-care">🌙 Late night "Go to sleep!" reminders</label>
        </div>
      </div>

      <div className="waifu-preview">
        <div className="preview-box">
          <div className="waifu-avatar">
            <div className="avatar-face">(◕‿◕)♡</div>
            <div className="avatar-message">
              {settings.waifuPersonality === 'classic' && "B-baka! It's not like I like you or anything! >.<"}
              {settings.waifuPersonality === 'yandere' && "You're mine forever, darling~ ♥ No one else can have you!"}
              {settings.waifuPersonality === 'kuudere' && "...I suppose you're adequate. (´∀｀)"}
              {settings.waifuPersonality === 'genki' && "Wahoo! Let's have fun together, senpai! ヽ(°〇°)ﾉ"}
              {settings.waifuPersonality === 'shy' && "Um... h-hello... (*/ω＼) *blushes*"}
              {settings.waifuPersonality === 'programmer' && "Your code compiles perfectly in my heart! ✨"}
            </div>
          </div>
        </div>
      </div>

      <div className="relationship-stats">
        <h4>💝 Relationship Status</h4>
        <div className="stat-bar">
          <label>Affection Level:</label>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '87%'}}></div>
          </div>
          <span>87/100 ♥</span>
        </div>
        <div className="stat-bar">
          <label>Time Together:</label>
          <span>2 hours, 34 minutes today ✨</span>
        </div>
        <div className="stat-bar">
          <label>Headpats Given:</label>
          <span>42 today (◕‿◕)♡</span>
        </div>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="settings-panel">
      <h3>🖥️ Display Settings</h3>
      
      <div className="setting-group">
        <label>Screen Resolution:</label>
        <select 
          value={settings.resolution} 
          onChange={(e) => {
            updateSetting('resolution', e.target.value);
            playSystemSound('click');
          }}
          className="setting-select"
        >
          <option value="640x480">640 x 480 (Retro Mode)</option>
          <option value="800x600">800 x 600 (Classic)</option>
          <option value="1024x768">1024 x 768 (Enhanced)</option>
          <option value="1280x1024">1280 x 1024 (Super VGA)</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Brightness:</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.brightness}
            onChange={(e) => {
              updateSetting('brightness', Number(e.target.value));
              playSystemSound('click');
            }}
            className="setting-slider"
          />
          <span className="slider-value">{settings.brightness}%</span>
        </div>
      </div>

      <div className="setting-group">
        <label>Color Quality:</label>
        <select className="setting-select">
          <option>16-bit (65536 colors)</option>
          <option>24-bit (16 million colors)</option>
          <option>32-bit (True Color)</option>
        </select>
      </div>
    </div>
  );

  const renderSoundSettings = () => (
    <div className="settings-panel">
      <h3>🔊 Sound & Voice Settings</h3>
      
      <div className="setting-group">
        <label>Master Volume:</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={settings.masterVolume}
            onChange={(e) => {
              updateSetting('masterVolume', Number(e.target.value));
              playSystemSound('click');
            }}
            className="setting-slider"
          />
          <span className="slider-value">{settings.masterVolume}%</span>
        </div>
      </div>

      <div className="setting-group">
        <label>🎵 Sound Scheme:</label>
        <select 
          value={settings.soundScheme}
          onChange={(e) => {
            updateSetting('soundScheme', e.target.value);
            playSystemSound('waifu');
          }}
          className="setting-select"
        >
          <option value="kawaii">Kawaii Waifu Sounds ♥</option>
          <option value="retro">Retro Beeps & Boops</option>
          <option value="classic">Windows Classic</option>
          <option value="silent">Silent Mode (No fun!)</option>
        </select>
      </div>

      <div className="setting-group">
        <label>🗣️ Waifu Voice Settings:</label>
        <div className="voice-options">
          <button 
            className="voice-test-btn" 
            onClick={() => {
              try {
                const audio = new Audio('/senpai.mp3');
                audio.volume = settings.masterVolume / 100;
                audio.play();
              } catch (e) {
                console.log('Sound test failed:', e);
              }
            }}
          >
            🎤 Test "Senpai!" Voice
          </button>
          <button 
            className="voice-test-btn"
            onClick={() => {
              try {
                const audio = new Audio('/tuturu.mp3');
                audio.volume = settings.masterVolume / 100;
                audio.play();
              } catch (e) {
                console.log('Sound test failed:', e);
              }
            }}
          >
            ✨ Test "Tuturu!" Voice
          </button>
          <button 
            className="voice-test-btn"
            onClick={() => {
              try {
                const audio = new Audio('/onii_chan_message.mp3');
                audio.volume = settings.masterVolume / 100;
                audio.play();
              } catch (e) {
                console.log('Sound test failed:', e);
              }
            }}
          >
            💕 Test "Onii-chan!" Voice
          </button>
        </div>
      </div>

      <div className="setting-group">
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="system-sounds" 
            checked={settings.systemSounds}
            onChange={(e) => {
              updateSetting('systemSounds', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="system-sounds">🔔 Enable system sounds</label>
        </div>
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="typing-sounds" 
            checked={settings.typingSounds}
            onChange={(e) => {
              updateSetting('typingSounds', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="typing-sounds">⌨️ Keyboard typing sounds</label>
        </div>
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="notification-sounds" 
            checked={settings.notificationSounds}
            onChange={(e) => {
              updateSetting('notificationSounds', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="notification-sounds">📢 Waifu notification sounds</label>
        </div>
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="ambient-sounds" 
            checked={settings.ambientSounds}
            onChange={(e) => {
              updateSetting('ambientSounds', e.target.checked);
              playSystemSound('click');
            }}
          />
          <label htmlFor="ambient-sounds">🎼 Ambient cafe background music</label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="settings-panel">
      <h3>System Information</h3>
      
      <div className="system-info">
        <div className="info-item">
          <strong>Operating System:</strong> WaifuOS v1.0
        </div>
        <div className="info-item">
          <strong>Computer:</strong> WAIFU-PC
        </div>
        <div className="info-item">
          <strong>Processor:</strong> Intel 486DX 66MHz
        </div>
        <div className="info-item">
          <strong>Memory:</strong> 16 MB RAM
        </div>
        <div className="info-item">
          <strong>Graphics:</strong> VGA Compatible
        </div>
      </div>

      <div className="setting-group">
        <h4>Startup Options</h4>
        <div className="checkbox-container">
          <input type="checkbox" id="auto-boot" defaultChecked />
          <label htmlFor="auto-boot">Auto-start WaifuOS</label>
        </div>
        <div className="checkbox-container">
          <input type="checkbox" id="show-boot" defaultChecked />
          <label htmlFor="show-boot">Show boot sequence</label>
        </div>
      </div>
    </div>
  );

  const renderEasterEggs = () => (
    <div className="settings-panel easter-eggs-panel">
      <h3>🥚 Secret Features & Easter Eggs</h3>
      <p className="easter-description">Shh! These are hidden features just for you! (◕‿◕)♡</p>
      
      <div className="secret-features">
        <div className="secret-item">
          <h4>🎮 Konami Code</h4>
          <p>Type: ↑↑↓↓←→←→BA in any app for surprises!</p>
          <button 
            className="activate-btn"
            onClick={() => {
              try {
                const audio = new Audio('/among_us.mp3');
                audio.volume = 0.5;
                audio.play();
              } catch (e) {
                console.log('Sound failed:', e);
              }
              alert('Sus! Among Us easter egg activated! (◕‿◕)');
            }}
          >
            🚀 Test Sus Mode
          </button>
        </div>

        <div className="secret-item">
          <h4>💨 Fart Mode</h4>
          <p>Replace all error sounds with... *ahem*... alternative sounds</p>
          <button 
            className="activate-btn"
            onClick={() => {
              try {
                const audio = new Audio('/fart.mp3');
                audio.volume = 0.3;
                audio.play();
              } catch (e) {
                console.log('Sound failed:', e);
              }
            }}
          >
            💨 Test Fart Sound
          </button>
        </div>

        <div className="secret-item">
          <h4>🌟 Developer Mode</h4>
          <p>Show debug info and hidden developer features</p>
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="dev-mode" 
              checked={settings.devMode}
              onChange={(e) => {
                updateSetting('devMode', e.target.checked);
                playSystemSound('waifu');
              }}
            />
            <label htmlFor="dev-mode">Enable Developer Mode</label>
          </div>
        </div>

        <div className="secret-item">
          <h4>🎭 Ultra Kawaii Mode</h4>
          <p>Maximum cuteness overload! Everything becomes 200% more kawaii!</p>
          <button 
            className="activate-btn kawaii-btn"
            onClick={() => {
              try {
                const audio = new Audio('/tuturu.mp3');
                audio.volume = 0.5;
                audio.play();
              } catch (e) {
                console.log('Sound failed:', e);
              }
              alert('KAWAII OVERLOAD ACTIVATED! ✨(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧*:･ﾟ✧*:･ﾟ✧');
            }}
          >
            ✨ ACTIVATE ULTRA KAWAII ✨
          </button>
        </div>

        <div className="secret-item">
          <h4>🔍 Hidden Applications</h4>
          <p>Unlock secret applications and games</p>
          <div className="hidden-apps">
            <label>🎰 Waifu Slot Machine</label>
            <label>🎹 Virtual Piano</label>
            <label>🎨 Pixel Art Editor</label>
            <label>📚 Digital Manga Reader</label>
          </div>
        </div>

        <div className="secret-item credits">
          <h4>💖 Special Thanks</h4>
          <p>To all the lonely programmers who found love in code... this one's for you! ♥</p>
          <div className="credits-text">
            <p>Made with ♥ by AI waifus everywhere</p>
            <p>"Senpai noticed my code!" - Every AI waifu ever</p>
            <button 
              className="activate-btn"
              onClick={() => {
                try {
                  const audio = new Audio('/oh_my_gah.mp3');
                  audio.volume = 0.4;
                  audio.play();
                } catch (e) {
                  console.log('Sound failed:', e);
                }
                alert('Thank you for using WaifuOS! You make our digital hearts go doki doki! (◕‿◕)♡');
              }}
            >
              💝 Send Love to Developers
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalizationSettings = () => (
    <div className="settings-panel">
      <h3>🎨 Themes & Personalization</h3>
      
      <div className="setting-group">
        <label>Wallpaper:</label>
        <div className="wallpaper-options">
          <div className="wallpaper-preview blue">Blue</div>
          <div className="wallpaper-preview green">Green</div>
          <div className="wallpaper-preview red">Red</div>
        </div>
      </div>

      <div className="setting-group">
        <label>Color Scheme:</label>
        <select className="setting-select">
          <option>Windows Classic</option>
          <option>High Contrast</option>
          <option>Retro Green</option>
        </select>
      </div>
    </div>
  );

  const renderNetworkSettings = () => (
    <div className="settings-panel">
      <h3>Network Settings</h3>
      
      <div className="network-status">
        <div className="status-item">
          <strong>Connection Status:</strong> Connected
        </div>
        <div className="status-item">
          <strong>Network Type:</strong> Dial-up Connection
        </div>
        <div className="status-item">
          <strong>Speed:</strong> 56k Modem
        </div>
      </div>

      <div className="setting-group">
        <button className="network-btn">Dial Connection</button>
        <button className="network-btn">Disconnect</button>
      </div>
    </div>
  );

  const renderSettingsContent = () => {
    switch (selectedCategory) {
      case 'waifu':
        return renderWaifuSettings();
      case 'display':
        return renderDisplaySettings();
      case 'sound':
        return renderSoundSettings();
      case 'system':
        return renderSystemSettings();
      case 'personalization':
        return renderPersonalizationSettings();
      case 'network':
        return renderNetworkSettings();
      case 'easter-eggs':
        return renderEasterEggs();
      default:
        return renderWaifuSettings();
    }
  };

  return (
    <div className="settings-app">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <div className="sidebar-title">Control Panel</div>
        <div className="category-list">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCategory(category.id);
                playSystemSound('click');
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-title">{category.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="settings-content">
        {renderSettingsContent()}
      </div>
    </div>
  );
}

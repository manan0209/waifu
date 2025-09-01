import { useState } from 'react';

interface SettingCategory {
  id: string;
  title: string;
  icon: string;
}

export default function Settings() {
  const [selectedCategory, setSelectedCategory] = useState('display');
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(80);
  const [resolution, setResolution] = useState('800x600');

  const categories: SettingCategory[] = [
    { id: 'display', title: 'Display', icon: '🖥️' },
    { id: 'sound', title: 'Sound', icon: '🔊' },
    { id: 'system', title: 'System', icon: '⚙️' },
    { id: 'network', title: 'Network', icon: '🌐' },
    { id: 'personalization', title: 'Personalization', icon: '🎨' }
  ];

  const renderDisplaySettings = () => (
    <div className="settings-panel">
      <h3>Display Settings</h3>
      
      <div className="setting-group">
        <label>Screen Resolution:</label>
        <select 
          value={resolution} 
          onChange={(e) => setResolution(e.target.value)}
          className="setting-select"
        >
          <option value="640x480">640 x 480</option>
          <option value="800x600">800 x 600</option>
          <option value="1024x768">1024 x 768</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Brightness:</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="setting-slider"
          />
          <span className="slider-value">{brightness}%</span>
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
      <h3>Sound Settings</h3>
      
      <div className="setting-group">
        <label>Master Volume:</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="setting-slider"
          />
          <span className="slider-value">{volume}%</span>
        </div>
      </div>

      <div className="setting-group">
        <label>Sound Scheme:</label>
        <select className="setting-select">
          <option>Windows Default</option>
          <option>No Sounds</option>
          <option>Retro Beeps</option>
        </select>
      </div>

      <div className="setting-group">
        <div className="checkbox-container">
          <input type="checkbox" id="system-sounds" defaultChecked />
          <label htmlFor="system-sounds">Enable system sounds</label>
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

  const renderPersonalizationSettings = () => (
    <div className="settings-panel">
      <h3>Personalization</h3>
      
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
      default:
        return renderDisplaySettings();
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
              onClick={() => setSelectedCategory(category.id)}
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

import React, { useRef } from 'react';

export type BackgroundPresetType = 'transparent' | 'white' | 'black' | 'gradient' | 'custom';

interface BackgroundPresetsProps {
  selectedType: BackgroundPresetType;
  customColor: string;
  onPresetChange: (type: BackgroundPresetType) => void;
  onCustomColorChange: (color: string) => void;
}

export const BackgroundPresets: React.FC<BackgroundPresetsProps> = ({
  selectedType,
  customColor,
  onPresetChange,
  onCustomColorChange,
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleCustomClick = () => {
    onPresetChange('custom');
    colorInputRef.current?.click();
  };

  const presets = [
    {
      id: 'transparent' as BackgroundPresetType,
      label: 'Transparent',
      previewClass: 'transparency-grid',
    },
    {
      id: 'white' as BackgroundPresetType,
      label: 'White',
      previewClass: 'bg-white',
    },
    {
      id: 'black' as BackgroundPresetType,
      label: 'Black',
      previewClass: 'bg-[#1b1c1a]',
    },
    {
      id: 'gradient' as BackgroundPresetType,
      label: 'Blue-Cream',
      previewClass: 'blue-cream-gradient',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-title-md text-title-md text-on-surface px-1">
        Background Presets
      </h3>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2 -mx-2 px-2">
        {presets.map((preset) => {
          const isActive = selectedType === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2 focus:outline-none"
            >
              <div
                className={`w-16 h-16 rounded-2xl transition-all ${
                  preset.previewClass
                } ${
                  isActive
                    ? 'border-2 border-primary shadow-md ring-2 ring-primary/20'
                    : 'border border-outline-variant/30 hover:scale-105'
                }`}
              />
              <span
                className={`font-label-md text-label-md ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {preset.label}
              </span>
            </button>
          );
        })}

        {/* Custom Preset Selector */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <button
            onClick={handleCustomClick}
            className={`w-16 h-16 rounded-2xl relative flex items-center justify-center transition-all overflow-hidden ${
              selectedType === 'custom'
                ? 'border-2 border-primary shadow-md ring-2 ring-primary/20'
                : 'bg-surface-container-low border border-dashed border-outline hover:scale-105'
            }`}
            style={selectedType === 'custom' ? { backgroundColor: customColor } : {}}
          >
            {selectedType === 'custom' ? (
              // When custom color is selected, fill background with it
              <span
                className="material-symbols-outlined"
                style={{
                  color: parseInt(customColor.replace('#', ''), 16) > 0xffffff / 2 ? '#001736' : '#ffffff',
                }}
              >
                palette
              </span>
            ) : (
              <span className="material-symbols-outlined text-outline">palette</span>
            )}
            
            <input
              ref={colorInputRef}
              type="color"
              value={customColor}
              onChange={(e) => {
                onCustomColorChange(e.target.value);
                onPresetChange('custom');
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </button>
          
          <span
            className={`font-label-md text-label-md ${
              selectedType === 'custom' ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            Custom
          </span>
        </div>
      </div>
    </div>
  );
};

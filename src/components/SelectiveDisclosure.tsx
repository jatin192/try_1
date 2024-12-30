import { useState } from 'react';

interface SelectiveDisclosureProps {
  proof: any;
  onUpdate: (selectedFields: string[]) => void;
}

export function SelectiveDisclosure({ proof, onUpdate }: SelectiveDisclosureProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  
  const availableFields = [
    { id: 'age', label: 'Age Verification' },
    { id: 'state', label: 'State/Region' },
    { id: 'gender', label: 'Gender' },
  ];

  const handleToggle = (fieldId: string) => {
    setSelectedFields(prev => {
      const newSelection = prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId];
      
      onUpdate(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="w-full p-6 bg-[#0a1929] rounded-lg border border-blue-500/10">
      <h3 className="font-semibold mb-6 text-gray-200">Choose Information to Share</h3>
      <div className="space-y-3">
        {availableFields.map(field => (
          <label
            key={field.id}
            className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-[#0c1f35] rounded-lg transition-colors duration-200 group border border-transparent hover:border-blue-500/20"
          >
            <input
              type="checkbox"
              checked={selectedFields.includes(field.id)}
              onChange={() => handleToggle(field.id)}
              className="form-checkbox h-5 w-5 text-cyan-500 border-blue-500/30 rounded bg-[#0c1f35] focus:ring-cyan-500 focus:ring-offset-[#0a1929]"
            />
            <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-200">{field.label}</span>
          </label>
        ))}
      </div>
      
      {selectedFields.length > 0 && (
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-sm text-cyan-400">
            Selected fields: {selectedFields.map(f => 
              availableFields.find(af => af.id === f)?.label
            ).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}

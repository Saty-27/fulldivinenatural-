interface TimeSlot {
  id: string;
  label: string;
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSelectSlot: (slotId: string) => void;
  testId?: string;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelectSlot, testId }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3" data-testid={testId}>
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => slot.available && onSelectSlot(slot.id)}
          disabled={!slot.available}
          data-testid={`time-slot-${slot.id}`}
          className={`
            p-3 rounded-lg border-2 transition-all text-left
            ${selectedSlot === slot.id
              ? 'border-forest bg-forest/10'
              : slot.available
              ? 'border-sage/20 hover:border-sage bg-cream'
              : 'border-sage/10 bg-gray-50 opacity-50 cursor-not-allowed'
            }
          `}
        >
          <div className="font-semibold text-forest text-sm">{slot.label}</div>
          <div className="text-xs text-sage">{slot.time}</div>
          {!slot.available && (
            <div className="text-xs text-red-500 mt-1">Not available</div>
          )}
        </button>
      ))}
    </div>
  );
}

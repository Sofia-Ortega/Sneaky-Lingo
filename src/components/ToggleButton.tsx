export default function ToggleButton() {
  return (
    <div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-sky-300 transition"></div>
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition"></div>
      </label>
    </div>
  );
}

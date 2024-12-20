// Macro nutrient display card component
function MacroCard({ title, value, unit }) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl">
        <h3 className="text-sm text-emerald-600 dark:text-emerald-400">{title}</h3>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {value}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
            {unit}
          </span>
        </div>
      </div>
    );
  }

  export default MacroCard;
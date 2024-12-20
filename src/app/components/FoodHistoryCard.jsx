import Image from "next/image";
import MacroCard from "./macrocard";

function FoodHistoryCard({ food, onToggleEaten }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48">
          <Image
            src={food.imageUrl}
            alt={food.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {food.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(food.date)}
              </p>
            </div>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={food.eaten}
                onChange={() => onToggleEaten(food.id)}
                className="form-checkbox h-5 w-5 text-emerald-600 rounded border-gray-300 
                          focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Eaten</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            <MacroCard title="Calories" value={food.calories} unit="kcal" />
            <MacroCard title="Protein" value={food.protein} unit="g" />
            <MacroCard title="Carbs" value={food.carbs} unit="g" />
            <MacroCard title="Fat" value={food.fat} unit="g" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodHistoryCard; 
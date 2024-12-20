'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { analyzeImage } from "./aiModel/aiService";
import MacroCard from './components/macrocard';
import Notification from './components/notification';
import FoodHistoryCard from './components/FoodHistoryCard';

import { FloatingNav } from './components/ui/floating-navbar';

const navItems = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Profile",
    link: "/profile",
  },
  {
    name: "Settings",
    link: "/settings",
  },
];

export default function Home() {
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [foodHistory, setFoodHistory] = useState([]);
  const [userStats, setUserStats] = useState({
    height: 175, // cm
    weight: 70, // kg
    diet: 'Balanced',
    bmi: 22.9,
    goals: {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 55
    }
  });

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasCamera(true);
      setCameraStream(stream);
      const videoElement = document.getElementById('camera-feed');
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setNotification({
        type: 'error',
        message: 'Please allow camera access to use this feature'
      });
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleImageAnalysis = async (imageData) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(imageData);
      setNutritionData(result);
      
      setFoodHistory(prev => [{
        id: Date.now(),
        imageUrl: imageData,
        name: result.name || 'Unknown Food',
        date: new Date(),
        eaten: false,
        ...result
      }, ...prev]);

      const resultsSection = document.querySelector('[data-results-section]');
      if (resultsSection) {
        resultsSection.classList.remove('hidden');
      }
      setNotification({
        type: 'success',
        message: 'Image analysis completed successfully!'
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setNotification({
        type: 'error',
        message: 'Error analyzing image. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
      setPreviewImage(null);
    }
  };

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target.result;
        setPreviewImage(base64Image);
        await handleImageAnalysis(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleEaten = (foodId) => {
    setFoodHistory(prevHistory =>
      prevHistory.map(food =>
        food.id === foodId ? { ...food, eaten: !food.eaten } : food
      )
    );
  };

  return (
    <main className="min-h-screen bg-sage-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-grow">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <main className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                NutriSnap
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Snap a photo of your food and get instant nutrition insights
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="border-2 border-dashed border-emerald-200 dark:border-emerald-700 rounded-xl p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  {hasCamera ? (
                    <video
                      id="camera-feed"
                      autoPlay
                      playsInline
                      className="w-full max-w-md rounded-lg"
                    />
                  ) : previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="w-full max-w-md rounded-lg object-contain"
                    />
                  ) : null}
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="imageInput"
                    capture="environment"
                    onChange={handleFileInput}
                  />
                  {!previewImage && !hasCamera && (
                    <label
                      htmlFor="imageInput"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900">
                        <FaCamera 
                          size={32}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                          Drop an image or take a photo
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          We'll analyze your food and provide detailed nutrition information
                        </p>
                      </div>
                    </label>
                  )}

                  {isAnalyzing && (
                    <div className="text-emerald-600 dark:text-emerald-400">
                      Analyzing image...
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={setupCamera}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    >
                      {hasCamera ? 'Switch Camera' : 'Enable Camera'}
                    </button>
                    
                    {hasCamera && (
                      <button
                        onClick={() => {
                          if (cameraStream) {
                            cameraStream.getTracks().forEach(track => track.stop());
                            setCameraStream(null);
                            setHasCamera(false);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        Stop Camera
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section - Initially Hidden */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg ${!nutritionData ? 'hidden' : ''}`} data-results-section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Nutrition Analysis
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MacroCard title="Calories" value={nutritionData?.calories || '0'} unit="kcal" />
                <MacroCard title="Protein" value={nutritionData?.protein || '0'} unit="g" />
                <MacroCard title="Carbs" value={nutritionData?.carbs || '0'} unit="g" />
                <MacroCard title="Fat" value={nutritionData?.fat || '0'} unit="g" />
              </div>
            </div>

            {/* User Stats & Goals Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Stats */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Personal Stats
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Height:</span>
                      <span className="font-semibold">{userStats.height} cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                      <span className="font-semibold">{userStats.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">BMI:</span>
                      <span className="font-semibold">{userStats.bmi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Diet Type:</span>
                      <span className="font-semibold">{userStats.diet}</span>
                    </div>
                  </div>
                </div>

                {/* Daily Macro Goals */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      Daily Macro Goals
                    </h2>
                    <button
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                      onClick={() => {
                        // TODO: Add update goals functionality
                        console.log('Update goals clicked');
                      }}
                    >
                      Update Goals
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                      <span className="font-semibold">{userStats.goals.calories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                      <span className="font-semibold">{userStats.goals.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Carbs:</span>
                      <span className="font-semibold">{userStats.goals.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Fat:</span>
                      <span className="font-semibold">{userStats.goals.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Food History Section */}
            {foodHistory.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Food History
                </h2>
                <div className="space-y-4">
                  {foodHistory.map(food => (
                    <FoodHistoryCard
                      key={food.id}
                      food={food}
                      onToggleEaten={handleToggleEaten}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <div className="fixed bottom-6 inset-x-0 z-50">
        <FloatingNav navItems={navItems} />
      </div>
    </main>
  );
}

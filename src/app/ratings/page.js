'use client';

import { useGetMyRatingsQuery } from '../../store/apiSlice';

export default function Ratings() {
  const { data: ratings, isLoading } = useGetMyRatingsQuery();

  const averageRating = ratings?.length 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <div className="mobile-container min-h-screen bg-white dark:bg-black pb-16">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center py-4">My Ratings</h1>
        {ratings?.length > 0 && (
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{averageRating}</div>
            <div className="text-sm text-gray-500">Average Rating ({ratings.length} reviews)</div>
          </div>
        )}
      </header>
      
      <main className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}
        
        <div className="space-y-3">
          {ratings?.map((rating) => (
            <div key={rating._id} className="touch-friendly bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{rating.customer?.name}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-sm ${i < rating.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-sm font-semibold">{rating.rating}</span>
                </div>
              </div>
              {rating.feedback && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  "{rating.feedback}"
                </p>
              )}
              <span className="text-xs text-gray-500">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              No ratings yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
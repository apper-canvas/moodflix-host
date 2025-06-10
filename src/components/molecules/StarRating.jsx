import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';
import ratingService from '@/services/api/ratingService';

const StarRating = ({ 
  movieId, 
  initialRating = 0, 
  initialReview = '', 
  onRatingSubmit,
  showReviewInput = true,
  readOnly = false,
  size = 'md' 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewArea, setShowReviewArea] = useState(false);

  const maxLength = 500;
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  useEffect(() => {
    setRating(initialRating);
    setReview(initialReview);
  }, [initialRating, initialReview]);

  const handleStarClick = (value) => {
    if (readOnly) return;
    
    setRating(value);
    if (showReviewInput && !showReviewArea) {
      setShowReviewArea(true);
    }
  };

  const handleStarHover = (value) => {
    if (readOnly) return;
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleKeyDown = (event, value) => {
    if (readOnly) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStarClick(value);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (review.length > maxLength) {
      toast.error(`Review must be ${maxLength} characters or less`);
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingService.create({
        movieId,
        rating,
        review: review.trim(),
        userId: 'current-user' // In real app, get from auth context
      });

      toast.success('Rating submitted successfully!');
      
      if (onRatingSubmit) {
        onRatingSubmit({ rating, review: review.trim() });
      }
      
      setShowReviewArea(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(initialRating);
    setReview(initialReview);
    setShowReviewArea(false);
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="space-y-4">
      {/* Star Rating */}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          
          return (
            <motion.button
              key={star}
              type="button"
              className={`${sizeClasses[size]} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-800 rounded ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              }`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              onKeyDown={(e) => handleKeyDown(e, star)}
              disabled={readOnly || isSubmitting}
              aria-label={`Rate ${star} out of 5 stars`}
              tabIndex={readOnly ? -1 : 0}
            >
              <ApperIcon
                name="Star"
                className={`w-full h-full transition-colors duration-200 ${
                  isFilled 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-400 hover:text-yellow-300'
                }`}
              />
            </motion.button>
          );
        })}
        
        {displayRating > 0 && (
          <Text className="ml-2 text-sm text-gray-300">
            {displayRating} out of 5 stars
          </Text>
        )}
      </div>

      {/* Review Text Area */}
      {showReviewInput && showReviewArea && !readOnly && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div>
            <label htmlFor={`review-${movieId}`} className="block text-sm font-medium text-gray-300 mb-2">
              Write a review (optional)
            </label>
            <textarea
              id={`review-${movieId}`}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              className="w-full p-3 bg-surface-700 border border-surface-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              maxLength={maxLength}
              aria-describedby={`review-help-${movieId}`}
            />
            <div id={`review-help-${movieId}`} className="flex justify-between items-center mt-1">
              <Text className="text-xs text-gray-400">
                Share your thoughts about this movie
              </Text>
              <Text className={`text-xs ${review.length > maxLength * 0.9 ? 'text-warning' : 'text-gray-400'}`}>
                {review.length}/{maxLength}
              </Text>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              animate={true}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isSubmitting}
              variant="secondary"
              className="px-4 py-2 bg-surface-600 text-gray-300 rounded-lg hover:bg-surface-500"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Display existing review if read-only */}
      {readOnly && initialReview && (
        <div className="mt-3 p-3 bg-surface-700 rounded-lg">
          <Text className="text-sm text-gray-300 leading-relaxed">
            "{initialReview}"
          </Text>
        </div>
      )}
    </div>
  );
};

export default StarRating;
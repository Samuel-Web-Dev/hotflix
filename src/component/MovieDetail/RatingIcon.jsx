import React from 'react';

const RatingIcon = ({ rating }) => {

  const ratingIcons = [
    { min: 0, max: 3, icon: '⭐' },
    { min: 3, max: 6, icon: '⭐⭐' },
    { min: 6, max: 8, icon: '⭐⭐⭐' },
    { min: 8, max: 10, icon: '⭐⭐⭐⭐' },
  ];

  // Find the matching icon based on the rating
  const matchedIcon = ratingIcons.find((range) => rating >= range.min && rating <= range.max);

  return matchedIcon ? matchedIcon.icon : 'No rating'
};

export default RatingIcon;

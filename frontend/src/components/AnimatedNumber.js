import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedNumber = ({ value, duration = 0.6, decimals = 2, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration * 0.5 }}
    >
      {typeof displayValue === 'number'
        ? displayValue.toFixed(decimals)
        : displayValue}
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;

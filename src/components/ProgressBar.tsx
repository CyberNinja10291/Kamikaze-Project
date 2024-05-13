import { useState, useEffect } from "react";
import { Progress } from "@chakra-ui/react";
const ProgressBar = ({ duration, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          onClose(); // Close toast when timer ends
          return 0;
        }
        return oldProgress + 1;
      });
    }, duration / 100); // Calculate decrement interval

    return () => {
      clearInterval(interval);
    };
  }, [duration, onClose]);

  return <Progress value={progress} size="xs" borderRadius="md" hasStripe />;
};
export default ProgressBar;

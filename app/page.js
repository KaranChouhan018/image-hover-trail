'use client';
import styles from './page.module.css';
import { useRef, useEffect } from 'react';

export default function Index() {

  let steps = useRef(0).current;
  let currentIndex = useRef(0).current;
  let nbOfImages = useRef(0).current;
  const maxNumberOfImages = 7;
  const refs = useRef([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, 19); // Ensure refs array length matches the number of images
  }, []);

  const manageMove = (x, y) => {
    steps += 24; // Adjust for sensitivity

    if (steps >= currentIndex * 150) {
      moveImage(x, y);

      if (nbOfImages === maxNumberOfImages) {
        removeImage();
      }
    }

    if (currentIndex === refs.current.length) {
      currentIndex = 0;
      steps = -150;
    }
  };

  const moveImage = (x, y) => {
    const currentImage = refs.current[currentIndex];
    if (currentImage) {
      currentImage.style.left = `${x}px`;
      currentImage.style.top = `${y}px`;
      currentImage.style.display = 'block';
      currentIndex++;
      nbOfImages++;
      setZIndex();
    }
  };

  const setZIndex = () => {
    const images = getCurrentImages();
    for (let i = 0; i < images.length; i++) {
      images[i].style.zIndex = i;
    }
  };

  const removeImage = () => {
    const images = getCurrentImages();
    images[0].style.display = 'none';
    nbOfImages--;
  };

  const getCurrentImages = () => {
    let images = [];
    let indexOfFirst = currentIndex - nbOfImages;
    for (let i = indexOfFirst; i < currentIndex; i++) {
      let targetIndex = i;
      if (targetIndex < 0) targetIndex += refs.current.length;
      images.push(refs.current[targetIndex]);
    }
    return images;
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    manageMove(clientX, clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    manageMove(clientX, clientY);
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onTouchMove={handleTouchMove} 
      className={styles.main}
    >
      {
        [...Array(19).keys()].map((_, index) => {
          return (
            <img 
              key={index} 
              ref={el => refs.current[index] = el} 
              src={`/images/${index}.jpg`} 
              className={styles.image} 
            />
          );
        })
      }
      <div className={styles.marquee}>
        <span className={styles.marqueeText}>
          {Array(1000).fill('404 Found').join('   ')} 
        </span>
      </div>
    </div>
  );
}

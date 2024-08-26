'use client';
import styles from './page.module.css';
import { useRef, useEffect } from 'react';

export default function Index() {

  const steps = useRef(0);
  const currentIndex = useRef(0);
  const nbOfImages = useRef(0);
  const maxNumberOfImages = 7;
  const refs = useRef([]);
  const lastMoveTime = useRef(Date.now());

  useEffect(() => {
    refs.current = refs.current.slice(0, 19); // Dynamically adjust for the actual number of images

    // Preload images
    refs.current.forEach((ref, index) => {
      const img = new Image();
      img.src = `/images/${index}.jpg`;
    });
  }, []);

  const manageMove = (x, y) => {
    const now = Date.now();
    if (now - lastMoveTime.current < 16) return; // Throttle to roughly 60fps
    lastMoveTime.current = now;

    steps.current += 24; // Adjust for sensitivity

    if (steps.current >= currentIndex.current * 150) {
      moveImage(x, y);

      if (nbOfImages.current === maxNumberOfImages) {
        removeImage();
      }
    }

    if (currentIndex.current === refs.current.length) {
      currentIndex.current = 0;
      steps.current = -150;
    }
  };

  const moveImage = (x, y) => {
    const currentImage = refs.current[currentIndex.current];
    if (currentImage) {
      currentImage.style.left = `${x}px`;
      currentImage.style.top = `${y}px`;
      currentImage.style.display = 'block';
      currentIndex.current++;
      nbOfImages.current++;
      setZIndex();
    }
  };

  const setZIndex = () => {
    const images = getCurrentImages();
    images.forEach((image, index) => {
      image.style.zIndex = index;
    });
  };

  const removeImage = () => {
    const images = getCurrentImages();
    if (images.length > 0) {
      images[0].style.display = 'none';
      nbOfImages.current--;
    }
  };

  const getCurrentImages = () => {
    let images = [];
    let indexOfFirst = currentIndex.current - nbOfImages.current;
    for (let i = indexOfFirst; i < currentIndex.current; i++) {
      let targetIndex = i;
      if (targetIndex < 0) targetIndex += refs.current.length;
      images.push(refs.current[targetIndex]);
    }
    return images;
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    requestAnimationFrame(() => manageMove(clientX, clientY));
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    requestAnimationFrame(() => manageMove(clientX, clientY));
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onTouchMove={handleTouchMove} 
      className={styles.main}
    >
       <header className={styles.header}>
        <div className={styles.logo}>
          A-O
        </div>
        <nav className={styles.navbar}>
          <ul>
           <li> <a href='#'>MENU</a> </li>
          </ul>
        </nav>
      </header>
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
          {Array(1000).fill('404 -').join('   ')} 
        </span>
      </div>
    </div>
  );
}

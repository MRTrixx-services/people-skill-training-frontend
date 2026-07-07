import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
   const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash === '') {
      // Scroll to top when there's no hash
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to element if hash exists (e.g., #section-id)
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return null;
};


export default ScrollToTop;
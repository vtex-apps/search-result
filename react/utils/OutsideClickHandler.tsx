import React, { useRef, useEffect } from "react";
import { useDevice } from "vtex.device-detector";

interface OutsideClickHandlerProps {
  onOutsideClick: (event: MouseEvent | TouchEvent) => void
}

function useOutsideClickHandler(ref: React.MutableRefObject<HTMLElement | null>, onOutsideClick: (event: MouseEvent | TouchEvent) => void) {
  const { isMobile } = useDevice()
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        onOutsideClick(event)
      }
    }

    document.addEventListener(isMobile ? 'touchend' : 'mouseup', handleClickOutside);
    
    return () => {
      document.removeEventListener(isMobile ? 'touchend' : 'mouseup', handleClickOutside);
    };
  }, [ref]);
}

const OutsideClickHandler: React.FC<OutsideClickHandlerProps>  = (props) => {
  const wrapperRef = useRef(null);
  useOutsideClickHandler(wrapperRef, props.onOutsideClick);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default OutsideClickHandler
import * as React from "react"

const MOBILE_BREAKPOINT = 768

interface MobileState {
  isMobile: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export function useMobile(): MobileState {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const toggleMenu = React.useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return { isMobile, isMenuOpen, toggleMenu };
}
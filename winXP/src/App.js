import React, { useState, useCallback, useEffect } from 'react';

import WinXP from './WinXP';
import BootIntro, { hasBootCompleted } from './BootIntro';

const App = () => {
  const [entered, setEntered] = useState(() => hasBootCompleted());
  const handleEnter = useCallback(() => setEntered(true), []);

  useEffect(() => {
    const onDisclaimerAccepted = () => {
      try { sessionStorage.removeItem('winxp-boot-complete'); } catch {}
      setEntered(false);
    };
    window.addEventListener('winxp-disclaimer-accepted', onDisclaimerAccepted);
    return () => window.removeEventListener('winxp-disclaimer-accepted', onDisclaimerAccepted);
  }, []);

  if (!entered) {
    return <BootIntro onEnter={handleEnter} />;
  }

  return <WinXP />;
};

export default App;

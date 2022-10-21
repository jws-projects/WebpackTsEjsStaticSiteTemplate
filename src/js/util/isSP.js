const isSP = () => {
  const ww = $(window).width();
  const spWidth = 768;
  if (ww <= spWidth) {
    return true;
  } else {
    return false;
  }
};

export default isSP;

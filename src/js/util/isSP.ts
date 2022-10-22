const isSP = () => {
  const windowInnerWidth = window.innerWidth;
  const spWidth = 768;
  if (windowInnerWidth <= spWidth) {
    return true;
  } else {
    return false;
  }
};

export default isSP;

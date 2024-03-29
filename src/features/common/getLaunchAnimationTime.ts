export default function getLaunchAnimationTime() {
  let launchAnimationTime: number;
  const propertyValue = window.getComputedStyle(document.documentElement).getPropertyValue('--launch-animation-time');
  if (propertyValue.slice(-2) === 'ms') {
    launchAnimationTime = Number(
      propertyValue.slice(0, -2),
    );
  } else {
    throw new Error(`${propertyValue} is invalid. Launch animation time must be in ms`);
  }

  return launchAnimationTime;
}

function getBrowserName(userAgent) {
  if (/edg/i.test(userAgent)) {
    return "Microsoft Edge";
  }

  if (/opr|opera/i.test(userAgent)) {
    return "Opera";
  }

  if (
    /chrome|crios/i.test(userAgent) &&
    !/edg/i.test(userAgent)
  ) {
    return "Google Chrome";
  }

  if (/firefox|fxios/i.test(userAgent)) {
    return "Mozilla Firefox";
  }

  if (
    /safari/i.test(userAgent) &&
    !/chrome|crios|android/i.test(
      userAgent
    )
  ) {
    return "Safari";
  }

  return "Unknown Browser";
}

function getOperatingSystem(
  userAgent
) {
  if (/windows nt 10/i.test(userAgent)) {
    return "Windows";
  }

  if (/windows/i.test(userAgent)) {
    return "Windows";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iOS";
  }

  if (/mac os x/i.test(userAgent)) {
    return "macOS";
  }

  if (/linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Unknown OS";
}

function getDeviceType(userAgent) {
  if (/tablet|ipad/i.test(userAgent)) {
    return "Tablet";
  }

  if (
    /mobile|android|iphone|ipod/i.test(
      userAgent
    )
  ) {
    return "Mobile";
  }

  return "Desktop";
}

export function getDeviceInfo() {
  const userAgent =
    window.navigator.userAgent || "";

  return {
    browser: getBrowserName(userAgent),
    operatingSystem:
      getOperatingSystem(userAgent),
    deviceType:
      getDeviceType(userAgent),
    language:
      window.navigator.language ||
      "Unknown",
    platform:
      window.navigator.platform ||
      "Unknown",
    screen: `${window.screen.width} × ${window.screen.height}`,
  };
}
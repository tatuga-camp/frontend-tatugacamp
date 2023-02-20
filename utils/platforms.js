function getOperatingSystem(window) {
  let operatingSystem = "Not known";
  if (window.navigator.appVersion.indexOf("Win") !== -1) {
    operatingSystem = "Windows OS";
  }
  if (window.navigator.appVersion.indexOf("Mac") !== -1) {
    operatingSystem = "MacOS";
  }
  if (window.navigator.appVersion.indexOf("X11") !== -1) {
    operatingSystem = "UNIX OS";
  }
  if (window.navigator.appVersion.indexOf("Linux") !== -1) {
    operatingSystem = "Linux OS";
  }

  return operatingSystem;
}

function getBrowser(window) {
  let currentBrowser = "Not known";

  if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
    currentBrowser = "Google Chrome";
  } else if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
    currentBrowser = "Mozilla Firefox";
  } else if (window.navigator.userAgent.indexOf("MSIE") !== -1) {
    currentBrowser = "Internet Exployer";
  } else if (window.navigator.userAgent.indexOf("Edge") !== -1) {
    currentBrowser = "Edge";
  } else if (window.navigator.userAgent.indexOf("Safari") !== -1) {
    currentBrowser = "Safari";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    currentBrowser = "Opera";
  } else {
    currentBrowser = "scoial media browser";
  }

  return currentBrowser;
}

function checkSocialmediaBrowser(window) {
  let currentBrowser = "Not know";
  if (
    window.navigator.userAgent.indexOf("facebook") > -1 ||
    window.navigator.userAgent.indexOf("instagram") > -1 ||
    window.navigator.userAgent.indexOf("twitter") > -1
  ) {
    currentBrowser = "scoial media browser";
  } else {
    currentBrowser = "browser";
  }
  return currentBrowser;
}

export const OS = (window) => {
  return getOperatingSystem(window);
};
export const currentBrowser = (window) => {
  return getBrowser(window);
};

export const getSocialmediaBrowse = (window) => {
  return checkSocialmediaBrowser(window);
};

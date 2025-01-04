import { Dimensions, View } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

export const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};

export const ensureHttps = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const trimmedString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

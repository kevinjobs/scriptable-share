// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;

const widget = new ListWidget();

// 在 iCloud 的 Scriptable 文件下创建 img 文件夹
const imagePath = 'img/';
// 在上述 img 文件夹下创建 byCode 文件夹，放入天气图标文件
// 图标可以在这里下载 https://github.com/qwd/WeatherIcon
const imagePathByCode = 'img/byCode/';

const baiduMapApiKey = ''; // 填写百度地图公开平台 api
const qweatherApiKey = ''; // 填写和风天气开发 api

const locationFromDevice = await Location.current();
const locationArr = [locationFromDevice.longitude, locationFromDevice.latitude];

const weatherData = await getWeatherData(locationArr, qweatherApiKey);

const locationArrowImage = getImageFromiCloud(imagePath, 'ios-location');
const realLocationText = await getRealLocation(locationArr, baiduMapApiKey);
const weatherIconImage = getImageFromiCloud(imagePathByCode, weatherData.now.icon.toString());
const weatherTextText = weatherData.now.text;
const weatherTempText = weatherData.now.temp.toString() + '°';
const weatherWindDirText = weatherData.now.windDir;
const weatherWindScaleText = weatherData.now.windScale + '级';
const weatherHumidityText = '湿度' + weatherData.now.humidity + '%';

//
const locationStack = widget.addStack();
locationStack.centerAlignContent();
locationStack.setPadding(0, 30, 0, 0);
// locationStack.borderWidth = 1;
locationStack.size = new Size(130, 20);
const locationStackText = locationStack.addText(realLocationText.join(','));
locationStackText.font = new Font('PingFangSC', 12);
const locationStackSpacer = locationStack.addSpacer(5);
const locationStackArrowImg = locationStack.addImage(locationArrowImage);
locationStackArrowImg.imageSize = new Size(12, 12);
// 
const weatherIconStack = widget.addStack();
weatherIconStack.size = new Size(130, 90);
weatherIconStack.centerAlignContent();
// weatherIconStack.borderWidth = 1;
const weatherIconStackImage = weatherIconStack.addImage(weatherIconImage);
weatherIconStackImage.imageSize = new Size(80, 90);
const weatherIconStackSubStack = weatherIconStack.addStack();
weatherIconStackSubStack.size = new Size(50, 90);
weatherIconStackSubStack.setPadding(0, 10, 0, 0);
weatherIconStackSubStack.layoutVertically();
weatherIconStackSubStack.centerAlignContent();
// weatherIconStackSubStack.borderWidth = 1;
const weatherTextStackStatusText = weatherIconStackSubStack.addText(weatherTextText);
weatherTextStackStatusText.centerAlignText();
weatherIconStackSubStack.addSpacer(5);
const weatherTextStackTempText = weatherIconStackSubStack.addText(weatherTempText);
weatherTextStackTempText.centerAlignText();
//
const weatherOtherTextStack = widget.addStack();
weatherOtherTextStack.setPadding(0, 5, 0, 0);
const weatherOtherTextStackWind = weatherOtherTextStack.addText(weatherWindDirText);
weatherOtherTextStackWind.font = new Font('PingFangSC-light', 12);
weatherOtherTextStack.addSpacer(5);
const weatherOtherTextStackWindS = weatherOtherTextStack.addText(weatherWindScaleText);
weatherOtherTextStackWindS.font = new Font('PingFangSC-light', 12);
weatherOtherTextStack.addSpacer(5);
const weatherOtherTextStackHumidity = weatherOtherTextStack.addText(weatherHumidityText);
weatherOtherTextStackHumidity.font = new Font('PingFangSC-light', 12);

Script.setWidget(widget);
Script.complete();

async function getWeatherData(locationArr, key) {
  /**
   * get weather from qweather api
   * @method getWeatherData
   * @param {Array} locationArr [latitude, longitude]
   * @param {string} key qweather api private key
   * @return {JSON}
   */
  const url = `https://devapi.qweather.com/v7/weather/now?key=${key}&location=${locationArr.join(',')}`
  const res = new Request(url);
  const json = await res.loadJSON();
  return json;
}

async function getRealLocation(locationArr, ak) {
  /**
   * get real location from location arrary
   * @method getRealLocation
   * @param {Array} locationArr an arrary [latitude, longitude]
   * @param {string} ak the token of baidu map open api key
   * @return {JSON} 
   */
  const location = locationArr.reverse().join(',');
  const url = `http://api.map.baidu.com/reverse_geocoding/v3/?output=json&coordtype=wgs84ll&ak=${ak}&location=${location}`
  const res = new Request(url);
  const json = await res.loadJSON();
  const realLocation = [
    json.result.addressComponent.city,
    json.result.addressComponent.district
  ]
  return realLocation;
}

function getImageFromiCloud(path, name) {
  /**
   * get image from iCloud if exists
   * @method getImageFromiCloud
   * @param {string} name
   * @return {Image}
   */
  const fm = FileManager.iCloud();
  const currentPath = FileManager.iCloud().documentsDirectory();
  const imgPath = currentPath + '/' + path + name.toString() + '.png';
  if (fm.fileExists(imgPath)) {
    const img = Image.fromFile(imgPath);
    return img;
  }
}


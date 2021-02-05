// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
const widget = new ListWidget();
const baiduMapApiKey = '';
const qweatherApiKey = '';
const locationFromDevice = await Location.current();
const locationArr = [locationFromDevice.longitude, locationFromDevice.latitude];

const weatherData = await getWeatherData(locationArr, qweatherApiKey);

const realLocationText = await getRealLocation(locationArr, baiduMapApiKey);
const weatherIconImage = getImageFromiCloud(weatherData.now.icon);
const weatherTextText = weatherData.now.text;
const weatherTempText = weatherData.now.temp.toString();

//
const locationStack = widget.addStack();
const locationStackText = locationStack.addText(realLocationText.join(','));
locationStackText.font = new Font('PingFangSC-light', 10);
locationStackText.rightAlignText();
// 
const weatherIconStack = widget.addStack();
const weatherIconStackImage = weatherIconStack.addImage(weatherIconImage);
//
const weatherTextStack = widget.addStack();
const weatherTextStackStatusText = weatherTextStack.addText(weatherTextText);
const weatherTextStackTempText = weatherTextStack.addText(weatherTempText);

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
  const url = `
    https://devapi.qweather.com/v7/weather/now
    ?key=${key}&location=${locationArr.join(',')}`
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
  const url = `
    http://api.map.baidu.com/reverse_geocoding/v3/
    ?output=json&coordtype=wgs84ll
    &ak=${ak}&location=${location}`
  const res = new Request(url);
  const json = await res.loadJSON();
  const realLocation = [
    json.result.addressComponent.city,
    json.result.addressComponent.district
  ]
  return realLocation;
}

function getImageFromiCloud(code) {
  /**
   * get image from iCloud if exists
   * @method getImageFromiCloud
   * @param {number} code
   * @return {Image}
   */
  const fm = FileManager.iCloud();
  const currentDir = fm.documentsDirectory();
  const imgDir = currentDir + '/img' + '/byCode/';
  const imgPath = imgDir + code.toString() + '.png';
  if (fm.fileExists(imgPath)) {
    const img = Image.fromFile(imgPath);
    return img;
  }
}
const geolocationApiURL = "https://geo.ipify.org/api/";
const geolocationApiVersion =  "v1";
const apiKey = "at_YaE3cRYGXd0TzYYHqRKNek25UXRUn";

const fetchData = (endpoint) => fetch(endpoint)
.then(blob => blob.json())
.then(data => data);

async function getData(ipAddress) {
 const userEndpoint = "https://api.ipify.org?format=json";
 const userIP = await fetchData(userEndpoint);
 const ip = ipAddress || userIP.ip;
 
 const geolocationEndpont = `${geolocationApiURL}${geolocationApiVersion}?apiKey=${apiKey}&ipAddress=${ip}`;
 const geolocationData = await fetchData(geolocationEndpont);

 updateMap(geolocationData.location.lat, 
  geolocationData.location.lng, 
  geolocationData.location.city);
 updateInfo(geolocationData);
}

const map = L.map('mapid');
let prevMarker = L.marker([0, 0]);

function updateMap(lat = 0, lng = 0, city) {
 map.setView([lat, lng], 13);
 map.removeControl( map.zoomControl );
 
 const markerIcon = L.icon({
   iconUrl: './images/icon-location.svg',
   iconSize:     [45, 55], 
   iconAnchor:   [20, 74],
   popupAnchor:  [-3, -76] 
  });
  
 map.removeLayer(prevMarker);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
   maxZoom: 18,
 }).addTo(map);

 prevMarker = L.marker([lat, lng], {icon: markerIcon}).addTo(map)
 .bindPopup(`<b>Hello user!</b><br>you are in ${city}.`);
}

const searchBox = document.querySelector('.search');
const searchBtn = document.querySelector('.search-btn');

function ValidateIPaddress(inputText) {
 const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  
 
 return ipformat.test(inputText);
}

function getInput(e) {
 e.preventDefault();
 if (!ValidateIPaddress(searchBox.value)) {
  invalidIP.classList.add('display');
  return;
 }
 getData(searchBox.value);
}

// update html 
const ipAddress = document.querySelector('.ip-address');
const city = document.querySelector('.city');
const timezone = document.querySelector('.timezone');
const isp = document.querySelector('.isp');

function updateInfo(geolocationData) {
 isp.innerHTML = geolocationData.isp;
 ipAddress.innerHTML = geolocationData.ip;
 city.innerHTML = geolocationData.location.city;
 timezone.innerHTML = geolocationData.location.timezone;
}

const invalidIP = document.querySelector('.invalid-ip');

searchBtn.addEventListener('click', getInput);
searchBox.addEventListener('focus', () => invalidIP.classList.remove('display'));

getData();
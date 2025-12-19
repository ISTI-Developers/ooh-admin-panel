import { segments } from "./segments";

const conjunctionWords = [
  "and",
  "but",
  "or",
  "nor",
  "for",
  "so",
  "yet",
  "although",
  "because",
  "since",
  "unless",
  "while",
  "to",
  "at",
  "on",
  "off",
  "in",
  "of",
];
const colors = [
  "#84b6d8",
  "#5c7f97",
  "#344856",
  "#b8b5e7",
  "#8984d8",
  "#5f5c97",
  "#84d88e",
  "#5c9763",
  "#c1ebc6",
  "#27402a",
];
const regions = [
  "National Capital Region (NCR)",
  "Cordillera Administrative Region (CAR)",
  "Region I (Ilocos Region)",
  "Region II (Cagayan Valley)",
  "Region III (Central Luzon)",
  "Region IV-A (CALABARZON)",
  "Region IV-B (MIMAROPA)",
  "Region V (Bicol Region)",
  "Region VI (Western Visayas)",
  "Region VII (Central Visayas)",
  "Region VIII (Eastern Visayas)",
  "Region IX (Zamboanga Peninsula)",
  "Region X (Northern Mindanao)",
  "Region XI (Davao Region)",
  "Region XII (SOCCSKSARGEN)",
  "Region XIII (Caraga)",
  "Autonomous Region in Muslim Mindanao (ARMM)",
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
];
const regionList = [
  "Metro Manila",
  "Cordillera Administrative Region",
  "Ilocos Region",
  "Cagayan Valley",
  "Central Luzon",
  "Calabarzon",
  "Mimaropa",
  "Bicol Region",
  "Western Visayas",
  "Central Visayas",
  "Eastern Visayas",
  "Zamboanga Peninsula",
  "Northern Mindanao",
  "Davao Region",
  "Region XII",
  "Caraga",
  "Bangsamoro Autonomous Region in Muslim Mindanao",
];
const cities = [
  "Alaminos",
  "Angeles City",
  "Antipolo",
  "Bacolod",
  "Bacoor",
  "Bago",
  "Baguio",
  "Bais",
  "Balanga",
  "Baliwag",
  "Batac",
  "Batangas City",
  "Bayawan",
  "Baybay",
  "Bayugan",
  "Binan",
  "Bislig",
  "Bogo",
  "Borongan",
  "Butuan",
  "Cabadbaran",
  "Cabanatuan",
  "Cabuyao",
  "Cadiz",
  "Cagayan de Oro",
  "Calaca",
  "Calamba",
  "Calapan",
  "Calbayog",
  "Caloocan",
  "Candon",
  "Canlaon",
  "Carcar",
  "Carmona",
  "Catbalogan",
  "Cauayan",
  "Cavite City",
  "Cebu City",
  "Cotabato City",
  "Dagupan",
  "Danao",
  "Dapitan",
  "Dasmarinas",
  "Davao City",
  "Digos",
  "Dipolog",
  "Dumaguete",
  "El Salvador",
  "Escalante",
  "Gapan",
  "General Santos",
  "General Trias",
  "Gingoog",
  "Guihulngan",
  "Himamaylan",
  "Ilagan",
  "Iligan",
  "Iloilo City",
  "Imus",
  "Iriga",
  "Isabela",
  "Kabankalan",
  "Kidapawan",
  "Koronadal",
  "La Carlota",
  "Lamitan",
  "Laoag",
  "Lapu-Lapu City",
  "Las Pinas",
  "Legazpi",
  "Ligao",
  "Lipa",
  "Lucena",
  "Maasin",
  "Mabalacat",
  "Makati",
  "Malabon",
  "Malaybalay",
  "Malolos",
  "Mandaluyong",
  "Mandaue",
  "Manila",
  "Marawi",
  "Marikina",
  "Masbate City",
  "Mati",
  "Meycauayan",
  "Munoz",
  "Muntinlupa",
  "Naga",
  "Navotas",
  "Olongapo",
  "Ormoc",
  "Oroquieta",
  "Ozamiz",
  "Pagadian",
  "Palayan",
  "Panabo",
  "Paranaque",
  "Pasay",
  "Pasig",
  "Passi",
  "Puerto Princesa",
  "Quezon City",
  "Roxas",
  "Sagay",
  "Samal",
  "San Carlos",
  "San Fernando",
  "San Jose",
  "San Jose Del Monte",
  "San Juan",
  "San Pablo",
  "Santa Rosa",
  "Santo Tomas",
  "Santiago",
  "Silay",
  "Sipalay",
  "Sorsogon City",
  "Surigao City",
  "Tabaco",
  "Tabuk",
  "Tacloban",
  "Tacurong",
  "Tagaytay",
  "Tagbilaran",
  "Taguig",
  "Tagum",
  "Talisay",
  "Tanauan",
  "Tandag",
  "Tangub",
  "Tanjay",
  "Tarlac City",
  "Tayabas",
  "Toledo",
  "Trece Martires",
  "Tuguegarao",
  "Urdaneta",
  "Valencia",
  "Valenzuela",
  "Victorias",
  "Vigan",
  "Zamboanga City",
];

const headers = [
  "site",
  "area",
  "city",
  "region",
  "latitude",
  "longitude",
  "type",
  "site_owner",
  "board_facing",
  "size_width",
  "size_height",
  "size_unit",
  "segments",
  "price",
  "ideal_view",
];

const locationMap = {
  "Kalakhang Maynila": "Metro Manila",
  "Gitnáng Luzon": "Central Luzon",
  Isabela: "Cagayan Valley",
  "Lungsod Quezon": "Quezon City",
  "Hilagang Mindanao": "Northern Mindanao",
  "Rehiyong Pampangasiwaan ng Cordillera": "Cordillera Administrative Region",
  "Gitnang Kabisayaan": "Central Visayas",
  Bicol: "Bicol Region",
  SOCCSKSARGEN: "Region XII",
};
const batchUploadHeaders = [
  { name: "city", options: cities },
  { name: "region", options: regionList },
  { name: "latitude" },
  { name: "longitude" },
  { name: "type", options: ["classic", "digital", "banner"] },
  { name: "site_owner" },
  { name: "board_facing" },
  { name: "size_width" },
  { name: "size_height" },
  { name: "size_unit", options: ["ft", "m"] },
  { name: "segments" },
  { name: "price" },
  { name: "ideal_view" },
];
const toUnderscored = (text) => {
  return text.split(" ").join("_");
};
const toSpaced = (text) => {
  return text.split("_").join(" ");
};
const capitalize = (text = "", sep = " ") => {
  const tempText = text.split(sep);
  tempText.forEach((text, index) => {
    if (!conjunctionWords.includes(text)) {
      tempText[index] = text.charAt(0).toUpperCase() + text.slice(1);
    }
  });
  return tempText.join(" ");
};

const toSentenceCase = (str) => {
  // Check if the input string is not empty
  if (str && typeof str === "string") {
    // Convert the first character to uppercase and the rest to lowercase
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Return an empty string if the input is invalid
  return "";
};

function offsetCoordinate(lat, lng, offsetMeters) {
  // Earth's radius in meters
  const earthRadius = 6378137; // Approximate value for Earth's radius in meters

  // Offset in radians
  const offsetLat = offsetMeters / earthRadius;
  const offsetLng =
    offsetMeters / (earthRadius * Math.cos((Math.PI * lat) / 180));

  // New latitude and longitude after offset
  const newLat = lat + (offsetLat * 180) / Math.PI;
  const newLng = lng + (offsetLng * 180) / Math.PI;

  return { lat: newLat, lng: newLng };
}
function searchItems(array, query) {
  // Convert query to lowercase for case-insensitive search
  const lowerCaseQuery = query.toLowerCase();

  // Array to store matched objects
  const matches = [];

  // Loop through each object in the array
  for (let obj of array) {
    // Check each key in the object
    for (let key in obj) {
      // Check if the value of the key contains the query string
      if (obj[key].toString().toLowerCase().includes(lowerCaseQuery)) {
        // If there's a match, add the object to the matches array
        matches.push(obj);
        // Break out of the loop to avoid adding the same object multiple times
        break;
      }
    }
  }

  return matches;
}
function findClosestLocations(givenCoord) {
  const locations = segments;
  let nearest = { areaCode: "", distance: Infinity };

  for (const [areaCode, routeGroup] of Object.entries(locations)) {
    for (const route of Object.values(routeGroup)) {
      const points = [...route.origin, ...route.destination];

      for (const point of points) {
        console.log(points);
        const distance = haversineDistance(
          givenCoord.lat,
          givenCoord.lng,
          Number(point.lat),
          Number(point.lng)
        );

        if (distance < nearest.distance) {
          nearest = { areaCode, distance };
        }
      }
    }
  }

  return nearest;
}

const retrieveIdealViewCoordinates = (link) => {
  //https://www.google.com/maps/@14.624232,121.0744222,3a,75y,354.06h,92.22t/data=!3m6!1e1!3m4!1s69Lv8YYzi_Y0B1BfBw0zYA!2e0!7i16384!8i8192?entry=ttu
  const isGoogleLink = /google.*maps/.test(link);
  const latlngRegex = /@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/;

  if (!isGoogleLink) return;

  const latlngResults = link.match(latlngRegex);

  if (!latlngResults || latlngResults?.length < 3) return;

  const latitude = parseFloat(latlngResults[1]);
  const longitude = parseFloat(latlngResults[2]);

  return {
    lat: latitude,
    lng: longitude,
  };
};

const capitalizeFirst = (text = "", sep = " ") => {
  const tempText = text.split(sep);
  tempText.forEach((text, index) => {
    if (!conjunctionWords.includes(text)) {
      tempText[index] =
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
  });
  return tempText.join(" ");
};
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
export const useFunction = () => {
  return {
    colors,
    regions,
    regionList,
    cities,
    headers,
    locationMap,
    batchUploadHeaders,
    toUnderscored,
    toSpaced,
    capitalize,
    toSentenceCase,
    offsetCoordinate,
    searchItems,
    findClosestLocations,
    retrieveIdealViewCoordinates,
    capitalizeFirst,
    haversineDistance,
  };
};

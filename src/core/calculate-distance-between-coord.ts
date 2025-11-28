export interface Coordinate {
  latitude: number
  longitude: number
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistance(from: Coordinate, to: Coordinate) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

console.log(haversineDistance({
    latitude: -26.8540067,
    longitude: -49.106448,
},
{
    latitude: -26.923473,
    longitude: -49.0232421,
}))

/*
SELECT * from table where (
    6371 * ACOS(
        COS(RADIANS(latitude1)) * COS(RADIANS(latitude2)) * COS(RADIANS(longitude2) - RADIANS(longitude1))
        + SIN(RADIANS(latitude1)) * SIN(RADIANS(latitude2))
) ) <= 10;
*/
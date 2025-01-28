import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Button, Label, TextInput } from "flowbite-react";
import useGeocode from "~/contexts/UseGeocode";
import { lightButtonTheme } from "~/misc/themes";
function MapPicker({
  isEditable,
  center,
  setCenter,
  onChange,
  item,
  handleMapChange,
}) {
  const zoom = 17;
  const [search, setSearch] = useState("");
  const [midpoint, setMidpoint] = useState(center);
  const handleCenterChange = (position) => {
    const coords = {
      lat: position.map.center.lat(),
      lng: position.map.center.lng(),
    };
    setMidpoint(coords);
  };

  const handleSearch = () => {
    const searchTerm = search;
    if (!searchTerm) return;

    // Create a new instance of Geocoder
    const geocoder = new window.google.maps.Geocoder();

    // Make Geocode request
    geocoder.geocode({ address: searchTerm }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results.length > 0
      ) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
        setMidpoint({ lat: lat(), lng: lng() });
      } else {
        console.log(status);
      }
    });
  };
  return (
    <div className="w-full flex flex-col gap-4 row-[1/5]">
      {isEditable && (
        <>
          <div>
            <Label htmlFor="location" value="Location Information" />
            <LocationInfo
              isEditable={isEditable}
              {...midpoint}
              item={item}
              onChange={onChange}
            />
          </div>
          <div>
            <Label
              htmlFor="search"
              value="Search Location"
              className="font-semibold"
            />
            <div className="flex items-center gap-2">
              <TextInput
                id="search"
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                sizing="md"
                className="w-full"
                placeholder="search location"
              />
              <Button
                theme={lightButtonTheme}
                onClick={handleSearch}
                color="transparent"
              >
                Search
              </Button>
            </div>
          </div>
        </>
      )}
      <div>
        {isEditable && (
          <span className="font-semibold">
            or drag the map to your desired location
          </span>
        )}
        <APIProvider apiKey="AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE">
          <div className="h-[300px] w-full">
            {/* {center.lat + ", " + center.lng} */}
            <Map
              onDragend={handleCenterChange}
              onDrag={() => setSearch("")}
              center={center}
              zoom={zoom}
              mapId={"b3f282d4d5ce8522"}
              onCenterChanged={(event) => {
                if (isEditable) {
                  setCenter(event.detail.center);
                  handleMapChange(
                    event.detail.center.lat,
                    event.detail.center.lng
                  );
                }
              }}
              fullscreenControl={false}
              streetViewControl={false}
            >
              <AdvancedMarker position={center} />
            </Map>
          </div>
        </APIProvider>
      </div>
    </div>
  );
}

function LocationInfo({ isEditable, lat, lng, onChange, item }) {
  const { address, loading, error } = useGeocode(lat, lng);

  useEffect(() => {
    if (address) {
      onChange(address);
    }
  }, [address, lat, lng]);
  return (
    isEditable && (
      <TextInput
        id="location"
        disabled
        type="text"
        sizing="md"
        onChange={(e) => onChange(e.target.value)}
        // defaultValue={address}
        value={item ? item : address}
        placeholder={
          loading
            ? "Loading..."
            : error
            ? "Error occured. Please try again"
            : "Enter location name"
        }
      />
    )
  );
}

MapPicker.propTypes = {
  center: PropTypes.object,
  setCenter: PropTypes.func,
  onChange: PropTypes.func,
  item: PropTypes.object,
};
LocationInfo.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  onChange: PropTypes.func,
  item: PropTypes.object,
};
export default MapPicker;

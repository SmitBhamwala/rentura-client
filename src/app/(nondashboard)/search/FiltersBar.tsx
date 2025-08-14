import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen
} from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { Filter, Grid, List, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBox = dynamic<any>(
  () => import("@mapbox/search-js-react").then((mod) => mod.SearchBox as any),
  { ssr: false }
);

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchInput, setSearchInput] = useState(filters.location);
  const [coordinates, setCoordinates] = useState(filters.coordinates || [0, 0]);

  useEffect(() => {
    async function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
            );
            const data = await response.json();
            console.log("Current location: " + data.features[0].place_name);

            if (data.features && data.features.length > 0) {
              // const locationName = data.features[0].place_name;
              // const locality: { id: string; text: string } =
              //   data.features[0].context.find(
              //     (context: { id: string; text: string }) =>
              //       context.id.startsWith("locality")
              //   );
              const city: { id: string; text: string } =
                data.features[0].context.find(
                  (context: { id: string; text: string }) =>
                    context.id.startsWith("place")
                );
              // console.log("Locality:", locality?.text);
              // console.log("City:", city?.text);

              setSearchInput(city?.text);
              dispatch(
                setFilters({
                  location: city?.text,
                  coordinates: [
                    position.coords.longitude,
                    position.coords.latitude
                  ]
                })
              );
            }
          } catch (err) {
            console.error("Error search location:", err);
          }
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
    // getCurrentLocation();
  }, [dispatch]);

  const updateURL = (newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  };

  const handleFilterChange = (
    key: string,
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;

    if (key === "priceRange" || key === "squareFeet") {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : Number(value);
      }
      newValue = currentArrayRange;
    } else if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };

  const handleLocationSearch = async () => {
    const [lat, lng] = coordinates;

    const trimmedQuery = searchInput.trim();
    if (trimmedQuery.length === 0) {
      return;
    }

    dispatch(
      setFilters({
        location: trimmedQuery,
        coordinates: [lng, lat]
      })
    );
    updateURL({
      ...filters,
      location: trimmedQuery,
      coordinates: [lng, lat]
    });
  };

  return (
    <div className="flex justify-between items-start lg:items-center w-full py-5">
      {/* Filters */}
      <div className="flex overflow-x-scroll justify-between items-center gap-4 p-2">
        {/* All Filters */}
        <Button
          variant="outline"
          className={cn(
            "gap-2 rounded-xl border-primary-400 cursor-pointer hidden lg:flex",
            isFiltersFullOpen && "bg-primary-700! text-primary-100!"
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}>
          <Filter className="h-4 w-4" />
          <span>All Filters</span>
        </Button>

        {/* Search Location */}
        <div className="flex items-center">
          <div className="filtersbar w-48">
            <SearchBox
              accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
              options={{
                types: "place",
                country: "in"
              }}
              value={filters.location || searchInput}
              onRetrieve={(e: any) => {
                setSearchInput(e.features[0].properties.context.place!.name);
                setCoordinates([
                  e.features[0].geometry.coordinates[1],
                  e.features[0].geometry.coordinates[0]
                ]);
              }}
              onClear={() => setSearchInput("")}
              placeholder="Search Location"
            />
          </div>
          <Button
            onClick={handleLocationSearch}
            className={`rounded-r-xl rounded-l-none border-l-0 border-primary-400 shadow-none border hover:bg-primary-700 hover:text-primary-50 cursor-pointer`}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Minimum Price Selector */}
        <div className="flex gap-1">
          <Select
            value={filters.priceRange[0]?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange("priceRange", value, true)
            }>
            <SelectTrigger className="rounded-xl border-primary-400! focus-visible:ring-0 cursor-pointer">
              <SelectValue>
                &#8377;{formatPriceValue(filters.priceRange[0], true)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any" className="cursor-pointer">
                Any Min Price
              </SelectItem>
              {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem
                  key={price}
                  value={price.toString()}
                  className="cursor-pointer">
                  &#8377;{price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Maximum Price Selector */}
        <div className="flex gap-1">
          <Select
            value={filters.priceRange[1]?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange("priceRange", value, false)
            }>
            <SelectTrigger className="rounded-xl border-primary-400! focus-visible:ring-0 cursor-pointer">
              <SelectValue>
                &lt; &#8377;{formatPriceValue(filters.priceRange[1], false)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any" className="cursor-pointer">
                Any Max Price
              </SelectItem>
              {[1000, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem
                  key={price}
                  value={price.toString()}
                  className="cursor-pointer">
                  &lt; &#8377;{price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds */}
        <div className="flex gap-1">
          <Select
            value={filters.beds}
            onValueChange={(value) => handleFilterChange("beds", value, null)}>
            <SelectTrigger className="rounded-xl border-primary-400! focus-visible:ring-0 cursor-pointer">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any" className="cursor-pointer">
                Any Beds
              </SelectItem>
              <SelectItem value="1" className="cursor-pointer">
                1+ bed
              </SelectItem>
              <SelectItem value="2" className="cursor-pointer">
                2+ beds
              </SelectItem>
              <SelectItem value="3" className="cursor-pointer">
                3+ beds
              </SelectItem>
              <SelectItem value="4" className="cursor-pointer">
                4+ beds
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Baths */}
        <div className="flex gap-1">
          {/* Baths */}
          <Select
            value={filters.baths}
            onValueChange={(value) => handleFilterChange("baths", value, null)}>
            <SelectTrigger className="rounded-xl border-primary-400! focus-visible:ring-0 cursor-pointer">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any" className="cursor-pointer">
                Any Baths
              </SelectItem>
              <SelectItem value="1" className="cursor-pointer">
                1+ bath
              </SelectItem>
              <SelectItem value="2" className="cursor-pointer">
                2+ baths
              </SelectItem>
              <SelectItem value="3" className="cursor-pointer">
                3+ baths
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <Select
          value={filters.propertyType || "any"}
          onValueChange={(value) =>
            handleFilterChange("propertyType", value, null)
          }>
          <SelectTrigger className="rounded-xl border-primary-400! focus-visible:ring-0 cursor-pointer">
            <SelectValue placeholder="Home Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="any" className="cursor-pointer">
              Any Property Type
            </SelectItem>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type} className="cursor-pointer">
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode */}
      <div className="hidden lg:flex justify-between items-center gap-4 p-2">
        <div className="flex border rounded-xl">
          <Button
            variant="ghost"
            className={cn(
              "px-3 py-1 rounded-none rounded-l-xl hover:bg-primary-600 hover:text-primary-50",
              viewMode === "list" ? "bg-primary-700 text-primary-50" : ""
            )}
            onClick={() => dispatch(setViewMode("list"))}>
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "px-3 py-1 rounded-none rounded-r-xl hover:bg-primary-600 hover:text-primary-50",
              viewMode === "grid" ? "bg-primary-700 text-primary-50" : ""
            )}
            onClick={() => dispatch(setViewMode("grid"))}>
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

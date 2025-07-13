"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import PropertyCard from "@/components/PropertyCard";
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from "@/state/api";

export default function ManagerProperties() {
  const { data: authUser } = useGetAuthUserQuery();

  const {
    data: managerProperties,
    isLoading,
    isError
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId
  });

  if (isError) {
    return <div className="text-center">Failed to fetch your properties.</div>;
  }

  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {managerProperties?.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={false}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/managers/properties/${property.id}`}
            />
          ))}
        </div>
      )}
      {!isLoading &&
        (!managerProperties || managerProperties?.length === 0) && (
          <div className="text-center mt-8">
            You don&apos;t manage any properties.
          </div>
        )}
    </div>
  );
}

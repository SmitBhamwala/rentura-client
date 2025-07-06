"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
} from "@/state/api";

export default function Favorites() {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );

  const {
    data: favoriteProperties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(
    {
      favoriteIds: tenant?.favorites.map((fav: { id: number }) => fav.id),
    },
    { skip: !tenant?.favorites || tenant?.favorites.length === 0 }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center">Failed to fetch favorite properties.</div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProperties?.map((property) => (
          <div key={property.id} className="property-card">
            {property.name}
          </div>
        ))}
      </div>
    </div>
  );
}

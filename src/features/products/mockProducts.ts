export type Product = {
  id: string;
  name: string;
  artist: string; // fikcyjna marka / „autor”
  price: number;
  description: string;
  image?: string; // stock image (zawsze obecny)
};

/**
 * UI w aplikacji bazuje na typie Product (powyżej).
 * Dane NIE są już trzymane jako stały mock – są pobierane z backendu (SQL Server + API).
 *
 * Zostawiamy export `mockProducts` tylko dla kompatybilności importów (np. testy/stare ekrany),
 * ale w runtime nie powinno się z niego korzystać.
 */
export const mockProducts: Product[] = [];

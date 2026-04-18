import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";

interface Store {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
}

const STORES: Store[] = [
  {
    id: "1",
    name: "Seoul Cheongdam",
    slug: "seoul-cheongdam",
    city: "Seoul, Korea",
    address: "117 Apgujeong-ro, Gangnam-gu, Seoul",
    hours: "Mon – Sat 11:00 – 20:00",
    phone: "+82 2 0000 0000",
  },
  {
    id: "2",
    name: "Seoul Lotte World Tower",
    slug: "seoul-lotte-world-tower",
    city: "Seoul, Korea",
    address: "300 Olympic-ro, Songpa-gu, Seoul",
    hours: "Mon – Sun 10:30 – 22:00",
    phone: "+82 2 0000 0001",
  },
  {
    id: "3",
    name: "Busan Shinsegae",
    slug: "busan-shinsegae",
    city: "Busan, Korea",
    address: "1-2 Jungang-daero, Jung-gu, Busan",
    hours: "Mon – Sun 10:30 – 20:30",
    phone: "+82 51 0000 0000",
  },
];

export function StoreList(): React.JSX.Element {
  return (
    <div className="space-y-8">
      {STORES.map((store) => (
        <Link
          key={store.id}
          href={`/offline-store/${store.slug}`}
          className="block group"
        >
          <div className="border-t border-byredo-gray-200 pt-6 pb-6 space-y-3 hover:border-byredo-black transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm tracking-wider uppercase group-hover:text-byredo-gray-500 transition-colors">
                  {store.name}
                </h3>
                <p className="text-[10px] tracking-widest uppercase text-byredo-gray-400 mt-0.5">
                  {store.city}
                </p>
              </div>
              <span className="text-[10px] tracking-widest uppercase text-byredo-gray-400 group-hover:text-byredo-black transition-colors">
                →
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-xs text-byredo-gray-500">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-byredo-gray-500">
                <Clock size={12} className="shrink-0" />
                <span>{store.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-byredo-gray-500">
                <Phone size={12} className="shrink-0" />
                <span>{store.phone}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

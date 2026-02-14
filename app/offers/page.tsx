import { Percent } from "lucide-react";

const offers = [
    { title: "Bakery Section", discount: "25%", desc: "Light, buttery croissants baked fresh every morning.", icon: "🥐", color: "bg-brand-orange" },
    { title: "Dairy Products", discount: "20%", desc: "Rich and creamy cheddar cheese, perfect for sandwiches.", icon: "🥛", color: "bg-brand-orange" },
    { title: "Meat & Poultry", discount: "18%", desc: "Freshly minced beef, ideal for kofta and burgers.", icon: "🍖", color: "bg-brand-orange" },
    { title: "Fruits & Vegetables", discount: "10%", desc: "Crisp, sweet carrots perfect for salads.", icon: "🍎", color: "bg-primary-brown/10 text-primary-brown" }, // Variant example
];

export default function OffersPage() {
    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-fredoka font-bold text-primary-brown mb-8 flex items-center gap-3">
                <Percent className="text-brand-orange" size={32} />
                Special Offers
            </h1>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
                {offers.map((offer, index) => (
                    <div key={index} className="bg-brand-orange rounded-3xl p-6 text-white shadow-md flex items-center gap-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                        {/* Icon Box */}
                        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl shrink-0 backdrop-blur-sm">
                            {offer.icon}
                        </div>

                        <div className="flex-1 z-10">
                            <h2 className="text-2xl font-bold font-fredoka mb-1">{offer.title}</h2>
                            <p className="text-white/90 leading-snug">{offer.desc}</p>
                        </div>

                        <div className="font-fredoka font-bold text-6xl text-white/20 group-hover:text-white/40 transition-colors">
                            {offer.discount}
                        </div>

                        {/* Decorative Background Circles */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

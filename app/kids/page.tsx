import { Gamepad2, Lock } from "lucide-react";

export default function KidsPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-8">
                <Gamepad2 size={120} className="text-brand-orange opacity-20" />
                <Lock size={48} className="text-primary-brown absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <h1 className="text-4xl font-fredoka font-bold text-primary-brown mb-2">Kids Mode</h1>
            <p className="text-xl text-primary-brown/60 mb-8 max-w-md">
                This section is locked. Games and entertainment for kids coming soon!
            </p>

            <button className="bg-primary-brown/10 text-primary-brown px-8 py-3 rounded-xl font-bold hover:bg-primary-brown/20 transition-colors">
                Parental Gate (Simulated)
            </button>
        </div>
    );
}

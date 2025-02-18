import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
<div className="relative h-[600px] overflow-hidden">
  <img 
    src="https://as1.ftcdn.net/v2/jpg/02/38/73/76/1000_F_238737634_xLkb4LQ0FtLZcF4TEWKXZ5O23vSlp5Oc.jpg"
    alt="Motocross"
    className="absolute inset-0 w-full h-full object-cover object-center md:object-[50%_20%]"
  />
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <div className="text-center text-white">
      <h1 className="text-5xl font-bold mb-6">
        Bienvenue au Circuit de Bellefontaine
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Découvrez nos circuits de motocross et supercross. 
        Réservez votre session dès maintenant !
      </p>
      <Link to="/reserver" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors inline-block">
        Réserver maintenant
      </Link>
    </div>
  </div>
</div>


        {/* Circuits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Circuits</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Circuit Motocross</h3>
                <p className="text-gray-600 mb-6">
                  Un circuit technique de 1920 mètres avec des obstacles variés.
                </p>
                <Link to="/reserver" className="text-primary hover:text-primary/90 font-semibold">
                  Découvrir
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Circuit Supercross</h3>
                <p className="text-gray-600 mb-6">
                  Un tracé de 590 mètres avec des enchainements rapides et techniques.
                </p>
                <Link to="/reserver" className="text-primary hover:text-primary/90 font-semibold">
                  Découvrir
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Prêt à rouler ?</h2>
            <p className="text-xl mb-8">
              Réservez votre créneau dès maintenant et profitez de nos circuits !
            </p>
            <Link to="/reserver" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md transition-colors inline-block">
              Réserver un créneau
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

const Circuits = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Nos Circuits</h1>
        
        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Circuit Motocross */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="h-[400px] bg-[url('https://cdn.pixabay.com/photo/2023/06/22/02/25/motocross-8080377_1280.jpg')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-4xl font-bold text-white mb-2">Circuit Motocross</h2>
                <p className="text-white/90 text-lg">Un circuit technique pour tous les niveaux</p>
              </div>
            </div>
            <div className="p-8">
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg leading-relaxed mb-6">
                  Un circuit technique de 1.5km avec des obstacles variés pour tous les niveaux. 
                  Profitez de nos whoops, tables, doubles et sections techniques pour améliorer votre pilotage.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-t border-gray-100">
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Longueur</p>
                    <p>1.5 km</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Difficulté</p>
                    <p>Intermédiaire</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Type de sol</p>
                    <p>Terre battue</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Obstacles</p>
                    <p>Tables, Whoops, Doubles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Circuit Supercross */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="h-[400px] bg-[url('https://images.pexels.com/photos/217872/pexels-photo-217872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-4xl font-bold text-white mb-2">Circuit Supercross</h2>
                <p className="text-white/90 text-lg">Une expérience indoor intense</p>
              </div>
            </div>
            <div className="p-8">
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg leading-relaxed mb-6">
                  Un tracé indoor spectaculaire avec des enchainements rapides et techniques. 
                  Des sections rythmées et des virages relevés pour une expérience intense.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-t border-gray-100">
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Longueur</p>
                    <p>800 m</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Difficulté</p>
                    <p>Avancé</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Type de sol</p>
                    <p>Terre préparée</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-primary">Spécificités</p>
                    <p>Virages relevés, Rythmiques</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circuits;

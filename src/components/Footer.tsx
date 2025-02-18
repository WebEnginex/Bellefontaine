const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <h4 className="text-lg font-bold mb-2">Contact</h4>
            <p className="text-gray-300">Email: motocrossavesnois@gmail.com</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Horaires</h4>
            <p className="text-gray-300">Mercredi et samedi 13h - 18h.</p>
            <p className="text-gray-300">Jeudi et dimanche, selon conditions.</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-300">
          <p>&copy; 2024 Circuit de Bellefontaine. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

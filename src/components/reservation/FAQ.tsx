import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => (
  <div className="mt-16">
    <h2 className="text-2xl font-bold mb-8">Questions Fréquentes</h2>
    <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md">
      <AccordionItem value="item-1">
        <AccordionTrigger className="px-6">
          Quel équipement est nécessaire ?
        </AccordionTrigger>
        <AccordionContent className="px-6">
        Pour votre sécurité, il est obligatoire de porter un casque homologué, des gants, des bottes de moto, une tenue adaptée (pantalon et maillot de cross), ainsi qu'une protection frontale et dorsale homologuée.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="px-6">
          Puis-je annuler ma réservation ?
        </AccordionTrigger>
        <AccordionContent className="px-6">
        Les annulations sont possibles via l'espace "Mon compte". Pour toute modification, vous pouvez nous contacter par email ou via la page "Contact".
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="px-6">
          Quel est le niveau requis ?
        </AccordionTrigger>
        <AccordionContent className="px-6">
        Les circuits de motocross et de supercross sont conçus pour les pilotes ayant un niveau compétition.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

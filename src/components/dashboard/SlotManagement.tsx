import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Label,
  Input,
  toast,
} from "@/components/ui";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { format, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://circuitdebellefontaine.fr' : 'http://localhost:3001';

interface Slot {
  id: string;
  date: string;
  circuit_1_capacity: number;
  circuit_2_capacity: number;
  circuit_1_available: number;
  circuit_2_available: number;
  created_at: string;
  updated_at: string;
}

export const SlotManagement = () => {
  const queryClient = useQueryClient();
  useRealtimeUpdates();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    circuit_1_capacity: 20,
    circuit_2_capacity: 20,
  });
  const [cancellationReason, setCancellationReason] = useState("");

  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("slots")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data as Slot[];
    },
  });

  const createSlotMutation = useMutation({
    mutationFn: async (newSlot: Omit<Slot, "id" | "created_at" | "updated_at" | "circuit_1_available" | "circuit_2_available">) => {
      // Vérifier si la date n'est pas dépassée
      if (isBefore(new Date(newSlot.date), startOfDay(new Date()))) {
        throw new Error("Impossible de créer un créneau pour une date passée");
      }

      // Vérifier si un créneau existe déjà pour cette date
      const { data: existingSlots, error: searchError } = await supabase
        .from("slots")
        .select("id")
        .eq("date", newSlot.date)
        .limit(1);

      if (searchError) {
        throw new Error("Erreur lors de la vérification de la date");
      }

      if (existingSlots && existingSlots.length > 0) {
        throw new Error("Un créneau existe déjà pour cette date");
      }

      const { data, error } = await supabase
        .from("slots")
        .insert([{
          ...newSlot,
          circuit_1_available: newSlot.circuit_1_capacity,
          circuit_2_available: newSlot.circuit_2_capacity,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      setIsCreateDialogOpen(false);
      setNewSlot({
        date: format(new Date(), 'yyyy-MM-dd'),
        circuit_1_capacity: 20,
        circuit_2_capacity: 20,
      });
      toast({
        title: "Succès",
        description: "Le créneau a été créé avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSlotMutation = useMutation({
    mutationFn: async (slot: Slot) => {
      // Vérifier si la date n'est pas dépassée
      if (isBefore(new Date(slot.date), startOfDay(new Date()))) {
        throw new Error("Impossible de modifier un créneau pour une date passée");
      }

      // Calculer le nombre de places déjà réservées
      const placesReserveesCircuit1 = slot.circuit_1_capacity - slot.circuit_1_available;
      const placesReserveesCircuit2 = slot.circuit_2_capacity - slot.circuit_2_available;

      // Vérifier que la nouvelle capacité n'est pas inférieure au nombre de places réservées
      if (slot.circuit_1_capacity < placesReserveesCircuit1) {
        throw new Error(`Impossible de réduire la capacité du circuit 1 en dessous de ${placesReserveesCircuit1} places (places déjà réservées)`);
      }
      if (slot.circuit_2_capacity < placesReserveesCircuit2) {
        throw new Error(`Impossible de réduire la capacité du circuit 2 en dessous de ${placesReserveesCircuit2} places (places déjà réservées)`);
      }

      // Calculer le nouveau nombre de places disponibles
      // Places disponibles = nouvelle capacité - places déjà réservées
      const newCircuit1Available = slot.circuit_1_capacity - placesReserveesCircuit1;
      const newCircuit2Available = slot.circuit_2_capacity - placesReserveesCircuit2;

      const { data, error } = await supabase
        .from("slots")
        .update({
          date: slot.date,
          circuit_1_capacity: slot.circuit_1_capacity,
          circuit_2_capacity: slot.circuit_2_capacity,
          circuit_1_available: newCircuit1Available,
          circuit_2_available: newCircuit2Available,
        })
        .eq("id", slot.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      setIsEditDialogOpen(false);
      setSelectedSlot(null);
      toast({
        title: "Succès",
        description: "Le créneau a été modifié avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (params: { id: string; reason: string }) => {
      try {
        // 1. Récupérer d'abord les réservations pour ce créneau
        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("user_id")
          .eq("slot_id", params.id);

        if (bookingsError) throw bookingsError;

        if (!bookings || bookings.length === 0) {
          // Pas de réservations, on peut supprimer directement
          const { error } = await supabase
            .from("slots")
            .delete()
            .eq("id", params.id);

          if (error) throw error;
          return;
        }

        // 2. Récupérer les emails des utilisateurs
        const userIds = bookings.map(b => b.user_id);
        const { data: users, error: usersError } = await supabase
          .from("profiles")  // Utilisation de la table profiles au lieu de users
          .select("email")
          .in("id", userIds);

        if (usersError) throw usersError;

        // 3. Envoyer les emails de notification
        if (users && users.length > 0) {
          const emailPromises = users.map(user => 
            fetch(`${API_BASE_URL}/api/send-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: user.email,
                templateId: "d-1dd66d2ec71f4782b9bdcbfcf1e302e1",
                dynamicTemplateData: {
                  date: selectedSlot?.date ? format(new Date(selectedSlot.date), "dd MMMM yyyy", { locale: fr }) : "",
                  reason: params.reason
                }
              })
            }).then(response => {
              if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
              }
              return response.json();
            })
          );

          await Promise.all(emailPromises);
        }

        // 4. Supprimer le créneau
        const { error } = await supabase
          .from("slots")
          .delete()
          .eq("id", params.id);

        if (error) throw error;
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      setIsDeleteDialogOpen(false);
      setSelectedSlot(null);
      toast({
        title: "Succès",
        description: "Le créneau a été supprimé avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des créneaux</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Ajouter un créneau
          </Button>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Places Motocross</TableHead>
                  <TableHead>Places Supercross</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots?.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>
                      {format(new Date(slot.date), "dd MMMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {slot.circuit_1_available} / {slot.circuit_1_capacity}
                    </TableCell>
                    <TableCell>
                      {slot.circuit_2_available} / {slot.circuit_2_capacity}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un créneau</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
                value={newSlot.date}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="circuit_1_capacity">Places Motocross</Label>
                <Input
                  id="circuit_1_capacity"
                  type="number"
                  min="0"
                  value={newSlot.circuit_1_capacity}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      circuit_1_capacity: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="circuit_2_capacity">Places Supercross</Label>
                <Input
                  id="circuit_2_capacity"
                  type="number"
                  min="0"
                  value={newSlot.circuit_2_capacity}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      circuit_2_capacity: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => createSlotMutation.mutate(newSlot)}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le créneau</DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={selectedSlot.date}
                  onChange={(e) =>
                    setSelectedSlot({
                      ...selectedSlot,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-circuit_1_capacity">
                    Places Motocross (minimum : {selectedSlot.circuit_1_capacity - selectedSlot.circuit_1_available} places réservées)
                  </Label>
                  <Input
                    id="edit-circuit_1_capacity"
                    type="number"
                    min={selectedSlot.circuit_1_capacity - selectedSlot.circuit_1_available}
                    value={selectedSlot.circuit_1_capacity}
                    onChange={(e) => {
                      const newCapacity = parseInt(e.target.value);
                      const placesReservees = selectedSlot.circuit_1_capacity - selectedSlot.circuit_1_available;
                      
                      // Mettre à jour la capacité et recalculer les places disponibles
                      setSelectedSlot({
                        ...selectedSlot,
                        circuit_1_capacity: newCapacity,
                        // Nouvelle capacité - places réservées = nouvelles places disponibles
                        circuit_1_available: newCapacity - placesReservees,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-circuit_2_capacity">
                    Places Supercross (minimum : {selectedSlot.circuit_2_capacity - selectedSlot.circuit_2_available} places réservées)
                  </Label>
                  <Input
                    id="edit-circuit_2_capacity"
                    type="number"
                    min={selectedSlot.circuit_2_capacity - selectedSlot.circuit_2_available}
                    value={selectedSlot.circuit_2_capacity}
                    onChange={(e) => {
                      const newCapacity = parseInt(e.target.value);
                      const placesReservees = selectedSlot.circuit_2_capacity - selectedSlot.circuit_2_available;
                      
                      // Mettre à jour la capacité et recalculer les places disponibles
                      setSelectedSlot({
                        ...selectedSlot,
                        circuit_2_capacity: newCapacity,
                        // Nouvelle capacité - places réservées = nouvelles places disponibles
                        circuit_2_available: newCapacity - placesReservees,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => selectedSlot && updateSlotMutation.mutate(selectedSlot)}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le créneau</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible.
            </AlertDialogDescription>
            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">Motif de l'annulation</Label>
              <Input
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Veuillez indiquer le motif de l'annulation"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCancellationReason("");
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedSlot) {
                  deleteSlotMutation.mutate({ 
                    id: selectedSlot.id, 
                    reason: cancellationReason 
                  });
                  setIsDeleteDialogOpen(false);
                  setCancellationReason("");
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

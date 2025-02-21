import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
export const useRealtimeUpdates = () => {
    const queryClient = useQueryClient();
    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3;
        let channel = null;
        const setupChannel = async () => {
            try {
                if (channel) {
                    await supabase.removeChannel(channel);
                }
                channel = supabase
                    .channel('schema-db-changes')
                    .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'slots'
                }, () => {
                    queryClient.invalidateQueries({
                        queryKey: ['slots'],
                    });
                })
                    .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'bookings'
                }, () => {
                    queryClient.invalidateQueries({
                        queryKey: ['slots'],
                    });
                });
                try {
                    await channel.subscribe();
                    console.log('Connexion réussie à Supabase realtime');
                    retryCount = 0;
                }
                catch (subscribeError) {
                    throw new Error(`Erreur lors de la souscription au canal: ${subscribeError}`);
                }
            }
            catch (error) {
                console.error('Erreur de connexion à Supabase realtime:', error);
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Nouvelle tentative de connexion (essai ${retryCount}/${maxRetries})...`);
                    setTimeout(setupChannel, 2000 * retryCount);
                }
            }
        };
        setupChannel();
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [queryClient]);
};

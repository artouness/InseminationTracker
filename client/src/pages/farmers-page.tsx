import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Farmer, InsertFarmer, insertFarmerSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function FarmersPage() {
  const { toast } = useToast();
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: farmers } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const form = useForm<InsertFarmer>({
    resolver: zodResolver(insertFarmerSchema),
    defaultValues: {
      fullName: "",
      address: "",
      phone: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFarmer) => {
      const res = await apiRequest("POST", "/api/farmers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Succès",
        description: "L'éleveur a été ajouté avec succès",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertFarmer & { id: number }) => {
      const { id, ...rest } = data;
      const res = await apiRequest("PATCH", `/api/farmers/${id}`, rest);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      setIsDialogOpen(false);
      setSelectedFarmer(null);
      form.reset();
      toast({
        title: "Succès",
        description: "L'éleveur a été mis à jour avec succès",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/farmers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      toast({
        title: "Succès",
        description: "L'éleveur a été supprimé avec succès",
      });
    },
  });

  const onSubmit = (data: InsertFarmer) => {
    if (selectedFarmer) {
      updateMutation.mutate({ ...data, id: selectedFarmer.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    form.reset(farmer);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet éleveur ?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Éleveurs</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedFarmer(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un éleveur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedFarmer ? "Modifier l'éleveur" : "Ajouter un éleveur"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {selectedFarmer ? "Mettre à jour" : "Ajouter"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom complet</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers?.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell>{farmer.fullName}</TableCell>
                <TableCell>{farmer.address}</TableCell>
                <TableCell>{farmer.phone}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(farmer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(farmer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

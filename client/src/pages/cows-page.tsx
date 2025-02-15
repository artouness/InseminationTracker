import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cow, Farm, Farmer, InsertCow, insertCowSchema } from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function CowsPage() {
  const { toast } = useToast();
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cows } = useQuery<Cow[]>({
    queryKey: ["/api/cows"],
  });

  const { data: farmers } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const { data: farms } = useQuery<Farm[]>({
    queryKey: ["/api/farms"],
  });

  const form = useForm<InsertCow>({
    resolver: zodResolver(insertCowSchema),
    defaultValues: {
      nationalId: "",
      ownerId: 0,
      farmId: 0,
      breed: "",
      birthDate: new Date().toISOString().split('T')[0],
      lastCalvingDate: undefined,
      father: "",
      mother: "",
      origin: "",
      bullBreed: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCow) => {
      const res = await apiRequest("POST", "/api/cows", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cows"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Succès",
        description: "La vache a été ajoutée avec succès",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCow) => {
      const res = await apiRequest("PATCH", `/api/cows/${data.nationalId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cows"] });
      setIsDialogOpen(false);
      setSelectedCow(null);
      form.reset();
      toast({
        title: "Succès",
        description: "La vache a été mise à jour avec succès",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (nationalId: string) => {
      await apiRequest("DELETE", `/api/cows/${nationalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cows"] });
      toast({
        title: "Succès",
        description: "La vache a été supprimée avec succès",
      });
    },
  });

  const onSubmit = (data: InsertCow) => {
    if (selectedCow) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (cow: Cow) => {
    setSelectedCow(cow);
    form.reset({
      ...cow,
      birthDate: new Date(cow.birthDate).toISOString().split('T')[0],
      lastCalvingDate: cow.lastCalvingDate 
        ? new Date(cow.lastCalvingDate).toISOString().split('T')[0]
        : undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (nationalId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette vache ?")) {
      deleteMutation.mutate(nationalId);
    }
  };

  const getFarmerName = (id: number) => {
    return farmers?.find(f => f.id === id)?.fullName || "N/A";
  };

  const getFarmAddress = (id: number) => {
    return farms?.find(f => f.id === id)?.address || "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Vaches</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedCow(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une vache
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedCow ? "Modifier la vache" : "Ajouter une vache"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro national</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Propriétaire</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un propriétaire" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {farmers?.map((farmer) => (
                            <SelectItem key={farmer.id} value={farmer.id.toString()}>
                              {farmer.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farmId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ferme</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une ferme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {farms?.map((farm) => (
                            <SelectItem key={farm.id} value={farm.id.toString()}>
                              {farm.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastCalvingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date du dernier vêlage</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="father"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Père</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mother"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mère</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origine</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bullBreed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race du taureau</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="col-span-2">
                  {selectedCow ? "Mettre à jour" : "Ajouter"}
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
              <TableHead>Numéro national</TableHead>
              <TableHead>Race</TableHead>
              <TableHead>Propriétaire</TableHead>
              <TableHead>Ferme</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Dernier vêlage</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cows?.map((cow) => (
              <TableRow key={cow.nationalId}>
                <TableCell>{cow.nationalId}</TableCell>
                <TableCell>{cow.breed}</TableCell>
                <TableCell>{getFarmerName(cow.ownerId)}</TableCell>
                <TableCell>{getFarmAddress(cow.farmId)}</TableCell>
                <TableCell>{new Date(cow.birthDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {cow.lastCalvingDate
                    ? new Date(cow.lastCalvingDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(cow)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cow.nationalId)}
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

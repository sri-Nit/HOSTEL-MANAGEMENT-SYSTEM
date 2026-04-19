import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import api from '@/services/api';

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  block: z.string().min(1, "Block is required"),
  floor: z.string().min(1, "Floor is required"),
  room: z.string().min(1, "Room is required"),
});

const ComplaintForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      description: "",
      block: "",
      floor: "",
      room: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // In a real app, we'd send this to the backend
      // await api.post('/complaints', {
      //   category: values.category,
      //   description: values.description,
      //   location: { block: values.block, floor: values.floor, room: values.room }
      // });
      console.log("Form submitted:", values);
      showSuccess("Complaint submitted successfully (Mock)!");
      form.reset();
    } catch (error) {
      showError("Failed to submit complaint.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg border shadow-sm">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Carpentry">Carpentry</SelectItem>
                  <SelectItem value="Internet">Internet/WiFi</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="block"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block</FormLabel>
                <FormControl>
                  <Input placeholder="A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Input placeholder="101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the issue in detail..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit Complaint</Button>
      </form>
    </Form>
  );
};

export default ComplaintForm;
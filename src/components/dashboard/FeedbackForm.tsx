import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { Star } from 'lucide-react';

const formSchema = z.object({
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a rating",
  }),
  comment: z.string().min(5, "Feedback must be at least 5 characters"),
});

const FeedbackForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Mock API call
      console.log("Feedback submitted:", values);
      showSuccess("Thank you for your feedback!");
      form.reset();
    } catch (error) {
      showError("Failed to submit feedback.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">System Feedback</CardTitle>
        <CardDescription>How was your experience with HCMS today?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <FormItem key={val} className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={val.toString()} id={`r${val}`} className="sr-only" />
                          </FormControl>
                          <FormLabel 
                            htmlFor={`r${val}`}
                            className={`cursor-pointer p-1 rounded-full transition-colors ${
                              field.value === val.toString() ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us what we can improve..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" className="w-full">Submit Feedback</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
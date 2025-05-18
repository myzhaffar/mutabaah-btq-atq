import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "@/components/layout/AuthLayout";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  userType: z.enum(["teacher", "parent"], {
    required_error: "Please select a user type",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "teacher",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    console.log("Login form submitted:", values);
    
    // In a real app with Supabase, you would authenticate the user here
    // For now, we'll navigate based on the selected user type
    if (values.userType === "teacher") {
      navigate("/teacher/students");
    } else {
      navigate("/parent/dashboard");
    }
  };

  return (
    <AuthLayout
      title="Quran Progress Monitor"
      subtitle="Track hafalan and tilawah progress for elementary school students"
    >
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full bg-gray-100 p-1">
          <TabsTrigger 
            value="login" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="about" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">Welcome Back</h2>
            <p className="text-gray-500 text-sm">
              Sign in to access the Quran progress monitoring system
            </p>
          </div>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="input-kid">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher / Administrator</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your role determines what features you can access
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        className="input-kid"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="input-kid"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full rounded-full bg-gradient-to-r from-kid-green to-kid-teal text-white hover:opacity-90 mt-6"
              >
                Sign In
              </Button>
            </form>
          </Form>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="text-sm text-gray-500"
            >
              Back to Home
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-kid-green/10 to-kid-teal/10">
              <CardTitle className="bg-gradient-to-r from-kid-green to-kid-teal bg-clip-text text-transparent">Quran Progress Monitor</CardTitle>
              <CardDescription>
                A simple system to track students' Quran memorization and recitation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-kid-green/20 flex items-center justify-center text-kid-green">👨‍🏫</span>
                  For Teachers
                </h3>
                <ul className="list-disc pl-5 text-sm space-y-2 mt-3 text-gray-600">
                  <li>Add and manage student profiles</li>
                  <li>Record daily hafalan and tilawah progress</li>
                  <li>View comprehensive reports for all students</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-kid-blue/20 flex items-center justify-center text-kid-blue">👪</span>
                  For Parents
                </h3>
                <ul className="list-disc pl-5 text-sm space-y-2 mt-3 text-gray-600">
                  <li>View your child's Quran learning progress</li>
                  <li>Track hafalan and tilawah achievements</li>
                  <li>Stay informed about daily activities</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("login")}
                className="rounded-full mr-2"
              >
                Back to Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="rounded-full"
              >
                Back to Home
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Index;

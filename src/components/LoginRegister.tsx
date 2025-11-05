import { Building2, GraduationCap, Shield, User, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LoginRegisterProps {
  onLogin: (userType: string) => void;
}

export function LoginRegister({ onLogin }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);

  const UserTypeCard = ({ 
    icon: Icon, 
    title, 
    description, 
    color, 
    userType 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    color: string;
    userType: string;
  }) => {
    // Each card has its own independent state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate passwords match in register mode
      if (!isLogin && password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      onLogin(userType);
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div
          className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`${userType}-email`}>Email</Label>
            <Input
              id={`${userType}-email`}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor={`${userType}-password`}>Password</Label>
            <Input
              id={`${userType}-password`}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <Label htmlFor={`${userType}-confirm`}>Confirm Password</Label>
              <Input
                id={`${userType}-confirm`}
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: color }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
        {isLogin && (
          <a
            href="#"
            className="text-xs text-gray-600 hover:underline mt-3 block text-center"
          >
            Forgot password?
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#0077B6] to-[#005f8f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-3">Welcome to NSS Care Network</h1>
          <p className="text-white/90">
            Choose your role to access your dashboard
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <UserTypeCard
            icon={User}
            title="Public User"
            description="Access blood donor search and health camps"
            color="#10B981"
            userType="public"
          />
          <UserTypeCard
            icon={Heart}
            title="NSS Volunteer"
            description="Access your volunteer dashboard and digital ID"
            color="#0077B6"
            userType="volunteer"
          />
          <UserTypeCard
            icon={GraduationCap}
            title="College Admin"
            description="Manage your NSS unit and volunteers"
            color="#0077B6"
            userType="college"
          />
          <UserTypeCard
            icon={Building2}
            title="Hospital Admin"
            description="Post blood requests and organize camps"
            color="#E63946"
            userType="hospital"
          />
          <UserTypeCard
            icon={Shield}
            title="Super Admin"
            description="National-level platform management"
            color="#8B5CF6"
            userType="admin"
          />
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl mx-auto">
          <h3 className="text-gray-900 mb-3">New to NSS Care Network?</h3>
          <p className="text-sm text-gray-700 mb-4">
            If you're a college NSS unit or hospital looking to join our network, please contact your
            state NSS coordinator for registration approval. Once approved, you'll receive your login credentials.
          </p>
          <Button variant="outline" className="border-[#0077B6] text-[#0077B6]">
            Contact State Coordinator
          </Button>
        </div>
      </div>
    </div>
  );
}

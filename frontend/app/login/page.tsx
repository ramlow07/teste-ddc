"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { LOGIN_MUTATION } from "@/lib/graphql/graphqlClient";
import { GraphQLClient } from "graphql-request";
import { useRouter } from "next/navigation";

interface LoginResponse {
  login: {
    token?: string;
    error?: {
      errors: {
        message: string;
        path: string[];
      }[];
    };
  };
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const client = new GraphQLClient("http://localhost:3001/graphql");

    const variables = {
      data: {
        email: formData.email,
        password: formData.password,
      },
    };

    try {
      const response = await client.request<LoginResponse>(
        LOGIN_MUTATION,
        variables
      );
      const loginResponse = response.login;

      if (loginResponse.error) {
        console.error("Erro no login:", loginResponse.error.errors);
        alert(
          loginResponse.error.errors
            .map((err: any) => `${err.path[0]}: ${err.message}`)
            .join("\n")
        );
      } else {
        console.log("Login bem-sucedido:", loginResponse.token);
        localStorage.setItem("token", loginResponse.token);
        router.push("/"); // redireciona pra main page
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro inesperado ao tentar fazer login.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your Admin Console</p>
        </div>

        {/* Login Form */}
        <Card className="p-8 shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="admin@console.com"
                className="h-12"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-12 text-base font-medium">
              <div className="flex items-center justify-center">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Demo Credentials:
            </p>
            <p className="text-sm text-blue-700">Email: admin@console.com</p>
            <p className="text-sm text-blue-700">Password: password123</p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Additional Links */}
        <div className="flex justify-center space-x-6 mt-6">
          <Link
            href="/help"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Help Center
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}

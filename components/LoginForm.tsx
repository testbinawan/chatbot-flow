"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AuthData } from '@/types/auth';
import { ResponseData } from '@/types/response';
import fetchJson from '@/lib/fetchJson';

interface LoginFormProps {
    onLoginSuccess: (user: any) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [host, setHost] = useState('http://localhost:8000');
    const [username, setUsername] = useState('dion');
    const [password, setPassword] = useState('dion');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            sessionStorage.setItem('url', host);

            const result: ResponseData = await fetchJson({
                method: 'post',
                endpoint: '/token',
                body: { username, password }
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message || 'Invalid credentials');
            }

            const data = result.data as AuthData;

            onLoginSuccess(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                    Enter your credentials to access the chatbot flow builder
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="host">Host</Label>
                            <Input
                                id="host"
                                type="text"
                                placeholder="172.31.0.116:8000"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
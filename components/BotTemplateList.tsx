"use client";

import React, { useState, useEffect } from 'react';
import { BotTemplateCard } from '@/components/BotTemplateCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponseData } from '@/types/response';
import { BotTemplateData } from '@/types/bot-template';
import fetchJson from '@/lib/fetchJson';
import { BotTemplateListTopBar } from '@/components/BotTemplateListTopBar';

interface BotTemplateListProps {
    onEditTemplate: (botTemplate: BotTemplateData) => void;
}

export function BotTemplateList({ onEditTemplate }: BotTemplateListProps) {
    const [botTemplates, setBotTemplates] = useState<BotTemplateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const perPage = 8;

    useEffect(() => {
        fetchTemplates();
    }, [currentPage]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);

            const result: ResponseData = await fetchJson({
                method: 'get',
                endpoint: `/bot_templates?page=${currentPage}&limit=${perPage}`
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message);
            }

            const total: number = result.total_data as number;
            const data = result.data as BotTemplateData[];

            setBotTemplates(data);
            setTotalData(total);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalData / perPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={fetchTemplates}>Retry</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <BotTemplateListTopBar onRefresh={fetchTemplates} />
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto py-8 px-4">
                    {botTemplates.length === 0 ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Card className="w-full max-w-md text-center">
                                <CardHeader>
                                    <CardTitle>No Templates Found</CardTitle>
                                    <CardDescription>
                                        There are no templates available at the moment.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {botTemplates.map((botTemplate) => (
                                    <BotTemplateCard
                                        key={botTemplate.id}
                                        botTemplate={botTemplate}
                                        onEdit={() => onEditTemplate(botTemplate)}
                                    />
                                ))}
                            </div>
                    
                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center mt-8">
                                <div className="text-sm text-gray-500">
                                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalData)} of {totalData} templates
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                    >
                                        Previous
                                    </Button>
                        
                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        // Only show first, last, current, and nearby pages
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return (
                                                <Button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        }
                          
                                        // Show ellipsis for skipped pages
                                        if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="flex items-center px-2">...</span>;
                                        }
                          
                                        return null;
                                    })}
                        
                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
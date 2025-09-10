"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ResponseData } from '@/types/response';
import { BotTemplateData } from '@/types/bot-template';
import fetchJson from '@/lib/fetchJson';

interface BotTemplateCardProps {
    botTemplate: BotTemplateData;
    onEdit: () => void;
}

export function BotTemplateCard({ botTemplate, onEdit }: BotTemplateCardProps) {
    const [isPublished, setIsPublished] = useState(botTemplate.is_active === 1);
    const [isUpdating, setIsUpdating] = useState(false);
  
    const media: { [key: number]: string } = {
        4: 'WhatsApp',
        18: 'Livechat'
    };

    const handlePublishToggle = async (checked: boolean) => {
        setIsUpdating(true);
        try {
            const result: ResponseData = await fetchJson({
                method: 'put',
                endpoint: `/bot_templates/${botTemplate.id}`,
                body: { is_active: checked === true ? 1 : 0 }
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message);
            }

            setIsPublished(checked);
        } catch (err) {
            console.error('Failed to update publish status:', err instanceof Error ? err.message : 'An unknown error occurred');
            // setIsPublished(!checked);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{botTemplate.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    Media {media[botTemplate.media_id]}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-sm text-gray-500 mb-2">
                    Created: {botTemplate.created}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    Last updated: {botTemplate.updated}
                </div>
        
                {/* Publish Status Switch */}
                <div className="flex items-center justify-between">
                    <Label htmlFor={`publish-switch-${botTemplate.id}`} className="text-sm font-medium">
                        Published
                    </Label>
                    <Switch
                        id={`publish-switch-${botTemplate.id}`}
                        checked={isPublished}
                        onCheckedChange={handlePublishToggle}
                        disabled={isUpdating}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={onEdit} className="w-full" disabled={isUpdating}>
                    Edit Template
                </Button>
            </CardFooter>
        </Card>
    );
}
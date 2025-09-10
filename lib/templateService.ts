import fetchJson from '@/lib/fetchJson';
import { TemplateData } from '@/types/template';
import { ResponseData } from '@/types/response';

export class TemplateService {
    static async fetchTemplates(page: number = 1, limit: number = 8): Promise<{ templates: TemplateData[], total: number }> {
        try {
            const result: ResponseData = await fetchJson({
                method: 'get',
                endpoint: `bot_templates?page=${page}&limit=${limit}`, // Adjust this endpoint based on your API
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message || 'Failed to fetch templates');
            }

            // If the data is an array, return it directly
            if (Array.isArray(result.data)) {
                return { templates: result.data as TemplateData[], total: result.data.length };
            }

            // If the data is an object with a templates property, return that
            if (result.data && typeof result.data === 'object' && 'templates' in result.data) {
                return { 
                    templates: result.data.templates as TemplateData[], 
                    total: (result.data as any).total || result.data.templates.length 
                };
            }

            // If no data, return empty array
            return { templates: [], total: 0 };
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }

    static async fetchTemplateById(id: number): Promise<TemplateData | null> {
        try {
            const result: ResponseData = await fetchJson({
                method: 'get',
                endpoint: `templates/${id}`, // Adjust this endpoint based on your API
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message || 'Failed to fetch template');
            }

            return result.data as TemplateData;
        } catch (error) {
            console.error(`Error fetching template with id ${id}:`, error);
            throw error;
        }
    }
  
    static async updateTemplatePublishStatus(id: number, published: boolean): Promise<boolean> {
        try {
            const result: ResponseData = await fetchJson({
                method: 'put',
                endpoint: `templates/${id}/publish`,
                body: { published }
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message || 'Failed to update template publish status');
            }

            return true;
        } catch (error) {
            console.error(`Error updating template publish status with id ${id}:`, error);
            throw error;
        }
    }
}
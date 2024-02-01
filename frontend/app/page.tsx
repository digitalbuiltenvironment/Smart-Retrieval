import Home from '@/app/components/ui/home/client-component';
import { Metadata } from 'next';

export const metadata: Metadata = {
    // Google Search Console HTML Tag Verification
    verification: {
        google: process.env.GSC_TAG_VERIFICATION,
        // Add more verification providers here. Refer: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#verification
    },
};

export default Home;
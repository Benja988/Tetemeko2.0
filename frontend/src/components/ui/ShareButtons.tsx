// @/components/ui/ShareButtons.tsx

interface ShareButtonsProps {
    url: string;
    title: string;
    description: string;
    variant?: 'small' | 'large';
}

export default function ShareButtons({ url, title, description, variant = 'small' }: ShareButtonsProps) {
    const shareData = {
        url,
        title,
        text: description
    };

    const handleShare = async (platform: string) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
                break;
            case 'native':
                if (navigator.share) {
                    navigator.share(shareData).catch(console.error);
                }
                break;
            default:
                break;
        }
    };

    const isSmall = variant === 'small';

    return (
        <div className={`flex ${isSmall ? 'space-x-2' : 'space-x-4'}`}>
            <button
                onClick={() => handleShare('twitter')}
                className={`rounded-full text-white bg-twitter hover:bg-twitter-dark transition-colors ${isSmall ? 'p-2' : 'p-3'}`}
                aria-label="Share on Twitter"
            >
                <svg className={isSmall ? 'h-4 w-4' : 'h-5 w-5'} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
            </button>

            <button
                onClick={() => handleShare('facebook')}
                className={`rounded-full text-white bg-facebook hover:bg-facebook-dark transition-colors ${isSmall ? 'p-2' : 'p-3'}`}
                aria-label="Share on Facebook"
            >
                <svg className={isSmall ? 'h-4 w-4' : 'h-5 w-5'} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
            </button>

            <button
                onClick={() => handleShare('linkedin')}
                className={`rounded-full text-white bg-linkedin hover:bg-linkedin-dark transition-colors ${isSmall ? 'p-2' : 'p-3'}`}
                aria-label="Share on LinkedIn"
            >
                <svg className={isSmall ? 'h-4 w-4' : 'h-5 w-5'} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
            </button>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                    onClick={() => handleShare('native')}
                    className={`rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors ${isSmall ? 'p-2' : 'p-3'}`}
                    aria-label="Share using native share dialog"
                >
                    <svg
                        className={isSmall ? 'h-4 w-4' : 'h-5 w-5'}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                </button>
            )}

        </div>
    );
}
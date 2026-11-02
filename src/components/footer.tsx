import { site } from "@/lib/site";

export default function Footer() {
    return (
        <footer id="footer" className="footer w-full min-h-10 flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
            <a
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex justify-center text-sm text-blue-600 hover:underline dark:text-blue-300"
                href={site.icpUrl}
            >
                {site.icp}
            </a>
        </footer>
    )
}

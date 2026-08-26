import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer id="footer" className="footer w-full min-h-10 flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
                <Link target="_blank" rel="noopener noreferrer nofollow" className="flex justify-center text-md hover:underline text-blue-400 dark:text-blue-300" href="https://beian.miit.gov.cn">皖ICP备2023018992号-1</Link>
            </footer>
        </>
    )
}

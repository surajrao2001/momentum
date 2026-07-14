export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <div className="mx-auto max-w-lg px-[22px] py-7 lg:max-w-xl lg:py-12">
                {children}
            </div>
        </div>
    );
}

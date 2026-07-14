export function StepIndicator({
    step,
    total = 4,
}: {
    step: number;
    total?: number;
}) {
    return (
        <div className="mb-6 flex gap-1.5">
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    className="h-1 rounded-sm transition-all"
                    style={{
                        width: i + 1 === step ? 20 : 6,
                        backgroundColor:
                            i + 1 === step
                                ? 'var(--color-primary)'
                                : 'rgba(255,255,255,0.12)',
                    }}
                />
            ))}
        </div>
    );
}

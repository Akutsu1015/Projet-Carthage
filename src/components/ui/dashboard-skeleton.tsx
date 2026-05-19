"use client";

export function DashboardSkeleton() {
    return (
        <div className="min-h-[calc(100vh-4rem)] animate-pulse">
            {/* Header skeleton */}
            <div className="border-b border-lyoko-blue/10 bg-gradient-to-br from-dark-surface to-dark-bg py-8">
                <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 lg:px-8">
                    <div className="h-20 w-20 rounded-full bg-white/[0.06]" />
                    <div className="flex-1">
                        <div className="mb-2 h-7 w-48 rounded-lg bg-white/[0.06]" />
                        <div className="mb-3 h-4 w-32 rounded bg-white/[0.04]" />
                        <div className="h-2.5 w-64 rounded-full bg-white/[0.05]" />
                    </div>
                </div>
            </div>

            {/* Stats skeleton */}
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                        >
                            <div className="mx-auto mb-3 h-6 w-6 rounded bg-white/[0.06]" />
                            <div className="mx-auto mb-2 h-8 w-16 rounded-lg bg-white/[0.06]" />
                            <div className="mx-auto h-3 w-12 rounded bg-white/[0.04]" />
                        </div>
                    ))}
                </div>

                {/* Content blocks skeleton */}
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="mb-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5"
                    >
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-4 w-4 rounded bg-white/[0.06]" />
                            <div className="h-4 w-32 rounded bg-white/[0.06]" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-12 rounded-xl bg-white/[0.03]" />
                            <div className="h-12 rounded-xl bg-white/[0.03]" />
                        </div>
                    </div>
                ))}

                {/* Modules skeleton */}
                <div className="mb-4 h-6 w-32 rounded-lg bg-white/[0.06]" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"
                        >
                            <div className="p-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-white/[0.06]" />
                                    <div>
                                        <div className="mb-1 h-4 w-20 rounded bg-white/[0.06]" />
                                        <div className="h-3 w-16 rounded bg-white/[0.04]" />
                                    </div>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/[0.05]" />
                            </div>
                            <div className="border-t border-white/5 px-5 py-3">
                                <div className="mx-auto h-4 w-20 rounded bg-white/[0.04]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

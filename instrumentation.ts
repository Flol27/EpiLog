// instrumentation.ts  ← Root des Projekts, neben package.json

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { initDB } = await import('@/lib/initDB')
        await initDB()
    }
}

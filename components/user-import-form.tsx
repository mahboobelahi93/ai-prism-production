// app/components/UserImportForm.tsx
'use client';

import { useState } from 'react';
import { Button } from './ui/button';

export default function UserImportForm() {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/import-users', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Upload failed:', error);
            setResult({ error: 'Upload failed' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto w-1/2 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Import Users from CSV</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        CSV File
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:rounded-md file:border-0
              file:bg-blue-50 file:px-4
              file:py-2 file:text-sm
              file:font-semibold file:text-primary
              hover:file:bg-blue-100"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    variant={"default"}
                    className="w-full rounded-md px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? 'Importing...' : 'Import Users'}
                </Button>
            </form>

            {result && (
                <div className="mt-6 rounded-md bg-gray-50 p-4">
                    <h3 className="mb-2 font-medium">Import Results</h3>
                    {result.error ? (
                        <p className="text-red-500">{result.error}</p>
                    ) : (
                        <>
                            <p>Total: {result.total}</p>
                            <p>Success: {result.successCount}</p>
                            <p>Errors: {result.errorCount}</p>
                            <details className="mt-2">
                                <summary className="cursor-pointer text-sm font-bold text-primary">
                                    Show details
                                </summary>
                                <pre className="mt-2 max-h-60 overflow-auto rounded bg-white p-2 text-xs">
                                    {JSON.stringify(result.results, null, 2)}
                                </pre>
                            </details>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
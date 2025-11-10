"use client";
import { getUploadPresignedURL } from "@/lib/aws.utils";
import { PresignedURLCache } from "@/types";
import React, { createContext, useCallback, useContext, useRef } from "react";

interface UploadFileContext {
    fetchUploadUrl: (
        fileName: string,
        container: string,
        fileType: string,
    ) => Promise<PresignedURLCache | null>;
    clearCache: () => void;
    uploadFileToS3Direct: (
        file: File,
        fileClassType: { label: string; container: string },
        currentFileId?: number,
    ) => Promise<string>;
}

const UploadFileContext = createContext<UploadFileContext>({} as UploadFileContext);

export const useUploadFileContext = () => {
    return useContext(UploadFileContext);
};

export const useUploadFile = () => {
    // For generating and caching the upload presigned url before actual upload
    const uploadUrlCache = useRef(new Map<string, PresignedURLCache>());
    const getUploadPresignedURLInProgress = useRef([] as string[]); // To prevent multiple requests for the same file
    const fetchUploadUrl = useCallback(
        async (fileName: string, container: string, fileType: string) => {
            const cacheKey = `${container}/${fileName}`;
            console.log("fetchUploadUrl", cacheKey, new Map(uploadUrlCache.current));
            if (uploadUrlCache.current.has(cacheKey)) {
                const cache = uploadUrlCache.current.get(cacheKey);
                if (cache && cache.expiry > Date.now()) {
                    console.log("cache hit", cache);
                    return cache;
                } else {
                    uploadUrlCache.current.delete(cacheKey);
                }
            }
            console.log("cache miss", cacheKey);

            // If the request is already in progress, return null (due to multiple rerenders, etc.)
            if (getUploadPresignedURLInProgress.current.includes(cacheKey)) return null;

            // If the request is not in progress, make the request
            getUploadPresignedURLInProgress.current.push(cacheKey);
            const response = await getUploadPresignedURL(fileName, container, fileType);
            if (response.success) {
                const cache: PresignedURLCache = {
                    url: response.url,
                    key: response.key,
                    expiry: response.expiry,
                };
                console.log("cache set", cache);
                uploadUrlCache.current.set(cacheKey, cache);
                getUploadPresignedURLInProgress.current.filter((key) => key !== cacheKey);
                return cache;
            }
            getUploadPresignedURLInProgress.current.filter((key) => key !== cacheKey);
            return null;
        },
        [],
    );

    const clearCache = useCallback(() => {
        uploadUrlCache.current.clear();
    }, []);

    const uploadFileToS3Direct = useCallback(
        async (
            file: File,
            fileClassType: { label: string; container: string },
            currentFileId?: number,
        ) => {
            const cache = await fetchUploadUrl(file.name, fileClassType.container, file.type);
            if (!cache) {
                throw new Error(`Failed to get presigned URL for ${file.name}`);
            }
            const uploadResponse = await fetch(cache.url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                    "Content-Disposition": `inline`,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error(
                    `Failed to upload ${file.name} to S3: ${uploadResponse.statusText}`,
                );
            }

            return JSON.stringify({
                id: currentFileId,
                file_class_type: fileClassType.label,
                name: file.name,
                key: cache.key,
                size: file.size,
                type: file.type,
            });
        },
        [],
    );

    const UploadFileContextProvider = useCallback(({ children }: { children: React.ReactNode }) => {
        return (
            <UploadFileContext.Provider
                value={{ fetchUploadUrl, clearCache, uploadFileToS3Direct }}
            >
                {children}
            </UploadFileContext.Provider>
        );
    }, []);

    return { uploadFileToS3Direct, UploadFileContextProvider };
};

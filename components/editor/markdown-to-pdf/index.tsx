"use client";

import React, { FC, useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { marked } from 'marked';
import { parseMarkdownToPDF } from './parseHtmlToPDF';

// Styles for PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    section: {
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
    },
});

interface MarkdownToPDFProps {
    markdown: string;
}

const MarkdownToPDF: FC<MarkdownToPDFProps> = ({ markdown }) => {
    const textContent = useMemo(() => {
        try {
            const htmlContent = marked(markdown || '');
            // return htmlContent.replace(/<[^>]+>/g, ''); // Strip HTML tags
            return parseMarkdownToPDF(htmlContent)
        } catch (err) {
            console.error('Markdown parsing failed:', err);
            return 'Error parsing content';
        }
    }, [markdown]);

    console.log("textContent : ", textContent);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>{textContent}</View>
            </Page>
        </Document>
    );
};

export default MarkdownToPDF;

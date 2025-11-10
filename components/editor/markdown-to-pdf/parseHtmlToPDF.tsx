"use client";
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import { marked } from 'marked';

// Styles
const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 12 },
    heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    text: { fontSize: 16, marginBottom: 4 },
    list: { marginLeft: 12, marginBottom: 8 },
    listItem: { fontSize: 12, marginBottom: 2 },
    image: { marginVertical: 10, width: 400, height: 200 },
    code: {
        fontFamily: 'Courier',
        fontSize: 12,
        backgroundColor: '#f0f0f0',
        padding: 4,
        borderRadius: 4,
    },
});

// Helper to parse markdown and convert to react-pdf components
export const parseMarkdownToPDF = (markdown: string) => {
    const htmlContent = marked(markdown);
    const Br = () => <Text>{"\n"}</Text>;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const renderNodes = (nodes: NodeListOf<ChildNode>): React.ReactNode[] => {
        return Array.from(nodes).map((node, index) => {
            switch (node.nodeName) {
                case 'H1':
                case 'H2':
                    return (
                        <Text key={index} style={styles.heading}>
                            {node.textContent}
                        </Text>
                    );
                case 'P':
                    return (
                        <Text key={index} style={styles.text}>
                            {node.textContent?.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {"\n"}
                                </React.Fragment>
                            ))}
                        </Text>
                    );
                case '#text':
                    console.log("#text : ", node)
                    return <Br key={index} />;
                case 'UL':
                    return (
                        <View key={index} style={styles.list}>
                            {renderNodes(node.childNodes)}
                        </View>
                    );
                case 'LI':
                    return (
                        <Text key={index} style={styles.listItem}>
                            • {node.textContent}
                        </Text>
                    );
                case 'STRONG':
                    return (
                        <Text key={index} style={{ fontWeight: 'bold' }}>
                            {node.textContent}
                        </Text>
                    );
                case 'CODE':
                    return (
                        <Text
                            key={index}
                            style={{ fontFamily: 'Courier', backgroundColor: '#f0f0f0', padding: 2 }}
                        >
                            {node.textContent}
                        </Text>
                    );
                case 'IMG':
                    const imgSrc = (node as HTMLImageElement).getAttribute('src'); // Use getAttribute for src
                    if (!imgSrc) return null; // Skip if no valid src
                    return (
                        <Image
                            key={index}
                            style={styles.image}
                            src={imgSrc}
                        />
                    );
                default:
                    return (
                        <Text key={index} style={styles.text}>
                            {node.textContent}
                        </Text>
                    );
            }
        });
    };

    return renderNodes(doc.body.childNodes);
};
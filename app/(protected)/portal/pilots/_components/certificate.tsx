import type React from "react"

interface CertificateProps {
    name: string
    course: string
    date: string
    score: number
}

const Certificate: React.FC<CertificateProps> = ({ name, course, date, score }) => {
    return (
        <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="800" height="600" fill="#F8FAFC" />
            <rect x="20" y="20" width="760" height="560" rx="10" fill="white" stroke="#0891B2" strokeWidth="2" />

            {/* Watermark */}
            <g opacity="0.15">
                {/* Logo */}
                <image
                    href="/favicon.ico"
                    x="300"
                    y="200"
                    width="200"
                    height="200"
                    preserveAspectRatio="xMidYMid meet"
                />
                {/* Organization Name */}
                <text
                    x="400"
                    y="440"
                    fontFamily="Arial, sans-serif"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#0891B2"
                    textAnchor="middle"
                >
                    AI-PRISM Alliance of Open-Access Pilots
                </text>
            </g>

            {/* Title */}
            <text
                x="400"
                y="80"
                fontFamily="Arial, sans-serif"
                fontSize="40"
                fontWeight="bold"
                fill="#0891B2"
                textAnchor="middle"
            >
                Certificate of Completion
            </text>

            {/* Content */}
            <text x="400" y="150" fontFamily="Arial, sans-serif" fontSize="24" fill="#334155" textAnchor="middle">
                This certifies that
            </text>
            <text
                x="400"
                y="200"
                fontFamily="Arial, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="#334155"
                textAnchor="middle"
            >
                {name}
            </text>
            <text x="400" y="250" fontFamily="Arial, sans-serif" fontSize="24" fill="#334155" textAnchor="middle">
                has successfully completed the course
            </text>
            <text
                x="400"
                y="300"
                fontFamily="Arial, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="#0891B2"
                textAnchor="middle"
            >
                {course}
            </text>
            <text x="400" y="350" fontFamily="Arial, sans-serif" fontSize="24" fill="#334155" textAnchor="middle">
                with a score of
            </text>
            <text
                x="400"
                y="400"
                fontFamily="Arial, sans-serif"
                fontSize="40"
                fontWeight="bold"
                fill="#0891B2"
                textAnchor="middle"
            >
                {score}
            </text>
            <text x="400" y="480" fontFamily="Arial, sans-serif" fontSize="20" fill="#64748B" textAnchor="middle">
                Issued on: {date}
            </text>

            {/* Decorative elements */}
            <path d="M100,550 Q400,500 700,550" stroke="#0891B2" strokeWidth="2" fill="none" />
        </svg>
    )
}

export default Certificate

